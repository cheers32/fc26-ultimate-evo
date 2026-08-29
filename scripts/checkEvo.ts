/** Applies one evo to a real card and prints what it actually does, as a check on the data entry. */
import { simulateEvoChain } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { readFileSync } from 'fs';

const [, , playersPath, nameQuery, evoId] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const player: any = Object.values(players).find((p: any) =>
  p.bio?.name?.toLowerCase().includes(nameQuery.toLowerCase())
);
const evo = availableEvolutions[evoId];
console.log(`${evo.name} (${evo.id}) · ${evo.cost} · max OVR ${evo.requirements.maxOvr ?? '—'} · positions ${(evo.requirements.positions || ['any']).join('/')}`);

const before = simulateEvoChain([], player.bio, player.ovr, player.stats, player.playStyles);
const after = simulateEvoChain([evoId], player.bio, player.ovr, player.stats, player.playStyles);
const step = after.steps[0];
console.log(`\n${player.bio.name} ${player.ovr.base} ${player.bio.primaryPositions} — eligible: ${step.validation.eligible}`);
if (!step.validation.eligible) console.log(`  blocked: ${step.validation.reasons.join('; ')}`);
const faces = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
console.log(`  OVR ${before.finalOvr} → ${after.finalOvr}`);
console.log('  ' + faces.map(f => `${f.toUpperCase()} ${before.finalStats[f].baseFace}→${after.finalStats[f].baseFace}`).join(' · '));
console.log(`  SM ${before.finalBio.skillMoves}→${after.finalBio.skillMoves} · WF ${before.finalBio.weakFoot}→${after.finalBio.weakFoot}`);
