import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import { useModal } from '../utils/modalStack';

import { Plus } from 'lucide-react';
export const EvoDetailsModal = ({ evoId, onClose, onAddEvo }: { evoId: string | null; onClose: () => void; onAddEvo?: (id: string) => void }) => {
  useModal(!!evoId, { onClose });

  useEffect(() => {
    if (!evoId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && onAddEvo) {
        onAddEvo(evoId);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [evoId, onAddEvo]);

  if (!evoId) return null;
  const evo = availableEvolutions[evoId];
  if (!evo) return null;

  return (
    <div id="evo-details-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1a1c1a] border border-gray-700 w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1f211f] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white tracking-wide">{evo.name}</h2>
          <div className="flex items-center gap-3">
            {onAddEvo && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddEvo(evoId);
                }}
                className="px-4 py-1.5 bg-fcGreen hover:bg-[#1db954] text-black font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Requirements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(evo.requirements || {}).map(([key, val]) => {
                if (val === undefined) return null;
                if (Array.isArray(val) && val.length === 0) return null;
                const displayKey = key.replace('max', 'Max ').replace('PlayStylesPlus', 'PS+').replace('PlayStyles', 'PS');
                const isPositionReq = key === 'positions' || key === 'excludedPositions';
                return (
                  <div key={key} className={`p-2 rounded border flex flex-col items-center justify-center text-center ${
                    isPositionReq ? 'bg-red-950/40 border-red-900/50' : 'bg-[#121212] border-gray-800'
                  }`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isPositionReq ? 'text-red-500' : 'text-gray-500'}`}>
                      {key === 'excludedPositions' ? 'Excluded Pos' : key === 'positions' ? 'Req Pos' : displayKey}
                    </span>
                    <span className={`font-bold text-sm ${isPositionReq ? 'text-red-400' : 'text-gray-200'}`}>
                      {Array.isArray(val) ? val.join(', ') : val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Upgrades */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Upgrades</h3>
            {evo.ovrBoost && (
              <div className="mb-3 bg-gradient-to-r from-yellow-900/30 to-yellow-950/10 p-3 rounded-lg border border-yellow-700/50 flex justify-between items-center">
                <span className="text-yellow-500 font-bold text-sm tracking-wide">OVR Boost</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-lg">+{evo.ovrBoost.boost}</span>
                  <span className="text-gray-500 text-xs">Limit: {evo.ovrBoost.limit}</span>
                </div>
              </div>
            )}
            {evo.positionsAdded && evo.positionsAdded.length > 0 && (
              <div className="mb-3 bg-purple-900/20 p-3 rounded-lg border border-purple-800/40 flex justify-between items-center">
                <span className="text-purple-400 font-bold text-sm tracking-wide">Position Added</span>
                <span className="text-purple-300 font-bold text-base">+ {evo.positionsAdded.join(', ')}</span>
              </div>
            )}
            {evo.rarityChange && (
              <div className="mb-3 bg-purple-900/20 p-3 rounded-lg border border-purple-800/40 flex justify-between items-center">
                <span className="text-purple-400 font-bold text-sm tracking-wide">Rarity Change</span>
                <span className="text-purple-300 font-bold text-base">{evo.rarityChange}</span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(evo.subStatBoosts || {}).map(([stat, boost]) => (
                <div key={stat} className="bg-[#121212] p-2 rounded border border-gray-800 flex justify-between items-center text-xs group hover:border-fcGreen/50 transition-colors">
                  <span className="text-gray-400 uppercase font-bold">{stat}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-fcGreen">+{boost.boost}</span>
                    <span className="text-gray-600 text-[9px]">≤{boost.limit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* PlayStyles */}
          {((evo.playStylesAdded?.gold?.length || 0) > 0 || (evo.playStylesAdded?.silver?.length || 0) > 0) && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">PlayStyles Added</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {(evo.playStylesAdded?.gold || []).map(ps => (
                   <div key={`gold-${ps}`} className="relative group">
                     <img src={getPlayStyleIconUrl(ps, true)} alt={ps} title={ps} className="w-16 h-16 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                     <span className="absolute -top-1 -right-2 text-[8px] text-black bg-yellow-500 px-1 rounded-sm font-black tracking-wider shadow-sm">PS+</span>
                   </div>
                ))}
                {(evo.playStylesAdded?.silver || []).map(ps => (
                   <div key={`silver-${ps}`} className="relative group">
                     <img src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-12 h-12 drop-shadow-[0_0_4px_rgba(156,163,175,0.4)]" />
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
