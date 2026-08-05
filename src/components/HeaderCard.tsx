import React from 'react';
import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition, EvoFilters } from '../types/player';
import { calculateChip } from '../utils/statUtils';
import { availableEvolutions } from '../data/evolutionsData';
import { ExternalLink, Zap, Settings, Plus, Layers, X, Settings2, Minus, Star, Eye, RefreshCw, GitBranch, Trash2 } from 'lucide-react';
import { PlayerSubInfo } from './PlayerSubInfo';

interface HeaderCardProps {
  bio: PlayerBio;
  futbinLink?: string;
  avatarUrl?: string;
  activeBaseOvr: number;
  previewOvr: number;
  activePath: EvolutionPath;
  allPaths: EvolutionPath[];
  activePathId: string;
  expandedPathIds?: string[];
  comparePathId?: string | null;
  onSetComparePathId?: (id: string | null) => void;
  onSelectPath: (id: string) => void;
  onOpenEvoPool: () => void;
  onOpenManualPath: () => void;
  onBranchFromBase?: () => void;
  originalIgs: number;
  originalFaceSum: number;
  evoFilters: EvoFilters;
  onEvoFiltersChange: (val: EvoFilters) => void;
  onAnalyze: () => void;
  evosPool: string[];
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
  onChangePlayer?: () => void;
  onClearPaths?: () => void;
  onToggleFavoritePath?: (path: EvolutionPath) => void;
  onViewEvo?: (evoId: string) => void;
  // Index of the step new builds start from (-1 = raw card), and a setter for picking one.
  baseIndex?: number;
  onSetBase?: (pathId: string, index: number) => void;
  onRemoveNode?: (pathId: string, index: number) => void;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  bio,
  futbinLink,
  avatarUrl,
  activeBaseOvr,
  previewOvr,
  activePath,
  allPaths,
  activePathId,
  expandedPathIds = [],
  comparePathId,
  onSetComparePathId,
  onSelectPath,
  onOpenEvoPool,
  onOpenManualPath,
  onBranchFromBase,
  originalIgs,
  originalFaceSum,
  evoFilters,
  onEvoFiltersChange,
  onAnalyze,
  evosPool,
  evoPreview,
  evoLocked,
  accelerateType,
  igs,
  faceSum,
  activeEvo,
  selectedNodes,
  onNodeClick,
  playStyles,
  onDeletePath,
  onToggleFavoritePath,
  onChangePlayer,
  onClearPaths,
  onViewEvo,
  baseIndex = -1,
  onSetBase,
  onRemoveNode
}) => {
  const showEvoOvr = evoPreview && previewOvr !== activeBaseOvr;
  const isLockedOrEvo = evoLocked || evoPreview;

  const [showFilters, setShowFilters] = React.useState(false);
  const [expandedStats, setExpandedStats] = React.useState<Set<string>>(new Set());

  const toggleExpand = (stat: string) => {
    const next = new Set(expandedStats);
    if (next.has(stat)) next.delete(stat);
    else next.add(stat);
    setExpandedStats(next);
  };

  const statSubs: Record<string, {key: string, label: string}[]> = {
    pac: [{key: 'acceleration', label: 'Accel'}, {key: 'sprintSpeed', label: 'Sprint'}],
    sho: [{key: 'positioning', label: 'Pos'}, {key: 'finishing', label: 'Finish'}, {key: 'shotPower', label: 'Power'}, {key: 'longShots', label: 'Long'}, {key: 'volleys', label: 'Volley'}, {key: 'penalties', label: 'Pen'}],
    pas: [{key: 'vision', label: 'Vision'}, {key: 'crossing', label: 'Cross'}, {key: 'freekick', label: 'FK Acc'}, {key: 'shortPass', label: 'Short'}, {key: 'longPass', label: 'Long'}, {key: 'curve', label: 'Curve'}],
    dri: [{key: 'agility', label: 'Agility'}, {key: 'balance', label: 'Balance'}, {key: 'reactions', label: 'React'}, {key: 'ballControl', label: 'Control'}, {key: 'dribbling', label: 'Dribble'}, {key: 'composure', label: 'Composure'}],
    def: [{key: 'interceptions', label: 'Intercept'}, {key: 'headingAcc', label: 'Heading'}, {key: 'defAwareness', label: 'Def Aware'}, {key: 'standTackle', label: 'Stand T.'}, {key: 'slideTackle', label: 'Slide T.'}],
    phy: [{key: 'jumping', label: 'Jumping'}, {key: 'stamina', label: 'Stamina'}, {key: 'strength', label: 'Strength'}, {key: 'aggression', label: 'Aggress'}]
  };
  
  
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
    <div className="relative z-50 flex flex-col gap-2 mb-4">
      {/* Player Header Section (Ultra Compressed) */}
      <div className="relative z-50 flex flex-col gap-3 bg-[#1f211f]/60 p-4 rounded-xl border border-gray-800/80 backdrop-blur-sm w-full">
        
        {/* Top Part: LEFT (Avatar/Name/OVR/Pos/Stats) + RIGHT (Bio/PlayStyles) */}
        <div className="flex items-center gap-5 w-full">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 shrink-0">
            {avatarUrl && (
              <div className="relative">
                <div className="w-[80px] h-[80px] shrink-0 rounded-full border-2 border-gray-600 bg-[#121212] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={bio.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://futhead.cursecdn.com/static/img/24/players/p_placeholder.png';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center h-full gap-1.5">
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
              
              <div className="flex items-center gap-3">
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
                
                <span className="text-gray-300 font-bold text-sm bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700/50 shadow-sm">{bio.primaryPositions}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Bio details + PlayStyles */}
          <div className="flex flex-col gap-4 ml-auto border-l border-gray-800/60 pl-6 flex-1 min-w-0 justify-center py-1">
            
            {/* Row 1: Bio */}
            <div className="flex flex-wrap items-center gap-2 text-gray-300 font-medium text-xs">
              <span>{bio.nation}</span>
              <span className="text-gray-600">|</span>
              <span>{bio.league}</span>
              <span className="text-gray-600">|</span>
              <span>{bio.club}</span>
              <span className="text-gray-600">|</span>
              <span>{bio.rarity}</span>
              <div className="flex items-center gap-2 text-gray-400 pl-3 border-l border-gray-700/60">
                <span>{bio.height}</span>
                <span className="text-gray-600">|</span>
                <span>{bio.footAge}</span>
                {bio.bodyType && (
                  <>
                    <span className="text-gray-600">|</span>
                    <span>{bio.bodyType}</span>
                  </>
                )}
              </div>

            </div>

            {/* Row 2: PlayStyles */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <PlayerSubInfo bio={bio} playStyles={playStyles} isEvo={activePath.chainIds.length > 0} />
            </div>
          </div>
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex items-start gap-x-5 gap-y-2 mt-1 w-full border-t border-gray-800/60 pt-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1 items-center relative">
              {onChangePlayer && (
                <button
                  onClick={onChangePlayer}
                  title="Change Player (/)"
                  className="px-3 py-1.5 border border-gray-600 hover:border-fuchsia-500/50 bg-[#1f2937] hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors mr-1"
                >
                  <span className="text-[10px]">👤</span> Change
                  <kbd className="ml-1 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">/</kbd>
                </button>
              )}

              <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-1.5 border rounded-lg text-xs flex items-center gap-1.5 transition-colors ${showFilters ? 'bg-fcGreen text-black font-bold border-fcGreen' : 'bg-[#1f2937] hover:bg-[#374151] text-gray-300 border-gray-600'}`}>
                <Settings2 className="w-3.5 h-3.5" /> Filters
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#1A1C1A] border border-gray-700 rounded-xl shadow-2xl z-50 p-4">
                  <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                    <h4 className="text-sm font-bold text-white uppercase">Advanced Filters</h4>
                    <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {['ovr', 'pac', 'sho', 'pas', 'dri', 'def', 'phy', 'psPlus', 'ps'].map(stat => {
                      const safeFilters = evoFilters || {};
                      const statFilter = (safeFilters as any)[stat] || {};
                      const label = stat === 'psPlus' ? 'PS+' : stat === 'ps' ? 'PS' : stat.toUpperCase();
                      const hasSubs = !!statSubs[stat];
                      const isExpanded = expandedStats.has(stat);
                      return (
                        <div key={stat} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-1 w-14">
                              <span className="text-gray-400 font-bold">{label}</span>
                              {hasSubs && (
                                <button onClick={() => toggleExpand(stat)} className="text-gray-500 hover:text-white transition-colors">
                                  {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                value={statFilter.min || ''}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : undefined;
                                  onEvoFiltersChange({ ...safeFilters, [stat]: { ...statFilter, min: val } });
                                }}
                                className="w-14 bg-[#121212] border border-gray-700 rounded px-2 py-1 text-white text-center focus:border-fcGreen outline-none"
                              />
                              <span className="text-gray-600">-</span>
                              <input
                                type="number"
                                placeholder="Max"
                                value={statFilter.max || ''}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : undefined;
                                  onEvoFiltersChange({ ...safeFilters, [stat]: { ...statFilter, max: val } });
                                }}
                                className="w-14 bg-[#121212] border border-gray-700 rounded px-2 py-1 text-white text-center focus:border-fcGreen outline-none"
                              />
                            </div>
                          </div>
                          
                          {hasSubs && isExpanded && (
                            <div className="flex flex-col gap-2 pl-3 border-l-2 border-gray-800 ml-2 mt-1">
                              {statSubs[stat].map(sub => {
                                const subFilter = statFilter.subs?.[sub.key] || {};
                                return (
                                  <div key={sub.key} className="flex items-center justify-between gap-3 text-xs">
                                    <span className="text-gray-500 font-medium truncate w-14" title={sub.label}>{sub.label}</span>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        placeholder="Min"
                                        value={subFilter.min || ''}
                                        onChange={(e) => {
                                          const val = e.target.value ? Number(e.target.value) : undefined;
                                          onEvoFiltersChange({
                                            ...safeFilters, 
                                            [stat]: { 
                                              ...statFilter, 
                                              subs: { ...statFilter.subs, [sub.key]: { ...subFilter, min: val } } 
                                            }
                                          });
                                        }}
                                        className="w-14 bg-[#1a1c1a] border border-gray-800 rounded px-2 py-1 text-gray-300 text-center focus:border-fcGreen outline-none text-[10px]"
                                      />
                                      <span className="text-gray-700">-</span>
                                      <input
                                        type="number"
                                        placeholder="Max"
                                        value={subFilter.max || ''}
                                        onChange={(e) => {
                                          const val = e.target.value ? Number(e.target.value) : undefined;
                                          onEvoFiltersChange({
                                            ...safeFilters, 
                                            [stat]: { 
                                              ...statFilter, 
                                              subs: { ...statFilter.subs, [sub.key]: { ...subFilter, max: val } } 
                                            }
                                          });
                                        }}
                                        className="w-14 bg-[#1a1c1a] border border-gray-800 rounded px-2 py-1 text-gray-300 text-center focus:border-fcGreen outline-none text-[10px]"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Required EVOs Section */}
                  {evosPool && evosPool.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">Required EVOs</h4>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                        {[...evosPool].sort((a, b) => {
                          const nameA = availableEvolutions[a]?.name || '';
                          const nameB = availableEvolutions[b]?.name || '';
                          return nameA.localeCompare(nameB);
                        }).map(evoId => {
                          const evoDef = availableEvolutions[evoId];
                          if (!evoDef) return null;
                          const isRequired = evoFilters?.requiredEvos?.includes(evoId);
                          return (
                            <label key={evoId} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer bg-[#1a1c1a] p-1.5 rounded border border-gray-800 hover:border-gray-600 transition-colors">
                              <input 
                                type="checkbox"
                                className="accent-fcGreen"
                                checked={!!isRequired}
                                onChange={(e) => {
                                  const currentRequired = evoFilters?.requiredEvos || [];
                                  let nextRequired: string[];
                                  if (e.target.checked) {
                                    nextRequired = [...currentRequired, evoId];
                                  } else {
                                    nextRequired = currentRequired.filter(id => id !== evoId);
                                  }
                                  onEvoFiltersChange({ ...evoFilters, requiredEvos: nextRequired });
                                }}
                              />
                              <span className="truncate">{evoDef.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end">
                    <button onClick={() => onEvoFiltersChange({})} className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-bold">Clear All</button>
                  </div>
                </div>
              )}

              <button onClick={onOpenEvoPool} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 relative text-xs flex items-center gap-1.5 ml-2">
                <Settings className="w-3.5 h-3.5" /> Pool ({evosPool?.length || 0})
              </button>
              <button onClick={onOpenManualPath} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add EVO <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">.</kbd>
              </button>
              {onBranchFromBase && (
                <button
                  onClick={onBranchFromBase}
                  title="Start a new path from the base, leaving this one untouched"
                  className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-purple-800/60 rounded-lg text-purple-300 text-xs flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" /> Branch
                </button>
              )}
              <button onClick={() => { setShowFilters(false); onAnalyze(); }} disabled={!evosPool || evosPool.length === 0} className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 ${(evosPool?.length || 0) > 0 ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500 hover:border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-[#1f211f] text-gray-600 border-gray-800'}`}>
                <Zap className="w-3.5 h-3.5" /> Analyze
              </button>
              {onClearPaths && (
                <button
                  onClick={onClearPaths}
                  title="Clear all unstarred paths"
                  className="px-3 py-1.5 bg-[#1f2937] hover:bg-red-900/50 border border-gray-600 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-300 text-xs flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Paths
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    {/* Path Selection & Action Buttons */}
    <div className="flex flex-col gap-2 w-full bg-[#1A1C1A] border border-gray-800 rounded-xl p-3 shadow-md">

          
          <div className="flex flex-wrap gap-2">
            {allPaths.map((path) => (
              <div key={path.id} className="relative flex items-center group">
                <button
                  onClick={() => onSelectPath(path.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all border flex items-center gap-1.5 ${
                    expandedPathIds.includes(path.id)
                      ? 'bg-green-950/40 text-fcGreen border-fcGreen shadow-sm'
                      : comparePathId === path.id
                      ? 'bg-purple-950/40 text-purple-400 border-purple-500 shadow-sm'
                      : 'bg-[#1a1c1a] text-gray-400 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {path.name}
                </button>
                {onSetComparePathId && activePathId !== path.id && (
                  <div className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetComparePathId(comparePathId === path.id ? null : path.id);
                      }}
                      className={`rounded-full p-0.5 shadow-sm ${comparePathId === path.id ? 'bg-purple-600 text-white' : 'bg-purple-900 text-purple-400 hover:bg-purple-600 hover:text-white'}`}
                      title={comparePathId === path.id ? "Stop Comparing" : "Compare with active path"}
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
                {onToggleFavoritePath && path.chainIds.length > 0 && path.isFavorite && (
                  <div className="absolute -top-3 -left-1.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoritePath(path);
                      }}
                      className="rounded-full p-0.5 shadow-sm bg-yellow-500 text-black hover:bg-yellow-400"
                      title="Unstar (allow deletion)"
                    >
                      <Star className="w-2.5 h-2.5 fill-black" />
                    </button>
                  </div>
                )}
                {(onDeletePath || onToggleFavoritePath) && path.chainIds.length > 0 && !path.isFavorite && (
                  <div className="absolute -top-1.5 -left-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {onToggleFavoritePath && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoritePath(path);
                        }}
                        className="rounded-full p-0.5 shadow-sm bg-gray-800 text-gray-500 hover:bg-yellow-500 hover:text-black"
                        title="Star (keep permanently)"
                      >
                        <Star className="w-2.5 h-2.5" />
                      </button>
                    )}
                    {onDeletePath && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePath(path.id);
                        }}
                        className="bg-red-900 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                        title="Delete Path"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {expandedPathIds.map(renderPathId => {
              const renderPath = allPaths.find(p => p.id === renderPathId);
              if (!renderPath) return null;
              
              return (
                <div key={renderPathId} className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pb-2 items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800">
                  <Layers className="w-3.5 h-3.5 text-gray-500 mr-1 shrink-0" />

                {/* Base Card Chip — always present, so an empty path still anchors on the raw card */}
                <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                  renderPath.id === activePathId && baseIndex === -1 ? 'ring-1 ring-purple-500/60 rounded' : ''
                }`}>
                  <button
                    onClick={() => onNodeClick(-1)}
                    title="Original Base Card"
                    className={`shrink-0 px-2.5 py-1 rounded text-[10px] font-bold flex items-center transition-all shadow ${
                      selectedNodes.includes(-1)
                        ? 'bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]'
                        : 'bg-[#2a2d2a] text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Base Card
                    <span className={`font-normal text-[9.5px] ml-1.5 opacity-90 tracking-wide font-mono ${selectedNodes.includes(-1) ? 'text-black font-bold' : 'text-gray-300'}`}>
                      ({activeBaseOvr}/{playStyles.base.gold.length + playStyles.ev.gold.length})
                    </span>
                  </button>
                  {onSetBase && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetBase(renderPath.id, -1); }}
                      className={`absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
                        renderPath.id === activePathId && baseIndex === -1
                          ? 'bg-purple-600 text-white opacity-100'
                          : 'bg-purple-900/90 text-purple-400 hover:bg-purple-600 hover:text-white opacity-0 group-hover/node:opacity-100'
                      }`}
                      title={renderPath.id === activePathId && baseIndex === -1
                        ? 'New builds start from the raw card'
                        : 'Build from the raw card again'}
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {renderPath.chainIds.length > 0 ? (
                  <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                ) : (
                  <span className="text-[11px] text-gray-600 italic ml-2 shrink-0">
                    No EVOs yet — use Add EVO to build from here.
                  </span>
                )}

                {renderPath.chainIds.map((id, idx) => {
                  const evo = availableEvolutions[id];
                  if (!evo) return null;
                  
                  let stepStatsStr = null;
                  const stepResult = renderPath.steps?.[idx];
                  if (stepResult) {
                    const reqOvr = evo.requirements.maxOvr || 99;
                    const reqPsPlus = evo.requirements.maxPlayStylesPlus ?? 99;
                    const reqPsPlusStr = reqPsPlus === 99 ? '∞' : reqPsPlus;
                    const addedPsPlus = evo.playStylesAdded?.gold?.length || 0;
                    
                    const isStepActive = selectedNodes.includes(idx);
                    
                    stepStatsStr = (
                      <span className={`font-normal text-[9.5px] ml-1.5 opacity-90 tracking-wide font-mono ${isStepActive ? 'text-black font-bold' : 'text-gray-300'}`}>
                        ({stepResult.ovrAfter}/{reqOvr}/{reqPsPlusStr}/{addedPsPlus})
                      </span>
                    );
                  }

                  const isStepActive = selectedNodes.includes(idx);
                  const baseClass = isStepActive
                    ? "bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]"
                    : "bg-[#2a2d2a] text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-200";
                  // Everything up to the chosen base is locked in as the starting point.
                  const isBase = renderPath.id === activePathId && idx === baseIndex;
                  const inBasePrefix = renderPath.id === activePathId && idx <= baseIndex;

                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                        inBasePrefix ? 'ring-1 ring-purple-500/60 rounded' : ''
                      }`}>
                        <button
                          onClick={() => onNodeClick(idx)}
                          title={`Preview Step ${idx + 1} (${evo.name}) stats`}
                          className={`${baseClass} px-2.5 py-1 rounded text-[10.5px] font-bold flex items-center transition-all cursor-pointer shadow`}
                        >
                          {evo.name}
                          {stepStatsStr}
                        </button>
                        {onViewEvo && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewEvo(id); }}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-blue-900/90 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                            title="View Evolution Details"
                          >
                            <Eye className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {onRemoveNode && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemoveNode(renderPath.id, idx); }}
                            className="absolute -top-1.5 -left-1.5 p-0.5 bg-red-900/90 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                            title={`Remove ${evo.name} from this path`}
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {onSetBase && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onSetBase(renderPath.id, idx); }}
                            className={`absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
                              isBase
                                ? 'bg-purple-600 text-white opacity-100'
                                : 'bg-purple-900/90 text-purple-400 hover:bg-purple-600 hover:text-white opacity-0 group-hover/node:opacity-100'
                            }`}
                            title={isBase
                              ? 'This is the base for new builds — click to clear it'
                              : 'Set as base for new auto/manual builds'}
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      {idx < renderPath.chainIds.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}

                {futbinPlayerId && renderPath.chainIds.length > 0 && (
                  <a
                    href={`https://www.futbin.com/26/evolutions/builder/${futbinPlayerId}_${renderPath.chainIds.join('_')}?includeExpired=false`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 ml-auto text-[10px] text-fcGreen hover:text-white flex items-center gap-1 bg-green-950/60 px-2 py-1 rounded border border-green-800/60 transition-colors"
                  >
                    Open in FUTBIN <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};
