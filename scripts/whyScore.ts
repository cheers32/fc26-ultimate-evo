/** Where a card's position score actually goes, stat by stat. */
import { simulateEvoChain } from '../src/utils/evoEngine';
import { scoreCard, scoreAtPosition } from '../src/utils/positionScore';
import { isInGamePath } from '../src/utils/paths';
import { PASS_MARK, floorsOf } from '../src/data/buildTemplates';
import { withStyle } from '../src/utils/chem';
import { chemStyles } from '../src/data/chemStyles';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, pid] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const p = players[pid];
const cur = (team.savedPaths?.[pid] || []).find((x: any) => isInGamePath(x));
const now = simulateEvoChain(cur?.chainIds || [], p.bio, p.ovr, p.stats, p.playStyles);

for (const assume of [false, true]) {
  console.log(`\n=== ${p.bio.name} ${now.finalOvr} · ${assume ? 'with best chem style' : 'bare'}`);
  for (const s of scoreCard(now.finalStats, now.finalBio, assume)) {
    console.log(`  ${s.position.padEnd(6)} ${s.score.toFixed(1).padStart(5)}  as ${s.plan.name} · ${s.archetype}${s.fallback ? ` (fallback, plan wants ${s.plan.archetype})` : ''}${s.style ? ` · ${s.style}` : ''}`);
    if (s.under.length) console.log(`         under: ${s.under.map(u => `${u.key} ${u.value}/${u.floor}${u.fieldable ? '*' : ''}`).join(', ')}`);
  }
}

// Where the points go on the best plan.
const best = scoreCard(now.finalStats, now.finalBio, false)[0];
const subs: Record<string, number> = {};
for (const f of Object.values(now.finalStats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) subs[k] = v.base;
console.log(`\nPOINTS ON "${best.plan.name}" (a stat is worth 0 at 80 and 100 at 99)`);
let acc = 0, tw = 0;
for (const [k, w] of Object.entries(best.plan.maximise)) {
  const v = subs[k] ?? 0;
  const pts = Math.max(0, Math.min(1, (v - 80) / 19)) * 100;
  acc += pts * (w as number); tw += w as number;
  console.log(`  ${k.padEnd(14)} ${String(v).padStart(3)} → ${pts.toFixed(0).padStart(3)}/100  × weight ${(w as number).toFixed(2)}`);
}
console.log(`  weighted mean = ${(acc / tw).toFixed(1)}`);
