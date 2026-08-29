/**
 * Who an evo is actually for.
 *
 * Not "who is eligible" — that list is long and useless. What decides it is how much of the printed
 * upgrade a card can still take: an evo that puts five defensive stats at 98 is worth nothing to a
 * defender already sitting on 97, and everything to one at 84. So this prints the real gain after
 * caps, what the finished card reads on AcceleRATE, and which of the plans for that position it
 * passes — the three things that settle it.
 */
import { simulateEvoChain, validateRequirement } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { BUILD_TEMPLATES, PASS_MARK, floorsOf, templatesAvailable } from '../src/data/buildTemplates';
import { calculateAccelerateFamily, parseHeightCm } from '../src/utils/statUtils';
import { chemStyles } from '../src/data/chemStyles';
import { readFileSync } from 'fs';

const [, , playersPath, evoId, teamPath] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const evo = availableEvolutions[evoId];
// What the card can still do afterwards. An evo that ends the card on 98 OVR shuts the door on most
// of the pool, and a plan that ignores that spends its best free upgrade on a card it then cannot
// take any further.
const pool: string[] = teamPath
  ? Object.entries(JSON.parse(readFileSync(teamPath, 'utf8')).evoStatuses as Record<string, string>)
      .filter(([id, st]) => st === 'included' && availableEvolutions[id] && id !== evoId)
      .map(([id]) => id)
  : [];

const subsOf = (stats: any) => {
  const out: Record<string, number> = {};
  for (const f of Object.values(stats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) out[k] = v.base;
  return out;
};

/** Every archetype the card could be made to read, given a free choice of chemistry style. */
const archetypes = (subs: Record<string, number>, h?: number) => {
  const out = new Set<string>();
  for (const boosts of Object.values(chemStyles)) {
    const cap = (b: number, k: string) => Math.min(99, b + ((boosts as any)[k] || 0));
    out.add(calculateAccelerateFamily(cap(subs.acceleration, 'acceleration'), cap(subs.agility, 'agility'), cap(subs.strength, 'strength'), h));
  }
  return out;
};

console.log(`${evo.name} (${evo.id}) · ${evo.cost} · max OVR ${evo.requirements.maxOvr ?? '—'} · ${(evo.requirements.positions || ['any position']).join('/')}\n`);

const touched = Object.keys(evo.subStatBoosts || {});
type Row = { name: string; ovr: string; gain: number; wasted: number; fam: string; best: string; score: number; detail: string; open: string; def: string };
const rows: Row[] = [];

for (const p of Object.values(players) as any[]) {
  const before = simulateEvoChain([], p.bio, p.ovr, p.stats, p.playStyles);
  if (!validateRequirement(evo, before.finalOvr, before.finalStats, before.finalPlayStyles, before.finalBio).eligible) continue;

  const after = simulateEvoChain([evoId], p.bio, p.ovr, p.stats, p.playStyles);
  const b = subsOf(before.finalStats);
  const a = subsOf(after.finalStats);
  const height = parseHeightCm(p.bio.height);

  let gain = 0;
  let wasted = 0;
  for (const k of touched) {
    gain += (a[k] ?? 0) - (b[k] ?? 0);
    wasted += (evo.subStatBoosts[k].boost) - ((a[k] ?? 0) - (b[k] ?? 0));
  }

  const openBefore = pool.filter(id => validateRequirement(availableEvolutions[id], before.finalOvr, before.finalStats, before.finalPlayStyles, before.finalBio).eligible).length;
  const openAfter = pool.filter(id => validateRequirement(availableEvolutions[id], after.finalOvr, after.finalStats, after.finalPlayStyles, after.finalBio).eligible).length;

  const positions = after.finalBio.primaryPositions.split(',').map((x: string) => x.trim());
  const fams = archetypes(a, height);
  let best = '—';
  let bestScore = -99;
  let detail = '';
  for (const t of templatesAvailable(positions, height)) {
    if (!fams.has(t.archetype) && !(t.controlledFallback && fams.has('Controlled'))) continue;
    const floors = floorsOf(t);
    const under = Object.entries(floors).filter(([k, f]) => (a[k] ?? 0) < f);
    let raw = 0;
    let total = 0;
    for (const [k, w] of Object.entries(t.maximise)) {
      raw += Math.max(0, (a[k] ?? 0) - PASS_MARK) * w;
      total += w;
    }
    const score = (total > 0 ? raw / total : 0) - under.reduce((m, [k, f]) => Math.max(m, f - (a[k] ?? 0)), 0);
    if (score > bestScore) {
      bestScore = score;
      best = t.name;
      detail = under.length ? `fails ${under.map(([k, f]) => `${k} ${a[k] ?? 0}/${f}`).join(', ')}` : 'all pass';
    }
  }

  rows.push({
    open: `${openBefore}→${openAfter}`,
    def: `PAC ${after.finalStats.pac.baseFace} DEF ${after.finalStats.def.baseFace} PHY ${after.finalStats.phy.baseFace} · ${p.bio.height.split('|')[0].trim()}`,
    name: `${p.bio.name} ${p.ovr.base}`,
    ovr: `${before.finalOvr}→${after.finalOvr}`,
    gain, wasted,
    fam: `${calculateAccelerateFamily(b.acceleration, b.agility, b.strength, height)}→${calculateAccelerateFamily(a.acceleration, a.agility, a.strength, height)}`,
    best, score: bestScore, detail
  });
}

rows.sort((x, y) => y.gain - x.gain);
for (const r of rows) {
  console.log(
    `${r.name.padEnd(22)} OVR ${r.ovr.padEnd(7)} real +${String(r.gain).padStart(3)} (lost ${String(r.wasted).padStart(3)}) · ` +
    `evos open ${r.open.padEnd(7)} · ${r.def.padEnd(34)} · ${r.fam}`
  );
}
