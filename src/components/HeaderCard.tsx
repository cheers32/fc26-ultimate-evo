import React from 'react';
import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition } from '../types/player';
import { calculateChip } from '../utils/statUtils';
import { availableEvolutions } from '../data/evolutionsData';
import { Layers, ExternalLink, Plus, Zap, Settings, Beaker } from 'lucide-react';

interface HeaderCardProps {
  bio: PlayerBio;
  futbinLink?: string;
  activeBaseOvr: number;
  previewOvr: number;
  activePath: EvolutionPath;
  allPaths: EvolutionPath[];
  activePathId: string;
  onSelectPath: (id: string) => void;
  onOpenEvoPool: () => void;
  onOpenManualPath: () => void;
  onAnalyze: () => void;
  evosPoolCount: number;
  evoPreview: boolean;
  evoLocked: boolean;
  accelerateType: string;
  igs: {
    activeBase: number;
    effective: number;
    chem: number;
    diff: number;
  };
  faceSum: {
    activeBase: number;
    effective: number;
    chem: number;
    diff: number;
  };
  activeEvo?: EvolutionDefinition | null;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  bio,
  futbinLink,
  activeBaseOvr,
  previewOvr,
  activePath,
  allPaths,
  activePathId,
  onSelectPath,
  onOpenEvoPool,
  onOpenManualPath,
  onAnalyze,
  evosPoolCount,
  evoPreview,
  evoLocked,
  accelerateType,
  igs,
  faceSum,
  activeEvo
}) => {
  const showEvoOvr = evoPreview && previewOvr !== activeBaseOvr;
  const isLockedOrEvo = evoLocked || evoPreview;
  
  const actualOvrBoost = previewOvr - activeBaseOvr;
  let ovrChip = null;

  if (activeEvo && activeEvo.ovrBoost && isLockedOrEvo) {
    ovrChip = calculateChip(activeBaseOvr, activeEvo.ovrBoost.boost, activeEvo.ovrBoost.limit, actualOvrBoost, true);
  } else if (isLockedOrEvo && actualOvrBoost > 0) {
    ovrChip = { text: `+${actualOvrBoost}`, className: 'text-fcGreen border-fcGreen bg-green-950' };
  }

  const playerIdMatch = futbinLink ? futbinLink.match(/\/player\/(\d+)\//) : null;
  const futbinPlayerId = playerIdMatch ? playerIdMatch[1] : '';
  const builderLink = futbinPlayerId && activePath.chainIds.length > 0
    ? `https://www.futbin.com/26/evolutions/builder/${futbinPlayerId}_${activePath.chainIds.join('_')}?includeExpired=false`
    : null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-6 mb-8 gap-6">
      <div>
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          <h1 className="text-4xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {bio.name}
          </h1>
          <a
            href={futbinLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-[#1f2937] hover:bg-[#374151] text-gray-300 hover:text-white border border-gray-600 rounded px-2.5 py-1.5 flex items-center gap-1.5 transition-colors shadow-sm ml-2"
            title="View on FUTBIN"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            FUTBIN
          </a>
          
          {/* Main OVR Rating Badge */}
          <div
            id="ovr-badge"
            className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-3.5 py-1 rounded-lg font-bold text-xl shadow-lg border border-yellow-300 flex items-center gap-2 whitespace-nowrap transition-all duration-300"
          >
            <span className="text-black/60 text-xs font-semibold tracking-wider">OVR</span>
            <span>{activeBaseOvr}</span>

            {showEvoOvr && (
              <>
                <span className="text-black/50 text-sm font-normal">➜</span>
                <span>{previewOvr}</span>
              </>
            )}

            {ovrChip && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1 ${ovrChip.className}`}>
                {ovrChip.text}
              </span>
            )}
          </div>
        </div>

        {/* Path Selection & Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-fcGreen" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evolution Lab</h3>
            </div>
            
            <div className="flex gap-1">
              <button onClick={onOpenEvoPool} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 relative text-xs flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Pool ({evosPoolCount})
              </button>
              <button onClick={onOpenManualPath} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Manual
              </button>
              <button onClick={onAnalyze} disabled={evosPoolCount === 0} className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 ${evosPoolCount > 0 ? 'bg-fcGreen text-black border-fcGreen hover:bg-[#1db954]' : 'bg-[#1f211f] text-gray-600 border-gray-800'}`}>
                <Zap className="w-3.5 h-3.5" /> Analyze
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border ${
                  activePathId === path.id
                    ? 'bg-green-950/40 text-fcGreen border-fcGreen shadow-sm'
                    : 'bg-[#1a1c1a] text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {path.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800">
            {activePath.chainIds.length === 0 ? (
              <span className="text-[11px] text-gray-500 italic">No evolutions in this path.</span>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-gray-500 mr-1" />
                {activePath.chainIds.map((id, idx) => {
                  const evo = availableEvolutions[id];
                  if (!evo) return null;
                  
                  let stepStatsStr = null;
                  const stepResult = activePath.steps?.[idx];
                  if (stepResult) {
                    let fSum = 0;
                    let iSum = 0;
                    Object.values(stepResult.statsAfter).forEach(f => {
                      fSum += f.baseFace;
                      Object.values(f.subs).forEach(s => { iSum += s.base; });
                    });
                    stepStatsStr = (
                      <span className="text-gray-500 font-normal text-[9px] ml-1.5">
                        (<span className="text-yellow-500/90 font-bold">{fSum}</span> | <span className="text-fcGreen/90 font-bold">{iSum}</span>)
                      </span>
                    );
                  }

                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <span className="bg-[#2a2d2a] text-gray-300 border border-gray-600 px-2.5 py-1 rounded text-[10px] font-bold flex items-center">
                        {evo.name}
                        {stepStatsStr}
                      </span>
                      {idx < activePath.chainIds.length - 1 && (
                        <span className="text-gray-600 text-[10px]">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}

                {builderLink && (
                  <a
                    href={builderLink}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto text-[10px] text-fcGreen hover:text-white flex items-center gap-1 bg-green-950/60 px-2 py-1 rounded border border-green-800/60 transition-colors"
                  >
                    Open in FUTBIN <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        <div className="text-fcTextDim font-medium text-[15px] flex flex-wrap items-center gap-3 mt-4">
          <span className="text-yellow-400 font-bold">{bio.rarity}</span>
          <span className="text-gray-600">|</span>
          <span>{bio.primaryPositions}</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-xs">{bio.club} • {bio.nation}</span>
        </div>
      </div>

      {/* Base Info & Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-[14px] bg-[#1f211f]/60 p-4 rounded-xl border border-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Height</span>
          <span className="font-medium text-white">{bio.height}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Foot & Age</span>
          <span className="font-medium text-white">{bio.footAge}</span>
        </div>
        <div className="flex flex-col min-w-[130px]">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">AcceleRATE</span>
          <span className={`font-bold transition-colors ${accelerateType === 'Lengthy' ? 'text-fcGreen drop-shadow-[0_0_8px_rgba(30,215,96,0.4)]' : 'text-white'}`}>
            {accelerateType}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Face Stats</span>
          <div className="font-medium flex items-center gap-1 font-mono">
            <span className="text-gray-400">{faceSum.activeBase}</span>
            {previewOvr !== activeBaseOvr && (
              <>
                <span className="text-gray-600 text-xs">➜</span>
                <span className="text-[#EBB626] font-bold">{faceSum.effective}</span>
              </>
            )}
            {faceSum.diff > 0 && (
              <>
                <span className="text-fcGreen text-xs">➜</span>
                <span className="text-fcGreen font-bold">{faceSum.chem} (+{faceSum.diff})</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 font-semibold text-[11px] uppercase tracking-wider">Total IGS</span>
          <div className="font-medium flex items-center gap-1 font-mono">
            <span className="text-gray-400">{igs.activeBase}</span>
            {previewOvr !== activeBaseOvr && (
              <>
                <span className="text-gray-600 text-xs">➜</span>
                <span className="text-[#EBB626] font-bold">{igs.effective}</span>
              </>
            )}
            {igs.diff > 0 && (
              <>
                <span className="text-fcGreen text-xs">➜</span>
                <span className="text-fcGreen font-bold">{igs.chem} (+{igs.diff})</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
