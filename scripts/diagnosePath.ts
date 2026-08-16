/**
 * Why a build the user already has was never recommended.
 *
 * Answers it in the only terms that settle the question: could the search have produced this chain
 * at all, is every step of it in the pool, and — if it could — what the ranking makes of it.
 */
import { simulateEvoChain, isPlayStyleNodeId } from '../src/utils/evoEngine';
import { availableEvolutions } from '../src/data/evolutionsData';
import { BUILD_TEMPLATES, floorsOf, templatesAvailable, suggestTemplates } from '../src/data/buildTemplates';
import { calculateAccelerateFamily, parseHeightCm } from '../src/utils/statUtils';
import { chemStyles } from '../src/data/chemStyles';
import { readFileSync } from 'fs';

const [, , playersPath, teamPath, playerId, maxDepthArg] = process.argv;
const players = JSON.parse(readFileSync(playersPath, 'utf8')) as Record<string, any>;
const team = JSON.parse(readFileSync(teamPath, 'utf8'));
const maxDepth = Number(maxDepthArg || 5);

const player = players[playerId];
const path = (team.savedPaths[playerId] || []).find((p: any) => p.name === 'Default');
const pool = new Set(
  Object.entries(team.evoStatuses as Record<string, string>).filter(([, s]) => s === 'included').map(([id]) => id)
);

const evoNodes = path.chainIds.filter((id: string) => !isPlayStyleNodeId(id));
const psNodes = path.chainIds.filter((id: string) => isPlayStyleNodeId(id));

console.log(`${player.bio.name} ${player.ovr.base} · ${player.bio.primaryPositions} · ${player.bio.height}`);
console.log(`chain: ${path.chainIds.length} nodes = ${evoNodes.length} evos + ${psNodes.length} PlayStyle picks\n`);

console.log('REACHABLE BY ANALYZE?');
console.log(`  PlayStyle picks in chain: ${psNodes.length}   ${psNodes.length ? '← the search only ever picks evos, so this exact chain cannot be produced' : ''}`);
console.log(`  evo steps ${evoNodes.length} vs maxDepth ${maxDepth}   ${evoNodes.length > maxDepth ? '← too deep' : 'ok'}`);
for (const id of evoNodes) {
  const evo = availableEvolutions[id];
  console.log(`  ${id.padEnd(6)} ${(evo?.name || '??').padEnd(24)} ${pool.has(id) ? 'in pool' : 'NOT IN THIS TEAM POOL'}`);
}

const full = simulateEvoChain(path.chainIds, player.bio, player.ovr, player.stats, player.playStyles);
const subs: Record<string, number> = {};
for (const f of Object.values(full.finalStats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) subs[k] = v.base;
const height = parseHeightCm(full.finalBio.height);
const fam = calculateAccelerateFamily(subs.acceleration, subs.agility, subs.strength, height);

console.log(`\nFINISHED CARD  OVR ${full.finalOvr} · ${fam} bare · acc ${subs.acceleration} agi ${subs.agility} str ${subs.strength} · stamina ${subs.stamina}`);
console.log(`  positions ${full.finalBio.primaryPositions} · valid chain: ${full.isValidChain}`);

// The same chain with the PlayStyle picks taken out — what the search *could* have offered.
const bare = simulateEvoChain(evoNodes, player.bio, player.ovr, player.stats, player.playStyles);
const bareSubs: Record<string, number> = {};
for (const f of Object.values(bare.finalStats) as any[]) for (const [k, v] of Object.entries(f.subs) as any) bareSubs[k] = v.base;
console.log(`\nEVOS ONLY (no picks)  OVR ${bare.finalOvr} · valid: ${bare.isValidChain} · stamina ${bareSubs.stamina} · agi ${bareSubs.agility} · dri ${bareSubs.dribbling} · bal ${bareSubs.balance}`);
if (!bare.isValidChain) {
  for (const st of bare.steps) if (!st.validation.eligible) console.log(`    blocked at ${st.evoName}: ${st.validation.reasons.join('; ')}`);
}

const positions = full.finalBio.primaryPositions.split(',').map((p: string) => p.trim());
console.log(`\nAGAINST EACH PLAN IT COULD BE (suggested: ${suggestTemplates(positions, subs, full.finalBio.roles, height).join(', ')})`);

/**
 * Read the same way the engine reads it: with a chemistry style on, since that is how the card gets
 * played and how V2 scores it. Bare is one of the options — occasionally the styles that would lift
 * a stat are the same ones that spend the archetype.
 */
const OPTIONS: [string | null, Record<string, number>][] = [[null, {}], ...Object.entries(chemStyles)];
for (const t of templatesAvailable(positions, height)) {
  const floors = floorsOf(t);
  let best: { style: string | null; under: [string, number][]; subs: Record<string, number> } | null = null;
  for (const [style, boosts] of OPTIONS) {
    const styled: Record<string, number> = { ...subs };
    for (const [k, v] of Object.entries(boosts)) styled[k] = Math.min(99, (subs[k] ?? 0) + v);
    // Only a style that still reads the plan's archetype — the same requirement V2 applies.
    const arch = calculateAccelerateFamily(styled.acceleration, styled.agility, styled.strength, height);
    if (arch !== t.archetype && !(t.controlledFallback && arch === 'Controlled')) continue;
    const under = Object.entries(floors).filter(([k, f]) => (styled[k] ?? 0) < f) as [string, number][];
    if (!best || under.length < best.under.length) best = { style, under, subs: styled };
  }

  if (!best) {
    console.log(`  ${t.name.padEnd(22)} cannot be made ${t.archetype} — not a plan this card can carry out`);
    continue;
  }
  const how = best.style === null ? 'bare' : `on ${best.style}`;
  console.log(
    `  ${t.name.padEnd(22)} ${how.padEnd(14)} ` +
    (best.under.length === 0
      ? 'PASSES'
      : 'fails ' + best.under.map(([k, f]) => `${k} ${best!.subs[k] ?? 0}/${f}`).join(', '))
  );
}
