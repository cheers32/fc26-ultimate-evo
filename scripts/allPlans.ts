/** Every plan a card could be, before and after its chain — not just the one it scores highest on. */
import { simulateEvoChain } from '../src/utils/evoEngine';
import { scoreAtPosition } from '../src/utils/positionScore';
import { BUILD_TEMPLATES, PASS_MARK, floorsOf } from '../src/data/buildTemplates';
import { isInGamePath } from '../src/utils/paths';
import { parseHeightCm } from '../src/utils/statUtils';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, nameQuery] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const [pid, p] = Object.entries(players).find(([, x]: any) => x.bio.name.toLowerCase().includes(nameQuery.toLowerCase())) as any;
const cur = (team.savedPaths?.[pid] || []).find((x: any) => isInGamePath(x));
const base = simulateEvoChain([], p.bio, p.ovr, p.stats, p.playStyles);
const now = simulateEvoChain(cur?.chainIds || [], p.bio, p.ovr, p.stats, p.playStyles);

const subs = (s: any) => {
  const o: Record<string, number> = {};
  for (const f of Object.values(s) as any[]) for (const [k, v] of Object.entries(f.subs) as any) o[k] = v.base;
  return o;
};
const sb = subs(base.finalStats), sn = subs(now.finalStats);
const pts = (v: number) => Math.max(0, Math.min(1, (v - 80) / 19)) * 100;
const scoreOn = (s: Record<string, number>, t: any) => {
  let raw = 0, tot = 0;
  for (const [k, w] of Object.entries(t.maximise)) { raw += pts(s[k] ?? 0) * (w as number); tot += w as number; }
  raw /= tot;
  for (const k of t.avoid || []) raw -= Math.max(0, (s[k] ?? 0) - PASS_MARK) * 0.5;
  for (const [k, f] of Object.entries(floorsOf(t))) {
    const short = Math.max(0, (f as number) - (s[k] ?? 0));
    if (short > 0) raw -= (k in { acceleration: 1, sprintSpeed: 1, stamina: 1, balance: 1, ballControl: 1 } ? 8 : 4) * Math.min(1, short / Math.max(1, (f as number) - 80));
  }
  return Math.max(0, Math.min(100, raw));
};

const own = p.bio.primaryPositions.split(',').map((x: string) => x.trim().toUpperCase());
console.log(`${p.bio.name} · ${own.join('/')} · ${p.bio.height} · OVR ${base.finalOvr} → ${now.finalOvr}\n`);
console.log('plan'.padEnd(24) + 'base   built   change');
for (const t of BUILD_TEMPLATES.filter(t => t.positions.some(x => own.includes(x)))) {
  const a = scoreOn(sb, t), b = scoreOn(sn, t);
  console.log(`${t.name.padEnd(24)}${a.toFixed(1).padStart(5)}  ${b.toFixed(1).padStart(5)}   ${(b - a >= 0 ? '+' : '') + (b - a).toFixed(1)}`);
}
// The point a stat score cannot make: what the upgrade frees the chemistry style to do.
console.log('\nbest style available, and what it is worth:');
for (const [label, stats, bio] of [['base', base.finalStats, base.finalBio], ['built', now.finalStats, now.finalBio]] as any[]) {
  const s = scoreAtPosition(stats, bio, 'CDM', true);
  const bare = scoreAtPosition(stats, bio, 'CDM', false);
  if (s && bare) console.log(`  ${label.padEnd(6)} bare ${bare.score.toFixed(1)} as ${bare.plan.name} → with ${s.style || 'no style'} ${s.score.toFixed(1)} as ${s.plan.name}`);
}

console.log('\nas the app picks it (best plan per position):');
for (const pos of own) {
  const a = scoreAtPosition(base.finalStats, base.finalBio, pos, false);
  const b = scoreAtPosition(now.finalStats, now.finalBio, pos, false);
  if (a && b) console.log(`  ${pos.padEnd(5)} ${a.score.toFixed(1)} as ${a.plan.name}  →  ${b.score.toFixed(1)} as ${b.plan.name}`);
}
