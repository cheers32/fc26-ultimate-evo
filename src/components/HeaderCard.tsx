import React from 'react';
import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition } from '../types/player';
import { calculateChip } from '../utils/statUtils';
import { availableEvolutions } from '../data/evolutionsData';
import { ExternalLink, Zap, Beaker, Settings, Plus, Layers, X } from 'lucide-react';

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
  originalIgs: number;
  originalFaceSum: number;
  maxOvrCap: number;
  onMaxOvrCapChange: (val: number) => void;
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
  selectedNodes: [number, number];
  onNodeClick: (nodeIndex: number) => void;
  playStyles: import('../types/player').PlayStylesData;
  onDeletePath?: (pathId: string) => void;
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
  originalIgs,
  originalFaceSum,
  maxOvrCap,
  onMaxOvrCapChange,
  onAnalyze,
  evosPoolCount,
  evoPreview,
  evoLocked,
  accelerateType,
  igs,
  faceSum,
  activeEvo,
  selectedNodes,
  onNodeClick,
  playStyles,
  onDeletePath
}) => {
  const showEvoOvr = evoPreview && previewOvr !== activeBaseOvr;
  const isLockedOrEvo = evoLocked || evoPreview;
  const isEvo = isLockedOrEvo;
  
  // Gold PlayStyles stats
  const goldBase = playStyles.base.gold.length;
  const goldLimit = playStyles.limits.gold;
  const goldEvTotal = playStyles.ev.gold.length;
  let goldAdded = 0;
  if (isEvo) {
    const availGold = Math.max(0, goldLimit - goldBase);
    goldAdded = Math.min(availGold, goldEvTotal);
  }
  const goldCurrent = goldBase + goldAdded;

  // Silver PlayStyles stats
  const silverBase = playStyles.base.silver.length;
  const silverLimit = playStyles.limits.silver;
  const silverEvTotal = playStyles.ev.silver.length;
  let silverAdded = 0;
  if (isEvo) {
    const availSilver = Math.max(0, silverLimit - silverBase);
    silverAdded = Math.min(availSilver, silverEvTotal);
  }
  const silverCurrent = silverBase + silverAdded;
  
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
    <div className="flex flex-col gap-4 mb-4">
      {/* Player Header Section (Ultra Compressed) */}
      <div className="flex flex-col gap-2 bg-[#1f211f]/60 p-2.5 rounded-xl border border-gray-800/80 backdrop-blur-sm">
        
        {/* Row 1: Name, OVR, and Basic Bio */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-800/60 pb-2">
          {/* Name & FUTBIN */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {bio.name}
            </h1>
            <a
              href={futbinLink}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] bg-[#1f2937] hover:bg-[#374151] text-gray-300 hover:text-white border border-gray-600 rounded px-1.5 py-1 flex items-center gap-1 transition-colors shadow-sm"
              title="View on FUTBIN"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          {/* Main OVR Rating Badge */}
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-2 py-0.5 rounded font-bold text-base shadow-sm border border-yellow-300 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-black/60 text-[10px] font-semibold tracking-wider">OVR</span>
            <span>{activeBaseOvr}</span>
            {showEvoOvr && (
              <>
                <span className="text-black/50 text-xs font-normal">➜</span>
                <span>{previewOvr}</span>
              </>
            )}
            {ovrChip && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-0.5 ${ovrChip.className}`}>
                {ovrChip.text}
              </span>
            )}
          </div>

          {/* Compressed Bio */}
          <div className="flex flex-wrap items-center gap-3 text-[#1db954] font-bold text-xs ml-auto">
            <span className="flex items-center gap-1"><span className="text-sm leading-none">🇪🇸</span> {bio.nation}</span>
            <span className="flex items-center gap-1"><span className="text-sm leading-none">⚽</span> {bio.league}</span>
            <span className="flex items-center gap-1"><span className="text-sm leading-none">🛡️</span> {bio.club}</span>
            <span className="flex items-center gap-1"><span className="text-sm leading-none">🌟</span> <span className="text-yellow-400">{bio.rarity}</span></span>
            <div className="flex items-center gap-3 text-gray-400 font-medium pl-3 border-l border-gray-700/60">
              <span className="flex items-center gap-1">📏 {bio.height}</span>
              <span className="flex items-center gap-1">👟 {bio.footAge}</span>
            </div>
          </div>
        </div>

        {/* Row 2: PlayStyles (Left), Positions & Skills (Right) */}
        <div className="flex items-start justify-between gap-x-5 gap-y-2">
          {/* PlayStyles */}
          {(playStyles.base.gold.length > 0 || playStyles.ev.gold.length > 0 || playStyles.base.silver.length > 0 || playStyles.ev.silver.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Gold PlayStyles */}
              {(playStyles.base.gold.length > 0 || playStyles.ev.gold.length > 0) && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 mr-0.5">
                    {goldCurrent}
                  </span>
                  {playStyles.base.gold.map((ps) => (
                    <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-yellow-900/40 text-yellow-500 border-yellow-700/50">{ps}</span>
                  ))}
                  {isEvo && (
                    <>
                      {playStyles.ev.gold.slice(0, goldAdded).map((ps) => (
                        <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-yellow-900/40 text-yellow-500 border-yellow-700/50 flex items-center gap-1 shadow-[0_0_8px_rgba(234,179,8,0.2)]">
                          {ps} <span className="text-[7px] font-black bg-green-900/60 text-green-400 px-0.5 rounded">NEW</span>
                        </span>
                      ))}
                      {playStyles.ev.gold.slice(goldAdded).map((ps) => (
                        <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-[#1f2937] text-gray-500 border-red-900/50 opacity-60 flex items-center gap-1">
                          <span className="line-through decoration-red-500 decoration-2">{ps}</span> <span className="text-[7px] font-black text-red-400">LIMIT</span>
                        </span>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Silver PlayStyles */}
              {(playStyles.base.silver.length > 0 || playStyles.ev.silver.length > 0) && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-gray-800 text-gray-300 border border-gray-600 mr-0.5">
                    {silverCurrent}
                  </span>
                  {playStyles.base.silver.map((ps) => (
                    <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-gray-800 text-gray-300 border-gray-600">{ps}</span>
                  ))}
                  {isEvo && (
                    <>
                      {playStyles.ev.silver.slice(0, silverAdded).map((ps) => (
                        <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-gray-800 text-gray-300 border-gray-600 flex items-center gap-1 shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                          {ps} <span className="text-[7px] font-black bg-green-900/60 text-green-400 px-0.5 rounded">NEW</span>
                        </span>
                      ))}
                      {playStyles.ev.silver.slice(silverAdded).map((ps) => (
                        <span key={ps} className="text-[10px] px-1.5 py-0.5 rounded border font-bold bg-[#1f2937] text-gray-500 border-red-900/50 opacity-60 flex items-center gap-1">
                          <span className="line-through decoration-red-500 decoration-2">{ps}</span> <span className="text-[7px] font-black text-red-400">LIMIT</span>
                        </span>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 ml-auto shrink-0 mt-0.5">
            {/* Positions */}
            <div className="flex items-center gap-1.5 text-gray-300 font-bold text-xs">
              <span className="text-sm leading-none">🎯</span> {bio.primaryPositions}
            </div>
            
            {/* Skills & Weak Foot */}
            <div className="flex items-center gap-4 text-xs font-medium text-white border-l border-gray-700/60 pl-4">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">SM</span>
                <span>{bio.skillMoves} <span className="text-yellow-400">★</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">WF</span>
                <span>{bio.weakFoot} <span className="text-yellow-400">★</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Path Selection & Action Buttons */}
    <div className="flex flex-col gap-2 w-full bg-[#1A1C1A] border border-gray-800 rounded-xl p-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-fcGreen" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evolution Lab</h3>
            </div>
            
            <div className="flex gap-1 items-center">
              <div className="flex items-center gap-1.5 mr-2 bg-[#1f211f] border border-gray-800 rounded-lg px-2 py-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">OVR Cap</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={maxOvrCap}
                  onChange={(e) => onMaxOvrCapChange(Number(e.target.value) || 99)}
                  className="w-10 bg-transparent text-white text-xs font-bold focus:outline-none text-center"
                />
              </div>
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
              <div key={path.id} className="relative flex items-center group">
                <button
                  onClick={() => onSelectPath(path.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border ${
                    activePathId === path.id
                      ? 'bg-green-950/40 text-fcGreen border-fcGreen shadow-sm'
                      : 'bg-[#1a1c1a] text-gray-400 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {path.name}
                </button>
                {onDeletePath && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePath(path.id);
                    }}
                    className="absolute -top-1 -right-1 bg-red-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                    title="Delete Path"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pb-2 items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800">
            {activePath.chainIds.length === 0 ? (
              <span className="text-[11px] text-gray-500 italic">No evolutions in this path.</span>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-gray-500 mr-1" />
                
                {/* Base Card Chip */}
                <button
                  onClick={() => onNodeClick(-1)}
                  title="Original Base Card"
                  className={`shrink-0 px-2.5 py-1 rounded text-[10px] font-bold flex items-center transition-all shadow ${
                    selectedNodes.includes(-1)
                      ? 'bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]'
                      : 'bg-[#2a2d2a] text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-200'
                  }`}
                >
                  <span className={`mr-1.5 text-[11px] font-black ${
                    selectedNodes.includes(-1) ? 'text-black/80' : 'text-white'
                  }`}>
                    {activeBaseOvr}
                  </span>
                  Base Card
                  <span className="font-normal text-[9px] ml-1.5 opacity-90">
                    (<span className={selectedNodes.includes(-1) ? 'text-black font-extrabold' : 'text-yellow-500/90 font-bold'}>{originalFaceSum}</span> | <span className={selectedNodes.includes(-1) ? 'text-green-950 font-extrabold' : 'text-fcGreen/90 font-bold'}>{originalIgs}</span>)
                  </span>
                </button>

                {activePath.chainIds.length > 0 && (
                  <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                )}

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
                    
                    const isStepActive = selectedNodes.includes(idx);
                    const fSumClass = isStepActive ? "text-black font-extrabold" : "text-yellow-500/90 font-bold";
                    const iSumClass = isStepActive ? "text-green-950 font-extrabold" : "text-fcGreen/90 font-bold";
                    
                    stepStatsStr = (
                      <span className="font-normal text-[9px] ml-1.5 opacity-90">
                        (<span className={fSumClass}>{fSum}</span> | <span className={iSumClass}>{iSum}</span>)
                      </span>
                    );
                  }

                  const isStepActive = selectedNodes.includes(idx);
                  const baseClass = isStepActive
                    ? "bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]"
                    : "bg-[#2a2d2a] text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-200";

                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <button
                        onClick={() => onNodeClick(idx)}
                        title={`Preview Step ${idx + 1} (${evo.name}) stats`}
                        className={`${baseClass} shrink-0 px-2.5 py-1 rounded text-[10px] font-bold flex items-center transition-all cursor-pointer shadow`}
                      >
                        {stepResult && (
                          <span className={`mr-1.5 text-[11px] font-black ${isStepActive ? 'text-black/80' : 'text-white'}`}>
                            {stepResult.ovrAfter}
                          </span>
                        )}
                        {evo.name}
                        {stepStatsStr}
                      </button>
                      {idx < activePath.chainIds.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}

                {builderLink && (
                  <a
                    href={builderLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 ml-auto text-[10px] text-fcGreen hover:text-white flex items-center gap-1 bg-green-950/60 px-2 py-1 rounded border border-green-800/60 transition-colors"
                  >
                    Open in FUTBIN <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
    </div>
  );
};
