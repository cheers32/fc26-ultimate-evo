import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData } from '../types/player';
import { simulateEvoChain, validateRequirement } from '../utils/evoEngine';

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
  editingPath
}) => {
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [pathName, setPathName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Populate the builder with the path being edited (or reset for a fresh path) whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingPath) {
        setSelectedChain([...editingPath.chainIds]);
        setPathName(editingPath.name);
      } else {
        setSelectedChain([]);
        setPathName('');
        setSearchQuery('');
      }
    }
  }, [isOpen, editingPath]);

  // Live simulation to check if the current chain is valid
  const validationResult = useMemo(() => {
    if (selectedChain.length === 0) return { isValid: true, result: null };
    const res = simulateEvoChain(selectedChain, baseBio, baseOvr, baseStats, basePlayStyles);
    return { isValid: res.isValidChain, result: res };
  }, [selectedChain, baseBio, baseOvr, baseStats, basePlayStyles]);

  if (!isOpen) return null;

  const handleAdd = (id: string) => {
    const evo = availableEvolutions[id];
    const count = selectedChain.filter(eid => eid === id).length;
    const maxAllowed = evo?.maxRepeatable || 1;
    
    if (count < maxAllowed) {
      setSelectedChain([...selectedChain, id]);
    }
  };

  const handleRemove = (index: number) => {
    const newChain = [...selectedChain];
    newChain.splice(index, 1);
    setSelectedChain(newChain);
  };

  const handleSave = () => {
    if (selectedChain.length > 0 && validationResult.isValid) {
      const result = validationResult.result;
      const igs = result ? Object.values(result.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0) : 0;
      const defaultName = result ? `Custom ${result.finalOvr}/${selectedChain.length}/${igs}` : `Custom Path`;
      const pName = pathName.trim() || defaultName;
      onSave({
        id: editingPath ? editingPath.id : `manual-path-${Date.now()}`,
        name: pName,
        description: editingPath ? editingPath.description : 'User created manual evolution path.',
        isRecommended: editingPath?.isRecommended ?? false,
        chainIds: [...selectedChain],
        steps: validationResult.result?.steps
      });
      setSelectedChain([]);
      setPathName('');
    }
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

    if (evo && !limitReached) {
      const validation = validateRequirement(evo, currentOvr, currentStats, currentPlayStyles, currentBio);
      isEligible = validation.eligible;
      reasons = validation.reasons;

      if (isEligible) {
        const testRes = simulateEvoChain([...selectedChain, id], baseBio, baseOvr, baseStats, basePlayStyles);
        if (testRes.isValidChain) {
          expectedOvr = testRes.finalOvr;
          expectedStats = testRes.finalStats;
          expectedIgs = Object.values(testRes.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
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
      expectedStats
    };
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1f211f]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{editingPath ? 'Edit Path' : 'Create Manual Path'}</h2>
            <p className="text-xs text-gray-400 mt-1">
              {editingPath ? `Editing "${editingPath.name}". Add or remove EVOs below.` : 'Build your own chain from the EVOs Pool.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Current Chain */}
          <div className="md:w-1/2 flex flex-col border-r border-gray-800 bg-[#121212]">
            <div className="p-4 border-b border-gray-800 bg-[#1f211f]/50">
              <input 
                type="text" 
                placeholder="Name your path (optional)..."
                value={pathName}
                onChange={(e) => setPathName(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-fcGreen transition-colors"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Evolution Sequence</h3>
              
              {selectedChain.length === 0 ? (
                <div className="text-center py-10 text-gray-600 text-sm border-2 border-dashed border-gray-800 rounded-xl">
                  Select EVOs from the pool to start building.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedChain.map((id, index) => {
                    const evo = availableEvolutions[id];
                    const stepRes = validationResult.result?.steps[index];
                    const isValid = stepRes?.validation.eligible;
                    
                    return (
                      <div key={`${id}-${index}`} className={`relative p-3 rounded-xl border ${isValid ? 'bg-[#1f211f] border-gray-700' : 'bg-red-950/20 border-red-900/50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-gray-800 text-xs font-bold flex items-center justify-center text-gray-400">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{evo?.name || id}</h4>
                              {stepRes && (
                                <div className="mt-1 flex flex-col gap-1">
                                  <p className="text-[10px] text-gray-400">OVR After: <span className="text-yellow-400 font-bold">{stepRes.ovrAfter}</span></p>
                                  <div className="flex gap-2 text-[9px] text-gray-500 font-mono">
                                    <span>PAC <span className="text-gray-300">{stepRes.statsAfter.pac.evFace}</span></span>
                                    <span>SHO <span className="text-gray-300">{stepRes.statsAfter.sho.evFace}</span></span>
                                    <span>PAS <span className="text-gray-300">{stepRes.statsAfter.pas.evFace}</span></span>
                                    <span>DRI <span className="text-gray-300">{stepRes.statsAfter.dri.evFace}</span></span>
                                    <span>DEF <span className="text-gray-300">{stepRes.statsAfter.def.evFace}</span></span>
                                    <span>PHY <span className="text-gray-300">{stepRes.statsAfter.phy.evFace}</span></span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <button onClick={() => handleRemove(index)} className="text-gray-500 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {!isValid && stepRes && (
                          <div className="mt-2 text-xs text-red-400 bg-red-950/40 p-2 rounded flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <ul className="list-disc list-inside">
                              {stepRes.validation.reasons.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Validation Summary */}
            {selectedChain.length > 0 && (
              <div className={`p-4 border-t border-gray-800 ${validationResult.isValid ? 'bg-green-950/20' : 'bg-red-950/20'}`}>
                {validationResult.isValid ? (
                  <div className="text-fcGreen text-sm font-semibold flex justify-between items-center w-full">
                    <span>Valid Chain!</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono">Final OVR: {validationResult.result?.finalOvr}</span>
                      {validationResult.result && (
                        <div className="flex gap-2 text-[10px] text-fcGreen/80 font-mono">
                          <span>PAC {validationResult.result.finalStats.pac.evFace}</span>
                          <span>SHO {validationResult.result.finalStats.sho.evFace}</span>
                          <span>PAS {validationResult.result.finalStats.pas.evFace}</span>
                          <span>DRI {validationResult.result.finalStats.dri.evFace}</span>
                          <span>DEF {validationResult.result.finalStats.def.evFace}</span>
                          <span>PHY {validationResult.result.finalStats.phy.evFace}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400 text-sm font-semibold">
                    Invalid Chain. Fix errors to save.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Available Pool */}
          <div className="md:w-1/2 flex flex-col bg-[#1A1C1A]">
            <div className="p-4 border-b border-gray-800 bg-[#1f211f]/50 flex justify-between items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Available in Pool</h3>
              <div className="relative flex-1 max-w-[200px]">
                <input 
                  type="text"
                  placeholder="Search EVOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:border-fcGreen focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2 content-start">
              {poolWithStatus.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm">
                  Your EVO pool is empty.
                </div>
              ) : (
                poolWithStatus
                  .filter(({ evo }) => !searchQuery || evo?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(({ id, evo, limitReached, isEligible, reasons, expectedOvr, expectedIgs, expectedStats }) => {
                  if (!evo) return null;
                  
                  const canAdd = !limitReached && isEligible;
                  
                  return (
                    <div 
                      key={id}
                      onClick={() => { if (canAdd) handleAdd(id); }}
                      className={`p-3 rounded-xl transition-all flex flex-col ${
                        canAdd 
                          ? 'bg-[#121212] border border-gray-800 hover:border-fcGreen/50 cursor-pointer group' 
                          : 'bg-[#121212]/50 border border-gray-800/30 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h4 className={`font-bold text-sm transition-colors ${canAdd ? 'text-gray-200 group-hover:text-fcGreen' : 'text-gray-500'}`}>{evo.name}</h4>
                          <div className="flex gap-2 items-center mt-0.5">
                            <p className="text-[10px] text-gray-500 font-medium">Req OVR: ≤{evo.requirements.maxOvr}</p>
                            {canAdd && expectedOvr > currentOvr && (
                              <span className="px-1.5 py-0.5 bg-green-950/40 rounded text-[9px] text-green-400 border border-green-800/40 font-bold">
                                → {expectedOvr} OVR
                              </span>
                            )}
                            {canAdd && expectedIgs > 0 && (
                              <span className="px-1.5 py-0.5 bg-blue-950/40 rounded text-[9px] text-blue-400 border border-blue-800/40 font-bold">
                                → {expectedIgs} IGS
                              </span>
                            )}
                            {evo.maxRepeatable && evo.maxRepeatable > 1 && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] border font-bold ${canAdd ? 'bg-fcGold/20 text-fcGold border-fcGold/40' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                Repeatable: {evo.maxRepeatable}
                              </span>
                            )}
                          </div>
                          {canAdd && expectedStats && (
                            <div className="flex gap-2 text-[9px] text-gray-500 font-mono mt-1.5 pt-1.5 border-t border-gray-800/50">
                              <span>PAC <span className="text-gray-300">{expectedStats.pac.evFace}</span></span>
                              <span>SHO <span className="text-gray-300">{expectedStats.sho.evFace}</span></span>
                              <span>PAS <span className="text-gray-300">{expectedStats.pas.evFace}</span></span>
                              <span>DRI <span className="text-gray-300">{expectedStats.dri.evFace}</span></span>
                              <span>DEF <span className="text-gray-300">{expectedStats.def.evFace}</span></span>
                              <span>PHY <span className="text-gray-300">{expectedStats.phy.evFace}</span></span>
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

        <div className="p-4 border-t border-gray-800 bg-[#1f211f] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-[#2A2D2A] hover:bg-[#374151] transition-colors border border-gray-700">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={selectedChain.length === 0 || !validationResult.isValid}
            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${
              selectedChain.length > 0 && validationResult.isValid 
                ? 'bg-[#1ED760] text-black hover:bg-[#1db954]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {editingPath ? 'Save Changes' : 'Complete Path'}
          </button>
        </div>
      </div>
    </div>
  );
};
