/**
 * What your thumbs add up to.
 *
 * This is the half of the feedback loop that a click cannot do on its own. A vote says one row was
 * wrong; a retune needs to know *which part* of the model was wrong, and that only shows up across
 * votes — in the gap between the builds you kept and the builds you threw away.
 *
 * So this prints, per plan: how often it is liked, what the down votes gave as their reason, and
 * for every sub-stat the difference between the liked builds and the turned-down ones. A stat where
 * that gap is large and consistent is a weight or a floor that disagrees with you, and it comes out
 * as a proposal to check against the bench — never as an edit made behind your back.
 *
 * Usage:
 *   npx esbuild scripts/feedbackReport.ts --bundle --platform=node --format=esm --outfile=/tmp/fb.mjs
 *   node /tmp/fb.mjs feedback.json
 */
import { BUILD_TEMPLATES, PASS_MARK } from '../src/data/buildTemplates';
import { PathFeedback } from '../src/types/player';
import { readFileSync } from 'fs';

const store = JSON.parse(readFileSync(process.argv[2], 'utf8')) as Record<string, PathFeedback>;
const all = Object.values(store);

if (all.length === 0) {
  console.log('No feedback recorded yet.');
  process.exit(0);
}

const pretty = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();

const mean = (xs: number[]) => (xs.length === 0 ? null : xs.reduce((a, b) => a + b, 0) / xs.length);

const ups = all.filter(f => f.verdict === 'up');
const downs = all.filter(f => f.verdict === 'down');

console.log(`${all.length} verdicts · ${ups.length} up · ${downs.length} down`);
console.log(`${new Set(all.map(f => f.playerId)).size} cards\n`);

// ---- Which plans you actually want --------------------------------------------------------------
console.log('BY PLAN');
for (const t of BUILD_TEMPLATES) {
  const mine = all.filter(f => f.templateId === t.id);
  if (mine.length === 0) continue;
  const up = mine.filter(f => f.verdict === 'up').length;
  console.log(`  ${t.name.padEnd(22)} ${up}/${mine.length} liked`);
}

// ---- What the objections were -------------------------------------------------------------------
const reasonCounts = new Map<string, number>();
for (const f of downs) for (const r of f.reasons || []) reasonCounts.set(r, (reasonCounts.get(r) || 0) + 1);
if (reasonCounts.size > 0) {
  console.log('\nREASONS GIVEN');
  for (const [id, n] of [...reasonCounts].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id.padEnd(18)} ${n}`);
  }
}
const unexplained = downs.filter(f => (f.reasons || []).length === 0).length;
if (unexplained > 0) console.log(`  (${unexplained} down votes with no reason given — worth the extra click)`);

// ---- Where the model disagrees with you ---------------------------------------------------------
// Per plan, because a stat that is right for a Target Man is wrong for a Poacher, and pooling them
// hides both.
console.log('\nWHERE LIKED AND DISLIKED BUILDS DIFFER');
const proposals: string[] = [];

for (const t of BUILD_TEMPLATES) {
  const mine = all.filter(f => f.templateId === t.id);
  const up = mine.filter(f => f.verdict === 'up');
  const down = mine.filter(f => f.verdict === 'down');
  if (up.length === 0 || down.length === 0) continue;

  // Every stat the cards actually have, not only the ones this plan already tracks. A stat the
  // plan ignores is exactly where the worst disagreements hide: strength on a playmaker costs the
  // card its archetype while the model, not looking at strength at all, sees nothing wrong.
  const keys = new Set<string>();
  for (const f of mine) for (const k of Object.keys(f.snapshot.subs)) keys.add(k);
  const tracked = new Set([...Object.keys(t.maximise), ...t.must, ...(t.avoid || [])]);
  const gaps = [...keys]
    .map(key => {
      const u = mean(up.map(f => f.snapshot.subs[key] ?? 0));
      const d = mean(down.map(f => f.snapshot.subs[key] ?? 0));
      return u === null || d === null ? null : { key, u, d, gap: u - d };
    })
    .filter((x): x is { key: string; u: number; d: number; gap: number } => x !== null && Math.abs(x.gap) >= 2)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  if (gaps.length === 0) continue;
  console.log(`\n  ${t.name} · ${up.length} liked vs ${down.length} turned down`);
  for (const g of gaps.slice(0, 6)) {
    console.log(
      `    ${pretty(g.key).padEnd(14)} liked ${g.u.toFixed(1).padStart(5)} · disliked ${g.d.toFixed(1).padStart(5)} · ` +
        `${g.gap > 0 ? '+' : ''}${g.gap.toFixed(1)}${tracked.has(g.key) ? '' : '   (not in this plan)'}`
    );
    // A stat the liked builds are consistently *lower* on is one this plan is being rewarded for
    // and should not be. That is the shape of the strength-on-a-playmaker problem.
    if (g.gap <= -3 && !(t.avoid || []).includes(g.key)) {
      proposals.push(`${t.name}: add '${g.key}' to avoid — liked builds run ${(-g.gap).toFixed(1)} lower on it`);
    }
    if (g.gap >= 3 && !tracked.has(g.key)) {
      proposals.push(`${t.name}: consider weighting '${g.key}' — liked builds run ${g.gap.toFixed(1)} higher and the plan does not look at it`);
    }
    if (g.gap >= 3 && tracked.has(g.key) && Math.min(...up.map(f => f.snapshot.subs[g.key] ?? 0)) > PASS_MARK) {
      const floor = Math.min(...up.map(f => f.snapshot.subs[g.key] ?? 0));
      proposals.push(`${t.name}: raise the ${pretty(g.key)} floor toward ${floor} — every liked build clears it`);
    }
  }
}

if (proposals.length > 0) {
  console.log('\nPROPOSALS — check each against the bench before applying');
  for (const p of proposals) console.log(`  · ${p}`);
} else {
  console.log('\nNothing consistent enough to propose yet. More verdicts, especially on the same plan.');
}
