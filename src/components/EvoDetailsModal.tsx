import React from 'react';
import { X } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';

export const EvoDetailsModal = ({ evoId, onClose }: { evoId: string | null; onClose: () => void }) => {
  if (!evoId) return null;
  const evo = availableEvolutions[evoId];
  if (!evo) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#1a1c1a] border border-gray-700 w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1f211f] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white tracking-wide">{evo.name}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Requirements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(evo.requirements || {}).map(([key, val]) => {
                if (val === undefined) return null;
                const displayKey = key.replace('max', 'Max ').replace('PlayStylesPlus', 'PS+').replace('PlayStyles', 'PS');
                return (
                  <div key={key} className="bg-[#121212] p-2 rounded border border-gray-800 flex flex-col items-center justify-center text-center">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">{displayKey}</span>
                    <span className="font-bold text-gray-200 text-sm">{Array.isArray(val) ? val.join(', ') : val}</span>
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
              <div className="flex flex-wrap gap-2">
                {(evo.playStylesAdded?.gold || []).map(ps => (
                   <span key={`gold-${ps}`} className="px-2.5 py-1.5 rounded text-xs font-bold bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.15)]">
                     {ps} <span className="text-[9px] text-black bg-yellow-500 px-1 rounded-sm font-black tracking-wider">PS+</span>
                   </span>
                ))}
                {(evo.playStylesAdded?.silver || []).map(ps => (
                   <span key={`silver-${ps}`} className="px-2.5 py-1.5 rounded text-xs font-bold bg-gray-800 text-gray-300 border border-gray-600 flex items-center shadow-sm">
                     {ps}
                   </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
