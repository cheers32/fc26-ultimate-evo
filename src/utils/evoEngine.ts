import { EvolutionDefinition, ChainValidation, StatsData, OvrData, PlayStylesData, PlayerBio, EvolutionPath, ChainStepResult, EvoFilters } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';

const POSITION_WEIGHTS: Record<string, Record<string, number>> = {
  'ST': { pac: 0.25, sho: 0.35, pas: 0.10, dri: 0.20, def: 0.00, phy: 0.10 },
  'CF': { pac: 0.25, sho: 0.35, pas: 0.10, dri: 0.20, def: 0.00, phy: 0.10 },
  'LW': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'RW': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'LM': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'RM': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'CAM':{ pac: 0.10, sho: 0.20, pas: 0.35, dri: 0.30, def: 0.00, phy: 0.05 },
  'CM': { pac: 0.10, sho: 0.15, pas: 0.30, dri: 0.25, def: 0.10, phy: 0.10 },
  'CDM':{ pac: 0.10, sho: 0.00, pas: 0.20, dri: 0.10, def: 0.40, phy: 0.20 },
  'CB': { pac: 0.15, sho: 0.00, pas: 0.10, dri: 0.05, def: 0.45, phy: 0.25 },
  'LB': { pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'RB': { pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'LWB':{ pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'RWB':{ pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
};

function getPositionScore(stats: StatsData, pos: string): number {
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
  type Candidate = { chainIds: string[]; ovr: number; igs: number; stats: StatsData };
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
          igs: igsOf(state.stats),
          stats: cloneStats(state.stats)
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

  // Create unique key for a candidate
  const getCandKey = (c: Candidate) => c.chainIds.join('|');
  
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

  // 1. Top 3 Highest IGS
  validPaths.sort((a, b) => b.igs - a.igs);
  let count = 1;
  for (const cand of validPaths) {
    if (count > 3) break;
    addRecommendation(cand, `Max IGS ${count}`);
    count++;
  }

  // 2. Top 3 per Position
  const positions = baseBio.primaryPositions.split(',').map(p => p.trim()).filter(p => p.length > 0);
  positions.forEach(pos => {
    validPaths.sort((a, b) => getPositionScore(b.stats, pos) - getPositionScore(a.stats, pos));
    let posCount = 1;
    for (const cand of validPaths) {
      if (posCount > 3) break;
      addRecommendation(cand, `${pos}${posCount}`);
      posCount++;
    }
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

