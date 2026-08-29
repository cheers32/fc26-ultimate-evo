/** Scores two finished cards against every plan their position and frame allow. */
import { PASS_MARK, floorsOf, templatesAvailable } from '../src/data/buildTemplates';

const A: Record<string, number> = {
  acceleration: 99, sprintSpeed: 99,
  positioning: 96, finishing: 95, shotPower: 96, longShots: 96, volleys: 69, penalties: 94,
  vision: 99, crossing: 87, freekick: 99, shortPass: 99, longPass: 99, curve: 99,
  agility: 95, balance: 95, reactions: 97, ballControl: 98, dribbling: 97, composure: 97,
  interceptions: 99, headingAcc: 99, defAwareness: 99, standTackle: 99, slideTackle: 99,
  jumping: 99, stamina: 99, strength: 99, aggression: 99
};
const B: Record<string, number> = {
  acceleration: 98, sprintSpeed: 98,
  positioning: 97, finishing: 97, shotPower: 99, longShots: 97, volleys: 67, penalties: 92,
  vision: 99, crossing: 77, freekick: 99, shortPass: 99, longPass: 99, curve: 99,
  agility: 93, balance: 93, reactions: 99, ballControl: 97, dribbling: 96, composure: 99,
  interceptions: 99, headingAcc: 99, defAwareness: 99, standTackle: 99, slideTackle: 99,
  jumping: 99, stamina: 98, strength: 99, aggression: 99
};

const positions = ['CM', 'CDM'];
const height = 192;

for (const t of templatesAvailable(positions, height)) {
  const floors = floorsOf(t);
  const score = (s: Record<string, number>) => {
    let raw = 0, total = 0;
    for (const [k, w] of Object.entries(t.maximise)) { raw += Math.max(0, (s[k] ?? 0) - PASS_MARK) * w; total += w; }
    const under = Object.entries(floors).filter(([k, f]) => (s[k] ?? 0) < f);
    const worst = under.reduce((m, [k, f]) => Math.max(m, f - (s[k] ?? 0)), 0);
    return { pts: (total ? raw / total : 0) - worst, under };
  };
  const a = score(A), b = score(B);
  const diffs = Object.keys(t.maximise)
    .map(k => ({ k, d: (A[k] ?? 0) - (B[k] ?? 0), w: t.maximise[k] }))
    .filter(x => x.d !== 0)
    .sort((x, y) => Math.abs(y.d * y.w) - Math.abs(x.d * x.w))
    .slice(0, 5)
    .map(x => `${x.k} ${x.d > 0 ? '+' : ''}${x.d}`)
    .join(', ');
  console.log(
    `${t.name.padEnd(22)} A +${a.pts.toFixed(2)}  ·  B +${b.pts.toFixed(2)}  →  ${a.pts > b.pts ? 'A' : b.pts > a.pts ? 'B' : 'tie'} by ${Math.abs(a.pts - b.pts).toFixed(2)}`
  );
  console.log(`  A vs B on this plan: ${diffs || 'identical'}`);
  if (a.under.length || b.under.length) {
    console.log(`  floors: A ${a.under.map(([k, f]) => `${k} ${A[k]}/${f}`).join(', ') || 'all pass'} | B ${b.under.map(([k, f]) => `${k} ${B[k]}/${f}`).join(', ') || 'all pass'}`);
  }
  console.log('');
}
