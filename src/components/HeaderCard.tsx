import React from 'react';
import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition, EvoFilters, StatsData, ChainStepResult } from '../types/player';
import { isPlayStyleNodeId, parsePlayStyleNodeId } from '../utils/evoEngine';
import { calculateChip, getStatColorClass, formatEvoTerms, displayExcludedPositions, ACCELERATE_TYPES, ACCELERATE_SHORT, ACCELERATE_FAMILIES, STAR_TIERS, STAR_TIER_COUNT, parseHeightCm } from '../utils/statUtils';
import { BUILD_TEMPLATES, suggestTemplates, templatesAvailable } from '../data/buildTemplates';
import { chainKeyOf } from '../utils/feedback';
import { IN_GAME_STAR_TIER, isBaseCardPath, isInGamePath, pathLabel } from '../utils/paths';
import { FEEDBACK_REASONS } from '../types/player';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import { isModalOpen } from '../utils/modalStack';
import { PositionScore, bestScore, scoreAtPosition } from '../utils/positionScore';
import { PlayStyleScore, playStyleScoreAt } from '../utils/playStyleScore';
import { availableEvolutions } from '../data/evolutionsData';
import { ThumbsUp, ThumbsDown, ExternalLink, Loader2, Zap, Settings, Plus, Layers, X, Settings2, Minus, Star, Eye, RefreshCw, GitBranch, Trash2, Wand2, Users, Pencil, Copy, Check, Link2 } from 'lucide-react';
import { PlayerSubInfo } from './PlayerSubInfo';

