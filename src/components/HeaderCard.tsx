import React from 'react';
import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition, EvoFilters, StatsData, ChainStepResult } from '../types/player';
import { isPlayStyleNodeId, parsePlayStyleNodeId } from '../utils/evoEngine';
import { calculateChip, getStatColorClass, formatEvoTerms, displayExcludedPositions } from '../utils/statUtils';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import { availableEvolutions } from '../data/evolutionsData';
import { ExternalLink, Loader2, Zap, Settings, Plus, Layers, X, Settings2, Minus, Star, Eye, RefreshCw, GitBranch, Trash2, Wand2 } from 'lucide-react';
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
  // True when the build's current end is one of the rarities that unlock free PlayStyle
  // assignment in-game, so another pick can be made right now.
  canPickFreePlayStyles?: boolean;
  // 'new' adds a pick at the end of the chain; a number edits the node at that index.
  onOpenPlayStylePicker?: (target: number | 'new') => void;
  originalIgs: number;
  originalFaceSum: number;
  evoFilters: EvoFilters;
  excludedCount: number;
  extraCount: number;
  onEvoFiltersChange: (val: EvoFilters) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  analyzeProgress?: number;
  onCancelAnalyze?: () => void;
  rawBaseOvr: number;
  rawPlayStyles: import('../types/player').PlayStylesData;
  rawStats: StatsData;
  // The untouched card's rarity/positions, so the headline can mark what the chain changed.
  rawRarity?: string;
  rawPositions?: string;
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

/**
 * A PlayStyle pick rendered as what it is: a step of the build, sitting in the chain next to the
 * evos. Shows the picks it grants, and flags itself when the card isn't a rarity that could have
 * made that pick at this point — say the evo that unlocked it was removed.
 */
