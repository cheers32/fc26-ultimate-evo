import { EvolutionDefinition, ChainValidation, StatsData, OvrData, PlayStylesData, PlayerBio, EvolutionPath, ChainStepResult, EvoFilters } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';
import { controlModeFor, fitForPosition, fitScore } from './fitScore';
import { POSITION_WEIGHTS } from './positionWeights';

// Rarities that unlock free PlayStyle assignment in-game. Once a card is one of these,
// running another rarity-changing evo just overwrites the string for no extra benefit —
// the perk doesn't stack, so a chain should carry at most one rarity-changing evo total.
// Exported so the UI can gate the free-PlayStyle picker on the same list.
export const FREE_PLAYSTYLE_RARITIES = ['Futties Evo', 'National Pride', 'Glory Hunters', 'FUT Birthday'];

// --- Path-ranking helpers used by analyzeEvolutions' search -----------------------------
// Pulled out to module scope (rather than recreated as closures on every call) since they're
// pure functions of a candidate's chainIds/score and don't touch any search-local state.

// Only the best few per ranking are ever returned from a search.
const TOP_N = 3;

// Scores within this fraction of each other are "the same" for ranking purposes — a chain
// that's only technically higher by a couple of points nobody would notice isn't a real
// improvement. Scales with the metric itself so it works for both raw IGS (thousands) and
// the 0-99 position score without two separate constants.
const TIE_FRACTION = 0.0025;

// Order-independent identity for a chain: two chains that run the same evos in a different
// order are the same build as far as a user is concerned.
function canonicalKey(ids: string[]): string {
  return [...ids].sort().join(',');
}

// A sub-stat sitting at 98 or 99 reads as "maxed" and is worth more to a player than the same
// raw point gain lower down the scale — the flat IGS sum doesn't know the difference between
// a point that moves 60->61 and one that moves 98->99. This weighs *every* sub-stat within
// reach of the 99 ceiling, not a fixed list of "important" ones, so pushing anything to 98/99
// counts, not just a couple of hand-picked stats.
const NEAR_CAP_FLOOR = 97; // 98 -> +1, 99 -> +2, anything at or below 97 -> +0

function nearCapBonus(stats: StatsData): number {
  let bonus = 0;
  for (const face of Object.values(stats)) {
    for (const sub of Object.values(face.subs)) {
      bonus += Math.max(0, sub.base - NEAR_CAP_FLOOR);
    }
  }
  return bonus;
}

// >0 means `a` outranks `b`. Ties (within TIE_FRACTION) first drop the chain that spends a step
// re-changing a rarity that was already free-PlayStyle — legal, and worth taking when it wins on
// stats, but never worth taking when it doesn't. Next comes which chain gets more sub-stats up
// near 98/99 — a longer chain that quietly maxes out Composure, Reactions, or anything else
// shouldn't lose to a shorter one just because the aggregate IGS barely moved. Only once that
// also ties does length decide: shorter wins, since the whole point of ranking is to surface a
// build worth using, and a longer chain that isn't meaningfully better just adds steps nobody
// can attribute value to.
function rank<T extends { chainIds: string[]; nearCap: number; redundantRarity: number }>(
  a: T,
  b: T,
  score: (c: T) => number
): number {
  const sa = score(a), sb = score(b);
  const eps = Math.max(1, Math.abs(sa), Math.abs(sb)) * TIE_FRACTION;
  if (Math.abs(sa - sb) <= eps) {
    if (a.redundantRarity !== b.redundantRarity) return b.redundantRarity - a.redundantRarity;
    if (a.nearCap !== b.nearCap) return a.nearCap - b.nearCap;
    if (a.chainIds.length !== b.chainIds.length) return b.chainIds.length - a.chainIds.length;
    return 0;
  }
  return sa - sb;
}


export function getPositionScore(stats: StatsData, pos: string): number {
  const w = POSITION_WEIGHTS[pos.trim().toUpperCase()];
  if (!w) {
    return ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].reduce((sum, s) => sum + (stats[s]?.baseFace || 0), 0);
  }
  return ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].reduce((sum, s) => sum + (stats[s]?.baseFace || 0) * (w[s] || 0), 0);
}

export interface FullChainResult {
  chainIds: string[];
  isValidChain: boolean;
  steps: ChainStepResult[];
  finalOvr: number;
  finalStats: StatsData;
  finalPlayStyles: PlayStylesData;
  finalBio: PlayerBio;
}

/**
 * Splitting `primaryPositions` is pure string churn, and validateRequirement runs millions
 * of times during a path search over a handful of distinct position strings — so parse each
 * one once. The returned arrays are read-only for callers.
 */
