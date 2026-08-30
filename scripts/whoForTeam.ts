/**
 * Who in a squad an evo is for — judged on the cards as they stand in game, not as they came.
 *
 * The distinction matters more than anything else here. An evo's requirements are checked against
 * the card you actually have, and the cards in a squad have already been evolved: the OVR cap, the
 * PlayStyle+ cap and the stat caps are all things a finished card has usually already spent. So the
 * Current path is replayed first, and everything is measured from there.
 */
import { simulateEvoChain, validateRequirement } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { isInGamePath } from '../src/utils/paths';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, evoId] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const evo = availableEvolutions[evoId];
const F = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;

const roster = new Set<string>();
for (const sq of team.squads || []) {
  for (const slot of Object.values((sq.slots || {}) as Record<string, any>)) {
    if (slot?.playerId) roster.add(slot.playerId);
  }
}

const igs = (stats: any) =>
  (Object.values(stats) as any[]).reduce((a, f) => a + (Object.values(f.subs) as any[]).reduce((b, s) => b + s.base, 0), 0);

type Row = { name: string; gain: number; ovr: string; faces: string; ps: string; note: string };
const ok: Row[] = [];
const no: { name: string; why: string }[] = [];

for (const pid of roster) {
  const p = players[pid];
  if (!p) continue;
  // The card as it stands: its in-game record replayed onto the base.
  const current = (team.savedPaths?.[pid] || []).find((x: any) => isInGamePath(x));
  const now = simulateEvoChain(current?.chainIds || [], p.bio, p.ovr, p.stats, p.playStyles);

  const v = validateRequirement(evo, now.finalOvr, now.finalStats, now.finalPlayStyles, now.finalBio);
  const label = `${p.bio.name} ${now.finalOvr}${current ? '*' : ''}`;
  if (!v.eligible) { no.push({ name: label, why: v.reasons[0] }); continue; }

  const after = simulateEvoChain([...(current?.chainIds || []), evoId], p.bio, p.ovr, p.stats, p.playStyles);
  const touchedFaces = Object.keys(evo.faceBoosts || {});
  ok.push({
    name: label,
    gain: igs(after.finalStats) - igs(now.finalStats),
    ovr: `${now.finalOvr}→${after.finalOvr}`,
    faces: touchedFaces
      .map(f => `${f.toUpperCase()} ${now.finalStats[f].baseFace}→${after.finalStats[f].baseFace}`)
      .join(' · '),
    ps: `PS+ ${now.finalPlayStyles.base.gold.length}→${after.finalPlayStyles.base.gold.length}`,
    note: p.bio.primaryPositions
  });
}

console.log(`${team.name} · ${evo.name} (${evo.id}) · ${evo.cost}`);
console.log(`requirements: ${JSON.stringify(evo.requirements)}\n`);
console.log(`ELIGIBLE (${ok.length}) — * means measured after their in-game record`);
for (const r of ok.sort((a, b) => b.gain - a.gain)) {
  console.log(`  ${r.name.padEnd(26)} +${String(r.gain).padStart(3)} stats · OVR ${r.ovr.padEnd(7)} · ${r.faces.padEnd(38)} · ${r.ps} · ${r.note}`);
}
console.log(`\nNOT ELIGIBLE (${no.length})`);
for (const r of no.sort((a, b) => a.name.localeCompare(b.name))) console.log(`  ${r.name.padEnd(26)} ${r.why}`);