const PlayStyleNode: React.FC<{
  id: string;
  idx: number;
  step?: ChainStepResult;
  isActive: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}> = ({ id, idx, step, isActive, onClick, onEdit, onRemove }) => {
  const picks = parsePlayStyleNodeId(id);
  const invalid = step ? !step.validation.eligible : false;

  const border = invalid
    ? 'border-red-600 ring-1 ring-red-700/60'
    : isActive
    ? 'border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)]'
    : 'border-yellow-800/70 hover:border-yellow-600';

  return (
    <div className="flex items-center gap-0.5 group/node shrink-0 relative">
      <button
        onClick={onClick}
        title={invalid
          ? step!.validation.reasons.join(' · ')
          : `Preview Step ${idx + 1} (PlayStyle Pick) stats`}
        className={`shrink-0 p-1.5 rounded font-bold flex flex-col gap-1 border text-left transition-all cursor-pointer shadow bg-yellow-950/25 text-yellow-300 ${border}`}
      >
        <div className="flex items-center gap-1.5 px-1">
          <Wand2 className="w-3 h-3 shrink-0" />
          <span className="text-[10.5px]">PlayStyle Pick</span>
          {invalid && <span className="text-[9px] font-black uppercase tracking-wide text-red-400">Invalid</span>}
        </div>
        <div className="flex flex-wrap items-center gap-1 px-1 pb-0.5">
          {picks.gold.map(ps => (
            <img
              key={`g-${ps}`}
              src={getPlayStyleIconUrl(ps, true)}
              alt={ps}
              title={`${ps} (PS+)`}
              className="w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)] ring-[1.5px] ring-fcGreen ring-offset-[#1f211f] ring-offset-[1.5px] rounded-full"
            />
          ))}
          {picks.silver.map(ps => (
            <img
              key={`s-${ps}`}
              src={getPlayStyleIconUrl(ps, false)}
              alt={ps}
              title={ps}
              className="w-3.5 h-3.5 ring-[1.5px] ring-fcGreen ring-offset-[#1f211f] ring-offset-[1px] rounded-full"
            />
          ))}
        </div>
      </button>
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="absolute -top-1.5 -right-1.5 p-0.5 bg-yellow-900/90 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
          title="Change these PlayStyles"
        >
          <Settings2 className="w-2.5 h-2.5" />
        </button>
      )}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-1.5 -left-1.5 p-0.5 bg-red-900/90 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
          title="Remove this PlayStyle step"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
};

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
  canPickFreePlayStyles,
  onOpenPlayStylePicker,
  originalIgs,
  originalFaceSum,
  evoFilters,
  excludedCount,
  extraCount,
  onEvoFiltersChange,
  onAnalyze,
  isAnalyzing = false,
  analyzeProgress = 0,
  onCancelAnalyze,
  rawBaseOvr,
  rawPlayStyles,
  rawStats,
  rawRarity,
  rawPositions,
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
  const [draftFilters, setDraftFilters] = React.useState<EvoFilters>(evoFilters || {});

  React.useEffect(() => {
    if (showFilters) {
      setDraftFilters(evoFilters || {});
    }
  }, [showFilters, evoFilters]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      // Also ignore if a modifier key is pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === 'p') {
        e.preventDefault();
        onOpenEvoPool();
      } else if (key === 'f') {
        e.preventDefault();
        setShowFilters(prev => !prev);
      } else if (key === 'a') {
        e.preventDefault();
        onOpenManualPath();
      } else if (key === 'b' && onBranchFromBase) {
        e.preventDefault();
        onBranchFromBase();
      } else if (key === 's' && canPickFreePlayStyles && onOpenPlayStylePicker) {
        e.preventDefault();
        onOpenPlayStylePicker('new');
      } else if (key === 'c' && onClearPaths) {
        e.preventDefault();
        onClearPaths();
      } else if (key === '/' && onChangePlayer) {
        e.preventDefault();
        onChangePlayer();
      } else if (key === 'escape' && showFilters) {
        e.preventDefault();
        setShowFilters(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFilters, onOpenEvoPool, onOpenManualPath, onBranchFromBase, canPickFreePlayStyles, onOpenPlayStylePicker, onAnalyze, onClearPaths, onChangePlayer, evosPool]);

  const activeFiltersCount = React.useMemo(() => {
    if (!evoFilters) return 0;
    
    let count = 0;
    if (evoFilters.requiredEvos && evoFilters.requiredEvos.length > 0) count++;
    // The rarity/position toggles narrow results as much as any stat bound, so the badge counts
    // them — otherwise a run that returns nothing because of them looks unfiltered.
    if (evoFilters.newRarity) count++;
    if (evoFilters.newPosition) count++;
    if (evoFilters.noRarityChange) count++;
    if (evoFilters.noPositionChange) count++;

    // Check stats
    const statsToCheck = ['pac', 'sho', 'pas', 'dri', 'def', 'phy', 'ovr'];
    for (const stat of statsToCheck) {
      const statFilter = (evoFilters as any)[stat];
      if (statFilter) {
        if (stat === 'ovr' && statFilter.max === 99 && statFilter.min === undefined) {
           // Ignore default max ovr 99
        } else if (statFilter.min !== undefined || statFilter.max !== undefined) {
           count++;
        }
        
        if (statFilter.subs) {
           for (const sub of Object.values(statFilter.subs)) {
             const s = sub as any;
             if (s.min !== undefined || s.max !== undefined) count++;
           }
        }
      }
    }
    
    // Check playStyles limits
    if (evoFilters.ps) {
       if (evoFilters.ps.min !== undefined || evoFilters.ps.max !== undefined) count++;
    }
    if (evoFilters.psPlus) {
       if (evoFilters.psPlus.min !== undefined || evoFilters.psPlus.max !== undefined) count++;
    }
    
    return count;
  }, [evoFilters]);
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

  // Compared as lists: applying an evo re-joins the positions with ', ', so a raw string compare
  // would flag a card whose spacing differs from that but whose positions don't.
  const positionList = (s: string) => s.split(',').map(p => p.trim()).filter(Boolean).join(',');
  const positionsChanged = !!rawPositions && positionList(bio.primaryPositions) !== positionList(rawPositions);

  const playerIdMatch = futbinLink ? futbinLink.match(/\/player\/(\d+)\//) : null;
  const futbinPlayerId = playerIdMatch ? playerIdMatch[1] : '';
  // FUTBIN only knows about real evos, so PlayStyle steps are left out of the builder URL.
  const futbinChain = (path: EvolutionPath) => path.chainIds.filter(id => !isPlayStyleNodeId(id));
  const builderLink = futbinPlayerId && futbinChain(activePath).length > 0
    ? `https://www.futbin.com/26/evolutions/builder/${futbinPlayerId}_${futbinChain(activePath).join('_')}?includeExpired=false`
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
                
                {/* Positions and rarity as the build leaves them — both turn purple once the chain
                    has changed them, so the headline says what the finished card actually is. */}
                <span className={`font-bold text-sm px-2 py-0.5 rounded border shadow-sm ${
                  positionsChanged
                    ? 'bg-purple-950/50 text-purple-300 border-purple-700/60'
                    : 'bg-gray-800/80 text-gray-300 border-gray-700/50'
                }`}>
                  {bio.primaryPositions}
                </span>

                <span className={`font-bold text-sm px-2 py-0.5 rounded border shadow-sm whitespace-nowrap ${
                  rawRarity && bio.rarity !== rawRarity
                    ? 'bg-purple-950/50 text-purple-300 border-purple-700/60'
                    : 'bg-gray-800/80 text-gray-300 border-gray-700/50'
                }`}>
                  {rawRarity && bio.rarity !== rawRarity && (
                    <span className="text-gray-500 font-normal">{rawRarity} ➜ </span>
                  )}
                  {bio.rarity}
                </span>
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
                  title="Switch Player (/)"
                  className="px-3 py-1.5 border border-blue-600 hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1.5 transition-colors mr-1 font-bold shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                >
                  <span className="text-[10px]">👤</span> Switch
                  <kbd className="ml-1 px-1 bg-blue-950/50 border border-blue-800 rounded text-[9px] text-blue-300 font-mono">/</kbd>
                </button>
              )}

              <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-1.5 border rounded-lg text-xs flex items-center gap-1.5 transition-colors relative ${
                showFilters 
                  ? 'bg-fcGreen text-black font-bold border-fcGreen' 
                  : 'bg-[#1f2937] hover:bg-[#374151] text-gray-300 border-gray-600'
              }`}>
                <Settings2 className="w-3.5 h-3.5" /> Filters
                <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">f</kbd>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-fcGreen/20 text-fcGreen rounded font-bold text-[9px]">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {showFilters && (
                <div 
                  className="absolute top-full right-0 mt-2 w-72 bg-[#1A1C1A] border border-gray-700 rounded-xl shadow-2xl z-50 p-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onEvoFiltersChange(draftFilters);
                      setShowFilters(false);
                    } else if (e.key === 'Escape') {
                      setShowFilters(false);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                    <h4 className="text-sm font-bold text-white uppercase">Advanced Filters</h4>
                    <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

                    {/* Each pair is a three-way choice — want it, avoid it, don't care — so ticking
                        one side clears the other rather than leaving a filter that matches nothing. */}
                    <div className="mb-4 pb-3 border-b border-gray-800 space-y-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.newRarity}
                            onChange={(e) => setDraftFilters({ ...draftFilters, newRarity: e.target.checked, noRarityChange: e.target.checked ? false : draftFilters.noRarityChange })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          New Rarity
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.newPosition}
                            onChange={(e) => setDraftFilters({ ...draftFilters, newPosition: e.target.checked, noPositionChange: e.target.checked ? false : draftFilters.noPositionChange })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          New Position
                        </label>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.noRarityChange}
                            onChange={(e) => setDraftFilters({ ...draftFilters, noRarityChange: e.target.checked, newRarity: e.target.checked ? false : draftFilters.newRarity })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          Keep Rarity
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.noPositionChange}
                            onChange={(e) => setDraftFilters({ ...draftFilters, noPositionChange: e.target.checked, newPosition: e.target.checked ? false : draftFilters.newPosition })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          Keep Positions
                        </label>
                      </div>
                    </div>

                    {['ovr', 'pac', 'sho', 'pas', 'dri', 'def', 'phy', 'psPlus', 'ps'].map(stat => {
                      const statFilter = (draftFilters as any)[stat] || {};
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
                                  setDraftFilters({ ...draftFilters, [stat]: { ...statFilter, min: val } });
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
                                  setDraftFilters({ ...draftFilters, [stat]: { ...statFilter, max: val } });
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
                                          setDraftFilters({
                                            ...draftFilters, 
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
                                          setDraftFilters({
                                            ...draftFilters, 
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

                  <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">

                    <button onClick={() => setDraftFilters({})} className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-bold">Clear All</button>
                    <button onClick={() => { onEvoFiltersChange(draftFilters); setShowFilters(false); }} className="px-4 py-1.5 bg-fcGreen hover:bg-[#1db954] text-black font-bold text-xs rounded-lg shadow-sm">OK</button>
                  </div>
                </div>
              )}

              <button onClick={onOpenEvoPool} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 relative text-xs flex items-center gap-1.5 ml-2">
                <Settings className="w-3.5 h-3.5" /> Pool ({evosPool?.length || 0})
                <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">p</kbd>
                {(evoFilters?.requiredEvos?.length || 0) > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-fcGreen/20 text-fcGreen rounded font-bold text-[9px]" title="Must Include">
                    ★ {evoFilters!.requiredEvos!.length}
                  </span>
                )}
                {excludedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-900/40 text-red-400 rounded font-bold text-[9px]" title="Excluded">
                    ✖ {excludedCount}
                  </span>
                )}
                {extraCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-orange-900/40 text-orange-400 rounded font-bold text-[9px]" title="Extra (Selected Disabled)">
                    + {extraCount}
                  </span>
                )}
              </button>
              <button onClick={onOpenManualPath} className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add EVO <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">a</kbd>
              </button>
              {onBranchFromBase && (
                <button
                  onClick={onBranchFromBase}
                  title="Start a new path from the base, leaving this one untouched"
                  className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-purple-800/60 rounded-lg text-purple-300 text-xs flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" /> Branch <kbd className="ml-0.5 px-1 bg-black/40 border border-purple-900 rounded text-[9px] text-purple-400 font-mono">b</kbd>
                </button>
              )}
              {canPickFreePlayStyles && onOpenPlayStylePicker && (
                <button
                  onClick={() => onOpenPlayStylePicker('new')}
                  title="This build unlocks picking any PlayStyle — added to the chain as its own step, at the end"
                  className="px-3 py-1.5 bg-yellow-950/30 hover:bg-yellow-900/40 border border-yellow-700/60 rounded-lg text-yellow-400 text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Add Skill <kbd className="ml-0.5 px-1 bg-black/40 border border-yellow-900 rounded text-[9px] text-yellow-400 font-mono">s</kbd>
                </button>
              )}
              {isAnalyzing ? (
                <button
                  onClick={() => { setShowFilters(false); onCancelAnalyze?.(); }}
                  title="Stop the search"
                  className="px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border-red-700 hover:border-red-500 bg-red-950/30 hover:bg-red-900/40 text-red-300"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {analyzeProgress > 0
                    ? `${Math.round(analyzeProgress / 1000)}k · Stop`
                    : 'Analyzing · Stop'}
                </button>
              ) : (
                <button onClick={() => { setShowFilters(false); onAnalyze(); }} disabled={!evosPool || evosPool.length === 0} className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${(evosPool?.length || 0) > 0 ? 'border-blue-600 hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 hover:text-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-[#1f211f] text-gray-600 border-gray-800'}`}>
                  <Zap className="w-3.5 h-3.5" /> Analyze
                </button>
              )}
              {onClearPaths && (
                <button
                  onClick={onClearPaths}
                  title="Clear all unstarred paths"
                  className="px-3 py-1.5 bg-[#1f2937] hover:bg-red-900/50 border border-gray-600 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-300 text-xs flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Unstarred <kbd className="ml-0.5 px-1 bg-black/40 border border-red-900/50 rounded text-[9px] text-red-400 font-mono">c</kbd>
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
                <div key={renderPathId} className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pt-2 pl-2 pb-2 items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800">
                  <Layers className="w-3.5 h-3.5 text-gray-500 mr-1 shrink-0" />

                {/* Base Card Chip — always present, so an empty path still anchors on the raw card */}
                <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                  renderPath.id === activePathId && baseIndex === -1 ? 'ring-1 ring-purple-500/60 rounded' : ''
                }`}>
                  <button
                    onClick={() => onNodeClick(-1)}
                    title="Original Base Card"
                    className={`shrink-0 p-1.5 rounded font-bold flex flex-col transition-all shadow gap-1 ${
                      selectedNodes.includes(-1)
                        ? 'bg-[#1f211f] text-gray-200 border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)] hover:text-white'
                        : 'bg-[#1f211f] text-gray-200 border-gray-700 hover:border-gray-500 hover:text-white'
                    } border text-left cursor-pointer`}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                        {rawBaseOvr}/{rawPlayStyles.base.gold.length + (rawPlayStyles.ev?.gold?.length || 0)}
                      </span>
                      <span className="text-[10.5px]">Base Card</span>
                    </div>
                    <div className="flex gap-2 items-center px-1 mb-0.5">
                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600`}>
                        <span className={`text-white font-bold`}>BS</span>
                        <span className={`text-blue-400 font-bold`}>{Object.values(rawStats).reduce((acc, f) => acc + f.baseFace, 0)}</span>
                      </div>
                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600`}>
                        <span className={`text-white font-bold`}>IGS</span>
                        <span className={`text-blue-400 font-bold`}>{Object.values(rawStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5">
                      {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                        const val = rawStats[statKey as keyof StatsData].baseFace;
                        return (
                          <div key={statKey} className={`flex gap-0.5 items-center px-1 py-0.5 rounded text-[8.5px] shadow-inner border bg-black/40 border-gray-800/50`}>
                            <span className={`text-gray-400 uppercase`}>{statKey}</span>
                            {/* Selection is carried by the chip's gold ring, not by inverting the
                                text — the selected chip is dark, so black-on-black hid the stats
                                entirely, which is what a player with no evos yet always saw. */}
                            <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                    {(() => {
                      const gold = [...rawPlayStyles.base.gold, ...(rawPlayStyles.ev?.gold || [])];
                      const silver = [...rawPlayStyles.base.silver, ...(rawPlayStyles.ev?.silver || [])];
                      if (gold.length === 0 && silver.length === 0) return null;
                      return (
                        <div className={`flex flex-wrap items-center gap-1 mt-0.5 border-t pt-1 border-gray-700/50`}>
                          {gold.map(ps => (
                            <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (PS+)`} className="w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
                          ))}
                          {silver.map(ps => (
                            <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
                          ))}
                        </div>
                      );
                    })()}
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
                  if (isPlayStyleNodeId(id)) {
                    return (
                      <React.Fragment key={`${id}-${idx}`}>
                        <PlayStyleNode
                          id={id}
                          idx={idx}
                          step={renderPath.steps?.[idx]}
                          isActive={renderPath.id === activePathId && selectedNodes.includes(idx)}
                          onClick={renderPath.id === activePathId ? () => onNodeClick(idx) : undefined}
                          onEdit={renderPath.id === activePathId && onOpenPlayStylePicker ? () => onOpenPlayStylePicker(idx) : undefined}
                          onRemove={onRemoveNode ? () => onRemoveNode(renderPath.id, idx) : undefined}
                        />
                        {idx < renderPath.chainIds.length - 1 && (
                          <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                        )}
                      </React.Fragment>
                    );
                  }

                  const evo = availableEvolutions[id];
                  if (!evo) return null;

                  const isStepActive = selectedNodes.includes(idx);

                  let stepStatsStr = null;
                  const stepResult = renderPath.steps?.[idx];
                  if (stepResult) {
                    const reqOvr = evo.requirements.maxOvr || 99;
                    const reqPsPlus = evo.requirements.maxPlayStylesPlus ?? 99;
                    const reqPsPlusStr = reqPsPlus === 99 ? '∞' : reqPsPlus;
                  }

                  const afterPsPlus = stepResult 
                    ? (stepResult.playStylesAfter.base.gold.length + stepResult.playStylesAfter.ev.gold.length)
                    : '?';
                  const baseClass = isStepActive
                    ? "bg-[#1f211f] text-gray-200 border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)] hover:text-white"
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
                          className={`shrink-0 p-1.5 rounded font-bold flex flex-col transition-all cursor-pointer shadow gap-1 border text-left ${baseClass}`}
                        >
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                              {(() => {
                                const prevOvr = idx === 0 ? rawBaseOvr : renderPath.steps![idx - 1].ovrAfter;
                                const ovrDiff = stepResult ? stepResult.ovrAfter - prevOvr : 0;
                                return ovrDiff > 0 ? <span className={`text-fcGreen font-bold text-[10px] mr-0.5`}>+{ovrDiff}</span> : null;
                              })()}
                              {stepResult ? stepResult.ovrAfter : '?'}/{afterPsPlus}
                            </span>
                            <span className="text-[10.5px]">{evo.name}</span>
                            <span className={`font-bold text-[9.5px] tracking-wide font-mono opacity-90 text-gray-300`}>
                              {formatEvoTerms(evo)}
                            </span>
                          </div>
                          {/* What the step asks for and what it turns the card into — the same
                              requirement/rarity/position badges the pool and picker use, so a
                              finished chain shows it without opening them. */}
                          {(evo.rarityChange
                            || (evo.positionsAdded && evo.positionsAdded.length > 0)
                            || (evo.requirements.positions && evo.requirements.positions.length > 0)
                            || displayExcludedPositions(evo).length > 0) && (
                            <div className="flex flex-wrap items-center gap-1 px-1">
                              {evo.requirements.positions && evo.requirements.positions.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-900/50 text-[8.5px] font-bold tracking-wide">
                                  Req Pos: {evo.requirements.positions.join(', ')}
                                </span>
                              )}
                              {displayExcludedPositions(evo).length > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-900/50 text-[8.5px] font-bold tracking-wide">
                                  Excl Pos: {displayExcludedPositions(evo).join(', ')}
                                </span>
                              )}
                              {evo.rarityChange && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/50 text-[8.5px] font-bold tracking-wide">
                                  → {evo.rarityChange}
                                </span>
                              )}
                              {evo.positionsAdded && evo.positionsAdded.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/50 text-[8.5px] font-bold tracking-wide">
                                  + Pos: {evo.positionsAdded.join(', ')}
                                </span>
                              )}
                            </div>
                          )}
                          {stepResult && (
                            <>
                              <div className="flex gap-2 items-center px-1 mb-0.5">
                                {(() => {
                                  const prevStats = idx === 0 ? rawStats : renderPath.steps![idx - 1].statsAfter;
                                  const prevFace = Object.values(prevStats).reduce((a, b) => a + b.baseFace, 0);
                                  const curFace = Object.values(stepResult.statsAfter).reduce((a, b) => a + b.baseFace, 0);
                                  const bsDiff = curFace - prevFace;

                                  const prevIgs = Object.values(prevStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                                  const curIgs = Object.values(stepResult.statsAfter).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                                  const igsDiff = curIgs - prevIgs;

                                  return (
                                    <>
                                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600`}>
                                        <span className={`text-white font-bold`}>BS</span>
                                        <div className="flex items-baseline gap-0.5">
                                          {bsDiff > 0 && <span className={`text-fcGreen font-bold text-[7.5px]`}>+{bsDiff}</span>}
                                          <span className={`text-blue-400 font-bold`}>{curFace}</span>
                                        </div>
                                      </div>
                                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600`}>
                                        <span className={`text-white font-bold`}>IGS</span>
                                        <div className="flex items-baseline gap-0.5">
                                          {igsDiff > 0 && <span className={`text-fcGreen font-bold text-[7.5px]`}>+{igsDiff}</span>}
                                          <span className={`text-blue-400 font-bold`}>{curIgs}</span>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="grid grid-cols-3 gap-0.5">
                                {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                                  const val = stepResult.statsAfter[statKey as keyof StatsData].baseFace;
                                  const prevStats = idx === 0 ? rawStats : renderPath.steps![idx - 1].statsAfter;
                                  const prevVal = prevStats[statKey as keyof StatsData].baseFace;
                                  const diff = val - prevVal;
                                  
                                  let diffColor = "text-gray-300";
                                  if (diff >= 8) diffColor = "text-purple-400 font-bold";
                                  else if (diff >= 4) diffColor = "text-fcGreen font-bold";
                                  else if (diff >= 2) diffColor = "text-lime-400 font-semibold";

                                  return (
                                    <div key={statKey} className={`flex gap-0.5 items-center px-1 py-0.5 rounded text-[8.5px] shadow-inner border bg-black/40 border-gray-800/50`}>
                                      <span className={`text-gray-400 uppercase`}>{statKey}</span>
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
                                const prevPlayStyles = idx === 0 ? rawPlayStyles : renderPath.steps![idx - 1].playStylesAfter;
                                
                                const beforeGold = [...prevPlayStyles.base.gold, ...(prevPlayStyles.ev?.gold || [])];
                                const beforeSilver = [...prevPlayStyles.base.silver, ...(prevPlayStyles.ev?.silver || [])];
                                
                                const afterGold = [...stepResult.playStylesAfter.base.gold, ...(stepResult.playStylesAfter.ev?.gold || [])];
                                const afterSilver = [...stepResult.playStylesAfter.base.silver, ...(stepResult.playStylesAfter.ev?.silver || [])];
                                
                                const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
                                const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
                                
                                if (afterGold.length === 0 && afterSilver.length === 0) return null;
                                
                                return (
                                  <div className={`flex flex-wrap items-center gap-1 mt-0.5 border-t pt-1 border-gray-700/50`}>
                                    {afterGold.map(ps => {
                                      const isNew = addedGold.includes(ps);
                                      return (
                                        <img 
                                          key={`g-${ps}`} 
                                          src={getPlayStyleIconUrl(ps, true)} 
                                          alt={ps} 
                                          title={`${ps} (PS+)`} 
                                          className={`w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)] ${isNew ? `ring-[1.5px] ring-fcGreen ring-offset-[#1f211f] ring-offset-[1.5px] rounded-full` : ''}`} 
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
                                          className={`w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)] ${isNew ? `ring-[1.5px] ring-fcGreen ring-offset-[#1f211f] ring-offset-[1px] rounded-full` : ''}`} 
                                        />
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </>
                          )}
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

                {futbinPlayerId && futbinChain(renderPath).length > 0 && (
                  <a
                    href={`https://www.futbin.com/26/evolutions/builder/${futbinPlayerId}_${futbinChain(renderPath).join('_')}?includeExpired=false`}
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
