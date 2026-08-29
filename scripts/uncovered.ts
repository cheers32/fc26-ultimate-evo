/** What an evo does NOT touch — which is what actually separates cards it levels to the same ceiling. */
import { simulateEvoChain, validateRequirement } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { readFileSync } from 'fs';

const [, , playersPath, evoId, ...names] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const evo = availableEvolutions[evoId];
const covered = new Set([...Object.keys(evo.subStatBoosts || {}), ...Object.keys(evo.faceBoosts || {})]);
const show = ['shortPass', 'longPass', 'composure', 'reactions', 'ballControl', 'agility', 'balance', 'sprintSpeed', 'acceleration'].filter(k => !covered.has(k) || ['acceleration', 'sprintSpeed'].includes(k));

console.log(`${evo.name} — stats it does not cap out, on the cards worth considering\n`);
console.log('card'.padEnd(24) + show.map(s => s.slice(0, 8).padStart(9)).join('') + '   height');
for (const p of Object.values(players) as any[]) {
  if (!names.some(n => p.bio.name.toLowerCase().includes(n.toLowerCase()) && String(p.ovr.base) === (n.match(/\d+/) ? n.match(/\d+/)![0] : String(p.ovr.base)))) continue;
  const before = simulateEvoChain([], p.bio, p.ovr, p.stats, p.playStyles);
  if (!validateRequirement(evo, before.finalOvr, before.finalStats, before.finalPlayStyles, before.finalBio).eligible) continue;
  const after = simulateEvoChain([evoId], p.bio, p.ovr, p.stats, p.playStyles);
  const subs: Record<string, number> = {};
  for (const f of Object.values(after.finalStats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) subs[k] = v.base;
  console.log(`${p.bio.name} ${p.ovr.base}`.padEnd(24) + show.map(s => String(subs[s] ?? 0).padStart(9)).join('') + '   ' + p.bio.height.split('|')[0].trim());
}
