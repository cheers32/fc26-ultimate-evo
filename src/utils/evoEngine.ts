import { EvolutionDefinition, ChainValidation, StatsData, OvrData, PlayStylesData, PlayerBio, EvolutionPath, ChainStepResult, EvoFilters } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';

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

  // Check Max OVR
  if (currentOvr > evo.requirements.maxOvr) {
    reasons.push(`OVR ${currentOvr} exceeds Max Requirement of ${evo.requirements.maxOvr}`);
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
    reasons
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
      if (!currentPlayStyles.base.gold.includes(ps)) {
        if (currentPlayStyles.base.gold.length < goldLimit) {
          currentPlayStyles.base.gold.push(ps);
        }
      }
      // If upgraded to gold, remove from silver
      currentPlayStyles.base.silver = currentPlayStyles.base.silver.filter(s => s !== ps);
    });

    const silverLimit = evo.playStylesLimit?.silver ?? 99;
    evo.playStylesAdded.silver.forEach((ps) => {
      // Only add to silver if they don't already have it as gold or silver
      if (!currentPlayStyles.base.silver.includes(ps) && !currentPlayStyles.base.gold.includes(ps)) {
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

  for (const evoId of chainIds) {
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
  prefixChainIds: string[] = []
): EvolutionPath[] {
  // Only the primitives needed for ranking are kept per candidate. Holding the whole
  // ChainState for every hit would pin hundreds of thousands of stat objects in memory.
  type Candidate = { chainIds: string[]; ovr: number; igs: number };
  const validPaths: Candidate[] = [];

  const igsOf = (stats: StatsData) =>
    Object.values(stats).reduce(
      (acc, f) => acc + Object.values(f.subs).reduce((sum, s) => sum + s.base, 0),
      0
    );

  function dfs(currentChainIds: string[], state: ChainState) {
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
          if (!hasAllRequired) {
            passesFilters = false;
          }
        }
      }

      if (passesFilters) {
        validPaths.push({
          chainIds: [...currentChainIds],
          ovr: state.ovr,
          igs: igsOf(state.stats)
        });
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
      if (!validateRequirement(evo, state.ovr, state.stats, state.playStyles, state.bio).eligible) continue;

      currentChainIds.push(evoId);
      dfs(currentChainIds, applyEvo(state, evo).state);
      currentChainIds.pop();
    }
  }

  let seedState: ChainState = {
    ovr: baseOvr.base,
    stats: cloneStats(baseStats),
    playStyles: clonePlayStyles(basePlayStyles),
    bio: cloneBio(baseBio)
  };
  for (const evoId of prefixChainIds) {
    const evo = availableEvolutions[evoId];
    if (!evo) continue;
    seedState = applyEvo(seedState, evo).state;
  }

  dfs([...prefixChainIds], seedState);

  validPaths.sort((a, b) => b.igs - a.igs); // Sort by IGS descending

  const topPaths = validPaths.slice(0, 5);
  // Per-step snapshots are only needed for the handful of chains we actually return,
  // so they are built here rather than for every node visited during the search.
  return topPaths.map((cand, idx) => {
    const full = simulateEvoChain(cand.chainIds, baseBio, baseOvr, baseStats, basePlayStyles);

    return {
      id: `auto-path-${Date.now()}-${idx}`,
      name: `${cand.ovr}/${cand.chainIds.length}/${cand.igs}`,
      description: `Optimal chain spanning ${cand.chainIds.length} EVOs. Reaches ${cand.ovr} OVR.`,
      isRecommended: true,
      chainIds: [...cand.chainIds],
      steps: full.steps
    };
  });
}

