import React from 'react';
import { PlayerBio, StatsData, EvolutionPath } from '../types/player';
import { Shield, Sparkles } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { isPlayStyleNodeId } from '../utils/evoEngine';

interface FcCardPreviewProps {
  bio: PlayerBio;
  ovrVal: number;
  activePath: EvolutionPath;
  stats: StatsData;
  activeChemBoosts: Record<string, number>;
  activeChemName: string | null;
  evoLocked: boolean;
  evoPreview: boolean;
}

export const FcCardPreview: React.FC<FcCardPreviewProps> = ({
  bio,
  ovrVal,
  activePath,
  stats,
  activeChemBoosts,
  activeChemName,
  evoLocked,
  evoPreview
}) => {
  const isEvo = evoLocked || evoPreview;

  // Calculate face stats values for the card
  const getFaceDisplay = (faceKey: string) => {
    const faceData = stats[faceKey];
    let totalBase = 0;
    let totalChem = 0;

    Object.entries(faceData.subs).forEach(([subKey, subData]) => {
      const boost = activeChemBoosts[subKey] || 0;
      const effectiveVal = subData.base;
      const finalVal = Math.min(99, effectiveVal + boost);

      totalBase += effectiveVal * subData.w;
      totalChem += finalVal * subData.w;
    });

    const effectiveFaceVal = faceData.baseFace;
    const faceBoost = Math.round(totalChem) - Math.round(totalBase);
    return effectiveFaceVal + faceBoost;
  };

  const pac = getFaceDisplay('pac');
  const sho = getFaceDisplay('sho');
  const pas = getFaceDisplay('pas');
  const dri = getFaceDisplay('dri');
  const def = getFaceDisplay('def');
  const phy = getFaceDisplay('phy');

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* FC Card Outer Frame */}
      <div className={`relative w-72 h-[410px] rounded-2xl p-1 shadow-2xl transition-all duration-300 transform hover:scale-105 select-none ${
        isEvo
          ? 'bg-gradient-to-b from-yellow-300 via-green-500 to-emerald-800 shadow-[0_0_25px_rgba(30,215,96,0.5)]'
          : 'bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 shadow-xl'
      }`}>
        {/* Card Inner Gold Pattern */}
        <div className="w-full h-full bg-[#161816] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden border border-yellow-400/40">
          
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Row: OVR & Dynamic Multi-EVO Chips */}
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col items-center">
              <span className={`text-4xl font-black tracking-tighter font-mono ${isEvo ? 'text-fcGreen drop-shadow-[0_0_8px_rgba(30,215,96,0.8)]' : 'text-yellow-400'}`}>
                {ovrVal}
              </span>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider -mt-1">
                CDM
              </span>
            </div>

            <div className="flex flex-col items-end gap-1 max-w-[150px]">
              {/* Render Multi-EVO Badges on Card */}
              {isEvo && activePath.chainIds.map((id) => {
                if (isPlayStyleNodeId(id)) {
                  return (
                    <span key={id} className="flex items-center gap-1 bg-yellow-950/90 text-yellow-300 border border-yellow-600/80 px-2 py-0.5 rounded text-[9px] font-black tracking-wider shadow truncate">
                      <Sparkles className="w-2.5 h-2.5 shrink-0 text-yellow-400" /> PlayStyle Pick
                    </span>
                  );
                }
                const evo = availableEvolutions[id];
                if (!evo) return null;
                return (
                  <span key={id} className="flex items-center gap-1 bg-green-950/90 text-fcGreen border border-green-500/80 px-2 py-0.5 rounded text-[9px] font-black tracking-wider shadow truncate">
                    <Sparkles className="w-2.5 h-2.5 shrink-0 text-yellow-400" /> {evo.name}
                  </span>
                );
              })}

              {activeChemName && (
                <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5">
                  {activeChemName}
                </span>
              )}
            </div>
          </div>

          {/* Middle: Player Graphic Silhouette / Avatar */}
          <div className="my-auto flex flex-col items-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-yellow-400/20 to-green-500/20 border-2 border-yellow-400/50 flex items-center justify-center shadow-inner">
              <Shield className="w-12 h-12 text-yellow-400 opacity-90" />
            </div>
            <h3 className="text-xl font-black uppercase text-center mt-2 tracking-wider text-white drop-shadow">
              {bio.name}
            </h3>
            <span className="text-[11px] text-gray-400 font-semibold tracking-wide">
              {bio.club}
            </span>
          </div>

          {/* Bottom: 6 Face Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-yellow-400/30 text-xs font-mono font-bold z-10">
            <div className="flex justify-between border-r border-yellow-400/20 pr-2">
              <span className="text-gray-400">PAC</span>
              <span className={activeChemBoosts.acceleration ? 'text-fcGreen' : 'text-white'}>{pac}</span>
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-gray-400">DRI</span>
              <span className={activeChemBoosts.dribbling ? 'text-fcGreen' : 'text-white'}>{dri}</span>
            </div>

            <div className="flex justify-between border-r border-yellow-400/20 pr-2">
              <span className="text-gray-400">SHO</span>
              <span className={activeChemBoosts.finishing ? 'text-fcGreen' : 'text-white'}>{sho}</span>
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-gray-400">DEF</span>
              <span className={activeChemBoosts.interceptions ? 'text-fcGreen' : 'text-white'}>{def}</span>
            </div>

            <div className="flex justify-between border-r border-yellow-400/20 pr-2">
              <span className="text-gray-400">PAS</span>
              <span className={activeChemBoosts.shortPass ? 'text-fcGreen' : 'text-white'}>{pas}</span>
            </div>
            <div className="flex justify-between pl-2">
              <span className="text-gray-400">PHY</span>
              <span className={activeChemBoosts.strength ? 'text-fcGreen' : 'text-white'}>{phy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
