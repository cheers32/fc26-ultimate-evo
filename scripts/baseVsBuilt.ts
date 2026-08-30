/** The same card before and after its chain, through the position score, stat by stat. */
import { simulateEvoChain } from '../src/utils/evoEngine';
import { scoreCard } from '../src/utils/positionScore';
import { isInGamePath } from '../src/utils/paths';
import { PASS_MARK } from '../src/data/buildTemplates';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, nameQuery] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const hits = Object.entries(players).filter(([, p]: any) => p.bio.name.toLowerCase().includes(nameQuery.toLowerCase()));
for (const [pid, p] of hits as any) {
  const cur = (team.savedPaths?.[pid] || []).find((x: any) => isInGamePath(x));
  const base = simulateEvoChain([], p.bio, p.ovr, p.stats, p.playStyles);
  const now = simulateEvoChain(cur?.chainIds || [], p.bio, p.ovr, p.stats, p.playStyles);
  const b = scoreCard(base.finalStats, base.finalBio, false)[0];
  const n = scoreCard(now.finalStats, now.finalBio, false)[0];
  if (!b || !n) continue;
  console.log(`${p.bio.name} ${p.ovr.base} (${pid.slice(0, 30)})  chain: ${cur ? cur.chainIds.length : 0} steps`);
  console.log(`  base  OVR ${base.finalOvr}  ${b.position} ${b.score.toFixed(1)} as ${b.plan.name}`);
  console.log(`  built OVR ${now.finalOvr}  ${n.position} ${n.score.toFixed(1)} as ${n.plan.name}`);

  const subs = (s: any) => {
    const o: Record<string, number> = {};
    for (const f of Object.values(s) as any[]) for (const [k, v] of Object.entries(f.subs) as any) o[k] = v.base;
    return o;
  };
  const sb = subs(base.finalStats), sn = subs(now.finalStats);
  console.log(`  on ${n.plan.name}'s stats — base → built, and what each is worth out of 100:`);
  for (const [k, w] of Object.entries(n.plan.maximise)) {
    const pts = (v: number) => Math.max(0, Math.min(1, (v - 80) / 19)) * 100;
    console.log(`    ${k.padEnd(14)} ${String(sb[k] ?? 0).padStart(3)} → ${String(sn[k] ?? 0).padStart(3)}   ${pts(sb[k] ?? 0).toFixed(0).padStart(3)} → ${pts(sn[k] ?? 0).toFixed(0).padStart(3)}   (weight ${(w as number).toFixed(2)})`);
  }
  const changed = Object.keys(sn).filter(k => (sn[k] ?? 0) !== (sb[k] ?? 0));
  console.log(`  what the chain actually moved: ${changed.length ? changed.map(k => `${k} ${sb[k]}→${sn[k]}`).join(', ') : 'nothing'}`);
  console.log(`  chain: ${(cur?.chainIds || []).join(' ➜ ')}`);
  console.log('');
}
