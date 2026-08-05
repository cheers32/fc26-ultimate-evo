import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Plus, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { EvoDetailsModal } from './EvoDetailsModal';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData } from '../types/player';
import { simulateEvoChain, validateRequirement } from '../utils/evoEngine';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import { getStatColorClass } from '../utils/statUtils';

// How many evos may carry the RECOMMENDED badge at once. Every evo that trips any
// heuristic used to be badged, which on a full pool marked most of the list and made the
// badge meaningless — so candidates are scored and only the best few are highlighted.
const MAX_RECOMMENDATIONS = 3;

const getEvoRecommendation = (
  positions: string,
  currentOvr: number,
  expectedOvr: number,
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
  const ovrDiff = expectedOvr - currentOvr;
  
  const beforeGold = new Set([...currentPlayStyles.base.gold, ...currentPlayStyles.ev.gold]);
  const afterGold = new Set([...expectedPlayStyles.base.gold, ...expectedPlayStyles.ev.gold]);
  const newGoldCount = [...afterGold].filter(x => !beforeGold.has(x)).length;

  let reasons: string[] = [];
  let score = 0;

  // 1. PlayStyle+ is extremely valuable
  if (newGoldCount > 0) {
    reasons.push(newGoldCount > 1 ? `Adds ${newGoldCount} PS+` : `Adds PS+`);
    score += newGoldCount * 15;
  }

  // 2. Chaining Efficiency: High stat boost with low OVR cost
  // A typical OVR +1 gives ~6 stats. 
  const efficiencyRatio = totalStatsAdded - (ovrDiff * 6);
  if (efficiencyRatio >= 5) {
    reasons.push(`Highly Efficient (+${totalStatsAdded} BS / +${ovrDiff} OVR)`);
    score += efficiencyRatio * 2;
  } else if (totalStatsAdded >= 15) {
    reasons.push(`Massive Stats (+${totalStatsAdded})`);
  }
  
  // 3. Free Boosts: The holy grail of chained EVOs
  if (ovrDiff === 0 && (totalStatsAdded > 0 || newGoldCount > 0)) {
    reasons.push("Free Boost (+0 OVR)");
    score += 25;
  }

  score += totalStatsAdded;
  // Penalize OVR increases slightly as they restrict future EVOs
  score -= (ovrDiff * 3);

  // Position-based heuristics
  if (isAttacker) {
    if (pacDiff >= 5) { reasons.push(`+${pacDiff} PAC`); score += pacDiff; }
    if (shoDiff >= 5) { reasons.push(`+${shoDiff} SHO`); score += shoDiff; }
  }
  if (isMidfielder) {
    if (pasDiff >= 5) { reasons.push(`+${pasDiff} PAS`); score += pasDiff; }
    if (driDiff >= 5) { reasons.push(`+${driDiff} DRI`); score += driDiff; }
    if (pacDiff >= 4 && defDiff >= 4) { reasons.push(`Box-to-box`); score += pacDiff + defDiff; }
  }
  if (isDefender) {
    if (defDiff >= 5) { reasons.push(`+${defDiff} DEF`); score += defDiff; }
    if (phyDiff >= 5) { reasons.push(`+${phyDiff} PHY`); score += phyDiff; }
  }

  // Deduplicate reasons
  reasons = [...new Set(reasons)];

  return reasons.length > 0 ? { score, reasons } : { score: 0, reasons: [] };
}

