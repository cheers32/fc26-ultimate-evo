import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData } from '../types/player';
import { simulateEvoChain } from '../utils/evoEngine';

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

  // Populate the builder with the path being edited (or reset for a fresh path) whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingPath) {
        setSelectedChain([...editingPath.chainIds]);
        setPathName(editingPath.name);
      } else {
        setSelectedChain([]);
        setPathName('');
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

  const availableToSelect = evosPool.filter((id) => {
    const evo = availableEvolutions[id];
    const count = selectedChain.filter(eid => eid === id).length;
    const maxAllowed = evo?.maxRepeatable || 1;
    return count < maxAllowed;
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
                                <p className="text-[10px] text-gray-400 mt-0.5">OVR After: <span className="text-yellow-400 font-bold">{stepRes.ovrAfter}</span></p>
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
                  <div className="text-fcGreen text-sm font-semibold flex justify-between items-center">
                    <span>Valid Chain!</span>
                    <span className="font-mono">Final OVR: {validationResult.result?.finalOvr}</span>
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
            <div className="p-4 border-b border-gray-800 bg-[#1f211f]/50">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Available in Pool</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2 content-start">
              {availableToSelect.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm">
                  {evosPool.length === 0 ? 'Your EVO pool is empty.' : 'All pool EVOs used.'}
                </div>
              ) : (
                availableToSelect.map((id) => {
                  const evo = availableEvolutions[id];
                  if (!evo) return null;
                  return (
                    <div 
                      key={id}
                      onClick={() => handleAdd(id)}
                      className="p-3 bg-[#121212] border border-gray-800 hover:border-fcGreen/50 rounded-xl cursor-pointer transition-all flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="font-bold text-gray-200 text-sm group-hover:text-fcGreen transition-colors">{evo.name}</h4>
                        <div className="flex gap-2 items-center mt-0.5">
                          <p className="text-[10px] text-gray-500">Max OVR {evo.requirements.maxOvr}</p>
                          {evo.maxRepeatable && evo.maxRepeatable > 1 && (
                            <span className="px-1.5 py-0.5 bg-fcGold/20 rounded text-[9px] text-fcGold border border-fcGold/40 font-bold">
                              Repeatable: {evo.maxRepeatable}
                            </span>
                          )}
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-500 group-hover:text-fcGreen" />
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
