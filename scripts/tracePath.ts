/** Replays a card's saved chains step by step, so a finished card can be matched to how it got there. */
import { simulateEvoChain, isPlayStyleNodeId } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { readFileSync } from 'fs';

const [, , playersPath, playerId, ...teamPaths] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const p = players[playerId];
const F = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
const line = (r: any) => `${r.finalOvr} · ${F.map(f => r.finalStats[f].baseFace).join('/')}`;

console.log(`${p.bio.name} ${p.ovr.base} ${p.bio.rarity} — base ${line(simulateEvoChain([], p.bio, p.ovr, p.stats, p.playStyles))}\n`);

for (const tp of teamPaths) {
  const team = JSON.parse(readFileSync(tp, 'utf8'));
  for (const path of team.savedPaths?.[playerId] || []) {
    const full = simulateEvoChain(path.chainIds, p.bio, p.ovr, p.stats, p.playStyles);
    console.log(`${team.name} / "${path.name}" → ${line(full)}${full.isValidChain ? '' : '  [INVALID]'}`);
    full.steps.forEach((s, i) => {
      const label = isPlayStyleNodeId(s.evoId) ? 'PlayStyle pick' : `${availableEvolutions[s.evoId]?.name || s.evoId} (${s.evoId})`;
      console.log(`   ${i + 1}. ${label.padEnd(34)} → ${s.ovrAfter} · ${F.map(f => s.statsAfter[f].baseFace).join('/')}${s.validation.eligible ? '' : '  ✗ ' + s.validation.reasons[0]}`);
    });
    console.log('');
  }
}