const StatDisplay = ({ label, after, before }: { label: string, after: number, before?: number }) => {
  const diff = before !== undefined ? after - before : 0;
  if (diff <= 0) return null;
  
  return (
    <div className="flex gap-1.5 items-center bg-[#1f211f] px-1.5 py-0.5 rounded border border-gray-800">
      <span className="text-gray-500 font-bold">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-400">+{diff}</span>
        <span className={getStatColorClass(after)}>{after}</span>
      </div>
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
    <div className="flex gap-1 flex-wrap mt-1.5 items-center">
      {newGold.map(ps => (
        <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`+ ${ps}`} className="w-8 h-8 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
      ))}
      {newSilver.map(ps => (
        <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={`+ ${ps}`} className="w-6 h-6 opacity-80" />
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
  lockedPrefix = []
}) => {
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterNewRarity, setFilterNewRarity] = useState(false);
  const [filterNewPosition, setFilterNewPosition] = useState(false);
  const [localViewingEvo, setLocalViewingEvo] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Populate the builder with the path being edited (or reset for a fresh path) whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    setSelectedChain(editingPath ? [...editingPath.chainIds] : [...lockedPrefix]);
    setSearchQuery('');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't close the builder if the evo details modal is open on top of it
        if (!document.getElementById('evo-details-modal')) {
          onClose();
        }
      } else if (e.key === 'a' || e.key === 'A') {
        const activeNodeName = document.activeElement?.nodeName;
        if (activeNodeName !== 'INPUT' && activeNodeName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
          searchInputRef.current?.select();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, editingPath, onClose, lockedPrefix]);

  // Live simulation to check if the current chain is valid
  const validationResult = useMemo(() => {
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
          
          const rec = getEvoRecommendation(currentBio.primaryPositions, currentOvr, expectedOvr, currentStats, expectedStats, currentPlayStyles, expectedPlayStyles);
          recScore = rec.score;
          recReasons = rec.reasons;
        }
      }
    }

    const expectedFaceStats = expectedStats ? Object.values(expectedStats).reduce((acc, f) => acc + f.baseFace, 0) : 0;

    return {
      id,
      evo,
      limitReached,
      isEligible,
      reasons,
      expectedOvr,
      expectedIgs,
      expectedFaceStats,
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
    
    // 1. max required ovr ASC
    const aMaxOvr = a.evo.requirements.maxOvr || 99;
    const bMaxOvr = b.evo.requirements.maxOvr || 99;
    if (aMaxOvr !== bMaxOvr) return aMaxOvr - bMaxOvr;
    
    // 2. target ovr ASC
    if (a.expectedOvr !== b.expectedOvr) return a.expectedOvr - b.expectedOvr;
    
    // 3. target base stats DESC
    return b.expectedFaceStats - a.expectedFaceStats;
  });

  const currentFaceStats = Object.values(currentStats).reduce((acc, f) => acc + f.baseFace, 0);
  const currentIgs = Object.values(currentStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
  const currentPsPlusCount = currentPlayStyles.base.gold.length + currentPlayStyles.ev.gold.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-4" onClick={onClose}>
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-[98vw] lg:max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-[98vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#1A1C1A] relative">
          <button onClick={onClose} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800 transition-colors z-30">
            <X className="w-5 h-5" />
          </button>

          {/* Top Side: Current Path */}
          {validationResult.result && (
            <div className="flex flex-col gap-2 p-3 pr-10 border-b border-gray-800 bg-[#121212] shrink-0 pt-8 md:pt-3">
              <div className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pb-2 items-center gap-1.5">
                
                {/* Base Card Chip */}
                <div className="bg-[#1f211f] text-gray-200 border-gray-700 border p-1.5 rounded font-bold flex flex-col shadow gap-1 shrink-0">
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                      {baseOvr.base}/{basePlayStyles.base.gold.length + (basePlayStyles.ev?.gold?.length || 0)}
                    </span>
                    <span className="text-[10.5px]">Base Card</span>
                  </div>
                  <div className="flex gap-2 items-center px-1 mb-0.5">
                    <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                      <span className="text-white font-bold">BS</span>
                      <span className="text-blue-400 font-bold">{Object.values(baseStats).reduce((acc, f) => acc + f.baseFace, 0)}</span>
                    </div>
                    <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                      <span className="text-white font-bold">IGS</span>
                      <span className="text-blue-400 font-bold">{Object.values(baseStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-0.5">
                    {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                      const val = baseStats[statKey as keyof StatsData].baseFace;
                      return (
                        <div key={statKey} className="flex gap-0.5 items-center bg-black/40 px-1 py-0.5 rounded text-[8.5px] shadow-inner border border-gray-800/50">
                          <span className="text-gray-400 uppercase">{statKey}</span>
                          <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const gold = [...basePlayStyles.base.gold, ...(basePlayStyles.ev?.gold || [])];
                    const silver = [...basePlayStyles.base.silver, ...(basePlayStyles.ev?.silver || [])];
                    if (gold.length === 0 && silver.length === 0) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1 mt-0.5 border-t border-gray-700/50 pt-1">
                        {gold.map(ps => (
                          <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (PS+)`} className="w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
                        ))}
                        {silver.map(ps => (
                          <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
                        ))}
                      </div>
                    );
                  })()}
                </div>
                {selectedChain.length > 0 && (
                  <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                )}

                {selectedChain.map((id, idx) => {
                  const evo = availableEvolutions[id];
                  if (!evo) return null;
                  const stepResult = validationResult.result!.steps[idx];
                  if (!stepResult) return null;
                  
                  const afterPsPlus = stepResult.playStylesAfter.base.gold.length + stepResult.playStylesAfter.ev.gold.length;
                  
                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <div className="group/node relative bg-[#1f211f] text-gray-200 border-gray-700 border p-1.5 rounded font-bold flex flex-col shadow gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                            {(() => {
                              const prevOvr = idx === 0 ? baseOvr.base : validationResult.result!.steps[idx - 1].ovrAfter;
                              const ovrDiff = stepResult.ovrAfter - prevOvr;
                              return ovrDiff > 0 ? <span className="text-fcGreen font-bold text-[10px] mr-0.5">+{ovrDiff}</span> : null;
                            })()}
                            {stepResult.ovrAfter}/{afterPsPlus}
                          </span>
                          <span className="text-[10.5px]">{evo.name}</span>
                          <span className="font-bold text-[9.5px] tracking-wide font-mono opacity-90">
                            ({evo.requirements.maxOvr || 99}/{evo.requirements.maxPlayStylesPlus ?? '∞'}/+{evo.ovrBoost.boost})
                          </span>
                        </div>
                        <div className="flex gap-2 items-center px-1 mb-0.5">
                          {(() => {
                            const prevStats = idx === 0 ? baseStats : validationResult.result!.steps[idx - 1].statsAfter;
                            const prevFace = Object.values(prevStats).reduce((a, b) => a + b.baseFace, 0);
                            const curFace = Object.values(stepResult.statsAfter).reduce((a, b) => a + b.baseFace, 0);
                            const bsDiff = curFace - prevFace;

                            const prevIgs = Object.values(prevStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                            const curIgs = Object.values(stepResult.statsAfter).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                            const igsDiff = curIgs - prevIgs;

                            return (
                              <>
                                <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                                  <span className="text-white font-bold">BS</span>
                                  <div className="flex items-baseline gap-0.5">
                                    {bsDiff > 0 && <span className="text-fcGreen font-bold text-[7.5px]">+{bsDiff}</span>}
                                    <span className="text-blue-400 font-bold">{curFace}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                                  <span className="text-white font-bold">IGS</span>
                                  <div className="flex items-baseline gap-0.5">
                                    {igsDiff > 0 && <span className="text-fcGreen font-bold text-[7.5px]">+{igsDiff}</span>}
                                    <span className="text-blue-400 font-bold">{curIgs}</span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <div className="grid grid-cols-3 gap-0.5">
                          {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                            const val = stepResult.statsAfter[statKey as keyof StatsData].baseFace;
                            const prevStats = idx === 0 ? baseStats : validationResult.result!.steps[idx - 1].statsAfter;
                            const prevVal = prevStats[statKey as keyof StatsData].baseFace;
                            const diff = val - prevVal;
                            
                            let diffColor = "text-gray-300";
                            if (diff >= 8) diffColor = "text-purple-400 font-bold";
                            else if (diff >= 4) diffColor = "text-fcGreen font-bold";
                            else if (diff >= 2) diffColor = "text-lime-400 font-semibold";

                            return (
                              <div key={statKey} className="flex gap-0.5 items-center bg-black/40 px-1 py-0.5 rounded text-[8.5px] shadow-inner border border-gray-800/50">
                                <span className="text-gray-400 uppercase">{statKey}</span>
                                <div className="flex items-baseline gap-0.5 ml-0.5">
                                  {diff > 0 && <span className={`${diffColor} text-[7px] leading-none tracking-tighter`}>+{diff}</span>}
                                  <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* PlayStyle Additions */}
                        {(() => {
                          const prevPlayStyles = idx === 0 ? basePlayStyles : validationResult.result!.steps[idx - 1].playStylesAfter;
                          
                          const beforeGold = [...prevPlayStyles.base.gold, ...(prevPlayStyles.ev?.gold || [])];
                          const beforeSilver = [...prevPlayStyles.base.silver, ...(prevPlayStyles.ev?.silver || [])];
                          
                          const afterGold = [...stepResult.playStylesAfter.base.gold, ...(stepResult.playStylesAfter.ev?.gold || [])];
                          const afterSilver = [...stepResult.playStylesAfter.base.silver, ...(stepResult.playStylesAfter.ev?.silver || [])];
                          
                          const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
                          const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
                          
                          if (afterGold.length === 0 && afterSilver.length === 0) return null;
                          
                          return (
                            <div className="flex flex-wrap items-center gap-1 mt-0.5 border-t border-gray-700/50 pt-1">
                              {afterGold.map(ps => {
                                const isNew = addedGold.includes(ps);
                                return (
                                  <img 
                                    key={`g-${ps}`} 
                                    src={getPlayStyleIconUrl(ps, true)} 
                                    alt={ps} 
                                    title={`${ps} (PS+)`} 
                                    className={`w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)] ${isNew ? 'ring-[1.5px] ring-fcGreen ring-offset-[1.5px] ring-offset-[#1f211f] rounded-full' : ''}`} 
                                  />
                                );
                              })}
                              {afterSilver.map(ps => {
                                const isNew = addedSilver.includes(ps);
                                return (
                                  <img 
                                    key={`s-${ps}`} 
                                    src={getPlayStyleIconUrl(ps, false)} 
                                    alt={ps} 
                                    title={ps} 
                                    className={`w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)] ${isNew ? 'ring-[1.5px] ring-fcGreen ring-offset-[1px] ring-offset-[#1f211f] rounded-full' : ''}`} 
                                  />
                                );
                              })}
                            </div>
                          );
                        })()}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newChain = [...selectedChain];
                            newChain.splice(idx, 1);
                            
                            const result = simulateEvoChain(newChain, baseBio, baseOvr, baseStats, basePlayStyles);
                            const igs = Object.values(result.finalStats).reduce(
                              (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
                              0
                            );
                            onSave({
                              id: editingPath ? editingPath.id : `manual-path-${Date.now()}`,
                              name: editingPath ? editingPath.name : `Custom ${result.finalOvr}/${newChain.length}/${igs}`,
                              description: editingPath ? editingPath.description : 'User created manual evolution path.',
                              isRecommended: editingPath?.isRecommended ?? false,
                              chainIds: newChain,
                              steps: result.steps
                            });
                          }}
                          className="absolute -top-1.5 -left-1.5 p-0.5 bg-red-900/90 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                          title={`Remove ${evo.name} from this path`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      {idx < selectedChain.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Side: Available Pool */}
          <div className="flex flex-col shrink-0">
            <div className="sticky top-0 z-20 p-3 pr-10 border-b border-gray-800 bg-[#1f211f]/95 backdrop-blur flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Available in Pool</h3>
                <div className="hidden md:flex items-center gap-3 text-[11px] font-mono bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">OVR</span>
                    <span className="text-yellow-400 font-bold">{currentOvr}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">PS+</span>
                    <span className="text-yellow-400 font-bold">{currentPsPlusCount}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">BS</span>
                    <span className="text-blue-400 font-bold">{currentFaceStats}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">IGS</span>
                    <span className="text-blue-400 font-bold">{currentIgs}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 text-[11px] font-mono bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                  {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                    const stat = currentStats[statKey as keyof StatsData];
                    if (!stat) return null;
                    const val = stat.baseFace;
                    return (
                      <div key={statKey} className="flex gap-1.5 items-center">
                        <span className="text-gray-500 font-bold uppercase">{statKey}</span>
                        <span className={getStatColorClass(val) + " font-bold"}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 items-center flex-1 md:flex-none justify-end">
                <button
                  onClick={() => setFilterNewRarity(!filterNewRarity)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewRarity ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Rarity
                </button>
                <button
                  onClick={() => setFilterNewPosition(!filterNewPosition)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Position
                </button>
                <div className="relative max-w-[250px] w-full">
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search EVOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const filteredPool = poolWithStatus.filter(({ evo }) => {
                    if (!evo) return false;
                    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    if (filterNewRarity && !evo.rarityChange) return false;
                    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
                    return true;
});
                      const topEligible = filteredPool.find(p => p.isEligible && !p.limitReached);
                      if (topEligible) {
                        handleAdd(topEligible.id);
                      }
                    }
                  }}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:border-fcGreen focus:outline-none transition-colors"
                />
              </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {poolWithStatus.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm">
                  Your EVO pool is empty.
                </div>
              ) : (
                poolWithStatus
                  .filter(({ evo }) => {
                    if (!evo) return false;
                    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    if (filterNewRarity && !evo.rarityChange) return false;
                    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
                    return true;
})
                  .map(({ id, evo, limitReached, isEligible, reasons, expectedOvr, expectedIgs, expectedFaceStats, expectedStats, expectedPlayStyles, recReasons }) => {
                  if (!evo) return null;

                  const canAdd = !limitReached && isEligible;
                  const recRank = recommendedRank.get(id);
                  const isRec = canAdd && recRank !== undefined;
                  
                  return (
                    <div 
                      key={id}
                      className={`relative group bg-[#161816] border rounded-xl p-3 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer ${canAdd ? 'border-gray-800 hover:border-blue-500/50 hover:bg-[#1a1d1a] hover:-translate-y-0.5' : 'border-gray-800/30 opacity-70 grayscale-[0.2]'} ${isRec ? 'ring-1 ring-fcGreen/30' : ''}`}
                      onClick={() => setLocalViewingEvo(id)}
                    >
                      {isRec && (
                         <div className="absolute top-0 right-0 px-2 py-0.5 bg-fcGreen text-black text-[9px] font-bold rounded-bl-lg">
                           #{recRank} RECOMMENDED
                         </div>
                      )}
                      <div className="flex justify-between items-start w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm transition-colors flex items-center ${canAdd ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-500'}`}>
                              {canAdd && (
                                <span className="font-mono tracking-tight font-extrabold opacity-80 mr-1.5 text-white">
                                  {expectedOvr - currentOvr > 0 && <span className="text-fcGreen font-bold text-[10px] mr-0.5">+{expectedOvr - currentOvr}</span>}
                                  {expectedOvr}/{expectedPlayStyles ? (expectedPlayStyles.base.gold.length + expectedPlayStyles.ev.gold.length) : '?'}
                                </span>
                              )}
                              <span>{evo.name}</span>
                              <span className="font-mono text-xs opacity-70 ml-1.5 font-normal">
                                {evo.requirements.maxOvr || 99}/{evo.requirements.maxPlayStylesPlus ?? '∞'}/+{evo.ovrBoost.boost}
                              </span>
                            </h4>
                            <button
                              onClick={(e) => { e.stopPropagation(); setLocalViewingEvo(id); }}
                              className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto mr-1 shrink-0"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                          {isRec && recReasons && recReasons.length > 0 && (
                            <p className="text-[10px] text-fcGreen font-semibold mt-1 leading-snug">
                              Why: {recReasons.join(' · ')}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap items-center mt-0.5">

                            {canAdd && expectedStats && (
                              <div className="flex gap-1 items-center bg-gray-800/80 px-2 py-0.5 rounded border border-gray-600 text-[10px]">
                                <span className="text-white font-bold">BS</span>
                                <div className="flex items-baseline gap-0.5">
                                  {expectedFaceStats - currentFaceStats > 0 && <span className="text-fcGreen font-bold text-[8px]">+{expectedFaceStats - currentFaceStats}</span>}
                                  <span className="text-blue-400 font-bold">{expectedFaceStats}</span>
                                </div>
                              </div>
                            )}
                            {canAdd && expectedStats && (
                              <div className="flex gap-1 items-center bg-gray-800/80 px-2 py-0.5 rounded border border-gray-600 text-[10px]">
                                <span className="text-white font-bold">IGS</span>
                                <div className="flex items-baseline gap-0.5">
                                  {expectedIgs - currentIgs > 0 && <span className="text-fcGreen font-bold text-[8px]">+{expectedIgs - currentIgs}</span>}
                                  <span className="text-blue-400 font-bold">{expectedIgs}</span>
                                </div>
                              </div>
                            )}
                            {evo.requirements.positions && evo.requirements.positions.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-red-950/40 rounded text-[9px] text-red-400 border border-red-900/50 font-bold whitespace-nowrap">
                                Req Pos: {evo.requirements.positions.join(', ')}
                              </span>
                            )}
                            {evo.requirements.excludedPositions && evo.requirements.excludedPositions.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-red-950/40 rounded text-[9px] text-red-400 border border-red-900/50 font-bold whitespace-nowrap">
                                Excl Pos: {evo.requirements.excludedPositions.join(', ')}
                              </span>
                            )}
                            {evo.positionsAdded && evo.positionsAdded.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-purple-950/40 rounded text-[9px] text-purple-400 border border-purple-800/40 font-bold whitespace-nowrap">
                                + Pos: {evo.positionsAdded.join(', ')}
                              </span>
                            )}
                            {evo.rarityChange && (
                              <span className="px-1.5 py-0.5 bg-pink-950/40 rounded text-[9px] text-pink-400 border border-pink-800/40 font-bold whitespace-nowrap">
                                {evo.rarityChange}
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
                              <div className="grid grid-cols-3 gap-1 mt-1">
                                {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                                  const val = expectedStats[statKey as keyof StatsData].baseFace;
                                  const prevVal = currentStats[statKey as keyof StatsData].baseFace;
                                  const diff = val - prevVal;
                                  
                                  let diffColor = "text-gray-300";
                                  if (diff >= 8) diffColor = "text-purple-400 font-bold";
                                  else if (diff >= 4) diffColor = "text-fcGreen font-bold";
                                  else if (diff >= 2) diffColor = "text-lime-400 font-semibold";

                                  return (
                                    <div key={statKey} className="flex gap-0.5 items-center bg-[#101210] px-1 py-0.5 rounded text-[8.5px] shadow-inner border border-gray-800/80">
                                      <span className="text-gray-500 font-bold uppercase">{statKey}</span>
                                      <div className="flex items-baseline gap-0.5 ml-auto">
                                        {diff > 0 && <span className={`${diffColor} text-[7px] leading-none tracking-tighter`}>+{diff}</span>}
                                        <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <PlayStyleDiffDisplay before={currentPlayStyles} after={expectedPlayStyles} />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!canAdd && !limitReached && reasons.length > 0 && (
                        <div className="mt-2 text-[10px] text-red-400/80 bg-red-950/20 p-1.5 rounded pr-8">
                          {reasons[0]} {reasons.length > 1 && `(+${reasons.length - 1} more)`}
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdd(id); }}
                        disabled={!canAdd}
                        className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-colors shrink-0 shadow-lg z-10 ${canAdd ? 'bg-green-900/60 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-gray-800/80 text-gray-600 cursor-not-allowed'}`}
                        title={canAdd ? "Add Evo" : "Ineligible"}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      <EvoDetailsModal
        evoId={localViewingEvo}
        onClose={() => setLocalViewingEvo(null)}
        onAddEvo={(() => {
          const viewed = poolWithStatus.find(p => p.id === localViewingEvo);
          if (!viewed || viewed.limitReached || !viewed.isEligible) return undefined;
          return (id: string) => {
            handleAdd(id);
            setLocalViewingEvo(null);
          };
        })()}
      />
    </div>
  );
};
