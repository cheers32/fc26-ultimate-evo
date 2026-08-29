/**
 * Works out how a card that exists in game was actually built.
 *
 * The finished stats are a signature. A face stat that stopped below its cap was raised by exactly
 * the printed amount, so the state before the last evo is known precisely, and the search only has
 * to find the chain that lands on it. Which is the whole trick: guessing forwards from a pool of a
 * hundred evos is hopeless, but recognising one exact state is easy.
 */
import { forEachChain } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { readFileSync } from 'fs';

const [, , playersPath, playerId, lastEvoId, targetSpec, depthArg] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const p = players[playerId];
const last = availableEvolutions[lastEvoId];
const [tOvr, ...tFaces] = targetSpec.split('/').map(Number);
const F = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;

// What the card had to look like before the final evo, read back off its caps.
const need: Record<string, { min: number; exact?: number }> = {};
F.forEach((f, i) => {
  const fb = last.faceBoosts?.[f];
  const target = tFaces[i];
  if (!fb) { need[f] = { exact: target }; return; }
  // Below the cap the boost landed in full, so the earlier value is known exactly. At the cap all
  // that is known is that it was high enough to reach it.
  if (target < fb.limit) need[f] = { exact: target - fb.boost };
  else need[f] = { min: target - fb.boost };
});
const ovrMax = Math.min(last.requirements.maxOvr ?? 99, tOvr);

console.log(`${p.bio.name} ${p.ovr.base} → ${targetSpec}, ending on ${last.name}`);
console.log('state required before that evo:');
console.log('  ' + F.map(f => `${f.toUpperCase()} ${need[f].exact !== undefined ? need[f].exact : '≥' + need[f].min}`).join(' · ') + ` · OVR ≤ ${ovrMax}\n`);

const pool = Object.keys(availableEvolutions).filter(id => id !== lastEvoId);
let hits = 0;
forEachChain(
  {
    poolIds: pool,
    maxDepth: Number(depthArg || 3),
    baseBio: p.bio,
    baseOvr: p.ovr,
    baseStats: p.stats,
    basePlayStyles: p.playStyles,
    prefixChainIds: []
  },
  (chainIds, state) => {
    if (state.ovr > ovrMax) return;
    for (const f of F) {
      const v = state.stats[f].baseFace;
      const n = need[f];
      if (n.exact !== undefined ? v !== n.exact : v < n.min!) return;
    }
    hits += 1;
    console.log(
      `  ${chainIds.map(id => `${availableEvolutions[id]?.name} (${id})`).join(' ➜ ')}` +
      `  → OVR ${state.ovr} · ${F.map(f => state.stats[f].baseFace).join('/')}`
    );
  }
);
if (hits === 0) console.log('  nothing at this depth reaches that state.');