interface HeaderCardProps {
  bio: PlayerBio;
  futbinLink?: string;
  avatarUrl?: string;
  teamName?: string;
  onOpenTeamList?: () => void;
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
  /** Opens the "paste a share link" importer — the only way a build crosses between teams. */
  onOpenImportBuild?: () => void;
  // True when the build's current end is one of the rarities that unlock free PlayStyle
  // assignment in-game, so another pick can be made right now.
  canPickFreePlayStyles?: boolean;
  // 'new' adds a pick at the end of the chain; a number edits the node at that index.
  onOpenPlayStylePicker?: (target: number | 'new') => void;
  originalIgs: number;
  originalFaceSum: number;
  evoFilters: EvoFilters;
  /** This card's verdicts, keyed by canonical chain. */
  pathFeedback?: Record<string, import('../types/player').PathFeedback>;
  /** Records a verdict, or clears it with null. Reasons are only meaningful on a thumbs-down. */
  onRatePath?: (path: EvolutionPath, verdict: 'up' | 'down' | null, reasons?: string[]) => void;
  excludedCount: number;
  extraCount: number;
  onEvoFiltersChange: (val: EvoFilters) => void;
  onAnalyze: () => void;
  /** The weak-link ranking. Kept beside the original rather than replacing it. */
  onAnalyzeV2?: () => void;
  isAnalyzing?: boolean;
  /** The last Analyze run came back with nothing that passed the filters. */
  analyzeFoundNothing?: boolean;
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
  onDuplicatePath?: (pathId: string) => void;
  onChangePlayer?: () => void;
  onClearPaths?: () => void;
  onToggleFavoritePath?: (path: EvolutionPath) => void;
  onRenamePath?: (pathId: string, name: string) => void;
  /** The link that reopens this build on someone else's screen. */
  shareUrlFor?: (path: EvolutionPath) => string;
  onViewEvo?: (evoId: string) => void;
  // Index of the step new builds start from (-1 = raw card), and a setter for picking one.
  baseIndex?: number;
  onSetBase?: (pathId: string, index: number) => void;
  onRemoveNode?: (pathId: string, index: number) => void;
  // Ticks off how far the build has been played: the index of the step just marked done.
  onSetProgress?: (pathId: string, index: number) => void;
  /** What the card on screen is worth where it plays — computed by the page, shown beside OVR. */
  score?: PositionScore | null;
  /** The same for its PlayStyles, scored separately because it is a separate question. */
  psScore?: PlayStyleScore | null;
  /**
   * Where the card is being judged: the slot it stands in on the pitch, or its primary position.
   * Every score on this card reads it, so a chain's steps are all measured at one place.
   */
  scorePosition?: string;
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
  isDone?: boolean;
  onToggleDone?: () => void;
}> = ({ id, idx, step, isActive, onClick, onEdit, onRemove, isDone, onToggleDone }) => {
  const picks = parsePlayStyleNodeId(id);
  const invalid = step ? !step.validation.eligible : false;

  const border = invalid
    ? 'border-red-600 ring-1 ring-red-700/60'
    : isActive
    ? 'border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)]'
    : 'border-yellow-800/70 hover:border-yellow-600';

  return (
    <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
      isDone ? 'ring-1 ring-fcGreen/60 rounded' : ''
    }`}>
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
      {onToggleDone && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleDone(); }}
          className={`absolute -bottom-1.5 -left-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
            isDone
              ? 'bg-fcGreen text-black opacity-100'
              : 'bg-gray-800 text-gray-500 hover:bg-fcGreen hover:text-black opacity-0 group-hover/node:opacity-100'
          }`}
          title={isDone ? 'Done in game — click to unmark' : 'Mark this step done in game'}
        >
          <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
        </button>
      )}
    </div>
  );
};

export const HeaderCard: React.FC<HeaderCardProps> = ({
  bio,
  futbinLink,
  avatarUrl,
  teamName,
  onOpenTeamList,
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
  onOpenImportBuild,
  canPickFreePlayStyles,
  onOpenPlayStylePicker,
  originalIgs,
  originalFaceSum,
  evoFilters,
  pathFeedback,
  onRatePath,
  excludedCount,
  extraCount,
  onEvoFiltersChange,
  onAnalyze,
  onAnalyzeV2,
  isAnalyzing = false,
  analyzeFoundNothing = false,
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
  onDuplicatePath,
  onToggleFavoritePath,
  onRenamePath,
  shareUrlFor,
  onChangePlayer,
  onClearPaths,
  onViewEvo,
  baseIndex = -1,
  onSetBase,
  onRemoveNode,
  onSetProgress,
  score,
  psScore,
  scorePosition
}) => {
  const showEvoOvr = evoPreview && previewOvr !== activeBaseOvr;
  const isLockedOrEvo = evoLocked || evoPreview;

  const [showFilters, setShowFilters] = React.useState(false);
  /** Which row is currently being asked what was wrong with it. */
  const [reasonsFor, setReasonsFor] = React.useState<string | null>(null);
  /** The in-game record being deleted, and what has been typed to confirm it. */
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);
  const [deleteTyped, setDeleteTyped] = React.useState('');
  const [draftFilters, setDraftFilters] = React.useState<EvoFilters>(evoFilters || {});

  // Judged on the card as it is, not on the build in progress: which plan a card is for does not
  // change halfway through a chain.
  const buildPlans = React.useMemo(() => {
    const positions = (rawPositions || bio.primaryPositions || '').split(',').map(p => p.trim()).filter(Boolean);
    const heightCm = parseHeightCm(bio.height);
    const subs: Record<string, number> = {};
    for (const face of Object.values(rawStats || {})) {
      for (const [key, sub] of Object.entries(face.subs)) subs[key] = sub.base;
    }
    return {
      available: templatesAvailable(positions, heightCm),
      suggested: suggestTemplates(positions, subs, bio.roles, heightCm)
    };
  }, [bio, rawStats, rawPositions]);
  // Which name is being edited, and the name being typed. Held here rather than in the path so an
  // abandoned edit leaves nothing behind. A build is renameable from two places — its chip and its
  // row — so the key carries both the path and which of the two is open, or they would both put an
  // autofocusing input on screen for the same path.
  const [renamingKey, setRenamingKey] = React.useState<string | null>(null);
  const [draftName, setDraftName] = React.useState('');
  // Escape abandons the edit by way of a blur, and the blur is what commits. A ref rather than
  // state because the blur runs before a state update from the same event would be visible.
  const renameCancelled = React.useRef(false);
  // Which build's link was just copied, so the button can say so for a moment.
  const [copiedPathId, setCopiedPathId] = React.useState<string | null>(null);

  const copyShareLink = async (path: EvolutionPath) => {
    if (!shareUrlFor) return;
    const url = shareUrlFor(path);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard access can be refused (an insecure origin, or a browser that asks first).
      // Falling back to a prompt still lets the link be copied by hand rather than lost.
      window.prompt('Copy this link', url);
      return;
    }
    setCopiedPathId(path.id);
    window.setTimeout(() => setCopiedPathId(current => (current === path.id ? null : current)), 2000);
  };

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
      // These act on the page behind an open modal — 'c' would clear the unstarred builds out from
      // under the builder, and Escape would close the filter popover along with the modal.
      if (isModalOpen()) return;

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

  /** The filters in force, in words, for the "nothing matched" note. */
  const activeFilterSummary = React.useMemo(() => {
    if (!evoFilters) return [];
    const parts: string[] = [];
    (evoFilters.requiredEvos || []).forEach(id =>
      parts.push(`must include ${availableEvolutions[id]?.name || id}`)
    );
    if (evoFilters.templateIds && evoFilters.templateIds.length > 0) {
      const names = evoFilters.templateIds
        .map(id => BUILD_TEMPLATES.find(t => t.id === id)?.name)
        .filter(Boolean);
      if (names.length > 0) parts.push(`the ${names.join(' or ')} plan`);
    }
    if (evoFilters.accelerateFamily && evoFilters.accelerateFamily.length > 0) {
      parts.push(`AcceleRATE ${evoFilters.accelerateFamily.join(' or ')} in game`);
    }
    if (evoFilters.accelerate && evoFilters.accelerate.length > 0) {
      parts.push(`AcceleRATE ${evoFilters.accelerate.join(' or ')}`);
    }
    if (evoFilters.newRarity) parts.push('a new rarity');
    if (evoFilters.noRarityChange) parts.push('rarity unchanged');
    if (evoFilters.oneUsePerEvo === false) parts.push('evos may repeat');
    if (evoFilters.oneEvoPerRarity === false) parts.push('rarities may repeat');
    if (evoFilters.newPosition) parts.push('a new position');
    if (evoFilters.noPositionChange) parts.push('positions unchanged');
    (['ovr', 'pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const).forEach(stat => {
      const f = evoFilters[stat];
      if (!f) return;
      if (f.min !== undefined) parts.push(`${stat.toUpperCase()} ≥ ${f.min}`);
      if (f.max !== undefined && !(stat === 'ovr' && f.max >= 99)) parts.push(`${stat.toUpperCase()} ≤ ${f.max}`);
    });
    return parts;
  }, [evoFilters]);

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
    // One narrowing, however many archetypes are ticked — the badge counts filters, not values.
    if (evoFilters.accelerate && evoFilters.accelerate.length > 0) count++;
    if (evoFilters.accelerateFamily && evoFilters.accelerateFamily.length > 0) count++;
    if (evoFilters.templateIds && evoFilters.templateIds.length > 0) count++;

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

  // Only the leading digits are the player. FUTBIN links come as
  // .../player/20701/rodrigo-hernandez-cascante, .../player/20701, and .../player/21177_1014 —
  // where _1014 is an evo already applied to the card being viewed (1014 is Tiny Tim). What the
  // app holds is the base card, and the chain it appends is its own, so the suffix is dropped:
  // builder/21177_1014_990_… is a 404, builder/21177_990_… is the build on screen. Requiring a
  // name slug behind the digits, as this used to, dropped every one of these but the first.
  /** Where a build's in-game stats total ends up — what a finished build is judged on. */
  const igsOf = (stats: StatsData) =>
    Object.values(stats).reduce(
      (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
      0
    );

  // A build with no steps is the raw card, so it is worth what the raw card is worth rather than
  // nothing — otherwise the one chip that exists to be compared against carries no numbers.
  const pathIgs = (path: EvolutionPath) => {
    const last = path.steps?.[path.steps.length - 1];
    return igsOf(last ? last.statsAfter : rawStats);
  };

  /**
   * The raw card scored where it plays. Every step of every chain is then measured at this same
   * position, so the numbers down a row answer one question instead of each answering its own.
   */
  const baseScore = React.useMemo(
    () =>
      (scorePosition ? scoreAtPosition(rawStats, bio, scorePosition) : null) ?? bestScore(rawStats, bio),
    [rawStats, bio, scorePosition]
  );
  const basePs = React.useMemo(
    () => (baseScore ? playStyleScoreAt(rawStats, rawPlayStyles, bio, baseScore.position) : null),
    [baseScore, rawStats, rawPlayStyles, bio]
  );

  /** What the build is worth where it ends up playing — the chip's second number. */
  const pathScore = (path: EvolutionPath) => {
    const last = path.steps?.[path.steps.length - 1];
    if (!last) return baseScore;
    return bestScore(last.statsAfter, last.bioAfter);
  };

  /** 0 unstarred, otherwise which colour. A starred build with no tier reads as the first. */
  const starTier = (path: EvolutionPath) =>
    isInGamePath(path) ? IN_GAME_STAR_TIER : path.isFavorite ? path.starTier ?? 1 : 0;
  const starTitle = (path: EvolutionPath) => {
    if (isInGamePath(path)) {
      return 'What you have actually done in game. Always saved, never cleared, and green is reserved for it.';
    }
    const tier = starTier(path);
    if (tier === 0) return 'Star this build so it survives Analyze and the page reload';
    const after = tier + 1 === IN_GAME_STAR_TIER ? tier + 2 : tier + 1;
    const next = after > STAR_TIER_COUNT ? 'unstars it' : `turns it ${STAR_TIERS[after - 1]!.name}`;
    return `Saved · ${STAR_TIERS[tier - 1].name} — clicking ${next}`;
  };

  const startRename = (where: 'chip' | 'row', path: EvolutionPath) => {
    setRenamingKey(`${where}:${path.id}`);
    setDraftName(path.name);
  };

  /** The editor itself, shared by the chip and the path row. */
  const nameInput = (path: EvolutionPath, className: string) => (
    <input
      autoFocus
      value={draftName}
      onChange={(e) => setDraftName(e.target.value)}
      onBlur={() => {
        const next = draftName.trim();
        if (next && !renameCancelled.current && onRenamePath) onRenamePath(path.id, next);
        renameCancelled.current = false;
        setRenamingKey(null);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') {
          renameCancelled.current = true;
          e.currentTarget.blur();
        }
      }}
      className={className}
      placeholder={path.name}
    />
  );

  const playerIdMatch = futbinLink ? futbinLink.match(/\/player\/(\d+)/) : null;
  const futbinPlayerId = playerIdMatch ? playerIdMatch[1] : '';
  // FUTBIN only knows about real evos, so PlayStyle steps are left out of the builder URL.
  const futbinChain = (path: EvolutionPath) => path.chainIds.filter(id => !isPlayStyleNodeId(id));
  const builderLink = (path: EvolutionPath) => futbinPlayerId && futbinChain(path).length > 0
    ? `https://www.futbin.com/26/evolutions/builder/${futbinPlayerId}_${futbinChain(path).join('_')}?includeExpired=false`
    : null;

  return (
    <div className="relative z-50 flex flex-col gap-1.5 mb-2">
      {/* Player Header Section (Ultra Compressed) */}
      <div className="relative z-50 flex flex-col gap-1.5 bg-[#1f211f]/60 p-2.5 rounded-xl border border-gray-800/80 backdrop-blur-sm w-full">
        
        {/* Single Row Header: LEFT (Avatar + Name + Badges) + MIDDLE (Metadata) + RIGHT (Team Name) */}
        <div className="flex items-center gap-3 w-full flex-wrap">
          {/* LEFT SIDE: Avatar + Name + OVR + Positions + Rarity */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {avatarUrl && (
              <div className="relative">
                <div className="w-[44px] h-[44px] shrink-0 rounded-full border-2 border-gray-600 bg-[#121212] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
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

            <h1 className="text-lg font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent whitespace-nowrap">
              {bio.name}
            </h1>
            {/* Only when there is somewhere to go — an imported card with no URL was still drawing
                this chip, and clicking it reloaded the app. */}
            {futbinLink && (
              <a
                href={futbinLink}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] bg-[#1f2937] hover:bg-[#374151] text-gray-300 hover:text-white border border-gray-600 rounded px-1.5 py-0.5 flex items-center gap-1 transition-colors shadow-sm"
                title="View on FUTBIN"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* What the card is worth where it plays, out of 100 — the same rank of number as OVR,
                and the one that knows the difference between two 97s. */}
            {score && (
              <div
                className="bg-gray-800/80 text-gray-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm border border-gray-600 flex items-center gap-1 whitespace-nowrap"
                title={
                  `${score.position} score ${score.score.toFixed(1)}/100 as ${score.plan.name}` +
                  ` · ${score.style ? `on ${score.style}` : 'bare'} · ${score.archetype}${score.fallback ? ' (fallback)' : ''}` +
                  (score.under.length > 0
                    ? ` · under ${score.under.map(u => `${u.key} ${u.value}/${u.floor}`).join(', ')}`
                    : ' · clears every floor')
                }
              >
                <span className="text-gray-500 text-[9px] font-semibold tracking-wider">{score.position}</span>
                <span className={getStatColorClass(score.score)}>
                  {score.score.toFixed(1)}
                </span>
              </div>
            )}

            {/* The PlayStyles, scored apart from the stats: a card can be right on one and wrong on
                the other, and the two want opposite next steps. */}
            {psScore && (
              <div
                className="bg-gray-800/80 text-gray-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm border border-gray-600 flex items-center gap-1 whitespace-nowrap"
                title={
                  `PlayStyles ${psScore.score.toFixed(1)}/100 at ${psScore.position}` +
                  (psScore.detail.length > 0
                    ? ` · best: ${psScore.detail.slice(0, 3).map(d => `${d.name.replace(/\+/g, '')}${d.gold ? '+' : ''}`).join(', ')}`
                    : ' · none that this position uses') +
                  (psScore.missing.length > 0 ? ` · missing: ${psScore.missing.join(', ')}` : '')
                }
              >
                <span className="text-gray-500 text-[9px] font-semibold tracking-wider">PS</span>
                <span className={getStatColorClass(psScore.score)}>{psScore.score.toFixed(1)}</span>
              </div>
            )}

            {/* Main OVR Rating Badge */}
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-2 py-0.5 rounded font-bold text-xs shadow-sm border border-yellow-300 flex items-center gap-1 whitespace-nowrap">
              <span className="text-black/60 text-[9px] font-semibold tracking-wider">OVR</span>
              <span>{previewOvr}</span>
              {ovrChip && (
                <span className={`text-[8.5px] font-bold px-1 py-0.2 rounded border ml-0.5 ${ovrChip.className}`}>
                  {ovrChip.text}
                </span>
              )}
            </div>
            
            {/* Positions */}
            <span className={`font-bold text-xs px-2 py-0.5 rounded border shadow-sm whitespace-nowrap ${
              positionsChanged
                ? 'bg-purple-950/50 text-purple-300 border-purple-700/60'
                : 'bg-gray-800/80 text-gray-300 border-gray-700/50'
            }`}>
              {bio.primaryPositions}
            </span>

            {/* Rarity */}
            <span className={`font-bold text-xs px-2 py-0.5 rounded border shadow-sm whitespace-nowrap ${
              rawRarity && bio.rarity !== rawRarity
                ? 'bg-purple-950/50 text-purple-300 border-purple-700/60'
                : 'bg-gray-800/80 text-gray-300 border-gray-700/50'
            }`}>
              {bio.rarity}
            </span>
          </div>

          {/* MIDDLE: Bio Metadata (all in one line) */}
          <div className="flex flex-wrap items-center gap-1.5 text-gray-300 font-medium text-xs border-l border-gray-800/60 pl-3 py-0.5">
            <span>{bio.nation}</span>
            <span className="text-gray-600">|</span>
            <span>{bio.league}</span>
            <span className="text-gray-600">|</span>
            <span>{bio.club}</span>
            <span className="text-gray-600">|</span>
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

          {/* RIGHT: Team Name Button (placed top right) */}
          {teamName && (
            <button
              onClick={onOpenTeamList}
              className="ml-auto shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121212] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 transition-colors font-bold text-xs shadow-sm"
              title="Back to all teams"
            >
              <Users className="w-3.5 h-3.5 text-fcGreen" />
              <span>{teamName}</span>
            </button>
          )}
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex items-start gap-x-4 gap-y-1.5 mt-0.5 w-full border-t border-gray-800/60 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* Wraps because the row is wider than a tablet viewport and was pushing the page
                into horizontal scroll. */}
            <div className="flex flex-wrap gap-1 items-center relative">
              {onChangePlayer && (
                <button
                  onClick={onChangePlayer}
                  title="Switch Player (/)"
                  className="px-2.5 py-1 border border-blue-600 hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 rounded-lg text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors mr-1 font-bold shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                >
                  <span className="text-[10px]">👤</span> Switch
                  <kbd className="ml-0.5 px-1 bg-blue-950/50 border border-blue-800 rounded text-[9px] text-blue-300 font-mono">/</kbd>
                </button>
              )}

              <button onClick={() => setShowFilters(!showFilters)} className={`px-2.5 py-1 border rounded-lg text-xs flex items-center gap-1 transition-colors relative ${
                showFilters 
                  ? 'bg-fcGreen text-black font-bold border-fcGreen' 
                  : 'bg-[#1f2937] hover:bg-[#374151] text-gray-300 border-gray-600'
              }`}>
                <Settings2 className="w-3.5 h-3.5" /> Filters
                <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">f</kbd>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1 py-0.2 bg-fcGreen/20 text-fcGreen rounded font-bold text-[9px]">
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

                    {/* Not a filter — it excludes nothing. It swaps what "better" means everywhere
                        that ranks evos, so it gets its own block and starts switched off. */}
                    <div className="mb-4 pb-3 border-b border-gray-800 space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-200 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={!!draftFilters.playstyleWeighting}
                          onChange={(e) => setDraftFilters({ ...draftFilters, playstyleWeighting: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                        />
                        Rank by my PlayStyle profile
                      </label>
                      <p className="text-[10px] text-gray-500 leading-snug pl-5">
                        Scores each build on the PlayStyles and sub-stats your game actually uses, instead of raw
                        totals. Ranking only — nothing is filtered out.
                      </p>
                      {draftFilters.playstyleWeighting && (
                        <div className="flex items-center gap-2 pl-5 pt-1">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide">This card is</span>
                          {([
                            [undefined, 'Auto'],
                            ['manual', 'Mine'],
                            ['ai', 'AI']
                          ] as const).map(([mode, label]) => (
                            <button
                              key={label}
                              onClick={() => setDraftFilters({ ...draftFilters, controlMode: mode })}
                              title={
                                mode === undefined
                                  ? 'Decide from the position: attackers are yours, defenders are the AI'
                                  : mode === 'manual'
                                  ? 'You hold the stick: stamina, dribbling and pressing PlayStyles are worth more'
                                  : 'The AI plays it: positioning and interception PlayStyles are worth more'
                              }
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                draftFilters.controlMode === mode
                                  ? 'bg-fcGreen text-black border-fcGreen/80'
                                  : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

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
                      {/* How a chain may spend its steps. Both on unless you say otherwise, because
                          both rule out chains that spend a step on nothing: the same evo twice is
                          usually the search finding one idea twice, and rarity does not stack. */}
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors"
                               title="Use each evo at most once, whatever its repeat limit allows">
                          <input
                            type="checkbox"
                            checked={draftFilters.oneUsePerEvo !== false}
                            onChange={(e) => setDraftFilters({ ...draftFilters, oneUsePerEvo: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          One use per EVO
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors"
                               title="At most one evo granting any given rarity — a second one grants nothing">
                          <input
                            type="checkbox"
                            checked={draftFilters.oneEvoPerRarity !== false}
                            onChange={(e) => setDraftFilters({ ...draftFilters, oneEvoPerRarity: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          One EVO per rarity
                        </label>
                      </div>
                    </div>

                    {/* The plans V2 ranks against. A position is not a plan — a Rock CB and a Pace
                        CB want different evos out of the same pool — so the choice of plan is the
                        first thing the search needs, not the last. Left alone it uses the one or two
                        this card already is, by its own roles and archetype; "All plans" is how you
                        ask to see every option the card's positions and frame allow. */}
                    <div className="mb-4 pb-3 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Build Plan <span className="text-gray-600 normal-case">· Analyze V2 only</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDraftFilters({ ...draftFilters, templateIds: undefined })}
                            className={`text-[10px] uppercase tracking-wider font-bold ${
                              draftFilters.templateIds === undefined ? 'text-fcGreen' : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            Suggested
                          </button>
                          <button
                            onClick={() => setDraftFilters({ ...draftFilters, templateIds: [] })}
                            className={`text-[10px] uppercase tracking-wider font-bold ${
                              draftFilters.templateIds?.length === 0 ? 'text-fcGreen' : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            All plans
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {buildPlans.available.map(t => {
                          const auto = draftFilters.templateIds === undefined;
                          const isSuggested = buildPlans.suggested.includes(t.id);
                          const picked = auto ? isSuggested : (draftFilters.templateIds || []).includes(t.id);
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                const current = auto ? buildPlans.suggested : (draftFilters.templateIds || []);
                                const next = picked ? current.filter(id => id !== t.id) : [...current, t.id];
                                setDraftFilters({ ...draftFilters, templateIds: next });
                              }}
                              title={`${t.blurb} — ${t.archetype}${t.controlledFallback ? ', or Controlled if the card cannot reach it' : ''}. Passes at 90 on ${t.must.join(', ')}.`}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                                picked
                                  ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm'
                                  : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151] hover:text-white'
                              }`}
                            >
                              {isSuggested && <span className={picked ? 'text-black/60' : 'text-fcGreen'}>★ </span>}
                              {t.name}
                            </button>
                          );
                        })}
                        {buildPlans.available.length === 0 && (
                          <span className="text-[10px] text-gray-600">No plan fits this card's positions and height.</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1.5 leading-snug">
                        {draftFilters.templateIds === undefined
                          ? `★ suggested for this card — V2 will rank against ${buildPlans.suggested.length === 1 ? 'this plan' : 'these two'} only`
                          : draftFilters.templateIds.length === 0
                            ? 'Every plan this card can carry out'
                            : `${draftFilters.templateIds.length} chosen`}
                      </p>
                    </div>

                    {/* AcceleRATE is not a stat you can put a floor under — it is one of seven
                        archetypes, decided by acceleration, agility, strength and height. A build
                        counts if any chemistry style, Basic included, lands it on one you picked,
                        since the style is a free choice at the point of use. */}
                    <div className="mb-4 pb-3 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          AcceleRATE <span className="text-gray-600 normal-case">· in game / detailed</span>
                        </span>
                        {((draftFilters.accelerate?.length || 0) + (draftFilters.accelerateFamily?.length || 0)) > 0 && (
                          <button
                            onClick={() => setDraftFilters({ ...draftFilters, accelerate: [], accelerateFamily: [] })}
                            className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-bold"
                          >
                            Any
                          </button>
                        )}
                      </div>
                      {/* Two filters, not one said twice: the game turns Explosive on at an
                          agility lead of 10 while the seven-way thresholds lean Explosive from 4,
                          so ticking a printed archetype cannot just tick its tiers. Set both and
                          a build has to satisfy both. */}
                      <div className="flex gap-1.5 mb-1.5">
                        {ACCELERATE_FAMILIES.map(family => {
                          const picked = draftFilters.accelerateFamily?.includes(family) || false;
                          return (
                            <button
                              key={family}
                              onClick={() => {
                                const current = draftFilters.accelerateFamily || [];
                                setDraftFilters({
                                  ...draftFilters,
                                  accelerateFamily: picked
                                    ? current.filter(f => f !== family)
                                    : [...current, family]
                                });
                              }}
                              title={`${family} — as the card reads it in FC 26`}
                              className={`flex-1 px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                                picked
                                  ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm'
                                  : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151] hover:text-white'
                              }`}
                            >
                              {family.toUpperCase()}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ACCELERATE_TYPES.map(type => {
                          const picked = draftFilters.accelerate?.includes(type) || false;
                          return (
                            <button
                              key={type}
                              onClick={() => {
                                const current = draftFilters.accelerate || [];
                                setDraftFilters({
                                  ...draftFilters,
                                  accelerate: picked
                                    ? current.filter(t => t !== type)
                                    : [...current, type]
                                });
                              }}
                              title={type}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                                picked
                                  ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm'
                                  : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151] hover:text-white'
                              }`}
                            >
                              {ACCELERATE_SHORT[type]}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1.5 leading-snug">
                        {((draftFilters.accelerate?.length || 0) + (draftFilters.accelerateFamily?.length || 0)) === 0
                          ? 'Any archetype'
                          : 'Kept if some chem style — Basic included — reaches one of these'}
                      </p>
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

              <button onClick={onOpenEvoPool} className="px-2.5 py-1 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 relative text-xs flex items-center gap-1 ml-1">
                <Settings className="w-3.5 h-3.5" /> Pool ({evosPool?.length || 0})
                <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">p</kbd>
                {(evoFilters?.requiredEvos?.length || 0) > 0 && (
                  <span className="ml-1 px-1 py-0.2 bg-fcGreen/20 text-fcGreen rounded font-bold text-[9px]" title="Must Include">
                    ★ {evoFilters!.requiredEvos!.length}
                  </span>
                )}
                {excludedCount > 0 && (
                  <span className="ml-1 px-1 py-0.2 bg-red-900/40 text-red-400 rounded font-bold text-[9px]" title="Excluded">
                    ✖ {excludedCount}
                  </span>
                )}
                {extraCount > 0 && (
                  <span className="ml-1 px-1 py-0.2 bg-orange-900/40 text-orange-400 rounded font-bold text-[9px]" title="Extra (Selected Disabled)">
                    + {extraCount}
                  </span>
                )}
              </button>
              <button onClick={onOpenManualPath} className="px-2.5 py-1 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add EVO <kbd className="ml-0.5 px-1 bg-black/40 border border-gray-700 rounded text-[9px] text-gray-400 font-mono">a</kbd>
              </button>
              {onOpenImportBuild && (
                <button
                  onClick={onOpenImportBuild}
                  title="Paste share links to bring builds in from another team"
                  className="px-2.5 py-1 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-lg text-gray-300 text-xs flex items-center gap-1"
                >
                  <Link2 className="w-3.5 h-3.5" /> Import
                </button>
              )}
              {onBranchFromBase && (
                <button
                  onClick={onBranchFromBase}
                  title="Start a new path from the base, leaving this one untouched"
                  className="px-2.5 py-1 bg-[#1f2937] hover:bg-[#374151] border border-purple-800/60 rounded-lg text-purple-300 text-xs flex items-center gap-1"
                >
                  <GitBranch className="w-3.5 h-3.5" /> Branch <kbd className="ml-0.5 px-1 bg-black/40 border border-purple-900 rounded text-[9px] text-purple-400 font-mono">b</kbd>
                </button>
              )}
              {canPickFreePlayStyles && onOpenPlayStylePicker && (
                <button
                  onClick={() => onOpenPlayStylePicker('new')}
                  title="This build unlocks picking any PlayStyle — added to the chain as its own step, at the end"
                  className="px-2.5 py-1 bg-yellow-950/30 hover:bg-yellow-900/40 border border-yellow-700/60 rounded-lg text-yellow-400 text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Add Skill <kbd className="ml-0.5 px-1 bg-black/40 border border-yellow-900 rounded text-[9px] text-yellow-400 font-mono">s</kbd>
                </button>
              )}
              {isAnalyzing ? (
                <button
                  onClick={() => { setShowFilters(false); onCancelAnalyze?.(); }}
                  title="Stop the search"
                  className="px-2.5 py-1 border rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border-red-700 hover:border-red-500 bg-red-950/30 hover:bg-red-900/40 text-red-300"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {analyzeProgress > 0
                    ? `${Math.round(analyzeProgress / 1000)}k · Stop`
                    : 'Analyzing · Stop'}
                </button>
              ) : (
                <button onClick={() => { setShowFilters(false); onAnalyze(); }} disabled={!evosPool || evosPool.length === 0} className={`px-2.5 py-1 border rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${(evosPool?.length || 0) > 0 ? 'border-blue-600 hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 hover:text-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-[#1f211f] text-gray-600 border-gray-800'}`}>
                  <Zap className="w-3.5 h-3.5" /> Analyze
                </button>
              )}
              {/* Beside the original, not instead of it: the two rank on different questions and
                  which one is right depends on whether the card is being finished or started. */}
              {onAnalyzeV2 && !isAnalyzing && (
                <button
                  onClick={() => { setShowFilters(false); onAnalyzeV2(); }}
                  disabled={!evosPool || evosPool.length === 0}
                  title="Ranks on the weakest sub-stat the position runs on, not the total — so a build with a hole in it loses to a balanced one. Shortlists per position and per stat, with the reason on every row."
                  className={`px-2.5 py-1 border rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    (evosPool?.length || 0) > 0
                      ? 'border-fuchsia-600 hover:border-fuchsia-500 bg-fuchsia-900/20 hover:bg-fuchsia-900/40 text-fuchsia-300 hover:text-fuchsia-200 shadow-[0_0_10px_rgba(192,38,211,0.2)]'
                      : 'bg-[#1f211f] text-gray-600 border-gray-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Analyze V2
                </button>
              )}
              {onClearPaths && (
                <button
                  onClick={onClearPaths}
                  title="Clear all unstarred paths. The Default path — what you have done in game — is never cleared."
                  className="px-2.5 py-1 bg-[#1f2937] hover:bg-red-900/50 border border-gray-600 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-300 text-xs flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Unstarred <kbd className="ml-0.5 px-1 bg-black/40 border border-red-900/50 rounded text-[9px] text-red-400 font-mono">c</kbd>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    {/* Path Selection & Action Buttons */}
    <div className="flex flex-col gap-1 w-full bg-[#1A1C1A] border border-gray-800 rounded-xl p-2 shadow-md">
      {/* A search that finds nothing used to leave the screen exactly as it was, which reads as a
          broken button rather than an answer. Filters can genuinely rule everything out — an evo
          that has to be in the chain can be the very thing that costs the card the AcceleRATE the
          chain is being filtered on — so say so, and say what is doing the ruling out. */}
      {analyzeFoundNothing && !isAnalyzing && (
        <div className="mb-1 px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-800/50 text-[11px] text-amber-200/90 leading-snug">
          <span className="font-bold">Analyze found no build that satisfies the filters.</span>
          {activeFilterSummary.length > 0 && (
            <span className="text-amber-200/60"> Currently asking for: {activeFilterSummary.join(' · ')}.</span>
          )}
          <span className="text-amber-200/60">
            {' '}They can rule each other out — a required evo may cost the card the very thing the
            rest of the filter is asking for. Loosen them in Filters, or build by hand with Add EVO.
          </span>
        </div>
      )}
      {/* One chip per build, from the first build on — the row used to appear only once there were
          two, which left a single saved build with nothing to carry its name and its total. */}
      {allPaths.some(p => p.chainIds.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {allPaths.map((path) => (
            <div key={path.id} className="relative flex items-center group">
              {renamingKey === `chip:${path.id}` ? (
                nameInput(path, "w-32 bg-[#121212] border border-fcGreen rounded-lg px-2 py-1 text-[11px] font-bold text-white outline-none")
              ) : (
              <button
                onClick={() => onSelectPath(path.id)}
                onDoubleClick={() => { if (onRenamePath && path.chainIds.length > 0) startRename('chip', path); }}
                title={
                  // The reason a build was recommended belongs where the build is, not in a
                  // release note — a shortlist you have to take on faith is one you check by hand.
                  [path.description, path.chainIds.length > 0 && onRenamePath ? 'Double-click to rename' : '']
                    .filter(Boolean)
                    .join('\n\n') || undefined
                }
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border flex items-center gap-1.5 ${
                  expandedPathIds.includes(path.id)
                    ? 'bg-green-950/40 text-fcGreen border-fcGreen shadow-sm'
                    : comparePathId === path.id
                    ? 'bg-purple-950/40 text-purple-400 border-purple-500 shadow-sm'
                    : 'bg-[#1a1c1a] text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {pathLabel(path)}
                {/* What the build is worth, on the chip itself, so builds can be told apart without
                    expanding them: the stat total it ends on, and what that is worth where the card
                    plays. Bare numbers — the labels cost more room than they explain, and the two
                    are never confusable at this range. */}
                {pathIgs(path) !== null && (
                  <span
                    className="font-mono text-[9.5px] px-1 py-0.5 rounded bg-black/40 border border-gray-700 flex items-center gap-1"
                    title={(() => {
                      const s = pathScore(path);
                      return `IGS ${pathIgs(path)}` + (s
                        ? ` · ${s.position} score ${s.score.toFixed(1)}/100 as ${s.plan.name}` +
                          ` · ${s.style ? `on ${s.style}` : 'bare'} · ${s.archetype}${s.fallback ? ' (fallback)' : ''}`
                        : '');
                    })()}
                  >
                    <span className="text-blue-400">{pathIgs(path)}</span>
                    {(() => {
                      const s = pathScore(path);
                      if (!s) return null;
                      return (
                        <span className={getStatColorClass(s.score)}>
                          {s.score.toFixed(1)}
                        </span>
                      );
                    })()}
                  </span>
                )}
                {/* How far it's been played, on the chip too — a collapsed build should still
                    answer "how much of this is left" without being opened. */}
                {(path.doneUpTo ?? -1) >= 0 && (
                  <span
                    className="font-mono text-[9.5px] px-1 py-0.5 rounded bg-green-950/50 border border-fcGreen/50 text-fcGreen flex items-center gap-0.5"
                    title={`${Math.min(path.doneUpTo! + 1, path.chainIds.length)} of ${path.chainIds.length} steps done in game`}
                  >
                    <Check className="w-2 h-2" strokeWidth={4} />
                    {Math.min(path.doneUpTo! + 1, path.chainIds.length)}/{path.chainIds.length}
                  </span>
                )}
              </button>
              )}
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
              {onRenamePath && path.chainIds.length > 0 && renamingKey !== `chip:${path.id}` && (
                <button
                  onClick={(e) => { e.stopPropagation(); startRename('chip', path); }}
                  className="absolute -bottom-1.5 -right-1.5 rounded-full p-0.5 shadow-sm bg-gray-800 text-gray-400 hover:bg-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Rename this build"
                >
                  <Pencil className="w-2.5 h-2.5" />
                </button>
              )}
              {/* Copying is how a variant gets started: the copy opens as the active build, so the
                  next edit lands on it and not on the build it came from. */}
              {onDuplicatePath && path.chainIds.length > 0 && renamingKey !== `chip:${path.id}` && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicatePath(path.id); }}
                  className="absolute -bottom-1.5 -left-1.5 rounded-full p-0.5 shadow-sm bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title={`Duplicate "${pathLabel(path)}"`}
                >
                  <Copy className="w-2.5 h-2.5" />
                </button>
              )}
              {onToggleFavoritePath && path.chainIds.length > 0 && path.isFavorite && (
                <div className="absolute -top-3 -left-1.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavoritePath(path);
                    }}
                    className={`rounded-full p-0.5 shadow-sm ${STAR_TIERS[starTier(path) - 1].dot}`}
                    title={starTitle(path)}
                  >
                    <Star className={`w-2.5 h-2.5 ${STAR_TIERS[starTier(path) - 1].fill}`} />
                  </button>
                </div>
              )}
              {onDeletePath && isInGamePath(path) && path.chainIds.length > 0 && (
                <div className="absolute -top-1.5 -right-1.5 opacity-40 hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(path.id); setDeleteTyped(''); }}
                    className="bg-red-950 text-red-400 rounded-full p-0.5 hover:bg-red-600 hover:text-white shadow-sm"
                    title="Delete the in-game record — asks you to type its name first"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              {(onDeletePath || onToggleFavoritePath) && path.chainIds.length > 0 && !path.isFavorite && !isInGamePath(path) && (
                <div className="absolute -top-1.5 -left-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {onToggleFavoritePath && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoritePath(path);
                      }}
                      className="rounded-full p-0.5 shadow-sm bg-gray-800 text-gray-500 hover:bg-yellow-500 hover:text-black"
                      title={starTitle(path)}
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
      )}

      {/* Typed rather than clicked. Every other build here is a proposal that can be made again;
          this one is the record of evos already spent, and there is no undo for it. */}
      {confirmDelete && onDeletePath && (() => {
        const target = allPaths.find(p => p.id === confirmDelete);
        if (!target) return null;
        return (
          <div className="mt-1 p-2.5 rounded-lg bg-red-950/30 border border-red-800/60 flex flex-col gap-2">
            <div className="text-[11px] text-red-200/90 leading-snug">
              Delete <span className="font-bold">{target.name}</span> — {target.chainIds.length} evo
              {target.chainIds.length === 1 ? '' : 's'} you have already done in game. This cannot be undone,
              and Analyze cannot rebuild it. Type <span className="font-mono font-bold">{target.name}</span> to confirm.
            </div>
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={deleteTyped}
                onChange={e => setDeleteTyped(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setConfirmDelete(null); }}
                placeholder={target.name}
                className="w-40 bg-[#121212] border border-red-800 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-red-500"
              />
              <button
                disabled={deleteTyped.trim() !== target.name}
                onClick={() => { onDeletePath(target.id); setConfirmDelete(null); setDeleteTyped(''); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  deleteTyped.trim() === target.name
                    ? 'bg-red-600 border-red-500 text-white hover:bg-red-500'
                    : 'bg-[#1f211f] border-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                Delete
              </button>
              <button
                onClick={() => { setConfirmDelete(null); setDeleteTyped(''); }}
                className="px-2.5 py-1 rounded-lg text-[11px] text-gray-400 hover:text-white border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      })()}

          <div className="flex flex-col gap-2">
            {expandedPathIds.map(renderPathId => {
              const renderPath = allPaths.find(p => p.id === renderPathId);
              if (!renderPath) return null;
              
              // A build too wide for the page wraps onto another line, starting back at the left.
              // It used to scroll sideways instead, which put the end of a long chain behind a
              // swipe that the browser reads as a back gesture.
              return (
                <div key={renderPathId} className="flex flex-col gap-1">
                {/* Why this build is on the list, spelled out where the build is. V2 writes a full
                    line here — how it scores at the position, what its weakest key stat is, what
                    AcceleRATE it lands on — so a shortlist can be read rather than re-derived. */}
                {renderPath.isRecommended && renderPath.description && (
                  <div className="text-[10px] text-gray-500 leading-snug px-1.5">
                    {renderPath.description}
                  </div>
                )}
                {/* The verdict goes where the reasoning is. A thumbs-down asks what was wrong with
                    it, because a bare thumb cannot be acted on later — it says the row was wrong
                    without saying which part, and by then the row is gone. */}
                {renderPath.chainIds.length > 0 && onRatePath && (() => {
                  const key = chainKeyOf(renderPath.chainIds);
                  const verdict = pathFeedback?.[key]?.verdict;
                  const chosen = pathFeedback?.[key]?.reasons || [];
                  const asking = reasonsFor === renderPath.id;
                  return (
                    <div className="flex flex-wrap items-center gap-1 px-1.5">
                      <button
                        onClick={() => { onRatePath(renderPath, verdict === 'up' ? null : 'up'); setReasonsFor(null); }}
                        title="Good recommendation — keep showing it, and use it when tuning the ranking"
                        className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
                          verdict === 'up'
                            ? 'bg-green-900/40 border-fcGreen text-fcGreen'
                            : 'bg-[#1a1c1a] border-gray-700 text-gray-500 hover:text-fcGreen hover:border-fcGreen/60'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (verdict === 'down') { onRatePath(renderPath, null); setReasonsFor(null); }
                          else { onRatePath(renderPath, 'down'); setReasonsFor(renderPath.id); }
                        }}
                        title="Not a build you would make — hidden from future searches on this card"
                        className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
                          verdict === 'down'
                            ? 'bg-red-950/40 border-red-600 text-red-400'
                            : 'bg-[#1a1c1a] border-gray-700 text-gray-500 hover:text-red-400 hover:border-red-700'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      {verdict === 'down' && !asking && chosen.length > 0 && (
                        <button
                          onClick={() => setReasonsFor(renderPath.id)}
                          className="text-[9.5px] text-red-400/80 hover:text-red-300 underline decoration-dotted"
                        >
                          {chosen.map(id => FEEDBACK_REASONS.find(r => r.id === id)?.label || id).join(' · ')}
                        </button>
                      )}
                      {verdict === 'down' && !asking && chosen.length === 0 && (
                        <button
                          onClick={() => setReasonsFor(renderPath.id)}
                          className="text-[9.5px] text-gray-500 hover:text-gray-300 underline decoration-dotted"
                        >
                          say what was wrong
                        </button>
                      )}
                      {verdict === 'down' && asking && (
                        <span className="flex flex-wrap items-center gap-1">
                          {FEEDBACK_REASONS.map(reason => {
                            const picked = chosen.includes(reason.id);
                            return (
                              <button
                                key={reason.id}
                                title={reason.hint}
                                onClick={() => onRatePath(
                                  renderPath,
                                  'down',
                                  picked ? chosen.filter(r => r !== reason.id) : [...chosen, reason.id]
                                )}
                                className={`px-1.5 py-0.5 rounded border text-[9.5px] font-bold transition-colors ${
                                  picked
                                    ? 'bg-red-900/50 border-red-600 text-red-300'
                                    : 'bg-[#2A2D2A] border-gray-700/50 text-gray-400 hover:text-white hover:bg-[#374151]'
                                }`}
                              >
                                {reason.label}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setReasonsFor(null)}
                            className="px-1 text-[9.5px] text-gray-500 hover:text-white"
                          >
                            done
                          </button>
                        </span>
                      )}
                    </div>
                  );
                })()}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 p-1.5 bg-[#1a1c1a] rounded-lg border border-gray-800">
                  <Layers className="w-3.5 h-3.5 text-gray-500 mr-1 shrink-0" />

                {/* The build's name, and where it gets renamed. On the row rather than only on the
                    chips above, which appear once there are two paths — until now a lone build was
                    both unnamed on screen and unrenameable. Empty paths are left out: the Default
                    path isn't stored anywhere yet, so a name given to it would not survive. */}
                {renderPath.chainIds.length > 0 && onRenamePath && (
                  renamingKey === `row:${renderPath.id}` ? (
                    nameInput(renderPath, "shrink-0 w-32 bg-[#121212] border border-fcGreen rounded px-1.5 py-1 text-[11px] font-bold text-white outline-none")
                  ) : (
                    <button
                      onClick={() => startRename('row', renderPath)}
                      title={`Rename "${pathLabel(renderPath)}"`}
                      className="shrink-0 max-w-32 flex items-center gap-1 px-1.5 py-1 rounded border border-transparent hover:border-gray-700 text-[11px] font-bold text-gray-400 hover:text-gray-200 transition-colors group/name"
                    >
                      <span className="truncate">{pathLabel(renderPath)}</span>
                      <Pencil className="w-2.5 h-2.5 shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                    </button>
                  )
                )}

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
                      {/* The raw card scored where it plays — the bar every step of the chain is
                          then measured against. */}
                      {baseScore && (
                        <div
                          className="flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600"
                          title={`${baseScore.position} score ${baseScore.score.toFixed(1)}/100 as ${baseScore.plan.name} · ${baseScore.style ? `on ${baseScore.style}` : 'bare'}`}
                        >
                          <span className="text-white font-bold">{baseScore.position}</span>
                          <span className={getStatColorClass(baseScore.score)}>{baseScore.score.toFixed(1)}</span>
                        </div>
                      )}
                      {basePs && (
                        <div
                          className="flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600"
                          title={`PlayStyles ${basePs.score.toFixed(1)}/100 at ${basePs.position}`}
                        >
                          <span className="text-white font-bold">PS</span>
                          <span className={getStatColorClass(basePs.score)}>{basePs.score.toFixed(1)}</span>
                        </div>
                      )}
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
                    {isBaseCardPath(renderPath)
                      ? 'The card as it came. Nothing is ever added here — it is what the others are read against.'
                      : 'No EVOs yet — use Add EVO to build from here.'}
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
                          isDone={idx <= (renderPath.doneUpTo ?? -1)}
                          onToggleDone={onSetProgress ? () => onSetProgress(renderPath.id, idx) : undefined}
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
                  // Done in game, as ticked off by hand — a build is worked through in order, so
                  // the marker on step n means every step up to n is behind you.
                  const isDone = idx <= (renderPath.doneUpTo ?? -1);
                  const isLastDone = idx === (renderPath.doneUpTo ?? -1);

                  // A repeatable evo can appear several times in one chain, and on a path the
                  // useful part isn't that it repeats but which run this is and how many are left —
                  // the same card twice over is otherwise two identical steps with no way to tell
                  // whether a third is available.
                  const maxRepeat = evo.maxRepeatable ?? 1;
                  const repeatUse =
                    maxRepeat > 1
                      ? renderPath.chainIds.slice(0, idx + 1).filter(cid => cid === id).length
                      : 0;

                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                        inBasePrefix ? 'ring-1 ring-purple-500/60 rounded' : isDone ? 'ring-1 ring-fcGreen/60 rounded' : ''
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
                            || maxRepeat > 1
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
                              {maxRepeat > 1 && (
                                <span
                                  title={`Repeatable — this is run ${repeatUse} of ${maxRepeat}${
                                    repeatUse < maxRepeat ? `, ${maxRepeat - repeatUse} still available` : ', none left'
                                  }`}
                                  className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold tracking-wide border ${
                                    repeatUse < maxRepeat
                                      ? 'bg-fcGold/15 text-fcGold border-fcGold/40'
                                      : 'bg-gray-800 text-gray-500 border-gray-700'
                                  }`}
                                >
                                  ↻ {repeatUse}/{maxRepeat}
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
                                      {/* What the step is worth where the card plays. Measured at
                                          the base card's position all the way down the chain, so
                                          the steps can be compared with each other rather than each
                                          being scored somewhere else. */}
                                      {(() => {
                                        if (!baseScore) return null;
                                        const now = scoreAtPosition(stepResult.statsAfter, stepResult.bioAfter, baseScore.position);
                                        if (!now) return null;
                                        const before = idx === 0
                                          ? baseScore
                                          : scoreAtPosition(
                                              renderPath.steps![idx - 1].statsAfter,
                                              renderPath.steps![idx - 1].bioAfter,
                                              baseScore.position
                                            );
                                        const diff = before ? now.score - before.score : 0;
                                        return (
                                          <div
                                            className="flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600"
                                            title={`${now.position} score ${now.score.toFixed(1)}/100 as ${now.plan.name} · ${now.style ? `on ${now.style}` : 'bare'}`}
                                          >
                                            <span className="text-white font-bold">{now.position}</span>
                                            <div className="flex items-baseline gap-0.5">
                                              {Math.abs(diff) >= 0.05 && (
                                                <span className={`font-bold text-[7.5px] ${diff > 0 ? 'text-fcGreen' : 'text-red-400'}`}>
                                                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                                </span>
                                              )}
                                              <span className={getStatColorClass(now.score)}>{now.score.toFixed(1)}</span>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                      {(() => {
                                        if (!baseScore) return null;
                                        const now = playStyleScoreAt(stepResult.statsAfter, stepResult.playStylesAfter, stepResult.bioAfter, baseScore.position);
                                        const before = idx === 0
                                          ? basePs
                                          : playStyleScoreAt(
                                              renderPath.steps![idx - 1].statsAfter,
                                              renderPath.steps![idx - 1].playStylesAfter,
                                              renderPath.steps![idx - 1].bioAfter,
                                              baseScore.position
                                            );
                                        const diff = before ? now.score - before.score : 0;
                                        return (
                                          <div
                                            className="flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] bg-gray-800/80 border-gray-600"
                                            title={
                                              `PlayStyles ${now.score.toFixed(1)}/100 at ${now.position}` +
                                              (now.detail.length > 0
                                                ? ` · best: ${now.detail.slice(0, 3).map(d => `${d.name.replace(/\+/g, '')}${d.gold ? '+' : ''}`).join(', ')}`
                                                : '')
                                            }
                                          >
                                            <span className="text-white font-bold">PS</span>
                                            <div className="flex items-baseline gap-0.5">
                                              {Math.abs(diff) >= 0.05 && (
                                                <span className={`font-bold text-[7.5px] ${diff > 0 ? 'text-fcGreen' : 'text-red-400'}`}>
                                                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                                </span>
                                              )}
                                              <span className={getStatColorClass(now.score)}>{now.score.toFixed(1)}</span>
                                            </div>
                                          </div>
                                        );
                                      })()}
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
                        {/* Where the build stands in game. Stays visible once ticked — it's the
                            answer to "where was I", which is wanted before hovering anything. */}
                        {onSetProgress && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onSetProgress(renderPath.id, idx); }}
                            className={`absolute -bottom-1.5 -left-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
                              isDone
                                ? 'bg-fcGreen text-black opacity-100'
                                : 'bg-gray-800 text-gray-500 hover:bg-fcGreen hover:text-black opacity-0 group-hover/node:opacity-100'
                            }`}
                            title={isLastDone
                              ? `Done up to ${evo.name} — click to unmark it`
                              : isDone
                              ? `Done in game — click to roll progress back to ${evo.name}`
                              : `Mark done in game up to ${evo.name}`}
                          >
                            <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                          </button>
                        )}
                      </div>
                      {idx < renderPath.chainIds.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Save and Open live on the row itself. They used to hang off the path chips,
                    which are only drawn once there are two paths — so the common case of one
                    build had nowhere to star it from and no link to follow. */}
                {renderPath.chainIds.length > 0 && (
                  <div className="shrink-0 ml-auto flex items-center gap-1.5 pl-2">
                    {onToggleFavoritePath && (
                      <button
                        onClick={() => onToggleFavoritePath(renderPath)}
                        title={starTitle(renderPath)}
                        className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                          starTier(renderPath) === 0
                            ? 'bg-[#1f211f] text-gray-400 border-gray-700 hover:border-yellow-600 hover:text-yellow-400'
                            : STAR_TIERS[starTier(renderPath) - 1].button
                        }`}
                      >
                        <Star className={`w-3 h-3 ${starTier(renderPath) === 0 ? '' : STAR_TIERS[starTier(renderPath) - 1].fill}`} />
                        {starTier(renderPath) > 0 ? 'Saved' : 'Save'}
                      </button>
                    )}
                    {shareUrlFor && (
                      <button
                        onClick={() => copyShareLink(renderPath)}
                        title="Copy a link that opens this build on someone else's screen"
                        className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                          copiedPathId === renderPath.id
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#1f211f] text-gray-400 border-gray-700 hover:border-blue-500 hover:text-blue-300'
                        }`}
                      >
                        <Link2 className="w-3 h-3" />
                        {copiedPathId === renderPath.id ? 'Copied' : 'Share'}
                      </button>
                    )}
                    {builderLink(renderPath) ? (
                      <a
                        href={builderLink(renderPath)!}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-fcGreen hover:text-white flex items-center gap-1 bg-green-950/60 px-2 py-1 rounded border border-green-800/60 transition-colors"
                      >
                        Open in FUTBIN <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : futbinChain(renderPath).length > 0 && (
                      <span
                        className="text-[10px] text-gray-600 flex items-center gap-1 bg-[#1f211f] px-2 py-1 rounded border border-gray-800 cursor-help"
                        title="This card has no FUTBIN URL, so the builder link can't be addressed. Add one with Switch → the card's edit button → Futbin URL."
                      >
                        No FUTBIN URL <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                )}
                </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};
