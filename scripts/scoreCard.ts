/** Every number this app would put on one finished card, so a verdict can be argued with. */
import { PASS_MARK, floorsOf, templatesAvailable, BUILD_TEMPLATES } from '../src/data/buildTemplates';
import { calculateAccelerateFamily } from '../src/utils/statUtils';
import { chemStyles } from '../src/data/chemStyles';

const subs: Record<string, number> = {
  acceleration: 98, sprintSpeed: 98,
  positioning: 90, finishing: 86, shotPower: 97, longShots: 96, volleys: 90, penalties: 95,
  vision: 97, crossing: 93, freekick: 95, shortPass: 99, longPass: 99, curve: 96,
  agility: 95, balance: 98, reactions: 97, ballControl: 95, dribbling: 95, composure: 97,
  interceptions: 99, headingAcc: 98, defAwareness: 98, standTackle: 99, slideTackle: 98,
  jumping: 96, stamina: 99, strength: 96, aggression: 99
};
const positions = ['CM', 'CB', 'CDM'];
const height = 174;

console.log(`bare-ish reading: acc ${subs.acceleration} agi ${subs.agility} str ${subs.strength} @${height}cm → ${calculateAccelerateFamily(subs.acceleration, subs.agility, subs.strength, height)}`);
const reach = new Set<string>();
for (const [name, b] of Object.entries(chemStyles)) {
  const cap = (v: number, k: string) => Math.min(99, v + ((b as any)[k] || 0));
  reach.add(calculateAccelerateFamily(cap(subs.acceleration, 'acceleration'), cap(subs.agility, 'agility'), cap(subs.strength, 'strength'), height));
}
console.log(`archetypes reachable with any chem style: ${[...reach].join(', ')}\n`);

for (const t of BUILD_TEMPLATES) {
  const fitsPos = t.positions.some(p => positions.includes(p));
  if (!fitsPos) continue;
  const offered = templatesAvailable(positions, height).includes(t);
  const floors = floorsOf(t);
  let raw = 0, total = 0;
  for (const [k, w] of Object.entries(t.maximise)) { raw += Math.max(0, (subs[k] ?? 0) - PASS_MARK) * w; total += w; }
  const under = Object.entries(floors).filter(([k, f]) => (subs[k] ?? 0) < f);
  const worst = under.reduce((m, [k, f]) => Math.max(m, f - (subs[k] ?? 0)), 0);
  const canRead = reach.has(t.archetype) || (t.controlledFallback && t.archetype === 'Explosive' && reach.has('Controlled'));
  console.log(
    `${t.name.padEnd(22)} ${t.archetype.padEnd(10)} raw +${(raw / total).toFixed(1)} · floors ${under.length ? under.map(([k, f]) => `${k} ${subs[k]}/${f}`).join(', ') : 'all pass'} · final ${(raw / total - worst).toFixed(1)}` +
    `${!offered ? '   [plan not offered: frame]' : !canRead ? '   [cannot read this archetype]' : ''}`
  );
}
