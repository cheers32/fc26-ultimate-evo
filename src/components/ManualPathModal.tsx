import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData } from '../types/player';
import { simulateEvoChain, validateRequirement } from '../utils/evoEngine';

// How many evos may carry the RECOMMENDED badge at once. Every evo that trips any
// heuristic used to be badged, which on a full pool marked most of the list and made the
// badge meaningless — so candidates are scored and only the best few are highlighted.
const MAX_RECOMMENDATIONS = 3;

const getEvoRecommendation = (
  positions: string,
  currentStats: StatsData,
  expectedStats: StatsData,
  currentPlayStyles: PlayStylesData,
  expectedPlayStyles: PlayStylesData
): { score: number, reasons: string[] } => {
  if (!currentStats || !expectedStats) return { score: 0, reasons: [] };

  const isAttacker = /ST|CF|RW|LW/.test(positions);
  const isMidfielder = /CM|CAM|CDM|RM|LM/.test(positions);
  const isDefender = /CB|RB|LB|RWB|LWB/.test(positions);
  
  const pacDiff = expectedStats.pac.evFace - currentStats.pac.evFace;
  const shoDiff = expectedStats.sho.evFace - currentStats.sho.evFace;
  const pasDiff = expectedStats.pas.evFace - currentStats.pas.evFace;
  const driDiff = expectedStats.dri.evFace - currentStats.dri.evFace;
  const defDiff = expectedStats.def.evFace - currentStats.def.evFace;
  const phyDiff = expectedStats.phy.evFace - currentStats.phy.evFace;
  
  const totalStatsAdded = pacDiff + shoDiff + pasDiff + driDiff + defDiff + phyDiff;
  
  const beforeGold = new Set([...currentPlayStyles.base.gold, ...currentPlayStyles.ev.gold]);
  const afterGold = new Set([...expectedPlayStyles.base.gold, ...expectedPlayStyles.ev.gold]);
  const newGoldCount = [...afterGold].filter(x => !beforeGold.has(x)).length;

  let reasons: string[] = [];
  // Score is built from the same signals that produce the reasons, so the ranking always
  // matches the explanation shown on the badge. A PlayStyle+ is worth far more than raw
  // face points, and stats the position actually uses count double.
  let score = 0;

  if (newGoldCount > 0) {
    reasons.push(newGoldCount > 1 ? `Adds ${newGoldCount} PlayStyle+` : `Adds PlayStyle+`);
    score += newGoldCount * 12;
  }
  if (totalStatsAdded >= 15) reasons.push(`Massive Stats (+${totalStatsAdded})`);
  score += totalStatsAdded;

  // Position-based heuristics
  if (isAttacker) {
    if (pacDiff >= 5) { reasons.push(`+${pacDiff} PAC (Attacker)`); score += pacDiff; }
    if (shoDiff >= 5) { reasons.push(`+${shoDiff} SHO (Attacker)`); score += shoDiff; }
  }
  if (isMidfielder) {
    if (pasDiff >= 5) { reasons.push(`+${pasDiff} PAS (Midfielder)`); score += pasDiff; }
    if (driDiff >= 5) { reasons.push(`+${driDiff} DRI (Midfielder)`); score += driDiff; }
    if (pacDiff >= 4 && defDiff >= 4) { reasons.push(`Box-to-box boost`); score += pacDiff + defDiff; }
  }
  if (isDefender) {
    if (defDiff >= 5) { reasons.push(`+${defDiff} DEF (Defender)`); score += defDiff; }
    if (phyDiff >= 5) { reasons.push(`+${phyDiff} PHY (Defender)`); score += phyDiff; }
    if (pacDiff >= 4) { reasons.push(`+${pacDiff} PAC (Defender)`); score += pacDiff; }
  }

  // No qualifying reason means nothing worth badging, however many raw points it adds.
  return reasons.length > 0 ? { score, reasons } : { score: 0, reasons: [] };
}

