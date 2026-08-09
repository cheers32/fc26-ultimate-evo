/**
 * One-off import of the data the app used to keep in the repo.
 *
 * Before teams, per-player builds were written to src/data/saves/<playerId>.json and imported
 * players to src/data/app/*.json by a dev-server middleware. Those files are now orphaned: the
 * app reads teams and a global library from the shared store instead. This lifts them across.
 *
 *   node scripts/import-local-data.mjs "Team name"
 *
 * Every saved path lands in the team's default squad, because under the new model a build only
 * exists if it is in a squad. Nothing is deleted from disk — re-running is safe, it overwrites
 * the same squad rather than appending.
 */
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_SQUAD_ID,
  createTeam,
  getTeam,
  listTeams,
  putLibrary,
  saveSquad,
  updateTeam
} from '../server/store.js';

const SAVES = 'src/data/saves';
const APP = 'src/data/app';

const readJson = file => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
};

/** `steps` is derivable from chainIds and dwarfs everything else, so it is dropped. */
const withoutSteps = value => {
  if (Array.isArray(value)) return value.map(withoutSteps);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'steps')
        .map(([key, v]) => [key, withoutSteps(v)])
    );
  }
  return value;
};

const lastOvr = path => {
  const steps = path.steps || [];
  return steps.length ? steps[steps.length - 1].ovrAfter : 0;
};

async function main() {
  const teamName = process.argv[2] || 'Imported';

  const existing = (await listTeams()).find(t => t.name === teamName);
  const team = existing || (await createTeam(`t${Date.now().toString(36)}import`, teamName));
  console.log(`${existing ? 'Reusing' : 'Created'} team "${team.name}" (${team.id})`);

  // --- Global libraries -------------------------------------------------------------------
  for (const [file, key] of [
    ['futEvo_custom_players.json', 'customPlayers'],
    ['futEvo_deleted_db_players.json', 'deletedPlayers']
  ]) {
    const value = readJson(path.join(APP, file));
    if (!value) continue;
    await putLibrary(key, value);
    const count = Array.isArray(value) ? value.length : Object.keys(value).length;
    console.log(`  library/${key}: ${count} entries`);
  }

  // --- Pool statuses ----------------------------------------------------------------------
  // The old pool was per player; the union of every player's pool is the closest honest
  // translation of "cards this account was working with".
  const evoStatuses = {};
  (readJson(path.join(APP, 'futEvo_disabled_evos.json')) || []).forEach(id => {
    evoStatuses[id] = 'disabled';
  });

  const members = [];

  for (const file of fs.readdirSync(SAVES).filter(f => f.endsWith('.json'))) {
    const playerId = path.basename(file, '.json');
    const state = readJson(path.join(SAVES, file));
    if (!state) continue;

    (state.evosPool || []).forEach(id => {
      if (!evoStatuses[id]) evoStatuses[id] = 'included';
    });
    (state.evoFilters?.requiredEvos || []).forEach(id => {
      evoStatuses[id] = 'required';
    });

    const paths = [...(state.manualPaths || []), ...(state.generatedPaths || [])].filter(
      p => (p.chainIds || []).length > 0
    );

    paths.forEach((builtPath, index) => {
      members.push({
        id: `${playerId}-${index}`,
        playerId,
        playerState: withoutSteps({
          activePathId: builtPath.id,
          expandedPathIds: [builtPath.id],
          comparePathId: null,
          generatedPaths: [],
          manualPaths: [builtPath],
          evoFilters: state.evoFilters || { ovr: { max: 99 } },
          baseIndex: (builtPath.chainIds || []).length - 1
        }),
        snapshot: {
          name: playerId,
          pathName: builtPath.name || 'Imported',
          chainIds: builtPath.chainIds,
          baseOvr: 0,
          evoOvr: lastOvr(builtPath)
        }
      });
    });
  }

  await saveSquad(team.id, DEFAULT_SQUAD_ID, {
    name: 'Imported builds',
    formation: '4-2-3-1',
    members
  });

  await updateTeam(team.id, { evoStatuses });

  const after = await getTeam(team.id);
  console.log(`  pool: ${Object.keys(after.evoStatuses || {}).length} statuses`);
  console.log(`  squad "Imported builds": ${members.length} builds`);
  console.log(`Done. Open the app and pick "${after.name}".`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
