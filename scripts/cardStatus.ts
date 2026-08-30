/** Where one card actually stands, and what is still open to it. */
import { simulateEvoChain, validateRequirement } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { isInGamePath } from '../src/utils/paths';
import { calculateAccelerateFamily, parseHeightCm } from '../src/utils/statUtils';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, nameQuery] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const F = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;

// By id when one is given. Names are not unique — this library holds several cards per player, and
// picking the first match answers a question about a card the user does not have in the squad.
const matches = Object.entries(players).filter(([id, p]: any) =>
  id === nameQuery || p.bio.name.toLowerCase().includes(nameQuery.toLowerCase()));
if (matches.length === 0) { console.log('no such card'); process.exit(0); }
if (matches.length > 1 && !players[nameQuery]) {
  console.log(`${matches.length} cards match "${nameQuery}" — pass an id:`);
  for (const [id, p] of matches as any) console.log(`  ${id}  ${p.bio.name} ${p.ovr.base} ${p.bio.primaryPositions}`);
  process.exit(0);
}
const entry = matches[0];
const [pid, p] = entry as [string, any];

const current = (team.savedPaths?.[pid] || []).find((x: any) => isInGamePath(x));
const now = simulateEvoChain(current?.chainIds || [], p.bio, p.ovr, p.stats, p.playStyles);
const subs: Record<string, number> = {};
for (const f of Object.values(now.finalStats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) subs[k] = v.base;
const h = parseHeightCm(now.finalBio.height);

console.log(`${p.bio.name} — base ${p.ovr.base}, now ${now.finalOvr}`);
console.log(`  ${now.finalBio.primaryPositions} · ${now.finalBio.height} · ${p.bio.rarity}`);
console.log(`  ${F.map(f => `${f.toUpperCase()} ${now.finalStats[f].baseFace}`).join(' · ')}`);
console.log(`  ${calculateAccelerateFamily(subs.acceleration, subs.agility, subs.strength, h)} · acc ${subs.acceleration} agi ${subs.agility} str ${subs.strength} · stamina ${subs.stamina}`);
console.log(`  PS+ ${now.finalPlayStyles.base.gold.length}/5 · PS ${now.finalPlayStyles.base.silver.length} · SM ${now.finalBio.skillMoves}★ WF ${now.finalBio.weakFoot}`);
console.log(`  in-game record: ${current ? current.chainIds.map((id: string) => availableEvolutions[id]?.name || 'PlayStyle pick').join(' ➜ ') : '(none saved)'}\n`);

const pool = Object.entries(team.evoStatuses as Record<string, string>).filter(([, s]) => s === 'included').map(([id]) => id);
const open = pool.filter(id => availableEvolutions[id] && !(current?.chainIds || []).includes(id)
  && validateRequirement(availableEvolutions[id], now.finalOvr, now.finalStats, now.finalPlayStyles, now.finalBio).eligible);
console.log(`STILL ELIGIBLE FOR ${open.length} of the ${pool.length} evos in this team's pool`);
for (const id of open) {
  const e = availableEvolutions[id];
  const after = simulateEvoChain([...(current?.chainIds || []), id], p.bio, p.ovr, p.stats, p.playStyles);
  const gain = (Object.values(after.finalStats) as any[]).reduce((a, f) => a + (Object.values(f.subs) as any[]).reduce((b, s) => b + s.base, 0), 0)
             - (Object.values(now.finalStats) as any[]).reduce((a, f) => a + (Object.values(f.subs) as any[]).reduce((b, s) => b + s.base, 0), 0);
  console.log(`  ${e.name.padEnd(26)} ${(e.cost || '').padEnd(34)} +${String(gain).padStart(3)} stats · ${F.map(f => after.finalStats[f].baseFace).join('/')}`);
}