const StatDisplay = ({ label, after, before }: { label: string, after: number, before?: number }) => {
  const diff = before !== undefined ? after - before : 0;
  const isUp = diff > 0;
  const isElite = isUp && after >= 95;
  
  return (
    <div className="flex gap-1 items-center">
      <span className="text-gray-600 font-bold">{label}</span>
      <span className={`font-bold ${isElite ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : isUp ? 'text-fcGreen' : 'text-gray-600'}`}>{after}</span>
      {isUp && <span className={`text-[8px] ${isElite ? 'text-cyan-300' : 'text-fcGreen'}`}>+{diff}</span>}
    </div>
  );
};

const PlayStyleDiffDisplay = ({ before, after }: { before?: PlayStylesData, after: PlayStylesData }) => {
  if (!before) return null;
  const beforeGold = new Set([...before.base.gold, ...before.ev.gold]);
  const afterGold = new Set([...after.base.gold, ...after.ev.gold]);
  const beforeSilver = new Set([...before.base.silver, ...before.ev.silver]);
  const afterSilver = new Set([...after.base.silver, ...after.ev.silver]);
  
  const newGold = [...afterGold].filter(x => !beforeGold.has(x));
  const newSilver = [...afterSilver].filter(x => !beforeSilver.has(x));
  
  if (newGold.length === 0 && newSilver.length === 0) return null;
  
  return (
    <div className="flex gap-1 flex-wrap mt-1.5">
      {newGold.map(ps => (
        <span key={`g-${ps}`} className="px-1 py-0.5 bg-fcGold/20 rounded text-[8px] text-fcGold border border-fcGold/40 font-bold">
          +{ps}
        </span>
      ))}
      {newSilver.map(ps => (
        <span key={`s-${ps}`} className="px-1 py-0.5 bg-gray-700/50 rounded text-[8px] text-gray-300 border border-gray-600/50">
          +{ps}
        </span>
      ))}
    </div>
  );
};

interface ManualPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  evosPool: string[];
  onSave: (path: EvolutionPath) => void;
  baseBio: PlayerBio;
  baseOvr: OvrData;
  baseStats: StatsData;
  basePlayStyles: PlayStylesData;
  editingPath?: EvolutionPath | null;
  onViewEvo?: (evoId: string) => void;
  // Steps locked in by the chosen base. New paths start seeded with these and can't drop them.
  lockedPrefix?: string[];
}

