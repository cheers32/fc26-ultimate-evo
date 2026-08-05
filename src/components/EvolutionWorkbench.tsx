import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Sliders, Layers, ArrowRight, Star, Check } from 'lucide-react';
import { OvrData, EvolutionPath } from '../types/player';
import { defaultEvolutionPaths, availableEvolutions } from '../data/evolutionsData';

interface EvolutionWorkbenchProps {
  activePath: EvolutionPath;
  onSelectPath: (path: EvolutionPath) => void;
  evoPreview: boolean;
  selectedStep: 'full' | number;
  onTogglePreview: () => void;
  onSelectStep: (stepIndex: 'full' | number) => void;
  ovr: OvrData;
  onUpdateOvr: (newOvr: OvrData) => void;
}

export const EvolutionWorkbench: React.FC<EvolutionWorkbenchProps> = ({
  activePath,
  onSelectPath,
  evoPreview,
  selectedStep,
  onTogglePreview,
  onSelectStep,
  ovr,
  onUpdateOvr
}) => {
  const [showSandbox, setShowSandbox] = useState(false);

  return (
    <div className="mb-8 border-t border-gray-800 pt-6">
      
      {/* Title & Path Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fcGold" />
            Evolution Path & Step-by-Step Lock Workbench
          </h2>
        </div>
        
        <button
          onClick={() => setShowSandbox(!showSandbox)}
          className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-fcGold transition-colors bg-[#1f2937]/50 px-2.5 py-1 rounded border border-gray-700 hover:border-fcGold/50"
        >
          <Sliders className="w-3.5 h-3.5" />
          {showSandbox ? 'Hide Custom Rules' : 'Customize EVO Rules'}
        </button>
      </div>

      {/* Path Selector Tabs (Moved to HeaderCard) */}

      {/* Active Path Chips Display & Individual Lock Buttons */}
      <div className="bg-[#1f211f] p-4 rounded-xl border border-gray-800 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            Active Chain Steps (Click an EVO to preview its stats):
          </span>

          {/* Master Preview Toggle */}
          <button
            onClick={() => onSelectStep('full')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
              selectedStep === 'full'
                ? 'bg-[#EBB626] text-black border-[#d9a320] font-extrabold shadow'
                : 'bg-[#1f2937] text-gray-300 border-gray-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-fcGold" />
            Preview Full Chain
          </button>
        </div>

        {/* Step-by-Step Chips & Lock Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {activePath.chainIds.map((evoId, index) => {
            const evo = availableEvolutions[evoId];
            if (!evo) return null;

            const isStepSelected = selectedStep === index;

            return (
              <React.Fragment key={evoId}>
                <button 
                  onClick={() => onSelectStep(isStepSelected ? 'full' : index)}
                  title={`Preview Step ${index + 1} (${evo.name}) stats`}
                  className={`flex items-center border rounded-lg overflow-hidden shadow transition-all cursor-pointer text-left ${
                  (selectedStep === 'full' || index <= selectedStep)
                    ? 'bg-[#EBB626] border-[#d9a320] text-black hover:bg-[#d4a21e]'
                    : 'bg-[#19202a] border-[#3b4758] text-white hover:border-gray-400 hover:bg-[#222a36]'
                }`}>
                  <span className={`px-2.5 py-1.5 text-[10px] font-black border-r ${
                    (selectedStep === 'full' || index <= selectedStep)
                      ? 'bg-black/20 text-black border-black/20'
                      : 'bg-yellow-500/20 text-yellow-300 border-[#3b4758]'
                  }`}>
                    Step {index + 1}
                  </span>

                  <span className="px-3 py-1.5 text-xs font-extrabold flex items-center gap-1.5">
                    {evo.name}
                    <span className={`text-[10px] ${(selectedStep === 'full' || index <= selectedStep) ? 'text-black/70' : 'text-gray-400'}`}>
                      #{evo.id}
                    </span>
                    {evo.requirements.positions && evo.requirements.positions.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border ml-1 bg-red-950/40 text-red-400 border-red-900/50">
                        Req Pos: {evo.requirements.positions.join(', ')}
                      </span>
                    )}
                    {evo.positionsAdded && evo.positionsAdded.length > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ml-1 ${
                        (selectedStep === 'full' || index <= selectedStep)
                          ? 'bg-purple-900/20 text-purple-900 border-purple-900/20'
                          : 'bg-purple-950/40 text-purple-400 border-purple-800/40'
                      }`}>
                        + Pos: {evo.positionsAdded.join(', ')}
                      </span>
                    )}
                    {evo.rarityChange && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ml-1 ${
                        (selectedStep === 'full' || index <= selectedStep)
                          ? 'bg-purple-900/20 text-purple-900 border-purple-900/20'
                          : 'bg-purple-950/40 text-purple-400 border-purple-800/40'
                      }`}>
                        Rarity → {evo.rarityChange}
                      </span>
                    )}
                  </span>
                </button>

                {index < activePath.chainIds.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-fcGreen shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selection Info Notification */}
        {selectedStep !== 'full' && (
          <div className="text-xs text-fcGreen font-medium flex items-center gap-1.5 bg-green-950/40 p-2.5 rounded-lg border border-green-800/60">
            <Check className="w-4 h-4" />
            <span>
              Previewing Step {selectedStep + 1} ({availableEvolutions[activePath.chainIds[selectedStep]]?.name}). 
              {selectedStep > 0 ? ` Base stats are set to the output of Step ${selectedStep}.` : ' Base stats are the original card.'}
            </span>
          </div>
        )}
      </div>

      {/* Sandbox Config Drawer */}
      {showSandbox && (
        <div className="mt-4 p-4 bg-[#1a1d1a] border border-gray-700/80 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">OVR Base Rating</label>
            <input
              type="number"
              value={ovr.base}
              onChange={(e) => onUpdateOvr({ ...ovr, base: Number(e.target.value) })}
              className="w-full bg-[#121212] border border-gray-700 rounded px-2.5 py-1 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Max EVO Boost</label>
            <input
              type="number"
              value={ovr.boost}
              onChange={(e) => onUpdateOvr({ ...ovr, boost: Number(e.target.value) })}
              className="w-full bg-[#121212] border border-gray-700 rounded px-2.5 py-1 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">OVR Hard Cap Limit</label>
            <input
              type="number"
              value={ovr.limit}
              onChange={(e) => onUpdateOvr({ ...ovr, limit: Number(e.target.value) })}
              className="w-full bg-[#121212] border border-gray-700 rounded px-2.5 py-1 text-white font-bold"
            />
          </div>
        </div>
      )}
    </div>
  );
};
