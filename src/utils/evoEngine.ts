import { EvolutionDefinition, ChainValidation, StatsData, OvrData, PlayStylesData, PlayerBio, EvolutionPath, ChainStepResult } from '../types/player';
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

  // Check PlayStyles Count (Total: Gold + Silver)
  const currentTotalPlayStyles = currentPlayStyles.base.gold.length + currentPlayStyles.base.silver.length;
  if (evo.requirements.maxPlayStyles !== undefined && currentTotalPlayStyles > evo.requirements.maxPlayStyles) {
    reasons.push(`PlayStyles (${currentTotalPlayStyles}) exceeds Max Requirement of ${evo.requirements.maxPlayStyles}`);
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
  const playerPositions = bio.primaryPositions.split(',').map(p => p.trim());
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

export function simulateEvoChain(
  chainIds: string[],
  baseBio: PlayerBio,
  baseOvr: OvrData,
  baseStats: StatsData,
  basePlayStyles: PlayStylesData
): FullChainResult {
  let currentOvr = baseOvr.base;
  let currentStats: StatsData = JSON.parse(JSON.stringify(baseStats));
  let currentPlayStyles: PlayStylesData = JSON.parse(JSON.stringify(basePlayStyles));
  let currentBio: PlayerBio = JSON.parse(JSON.stringify(baseBio));

  const steps: ChainStepResult[] = [];
  let overallValid = true;

  for (const evoId of chainIds) {
    const evo = availableEvolutions[evoId];
    if (!evo) continue;

    // Validate eligibility
    const validation = validateRequirement(evo, currentOvr, currentStats, currentPlayStyles, currentBio);
    if (!validation.eligible) {
      overallValid = false;
    }

    // Apply OVR Boost
    currentOvr = Math.max(currentOvr, Math.min(currentOvr + evo.ovrBoost.boost, evo.ovrBoost.limit));

    // Apply Face & Sub Stat Boosts
    Object.keys(currentStats).forEach((faceKey) => {
      const faceData = currentStats[faceKey];
      const faceBoostObj = evo.faceBoosts?.[faceKey];

      const hasHardcodedSubs = Object.keys(faceData.subs).some(subKey => evo.subStatBoosts?.[subKey]);

      if (faceBoostObj && !hasHardcodedSubs) {
        // EA Dynamic Prorating Distribution Algorithm
        const targetFace = Math.min(faceData.baseFace + faceBoostObj.boost, faceBoostObj.limit);
        const faceDiff = targetFace - faceData.baseFace;
        const subStatCap = 99; // Sub-stats are not bounded by Face stat cap, only by 99

        if (faceDiff > 0) {
          // EA uses the actual diff for the ratio if the face stat is capped
          const ratio = faceDiff / faceData.baseFace;

          // Track the rounding loss tie-breaker
          const tieBreaker: Record<string, number> = {};

          // 1. Proportional growth (bounded at subStatCap)
          Object.keys(faceData.subs).forEach(subKey => {
            const subData = faceData.subs[subKey];
            const exactBoost = subData.base * ratio;
            const appliedBoost = Math.round(exactBoost);
            
            subData.base = Math.min(subData.base + appliedBoost, subStatCap);
            // Tie-breaker is the amount of exact boost that was lost due to rounding
            tieBreaker[subKey] = exactBoost - appliedBoost;
          });

          // 2. Compensation loop (redistribute lost points due to cap or rounding errors)
          const calculateFace = () => {
            let sum = 0;
            Object.values(faceData.subs).forEach((s: any) => { sum += s.base * s.w; });
            return sum;
          };

          // EA adds points one-by-one to the stat that lost the most from rounding
          while (Math.round(calculateFace() + 1e-6) < targetFace) {
            const uncappedKeys = Object.keys(faceData.subs).filter(k => faceData.subs[k].base < subStatCap);
            if (uncappedKeys.length === 0) break; // Hard limit reached
            
            uncappedKeys.sort((a, b) => tieBreaker[b] - tieBreaker[a]);
            const targetKey = uncappedKeys[0];
            
            faceData.subs[targetKey].base = Math.min(faceData.subs[targetKey].base + 1, subStatCap);
            // Decrease tie-breaker so it doesn't hoard all points
            tieBreaker[targetKey] -= 1;
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

    steps.push({
      evoId,
      evoName: evo.name,
      futbinLink: evo.futbinLink,
      validation,
      ovrAfter: currentOvr,
      statsAfter: JSON.parse(JSON.stringify(currentStats)),
      playStylesAfter: JSON.parse(JSON.stringify(currentPlayStyles)),
      bioAfter: JSON.parse(JSON.stringify(currentBio))
    });
  }

  return {
    chainIds: [...chainIds],
    isValidChain: overallValid,
    steps,
    finalOvr: currentOvr,
    finalStats: currentStats,
    finalPlayStyles: currentPlayStyles,
    finalBio: currentBio
  };
}

export function analyzeEvolutions(
  poolIds: string[],
  maxDepth: number,
  baseBio: PlayerBio,
  baseOvr: OvrData,
  baseStats: StatsData,
  basePlayStyles: PlayStylesData,
  maxOvrCap: number = 99
): EvolutionPath[] {
  const validPaths: FullChainResult[] = [];
  
  function dfs(currentChainIds: string[]) {
    let currentResult: FullChainResult | null = null;
    
    if (currentChainIds.length > 0) {
      currentResult = simulateEvoChain(currentChainIds, baseBio, baseOvr, baseStats, basePlayStyles);
      if (currentResult.isValidChain && currentResult.finalOvr <= maxOvrCap) {
        validPaths.push(currentResult);
      } else {
        return; // Stop branching if invalid or exceeds OVR cap
      }
    }
    
    if (currentChainIds.length >= maxDepth) return;
    
    for (const evoId of poolIds) {
      const evo = availableEvolutions[evoId];
      if (!evo) continue;

      const count = currentChainIds.filter(id => id === evoId).length;
      const maxAllowed = evo.maxRepeatable || 1;
      
      if (count >= maxAllowed) continue;
      
      let latestOvr = baseOvr.base;
      let latestBio = baseBio;
      let latestStats = baseStats;
      let latestPS = basePlayStyles;
      
      if (currentResult) {
        latestOvr = currentResult.finalOvr;
        latestBio = currentResult.finalBio;
        latestStats = currentResult.finalStats;
        latestPS = currentResult.finalPlayStyles;
      }
      
      const validation = validateRequirement(evo, latestOvr, latestStats, latestPS, latestBio);
      
      if (validation.eligible) {
        currentChainIds.push(evoId);
        dfs(currentChainIds);
        currentChainIds.pop();
      }
    }
  }
  
  dfs([]);
  
  validPaths.sort((a, b) => {
    // Calculate IGS for a
    const igsA = Object.values(a.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
    // Calculate IGS for b
    const igsB = Object.values(b.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
    return igsB - igsA; // Sort by IGS descending
  });
  
  const topPaths = validPaths.slice(0, 3);
  return topPaths.map((result, idx) => {
    const igs = Object.values(result.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
    const faceSum = Object.values(result.finalStats).reduce((acc, f) => acc + f.baseFace, 0);
    
    return {
      id: `auto-path-${Date.now()}-${idx}`,
      name: `Auto Gen (${result.chainIds.length} Evos) | OVR: ${result.finalOvr} | Base Stats: ${faceSum} | IGS: ${igs}`,
      description: `Optimal chain spanning ${result.chainIds.length} EVOs. Reaches ${result.finalOvr} OVR.`,
      isRecommended: true,
      chainIds: [...result.chainIds],
      steps: [...result.steps]
    };
  });
}