const positionsCache = new Map<string, { all: string[]; nonEmptyCount: number }>();
function parsePositions(primaryPositions: string) {
  let parsed = positionsCache.get(primaryPositions);
  if (!parsed) {
    const all = primaryPositions.split(',').map(p => p.trim());
    parsed = { all, nonEmptyCount: all.filter(Boolean).length };
    positionsCache.set(primaryPositions, parsed);
  }
  return parsed;
}

export function validateRequirement(
  evo: EvolutionDefinition,
  currentOvr: number,
  currentStats: StatsData,
  currentPlayStyles: PlayStylesData,
  bio: PlayerBio
): ChainValidation {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Check Max OVR
  if (currentOvr > evo.requirements.maxOvr) {
    reasons.push(`OVR ${currentOvr} exceeds Max Requirement of ${evo.requirements.maxOvr}`);
  }

  // Check Min OVR. Most evos only cap the card, but the ones that continue a series (Part 2 of a
  // set, say) also demand the OVR the earlier part leaves you on — without this a card that never
  // did Part 1 looks eligible for Part 2.
  if (evo.requirements.minOvr !== undefined && currentOvr < evo.requirements.minOvr) {
    reasons.push(`OVR ${currentOvr} is below Min Requirement of ${evo.requirements.minOvr}`);
  }

  // Check Max Pace
  if (evo.requirements.maxPace && currentStats.pac.baseFace > evo.requirements.maxPace) {
    reasons.push(`Pace ${currentStats.pac.baseFace} exceeds Max Requirement of ${evo.requirements.maxPace}`);
  }

  // Check Max Shooting
  if (evo.requirements.maxShooting && currentStats.sho.baseFace > evo.requirements.maxShooting) {
    reasons.push(`Shooting ${currentStats.sho.baseFace} exceeds Max Requirement of ${evo.requirements.maxShooting}`);
  }

  // Check Max Defending
  if (evo.requirements.maxDefending && currentStats.def.baseFace > evo.requirements.maxDefending) {
    reasons.push(`Defending ${currentStats.def.baseFace} exceeds Max Requirement of ${evo.requirements.maxDefending}`);
  }

  // Check Max Physicality
  if (evo.requirements.maxPhysicality && currentStats.phy.baseFace > evo.requirements.maxPhysicality) {
    reasons.push(`Physicality ${currentStats.phy.baseFace} exceeds Max Requirement of ${evo.requirements.maxPhysicality}`);
  }

  // Check PlayStyles+ Count
  const currentGoldCount = currentPlayStyles.base.gold.length;
  if (evo.requirements.maxPlayStylesPlus !== undefined && currentGoldCount > evo.requirements.maxPlayStylesPlus) {
    reasons.push(`PlayStyles+ (${currentGoldCount}) exceeds Max Requirement of ${evo.requirements.maxPlayStylesPlus}`);
  }

  // Check PlayStyles Count (Silver only)
  const currentSilverCount = currentPlayStyles.base.silver.length;
  if (evo.requirements.maxPlayStyles !== undefined && currentSilverCount > evo.requirements.maxPlayStyles) {
    reasons.push(`PlayStyles (${currentSilverCount}) exceeds Max Requirement of ${evo.requirements.maxPlayStyles}`);
  }

  // Check Total Positions Count
  const currentPositionCount = parsePositions(bio.primaryPositions).nonEmptyCount;
  if (evo.requirements.maxTotalPositions !== undefined && currentPositionCount > evo.requirements.maxTotalPositions) {
    reasons.push(`Total Positions (${currentPositionCount}) exceeds Max Requirement of ${evo.requirements.maxTotalPositions}`);
  }

  // Check Weak Foot
  if (evo.requirements.maxWeakFoot !== undefined && bio.weakFoot > evo.requirements.maxWeakFoot) {
    reasons.push(`Weak Foot (${bio.weakFoot}) exceeds Max Requirement of ${evo.requirements.maxWeakFoot}`);
  }

  // Check Skill Moves
  if (evo.requirements.maxSkillMoves !== undefined && bio.skillMoves > evo.requirements.maxSkillMoves) {
    reasons.push(`Skill Moves (${bio.skillMoves}) exceeds Max Requirement of ${evo.requirements.maxSkillMoves}`);
  }

  // Check Rarity
  if (evo.requirements.rarity && bio.rarity !== evo.requirements.rarity) {
    reasons.push(`Rarity (${bio.rarity}) does not match Required Rarity (${evo.requirements.rarity})`);
  }
  if (evo.requirements.notRarity && bio.rarity === evo.requirements.notRarity) {
    reasons.push(`Rarity (${bio.rarity}) matches Excluded Rarity (${evo.requirements.notRarity})`);
  }

  // Running a second rarity-changing evo on a card that already has a free-PlayStyle rarity
  // overwrites a rarity that was already doing that job — but the evo is still legal, and its
  // stats and PlayStyles land like any other. So this warns instead of blocking: the pick stays
  // available, and the path search only avoids it when something else scores as well.
  if (evo.rarityChange && FREE_PLAYSTYLE_RARITIES.includes(bio.rarity)) {
    warnings.push(`Card is already ${bio.rarity} (free PlayStyle rarity) — ${evo.rarityChange} only overwrites it`);
  }

  // Check Positions
  const playerPositions = parsePositions(bio.primaryPositions).all;
  if (evo.requirements.positions && evo.requirements.positions.length > 0) {
    const hasRequired = playerPositions.some(p => evo.requirements.positions!.includes(p));
    if (!hasRequired) {
      reasons.push(`None of player positions (${playerPositions.join(', ')}) are in Required Positions (${evo.requirements.positions.join(', ')})`);
    }
  }
  if (evo.requirements.excludedPositions && evo.requirements.excludedPositions.length > 0) {
    const hasExcluded = playerPositions.some(p => evo.requirements.excludedPositions!.includes(p));
    if (hasExcluded) {
      reasons.push(`Player has an Excluded Position (${evo.requirements.excludedPositions.join(', ')})`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    warnings
  };
}

export interface ChainState {
  ovr: number;
  stats: StatsData;
  playStyles: PlayStylesData;
  bio: PlayerBio;
}

// Hand-rolled clones: JSON.parse(JSON.stringify(...)) is roughly an order of magnitude
// slower, and this runs hundreds of thousands of times during analyzeEvolutions' search.
function cloneStats(stats: StatsData): StatsData {
  const out: StatsData = {};
  for (const faceKey in stats) {
    const f = stats[faceKey];
    const subs: typeof f.subs = {};
    for (const subKey in f.subs) {
      const s = f.subs[subKey];
      subs[subKey] = { label: s.label, base: s.base, boost: s.boost, limit: s.limit, w: s.w };
    }
    out[faceKey] = { label: f.label, baseFace: f.baseFace, evFace: f.evFace, subs };
  }
  return out;
}

function clonePlayStyles(ps: PlayStylesData): PlayStylesData {
  return {
    limits: { gold: ps.limits.gold, silver: ps.limits.silver },
    base: { gold: [...ps.base.gold], silver: [...ps.base.silver] },
    ev: { gold: [...ps.ev.gold], silver: [...ps.ev.silver] }
  };
}

/**
 * Layers a user's manual "free PlayStyle" picks (only meaningful once the card is one of the
 * FREE_PLAYSTYLE_RARITIES) on top of an already-computed PlayStylesData. Mirrors applyEvo's
 * own PlayStyle rules — gold supersedes silver for the same name, and neither list grows past
 * its slot limit — so a free pick behaves exactly like an evo-granted one everywhere else that
 * reads `base`.
 */
export function applyFreePlayStyles(
  playStyles: PlayStylesData,
  free?: { gold: string[]; silver: string[] }
): PlayStylesData {
  if (!free || (free.gold.length === 0 && free.silver.length === 0)) return playStyles;

  const result = clonePlayStyles(playStyles);
  const baseName = (ps: string) => ps.replace('+', '').trim();

  free.gold.forEach(ps => {
    const name = baseName(ps);
    const hasGold = result.base.gold.some(g => baseName(g) === name);
    // Only drop the plain version once the PS+ actually landed — same order as applyEvo. Removing
    // it regardless would delete a PlayStyle the card already had whenever the gold slots are full.
    const upgraded = hasGold || result.base.gold.length < result.limits.gold;
    if (!hasGold && upgraded) result.base.gold.push(ps);
    if (upgraded) result.base.silver = result.base.silver.filter(s => baseName(s) !== name);
  });

  free.silver.forEach(ps => {
    const name = baseName(ps);
    const hasGold = result.base.gold.some(g => baseName(g) === name);
    const hasSilver = result.base.silver.some(s => baseName(s) === name);
    if (!hasGold && !hasSilver && result.base.silver.length < result.limits.silver) {
      result.base.silver.push(ps);
    }
  });

  return result;
}

// --- Free PlayStyle nodes ---------------------------------------------------------------
// Assigning PlayStyles is a step of the build, not a property of the path: the game hands you
// the picker as part of the evo that turns the card into one of FREE_PLAYSTYLE_RARITIES (or,
// for a card that already is one, off the base card itself). So a pick lives in `chainIds` as
// its own entry and travels with the path through every mechanism that already exists —
// removal, branching, save/load — with no side table to keep in sync.
//
//   ps:Finesse Shot+|Tiki Taka        a trailing '+' marks a PlayStyle+, everything else is
//                                     a plain PlayStyle. No PlayStyle name contains '+' or '|'.
export const PLAYSTYLE_NODE_PREFIX = 'ps:';

export function isPlayStyleNodeId(id: string): boolean {
  return id.startsWith(PLAYSTYLE_NODE_PREFIX);
}

export function buildPlayStyleNodeId(free: { gold: string[]; silver: string[] }): string {
  const clean = (ps: string) => ps.replace('+', '').trim();
  const parts = [...free.gold.map(ps => `${clean(ps)}+`), ...free.silver.map(clean)];
  return PLAYSTYLE_NODE_PREFIX + parts.join('|');
}

export function parsePlayStyleNodeId(id: string): { gold: string[]; silver: string[] } {
  const gold: string[] = [];
  const silver: string[] = [];
  id.slice(PLAYSTYLE_NODE_PREFIX.length)
    .split('|')
    .map(part => part.trim())
    .filter(Boolean)
    .forEach(part => {
      if (part.endsWith('+')) gold.push(part.slice(0, -1).trim());
      else silver.push(part);
    });
  return { gold, silver };
}

/**
 * Whether a PlayStyle can be picked at this point of the build. The card just has to be one of
 * the rarities that unlock free assignment — a chain can pick more than once, and each pick sits
 * where it was actually made rather than being pulled back to the evo that unlocked it.
 */
export function canPickPlayStyles(rarity: string): boolean {
  return FREE_PLAYSTYLE_RARITIES.includes(rarity);
}

// `roles` is never mutated while applying an evolution, so it can stay shared.
function cloneBio(bio: PlayerBio): PlayerBio {
  return { ...bio };
}

/**
 * Applies a single evolution to a copy of `state`.
 *
 * Split out of simulateEvoChain so the path search can advance one evo per tree node
 * instead of replaying the whole chain from the base card at every node, and without
 * paying for the per-step snapshots that only the UI needs.
 */
export function applyEvo(
  state: ChainState,
  evo: EvolutionDefinition
): { state: ChainState; validation: ChainValidation } {
  // Validate eligibility
  const validation = validateRequirement(evo, state.ovr, state.stats, state.playStyles, state.bio);

  const currentStats = cloneStats(state.stats);
  const currentPlayStyles = clonePlayStyles(state.playStyles);
  const currentBio = cloneBio(state.bio);

  // Apply OVR Boost
  const currentOvr = Math.max(state.ovr, Math.min(state.ovr + evo.ovrBoost.boost, evo.ovrBoost.limit));

    // Apply Face & Sub Stat Boosts
    Object.keys(currentStats).forEach((faceKey) => {
      const faceData = currentStats[faceKey];
      const faceBoostObj = evo.faceBoosts?.[faceKey];

      const hasHardcodedSubs = Object.keys(faceData.subs).some(subKey => evo.subStatBoosts?.[subKey]);

      if (faceBoostObj && !hasHardcodedSubs) {
        // EA Prorating Distribution Algorithm
        const targetFace = Math.min(faceData.baseFace + faceBoostObj.boost, faceBoostObj.limit);
        const subStatCap = 99; // Sub-stats are not bounded by Face stat cap, only by 99

        if (targetFace > faceData.baseFace) {
          const scale = targetFace / faceData.baseFace;

          // 1. Scale every sub-stat proportionally, clamped at the sub-stat cap.
          Object.keys(faceData.subs).forEach(subKey => {
            const subData = faceData.subs[subKey];
            subData.base = Math.min(Math.round(subData.base * scale), subStatCap);
          });

          const weightedFace = () => {
            let sum = 0;
            Object.values(faceData.subs).forEach((s: any) => { sum += s.base * s.w; });
            return sum;
          };

          // 2. Rounding down, and sub-stats clamped at the cap, can leave the weighted
          // face short of the target. EA tops it up by walking the sub-stats in ascending
          // order of value (order fixed up front), handing out one point at a time and
          // re-checking after every single point — so the cheapest stats absorb the
          // shortfall first and the walk stops the moment the target is met.
          if (Math.round(weightedFace()) < targetFace) {
            const order = Object.keys(faceData.subs).sort(
              (a, b) => faceData.subs[a].base - faceData.subs[b].base
            );

            let progressed = true;
            outer: while (Math.round(weightedFace()) < targetFace && progressed) {
              progressed = false;
              for (const subKey of order) {
                const subData = faceData.subs[subKey];
                if (subData.base >= subStatCap) continue;
                subData.base += 1;
                progressed = true;
                if (Math.round(weightedFace()) >= targetFace) break outer;
              }
            }
          }
        }
      } else {
        Object.keys(faceData.subs).forEach((subKey) => {
          const subData = faceData.subs[subKey];
          const subBoostObj = evo.subStatBoosts?.[subKey];
          if (subBoostObj) {
            const newEv = Math.max(subData.base, Math.min(subData.base + subBoostObj.boost, subBoostObj.limit));
            subData.base = newEv; // Chain progression converts result to base for next step
          }
        });
      }

      // Calculate the new weighted average of the updated sub-stats
      let calculatedFace = 0;
      Object.values(faceData.subs).forEach((s: any) => {
        calculatedFace += s.base * s.w;
      });
      calculatedFace = Math.round(calculatedFace);

      if (faceBoostObj) {
        // If there is an explicit face boost (e.g. 'Pace +30 (92)'), we apply the explicit boost limits,
        // but the actual face stat will always be at least the true weighted average of the sub stats.
        const explicitFace = Math.max(faceData.baseFace, Math.min(faceData.baseFace + faceBoostObj.boost, faceBoostObj.limit));
        const newEvFace = Math.max(explicitFace, calculatedFace);
        faceData.baseFace = newEvFace;
        faceData.evFace = newEvFace;
      } else {
        // If no explicit face boost, the face stat is simply the updated weighted average
        // (FC ensures Face Stats never decrease during an evolution)
        const newEvFace = Math.max(faceData.baseFace, calculatedFace);
        faceData.baseFace = newEvFace;
        faceData.evFace = newEvFace;
      }
    });

    // Apply PlayStyles
    const goldLimit = evo.playStylesLimit?.gold ?? 99;
    evo.playStylesAdded.gold.forEach((ps) => {
      const baseName = ps.replace('+', '').trim();
      const hasGold = currentPlayStyles.base.gold.some(g => g.replace('+', '').trim() === baseName);
      
      let upgraded = false;
      if (!hasGold) {
        if (currentPlayStyles.base.gold.length < goldLimit) {
          currentPlayStyles.base.gold.push(ps);
          upgraded = true;
        }
      } else {
        upgraded = true;
      }
      
      // If upgraded to gold (or already gold), remove from silver
      if (upgraded) {
        currentPlayStyles.base.silver = currentPlayStyles.base.silver.filter(s => s.replace('+', '').trim() !== baseName);
      }
    });

    const silverLimit = evo.playStylesLimit?.silver ?? 99;
    evo.playStylesAdded.silver.forEach((ps) => {
      const baseName = ps.replace('+', '').trim();
      
      // Only add to silver if they don't already have it as gold or silver
      const hasGold = currentPlayStyles.base.gold.some(g => g.replace('+', '').trim() === baseName);
      const hasSilver = currentPlayStyles.base.silver.some(s => s.replace('+', '').trim() === baseName);
      
      if (!hasSilver && !hasGold) {
        if (currentPlayStyles.base.silver.length < silverLimit) {
          currentPlayStyles.base.silver.push(ps);
        }
      }
    });

    // Apply Bio mutations
    if (evo.weakFootBoost) {
      currentBio.weakFoot = Math.min(5, currentBio.weakFoot + evo.weakFootBoost);
    }
    if (evo.skillMovesBoost) {
      currentBio.skillMoves = Math.min(5, currentBio.skillMoves + evo.skillMovesBoost);
    }
    if (evo.rarityChange) {
      currentBio.rarity = evo.rarityChange;
    }
    if (evo.positionsAdded && evo.positionsAdded.length > 0) {
      const currentPos = currentBio.primaryPositions.split(',').map(p => p.trim());
      evo.positionsAdded.forEach(p => {
        if (!currentPos.includes(p)) currentPos.push(p);
      });
      currentBio.primaryPositions = currentPos.join(', ');
    }

  return {
    state: {
      ovr: currentOvr,
      stats: currentStats,
      playStyles: currentPlayStyles,
      bio: currentBio
    },
    validation
  };
}

export function simulateEvoChain(
  chainIds: string[],
  baseBio: PlayerBio,
  baseOvr: OvrData,
  baseStats: StatsData,
  basePlayStyles: PlayStylesData
): FullChainResult {
  let state: ChainState = {
    ovr: baseOvr.base,
    stats: cloneStats(baseStats),
    playStyles: clonePlayStyles(basePlayStyles),
    bio: cloneBio(baseBio)
  };

  const steps: ChainStepResult[] = [];
  let overallValid = true;

  for (let index = 0; index < chainIds.length; index++) {
    const evoId = chainIds[index];

    if (isPlayStyleNodeId(evoId)) {
      const picks = parsePlayStyleNodeId(evoId);
      const reasons: string[] = [];
      if (!FREE_PLAYSTYLE_RARITIES.includes(state.bio.rarity)) {
        reasons.push(`Only ${FREE_PLAYSTYLE_RARITIES.join(' / ')} cards can pick PlayStyles freely`);
      }
      // Picks still apply when misplaced, the same way an ineligible evo still shows its
      // effects — the step is flagged rather than silently doing nothing.
      state = { ...state, playStyles: applyFreePlayStyles(state.playStyles, picks) };
      if (reasons.length > 0) overallValid = false;

      steps.push({
        evoId,
        evoName: 'PlayStyle Pick',
        futbinLink: '',
        validation: { eligible: reasons.length === 0, reasons, warnings: [] },
        ovrAfter: state.ovr,
        statsAfter: cloneStats(state.stats),
        playStylesAfter: clonePlayStyles(state.playStyles),
        bioAfter: cloneBio(state.bio)
      });
      continue;
    }

    const evo = availableEvolutions[evoId];
    if (!evo) continue;

    const applied = applyEvo(state, evo);
    if (!applied.validation.eligible) {
      overallValid = false;
    }
    state = applied.state;

    steps.push({
      evoId,
      evoName: evo.name,
      futbinLink: evo.futbinLink,
      validation: applied.validation,
      ovrAfter: state.ovr,
      statsAfter: cloneStats(state.stats),
      playStylesAfter: clonePlayStyles(state.playStyles),
      bioAfter: cloneBio(state.bio)
    });
  }

  return {
    chainIds: [...chainIds],
    isValidChain: overallValid,
    steps,
    finalOvr: state.ovr,
    finalStats: state.stats,
    finalPlayStyles: state.playStyles,
    finalBio: state.bio
  };
}

export function analyzeEvolutions(
  poolIds: string[],
  maxDepth: number,
  baseBio: PlayerBio,
  baseOvr: OvrData,
  baseStats: StatsData,
  basePlayStyles: PlayStylesData,
  filters?: EvoFilters,
  // Evos already locked in ahead of the search. The DFS starts seeded with these so repeat
  // limits and eligibility account for them, and returned chains stay applicable to the raw card.
  prefixChainIds: string[] = [],
  // Called every few thousand nodes. Returning false aborts the search and returns whatever
  // has been found so far, which is what lets the worker be cancelled mid-run.
  onProgress?: (nodesVisited: number) => boolean | void
): EvolutionPath[] {
  // Only the primitives needed for ranking are kept per candidate. Holding the whole
  // ChainState for every hit would pin hundreds of thousands of stat objects in memory,
  // so the position scores are computed here and the stats themselves are dropped.
  type Candidate = {
    chainIds: string[];
    ovr: number;
    igs: number;
    posScores: number[];
    nearCap: number;
    /** Blended-position fit, only computed when the profile ranking is switched on. */
    fit: number;
    // Steps that re-changed an already free-PlayStyle rarity. Carried down the recursion rather
    // than recomputed per hit, and only ever used to break a tie (see `rank`).
    redundantRarity: number;
  };

  const rankPositions = baseBio.primaryPositions
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // With the profile switched on, every shortlist is ranked by what the build is worth to this
  // player rather than by raw totals — otherwise "Max IGS" would keep winning with stats the
  // player's positions and PlayStyles make no use of.
  const useFit = filters?.playstyleWeighting === true;
  const fitMode = controlModeFor(baseBio, filters?.controlMode);
  const fitOf = (state: ChainState, pos?: string) => {
    const ctx = { stats: state.stats, playStyles: state.playStyles, bio: state.bio, mode: fitMode };
    return pos ? fitForPosition(ctx, pos) : fitScore(ctx).total;
  };

  // Only the best few per ranking are ever returned, so nothing else is retained. Without
  // this the search kept every hit and ran the tab out of memory at the depths the app uses.
  const topByIgs: Candidate[] = [];
  const topByPosition: Candidate[][] = rankPositions.map(() => []);

  const offer = (list: Candidate[], cand: Candidate, score: (c: Candidate) => number) => {
    // Same set of evos in a different order isn't a meaningfully different option — without
    // this, "Max IGS 1/2/3" often ended up as the identical 5 evos shuffled three ways.
    const candKey = canonicalKey(cand.chainIds);
    if (list.some(c => canonicalKey(c.chainIds) === candKey)) return;

    if (list.length >= TOP_N && rank(cand, list[list.length - 1], score) <= 0) return;
    let i = list.length;
    while (i > 0 && rank(list[i - 1], cand, score) < 0) i--;
    list.splice(i, 0, cand);
    if (list.length > TOP_N) list.length = TOP_N;
  };

  const igsOf = (stats: StatsData) =>
    Object.values(stats).reduce(
      (acc, f) => acc + Object.values(f.subs).reduce((sum, s) => sum + s.base, 0),
      0
    );

  const PROGRESS_INTERVAL = 20000;
  let nodesVisited = 0;
  let aborted = false;

  function dfs(currentChainIds: string[], state: ChainState, redundantRarity: number) {
    if (aborted) return;

    if (++nodesVisited % PROGRESS_INTERVAL === 0 && onProgress) {
      if (onProgress(nodesVisited) === false) {
        aborted = true;
        return;
      }
    }

    if (currentChainIds.length > prefixChainIds.length) {
      const maxOvrAllowed = filters?.ovr?.max ?? 99;
      if (state.ovr > maxOvrAllowed) {
        return; // Prune branch: OVR only increases, so we can't recover
      }

      let passesFilters = true;
      if (filters) {
        if (filters.ovr?.min !== undefined && state.ovr < filters.ovr.min) passesFilters = false;

        const finalPS = state.playStyles;
        const psPlusCount = Math.min(finalPS.base.gold.length + finalPS.ev.gold.length, finalPS.limits.gold);
        const psCount = Math.min(finalPS.base.silver.length + finalPS.ev.silver.length, finalPS.limits.silver);

        if (filters.psPlus) {
          if (filters.psPlus.min !== undefined && psPlusCount < filters.psPlus.min) passesFilters = false;
          if (filters.psPlus.max !== undefined && psPlusCount > filters.psPlus.max) {
             passesFilters = false;
             return; // Prune branch: PS+ only increases
          }
        }
        
        if (filters.ps) {
          if (filters.ps.min !== undefined && psCount < filters.ps.min) passesFilters = false;
          if (filters.ps.max !== undefined && psCount > filters.ps.max) {
             passesFilters = false;
             return; // Prune branch: PS only increases
          }
        }

        const statsToCheck = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;
        for (const stat of statsToCheck) {
          if (filters[stat]) {
            const faceVal = state.stats[stat]?.baseFace || 0;
            if (filters[stat]!.min !== undefined && faceVal < filters[stat]!.min!) passesFilters = false;
            
            if (filters[stat]!.max !== undefined && faceVal > filters[stat]!.max!) {
              passesFilters = false;
              // We can also aggressively prune here if we assume stats only go up
              return; // Prune branch
            }

            // Check sub-stats if defined
            if (filters[stat]!.subs) {
              const subsConfig = filters[stat]!.subs!;
              const actualSubs = state.stats[stat]?.subs || {};
              for (const subKey in subsConfig) {
                const subVal = actualSubs[subKey]?.base || 0;
                if (subsConfig[subKey].min !== undefined && subVal < subsConfig[subKey].min!) passesFilters = false;
                if (subsConfig[subKey].max !== undefined && subVal > subsConfig[subKey].max!) {
                  passesFilters = false;
                  return; // Prune branch for sub-stat
                }
              }
            }
          }
        }

        if (filters.requiredEvos && filters.requiredEvos.length > 0) {
          const hasAllRequired = filters.requiredEvos.every(evoId => currentChainIds.includes(evoId));
          if (!hasAllRequired) passesFilters = false;
        }

if (filters.blockedEvos && filters.blockedEvos.length > 0) {
          const hasBlocked = filters.blockedEvos.some(evoId => currentChainIds.includes(evoId));
          if (hasBlocked) passesFilters = false;
        }

        if (filters.newRarity && state.bio.rarity === baseBio.rarity) {
          passesFilters = false;
        }

        if (filters.newPosition && state.bio.primaryPositions === baseBio.primaryPositions) {
          passesFilters = false;
        }

        // The inverse: leave the card as it is. Judged on the finished chain rather than per evo,
        // so a build that changes rarity and changes it back still counts as having changed it.
        if (filters.noRarityChange && state.bio.rarity !== baseBio.rarity) {
          passesFilters = false;
        }

        if (filters.noPositionChange && state.bio.primaryPositions !== baseBio.primaryPositions) {
          passesFilters = false;
        }
      }

      if (passesFilters) {
        const cand: Candidate = {
          chainIds: [...currentChainIds],
          ovr: state.ovr,
          igs: igsOf(state.stats),
          posScores: rankPositions.map(pos =>
            useFit ? fitOf(state, pos) : getPositionScore(state.stats, pos)
          ),
          nearCap: nearCapBonus(state.stats),
          redundantRarity,
          fit: useFit ? fitOf(state) : 0
        };
        offer(topByIgs, cand, c => (useFit ? c.fit : c.igs));
        topByPosition.forEach((list, i) => offer(list, cand, c => c.posScores[i]));
      }
    }

    if (currentChainIds.length >= prefixChainIds.length + maxDepth) return;

    for (const evoId of poolIds) {
      const evo = availableEvolutions[evoId];
      if (!evo) continue;

      // Counted in a loop rather than with .filter().length — this runs once per pool
      // entry per node, so the throwaway arrays add up to millions of allocations.
      let count = 0;
      for (let i = 0; i < currentChainIds.length; i++) {
        if (currentChainIds[i] === evoId) count++;
      }
      const maxAllowed = evo.maxRepeatable || 1;

      if (count >= maxAllowed) continue;

      // Cheap gate first — validateRequirement does no cloning, applyEvo does.
      const validation = validateRequirement(evo, state.ovr, state.stats, state.playStyles, state.bio);
      if (!validation.eligible) continue;

      currentChainIds.push(evoId);
      dfs(currentChainIds, applyEvo(state, evo).state, redundantRarity + validation.warnings.length);
      currentChainIds.pop();

      if (aborted) return;
    }
  }

  let seedState: ChainState = {
    ovr: baseOvr.base,
    stats: cloneStats(baseStats),
    playStyles: clonePlayStyles(basePlayStyles),
    bio: cloneBio(baseBio)
  };
  for (const evoId of prefixChainIds) {
    // A locked-in PlayStyle node counts towards the PS+/PS the search has to respect, so it is
    // seeded like any other step rather than skipped as an unknown id.
    if (isPlayStyleNodeId(evoId)) {
      seedState = { ...seedState, playStyles: applyFreePlayStyles(seedState.playStyles, parsePlayStyleNodeId(evoId)) };
      continue;
    }
    const evo = availableEvolutions[evoId];
    if (!evo) continue;
    seedState = applyEvo(seedState, evo).state;
  }

  dfs([...prefixChainIds], seedState, 0);

  // Canonical (order-independent) key for a candidate. The IGS ranking and each position
  // ranking run their own independent search bookkeeping, so it's routine for two of them to
  // land on the same set of evos in a different internal order — merge those into one
  // recommendation instead of showing what looks like two different builds.
  const getCandKey = (c: Candidate) => canonicalKey(c.chainIds);
  
  const recommendedPaths: { cand: Candidate, name: string }[] = [];
  const addedKeys = new Set<string>();

  const addRecommendation = (cand: Candidate, name: string) => {
    const key = getCandKey(cand);
    const existing = recommendedPaths.find(p => getCandKey(p.cand) === key);
    if (existing) {
      existing.name += ` / ${name}`;
    } else {
      recommendedPaths.push({ cand, name });
      addedKeys.add(key);
    }
  };

  // 1. Top 3 overall — by fit when the profile is on, by raw IGS otherwise
  topByIgs.forEach((cand, i) => addRecommendation(cand, useFit ? `Best Fit ${i + 1}` : `Max IGS ${i + 1}`));

  // 2. Top 3 per Position
  rankPositions.forEach((pos, posIdx) => {
    topByPosition[posIdx].forEach((cand, i) => addRecommendation(cand, `${pos}${i + 1}`));
  });

  return recommendedPaths.map(({ cand, name }, idx) => {
    const full = simulateEvoChain(cand.chainIds, baseBio, baseOvr, baseStats, basePlayStyles);
    
    const evoNames = cand.chainIds.map(id => availableEvolutions[id]?.name || id).join(' ➜ ');
    
    // Format: Name: OVR/IGS/EvosCount (e.g. CB1: 97/2750/4)
    const formattedName = `${name}: ${cand.ovr}/${cand.igs}/${cand.chainIds.length}`;

    return {
      id: `auto-path-${Date.now()}-${idx}`,
      name: formattedName,
      description: `Evos: ${evoNames}`,
      isRecommended: true,
      chainIds: [...cand.chainIds],
      steps: full.steps
    };
  });
}