export const ManualPathModal: React.FC<ManualPathModalProps> = ({
  isOpen,
  onClose,
  evosPool,
  onSave,
  baseBio,
  baseOvr,
  baseStats,
  basePlayStyles,
  editingPath,
  onViewEvo,
  lockedPrefix = []
}) => {
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Populate the builder with the path being edited (or reset for a fresh path) whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedChain(editingPath ? [...editingPath.chainIds] : [...lockedPrefix]);
      setSearchQuery('');
    }
  }, [isOpen, editingPath]);

  // Live simulation to check if the current chain is valid
  const validationResult = useMemo(() => {
    if (selectedChain.length === 0) return { isValid: true, result: null };
    const res = simulateEvoChain(selectedChain, baseBio, baseOvr, baseStats, basePlayStyles);
    return { isValid: res.isValidChain, result: res };
  }, [selectedChain, baseBio, baseOvr, baseStats, basePlayStyles]);

  if (!isOpen) return null;

  // Picking an evo appends it to the base and hands straight back to the player screen —
  // the chain is inspected and edited there, not in here.
  const handleAdd = (id: string) => {
    const chain = [...selectedChain, id];
    const result = simulateEvoChain(chain, baseBio, baseOvr, baseStats, basePlayStyles);
    const igs = Object.values(result.finalStats).reduce(
      (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
      0
    );
    onSave({
      id: editingPath ? editingPath.id : `manual-path-${Date.now()}`,
      // Appending keeps the path's own name (notably "Default"); a new branch gets an auto one.
      name: editingPath ? editingPath.name : `Custom ${result.finalOvr}/${chain.length}/${igs}`,
      description: editingPath ? editingPath.description : 'User created manual evolution path.',
      isRecommended: editingPath?.isRecommended ?? false,
      chainIds: chain,
      steps: result.steps
    });
  };

  const currentOvr = validationResult.result ? validationResult.result.finalOvr : baseOvr.base;
  const currentStats = validationResult.result ? validationResult.result.finalStats : baseStats;
  const currentPlayStyles = validationResult.result ? validationResult.result.finalPlayStyles : basePlayStyles;
  const currentBio = validationResult.result ? validationResult.result.finalBio : baseBio;

  const poolWithStatus = evosPool.map((id) => {
    const evo = availableEvolutions[id];
    const count = selectedChain.filter(eid => eid === id).length;
    const maxAllowed = evo?.maxRepeatable || 1;
    const limitReached = count >= maxAllowed;

    let isEligible = false;
    let reasons: string[] = [];
    let expectedOvr = 0;
    let expectedIgs = 0;
    let expectedStats = null;
    let expectedPlayStyles = null;
    let recScore = 0;
    let recReasons: string[] = [];

    if (evo && !limitReached) {
      const validation = validateRequirement(evo, currentOvr, currentStats, currentPlayStyles, currentBio);
      isEligible = validation.eligible;
      reasons = validation.reasons;

      if (isEligible) {
        const testRes = simulateEvoChain([...selectedChain, id], baseBio, baseOvr, baseStats, basePlayStyles);
        if (testRes.isValidChain) {
          expectedOvr = testRes.finalOvr;
          expectedStats = testRes.finalStats;
          expectedPlayStyles = testRes.finalPlayStyles;
          expectedIgs = Object.values(testRes.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
          
          const rec = getEvoRecommendation(currentBio.primaryPositions, currentStats, expectedStats, currentPlayStyles, expectedPlayStyles);
          recScore = rec.score;
          recReasons = rec.reasons;
        }
      }
    }

    return {
      id,
      evo,
      limitReached,
      isEligible,
      reasons,
      expectedOvr,
      expectedIgs,
      expectedStats,
      expectedPlayStyles,
      recScore,
      recReasons
    };
  });

  // Rank the candidates that qualified and badge only the strongest few, so RECOMMENDED
  // stays a shortlist rather than a label on most of the pool.
  const recommendedRank = new Map<string, number>();
  poolWithStatus
    .filter(p => p.recScore > 0 && p.isEligible && !p.limitReached)
    .sort((a, b) => b.recScore - a.recScore || b.expectedIgs - a.expectedIgs)
    .slice(0, MAX_RECOMMENDATIONS)
    .forEach((p, idx) => recommendedRank.set(p.id, idx + 1));

  // Sort: Eligible first, then ineligible, then limit reached. Within same status, sort by maxOvr ascending.
  poolWithStatus.sort((a, b) => {
    if (a.limitReached && !b.limitReached) return 1;
    if (!a.limitReached && b.limitReached) return -1;
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    
    // 1. Sort by Req Max OVR ascending
    const aMaxOvr = a.evo?.requirements.maxOvr || 99;
    const bMaxOvr = b.evo?.requirements.maxOvr || 99;
    if (aMaxOvr !== bMaxOvr) return aMaxOvr - bMaxOvr;

    // 2. If req OVR is the same, sort by expected OVR ascending
    if (a.expectedOvr !== b.expectedOvr) return a.expectedOvr - b.expectedOvr;

    // 3. If expected OVR is the same, sort by expected IGS ascending
    if (a.expectedIgs !== b.expectedIgs) return a.expectedIgs - b.expectedIgs;

    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-[98vw] lg:max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-[98vh]">
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#1A1C1A] relative">
          <button onClick={onClose} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800 transition-colors z-30">
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Side: Available Pool */}
          <div className="flex flex-col shrink-0">
            <div className="sticky top-0 z-20 p-3 border-b border-gray-800 bg-[#1f211f]/95 backdrop-blur flex flex-wrap justify-between items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Available in Pool</h3>
              <div className="relative max-w-[300px] w-full">
                <input 
                  type="text"
                  placeholder="Search EVOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:border-fcGreen focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {poolWithStatus.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm">
                  Your EVO pool is empty.
                </div>
              ) : (
                poolWithStatus
                  .filter(({ evo }) => !searchQuery || evo?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(({ id, evo, limitReached, isEligible, reasons, expectedOvr, expectedIgs, expectedStats, expectedPlayStyles, recReasons }) => {
                  if (!evo) return null;

                  const canAdd = !limitReached && isEligible;
                  const recRank = recommendedRank.get(id);
                  const isRec = canAdd && recRank !== undefined;
                  
                  return (
                    <div 
                      key={id}
                      onClick={() => { if (canAdd) handleAdd(id); }}
                      className={`p-3 rounded-xl transition-all flex flex-col relative overflow-hidden ${
                        canAdd 
                          ? isRec 
                            ? 'bg-gradient-to-br from-[#1a2e1a] to-[#121212] border border-fcGreen/50 hover:border-fcGreen cursor-pointer group shadow-[0_0_15px_rgba(212,248,62,0.1)]'
                            : 'bg-[#121212] border border-gray-800 hover:border-fcGreen/50 cursor-pointer group' 
                          : 'bg-[#121212]/50 border border-gray-800/30 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {isRec && (
                         <div className="absolute top-0 right-0 px-2 py-0.5 bg-fcGreen text-black text-[9px] font-bold rounded-bl-lg">
                           #{recRank} RECOMMENDED
                         </div>
                      )}
                      <div className="flex justify-between items-start w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm transition-colors ${canAdd ? 'text-gray-200 group-hover:text-fcGreen' : 'text-gray-500'}`}>{evo.name}</h4>
                            {onViewEvo && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onViewEvo(id); }}
                                className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          {isRec && recReasons && recReasons.length > 0 && (
                            <p className="text-[10px] text-fcGreen font-semibold mt-1 leading-snug">
                              Why: {recReasons.join(' · ')}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap items-center mt-0.5">
                            <p className="text-[10px] text-gray-500 font-medium">Req OVR: ≤{evo.requirements.maxOvr}</p>
                            {canAdd && expectedOvr > currentOvr && (
                              <span className="px-1.5 py-0.5 bg-green-950/40 rounded text-[9px] text-green-400 border border-green-800/40 font-bold whitespace-nowrap">
                                → {expectedOvr} OVR
                              </span>
                            )}
                            {canAdd && expectedIgs > 0 && (
                              <span className="px-1.5 py-0.5 bg-blue-950/40 rounded text-[9px] text-blue-400 border border-blue-800/40 font-bold whitespace-nowrap">
                                → {expectedIgs} IGS
                              </span>
                            )}
                            {evo.maxRepeatable && evo.maxRepeatable > 1 && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] border font-bold ${canAdd ? 'bg-fcGold/20 text-fcGold border-fcGold/40' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                Repeatable: {evo.maxRepeatable}
                              </span>
                            )}
                          </div>
                          {canAdd && expectedStats && expectedPlayStyles && (
                            <div className="mt-1.5 pt-1.5 border-t border-gray-800/50">
                              <div className="flex gap-2 flex-wrap text-[9px] text-gray-500 font-mono mt-0.5">
                                <StatDisplay label="PAC" after={expectedStats.pac.evFace} before={currentStats.pac.evFace} />
                                <StatDisplay label="SHO" after={expectedStats.sho.evFace} before={currentStats.sho.evFace} />
                                <StatDisplay label="PAS" after={expectedStats.pas.evFace} before={currentStats.pas.evFace} />
                                <StatDisplay label="DRI" after={expectedStats.dri.evFace} before={currentStats.dri.evFace} />
                                <StatDisplay label="DEF" after={expectedStats.def.evFace} before={currentStats.def.evFace} />
                                <StatDisplay label="PHY" after={expectedStats.phy.evFace} before={currentStats.phy.evFace} />
                              </div>
                              <PlayStyleDiffDisplay before={currentPlayStyles} after={expectedPlayStyles} />
                            </div>
                          )}
                        </div>
                        {canAdd ? (
                          <Plus className="w-4 h-4 text-gray-500 group-hover:text-fcGreen" />
                        ) : limitReached ? (
                          <span className="text-[10px] text-gray-500">Limit</span>
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500/50" />
                        )}
                      </div>
                      
                      {!canAdd && !limitReached && reasons.length > 0 && (
                        <div className="mt-2 text-[10px] text-red-400/80 bg-red-950/20 p-1.5 rounded">
                          {reasons[0]} {reasons.length > 1 && `(+${reasons.length - 1} more)`}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
