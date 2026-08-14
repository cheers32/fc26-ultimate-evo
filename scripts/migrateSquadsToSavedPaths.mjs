/**
 * One-off: move builds out of squads and onto the players they belong to.
 *
 * Squads used to *be* the storage — each member carried a whole copy of the workbench, and a build
 * that wasn't in a squad didn't exist. A squad is now twenty-three slots that point at a player and
 * one of that player's saved builds, so the builds have to move first or the pointers dangle.
 *
 * For every team:
 *   - each squad member becomes a starred build under `savedPaths[playerId]`, deduped by chain;
 *   - members whose player is no longer in the library are dropped, builds and all — there is no
 *     card left to open them against;
 *   - every squad is left with an empty pitch, to be filled in by hand.
 *
 * Usage:
 *   node scripts/migrateSquadsToSavedPaths.mjs            # report only, writes nothing
 *   node scripts/migrateSquadsToSavedPaths.mjs --apply
 *   node scripts/migrateSquadsToSavedPaths.mjs --apply --base http://localhost:3011
 */

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const base = (args[args.indexOf('--base') + 1] || '').startsWith('http')
  ? args[args.indexOf('--base') + 1]
  : 'http://localhost:3011';

const api = async (path, init) => {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  });
  if (!res.ok) throw new Error(`${init?.method || 'GET'} ${path} → ${res.status}`);
  return res.json();
};

/** The built-in catalogue, read as text so the script doesn't need the TypeScript toolchain. */
const builtInPlayerIds = () => {
  const src = readFileSync(new URL('../src/data/playersData.ts', import.meta.url), 'utf8');
  return [...src.matchAll(/^ {2}'([^']+)': \{$/gm)].map(m => m[1]);
};

const chainKey = ids => (ids || []).join('>');

async function main() {
  const known = new Set(builtInPlayerIds());
  const custom = await api('/api/library/customPlayers').catch(() => ({}));
  Object.keys(custom || {}).forEach(id => known.add(id));
  const deleted = await api('/api/library/deletedPlayers').catch(() => []);
  (deleted || []).forEach(id => known.delete(id));

  console.log(`${known.size} players in the library · ${apply ? 'APPLYING' : 'dry run'} · ${base}\n`);

  for (const summary of await api('/api/teams')) {
    const team = await api(`/api/teams/${summary.id}`);
    const savedPaths = { ...(team.savedPaths || {}) };
    const seen = new Map(
      Object.entries(savedPaths).map(([pid, paths]) => [pid, new Set(paths.map(p => chainKey(p.chainIds)))])
    );

    let migrated = 0;
    let duplicate = 0;
    const orphaned = new Map();

    for (const squad of team.squads || []) {
      for (const member of squad.members || []) {
        const chain = member.snapshot?.chainIds || [];
        if (chain.length === 0) continue;

        if (!known.has(member.playerId)) {
          orphaned.set(member.playerId, (orphaned.get(member.playerId) || 0) + 1);
          continue;
        }

        const key = chainKey(chain);
        if (!seen.has(member.playerId)) seen.set(member.playerId, new Set());
        if (seen.get(member.playerId).has(key)) {
          duplicate++;
          continue;
        }
        seen.get(member.playerId).add(key);

        savedPaths[member.playerId] = [
          ...(savedPaths[member.playerId] || []),
          {
            id: member.id || `${member.playerId}-${key}`,
            name: member.snapshot?.pathName || 'Imported build',
            description: '',
            chainIds: chain,
            isFavorite: true,
            starTier: 1,
            ...(member.playerState?.baseIndex >= 0 ? {} : {})
          }
        ];
        migrated++;
      }
    }

    const orphanTotal = [...orphaned.values()].reduce((a, b) => a + b, 0);
    console.log(`${team.name} (${team.id})`);
    console.log(`  builds moved to players : ${migrated}`);
    console.log(`  duplicate chains skipped: ${duplicate}`);
    console.log(`  dropped, player is gone : ${orphanTotal}${orphanTotal ? ` (${[...orphaned.keys()].join(', ')})` : ''}`);
    console.log(`  players now holding builds: ${Object.keys(savedPaths).length}`);
    console.log(`  squads emptied          : ${(team.squads || []).length}`);

    if (apply) {
      await api(`/api/teams/${team.id}`, { method: 'PATCH', body: JSON.stringify({ savedPaths }) });
      for (const squad of team.squads || []) {
        await api(`/api/teams/${team.id}/squads/${squad.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            id: squad.id,
            name: squad.name,
            createdAt: squad.createdAt,
            formation: squad.formation,
            slots: {}
          })
        });
      }
      console.log('  written.');
    }
    console.log('');
  }

  if (!apply) console.log('Nothing was written. Re-run with --apply.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
