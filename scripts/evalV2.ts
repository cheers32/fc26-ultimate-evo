/**
 * Bench for the recommendation model. Runs V2 (and V1, for comparison) over a real card and the
 * real evo pool, and prints the rows the way the app would show them, so the ranking can be judged
 * on output instead of on intention.
 *
 * Not part of the app. Bundled by scripts/eval.sh and run with node.
 */
import { analyzeEvolutions } from '../src/utils/evoEngine';
import { analyzeEvolutionsV2 } from '../src/utils/analyzeV2';
import { availableEvolutions } from '../src/data/evolutionsData';
import { calculateAccelerateFamily, calculateAccelerateType, parseHeightCm } from '../src/utils/statUtils';
import { suggestTemplates, templatesAvailable, BUILD_TEMPLATES } from '../src/data/buildTemplates';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, nameQuery, depthArg, versionArg, planArg] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const maxDepth = Number(depthArg || 3);

const match = Object.values(players).filter((p: any) =>
  p.bio?.name?.toLowerCase().includes(String(nameQuery).toLowerCase())
);
if (match.length === 0) {
  console.error('no player matches', nameQuery, '— have:', Object.values(players).map((p: any) => p.bio?.name).join(', '));
  process.exit(1);
}
const player: any = match.sort((a: any, b: any) => (b.ovr?.base || 0) - (a.ovr?.base || 0))[0];

const poolIds = Object.entries(team.evoStatuses as Record<string, string>)
  .filter(([id, s]) => s === 'included' && availableEvolutions[id])
  .map(([id]) => id);

const height = parseHeightCm(player.bio.height);
const sub = (k: string) => {
  for (const f of Object.values(player.stats) as any[]) if (f.subs[k]) return f.subs[k].base;
  return 0;
};

console.log(
  `${player.bio.name} ${player.ovr.base} ${player.bio.primaryPositions} ${player.bio.height} · ` +
    `acc ${sub('acceleration')} agi ${sub('agility')} str ${sub('strength')} · ` +
    `${calculateAccelerateFamily(sub('acceleration'), sub('agility'), sub('strength'), height)} / ` +
    `${calculateAccelerateType(sub('acceleration'), sub('agility'), sub('strength'), height)}`
);
const subsAll: Record<string, number> = {};
for (const f of Object.values(player.stats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) subsAll[k] = v.base;
const suggested = suggestTemplates(player.bio.primaryPositions.split(','), subsAll, player.bio.roles, height);
console.log(`available: ${templatesAvailable(player.bio.primaryPositions.split(','), height).map(t => t.name).join(', ')}`);
console.log(`suggested: ${suggested.map(id => BUILD_TEMPLATES.find(t => t.id === id)!.name).join(' + ')}`);
console.log(`pool ${poolIds.length} evos · depth ${maxDepth}\n`);

const input = {
  poolIds,
  maxDepth,
  baseBio: player.bio,
  baseOvr: player.ovr,
  baseStats: player.stats,
  basePlayStyles: player.playStyles,
  filters: planArg ? { templateIds: planArg === 'all' ? [] : planArg.split(',') } : undefined
};

const t0 = Date.now();
const paths =
  versionArg === '1'
    ? analyzeEvolutions(poolIds, maxDepth, player.bio, player.ovr, player.stats, player.playStyles, undefined, [])
    : analyzeEvolutionsV2({ ...input, prefixChainIds: [] });
console.log(`${paths.length} rows in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

for (const p of paths) {
  console.log(`${p.name}  ${p.description || ''}`);
}
