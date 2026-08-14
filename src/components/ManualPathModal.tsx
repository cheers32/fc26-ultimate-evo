import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, Plus, Trash2, AlertTriangle, Eye, Wand2, ThumbsUp, ChevronDown } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { EvoDetailsModal } from './EvoDetailsModal';
import { StatsGrid } from './StatsGrid';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData, EvoFilters, StatFilter } from '../types/player';
import { simulateEvoChain, validateRequirement, isPlayStyleNodeId, parsePlayStyleNodeId, getPositionScore } from '../utils/evoEngine';
import { runEvoSearch, EvoSearchHandle } from '../utils/runEvoSearch';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import {
  getStatColorClass,
  formatEvoTerms,
  displayExcludedPositions,
  AccelerateType,
  AccelerateFamily,
  ACCELERATE_TYPES,
  ACCELERATE_SHORT,
  ACCELERATE_FAMILY
} from '../utils/statUtils';
import { FitBreakdown, controlModeFor, fitScore, accelerateOf, accelerateSpread } from '../utils/fitScore';
import { useModal } from '../utils/modalStack';

// How many evos may carry the thumbs-up at once. Every evo that trips any heuristic used to be
// badged, which on a full pool marked most of the list and made the mark meaningless — so
// candidates are scored and only the strongest couple are flagged. Why each one earned it is in
// the badge's tooltip rather than on the card, which the reasons crowded out.
const MAX_RECOMMENDATIONS = 2;

// How deep past the current chain the continuation search looks. The full Analyze runs at 5 and
// takes tens of seconds; the builder re-runs this after every pick, so it stays shallow enough to
// land while the user is still reading the pool.
const REC_CHAIN_DEPTH = 3;
const MAX_CHAIN_RECOMMENDATIONS = 2;

// Pool orderings. Every one of them keeps addable evos above ineligible ones — an ineligible card
// has no simulated result at all (target OVR / IGS / BS are 0), so sorting it in with the rest
// would park the whole unusable half of the pool at the top of any ascending sort.
// The six face stats double as sort modes: "which evo adds the most DRI" is a question the totals
// can't answer, since a big IGS gain can be spread over stats this card has no use for.
const STAT_SORTS = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;
type StatSort = typeof STAT_SORTS[number];
const isStatSort = (mode: SortMode): mode is StatSort => (STAT_SORTS as readonly string[]).includes(mode);

type SortMode = 'default' | 'rec' | 'reqOvr' | 'targetOvr' | 'igs' | 'base' | 'fit' | StatSort;

const SORT_OPTIONS: { mode: SortMode; label: string; title: string }[] = [
  { mode: 'default', label: 'Default', title: 'Cheapest entry first: required OVR, then target OVR, then base stats' },
  {
    mode: 'rec',
    label: 'Rec ↓',
    title: 'The thumbs-up ranking over the whole pool: position-weighted stat gain, PS+ gained, ' +
      'OVR spent, and your Filters targets. Picks that would break a Filters max sink to the bottom.'
  },
  { mode: 'reqOvr', label: 'Req OVR ↑', title: 'Lowest required OVR first — the evos about to age out of reach' },
  { mode: 'targetOvr', label: 'Target OVR ↑', title: 'Lowest resulting OVR first — keeps headroom for later evos' },
  { mode: 'igs', label: 'IGS ↓', title: 'Biggest resulting in-game stats total first' },
  { mode: 'base', label: 'BS ↓', title: 'Biggest resulting base (face) stats total first' },
  {
    mode: 'fit',
    label: 'Fit ↓',
    title: 'Highest resulting Fit first — the card\'s own PlayStyle and body profile, not raw ' +
      'totals. Picking this turns the Fit calculation on even when Filters has PlayStyle ' +
      'weighting off, so the number you are sorting by is the one shown on each card.'
  },
  ...STAT_SORTS.map(stat => ({
    mode: stat as SortMode,
    label: `${stat.toUpperCase()} ↓`,
    title: `Biggest ${stat.toUpperCase()} gain first — what this evo adds to the stat as it stands now`
  }))
];

/**
 * Scores one candidate evo by what it does for the positions this player actually plays, using
 * the same weights the path search ranks by (`getPositionScore`) so the builder and Analyze agree
 * on what "better" means. A flat stat total used to drive this, which happily handed a CDM the
 * +20 SHO evo over the one that added DEF.
 */
const getEvoRecommendation = ({
  evoId,
  positions,
  currentOvr,
  expectedOvr,
  currentStats,
  expectedStats,
  currentPlayStyles,
  expectedPlayStyles,
  filters,
  fitDelta
}: {
  evoId: string;
  positions: string;
  currentOvr: number;
  expectedOvr: number;
  currentStats: StatsData;
  expectedStats: StatsData;
  currentPlayStyles: PlayStylesData;
  expectedPlayStyles: PlayStylesData;
  filters?: EvoFilters;
  /**
   * Fit gained by taking this evo, when the player's profile is switched on. It already accounts
   * for PlayStyles, sub-stats and body type, so it replaces the generic position gain rather than
   * adding to it — otherwise the same improvement would be counted twice.
   */
  fitDelta?: number;
}): { score: number, reasons: string[], blocked: boolean } => {
  if (!currentStats || !expectedStats) return { score: 0, reasons: [], blocked: false };

  const posList = positions.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const ratedPositions = posList.length > 0 ? posList : [''];

  // The listed primary position is what the card is judged on; a secondary one still counts,
  // at half weight, so a CM/CDM isn't scored as if either half of the card were the whole thing.
  const weightOf = (idx: number) => (idx === 0 ? 1 : 0.5);
  const totalWeight = ratedPositions.reduce((sum, _, idx) => sum + weightOf(idx), 0);
  const positionGain = ratedPositions.reduce(
    (sum, pos, idx) =>
      sum + (getPositionScore(expectedStats, pos) - getPositionScore(currentStats, pos)) * weightOf(idx),
    0
  ) / totalWeight;

  const ovrDiff = expectedOvr - currentOvr;

  const beforeGold = new Set([...currentPlayStyles.base.gold, ...currentPlayStyles.ev.gold]);
  const afterGold = new Set([...expectedPlayStyles.base.gold, ...expectedPlayStyles.ev.gold]);
  const newGoldCount = [...afterGold].filter(x => !beforeGold.has(x)).length;

  const reasons: string[] = [];

  // With the profile on, fit is the whole judgement of what the card became — PlayStyles,
  // sub-stats and AcceleRATE included. Without it, fall back to the position-weighted face-stat
  // gain plus a flat bonus per PlayStyle+.
  const usingFit = fitDelta !== undefined;
  const gain = usingFit ? fitDelta : positionGain;
  let score = gain * 6;

  if (newGoldCount > 0) {
    reasons.push(newGoldCount > 1 ? `Adds ${newGoldCount} PS+` : `Adds PS+`);
    if (!usingFit) score += newGoldCount * 15;
  }

  if (gain > 0) {
    reasons.push(usingFit ? `+${gain.toFixed(1)} fit` : `+${gain.toFixed(1)} ${posList[0] || 'rating'}`);
  }

  // OVR is the scarce resource in a chain — every point spent burns headroom on the max-OVR
  // gates of the evos that could still follow, so a boost that costs none is worth a premium.
  if (ovrDiff === 0 && (gain > 0 || newGoldCount > 0)) {
    reasons.push('Free Boost (+0 OVR)');
    score += 20;
  } else {
    score -= ovrDiff * 5;
  }

  // Name the stats behind the gain: the numbers are already on the card, but not which ones
  // earned the thumbs-up for this position.
  const topStats = (['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const)
    .map(key => ({ key, diff: expectedStats[key].baseFace - currentStats[key].baseFace }))
    .filter(s => s.diff > 0)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3)
    .map(s => `+${s.diff} ${s.key.toUpperCase()}`);
  reasons.push(...topStats);

  // What the Filters panel asks for outranks any generic notion of "good". Stats only ever go
  // up, so blowing past a max is terminal for the build the user asked for — that pick is never
  // recommended, however well it scores — while closing the gap on a min is the whole job.
  let blocked = false;
  if (filters) {
    if (filters.blockedEvos?.includes(evoId)) blocked = true;

    // Asked to leave the card's rarity/positions alone: an evo that changes them is still
    // addable by hand, but it is never what the app suggests doing next.
    const evo = availableEvolutions[evoId];
    if (filters.noRarityChange && evo?.rarityChange) {
      blocked = true;
      reasons.push(`Changes rarity to ${evo.rarityChange}`);
    }
    if (filters.noPositionChange && evo?.positionsAdded && evo.positionsAdded.length > 0) {
      blocked = true;
      reasons.push(`Adds ${evo.positionsAdded.join(', ')}`);
    }

    const goldCount = (ps: PlayStylesData) => Math.min(ps.base.gold.length + ps.ev.gold.length, ps.limits.gold);
    const silverCount = (ps: PlayStylesData) => Math.min(ps.base.silver.length + ps.ev.silver.length, ps.limits.silver);

    const targets: { label: string; filter?: StatFilter; before: number; after: number }[] = [
      { label: 'OVR', filter: filters.ovr, before: currentOvr, after: expectedOvr },
      ...(['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const).map(key => ({
        label: key.toUpperCase(),
        filter: filters[key],
        before: currentStats[key].baseFace,
        after: expectedStats[key].baseFace
      })),
      { label: 'PS+', filter: filters.psPlus, before: goldCount(currentPlayStyles), after: goldCount(expectedPlayStyles) },
      { label: 'PS', filter: filters.ps, before: silverCount(currentPlayStyles), after: silverCount(expectedPlayStyles) }
    ];

    for (const { label, filter, before, after } of targets) {
      if (!filter) continue;

      if (filter.max !== undefined && after > filter.max) {
        blocked = true;
        reasons.push(`${label} ${after} would break the ${label} ≤ ${filter.max} filter`);
        continue;
      }

      if (filter.min !== undefined && before < filter.min) {
        const progress = Math.min(after, filter.min) - before;
        if (progress > 0) {
          score += progress * 8;
          reasons.push(
            after >= filter.min
              ? `Meets ${label} ≥ ${filter.min}`
              : `+${progress} toward ${label} ≥ ${filter.min}`
          );
        }
      }
    }

    // A must-have is not a preference — the build is not finished without it, so it leads the
    // recommendations for as long as it stays addable.
    if (filters.requiredEvos?.includes(evoId)) {
      reasons.unshift('Must-have from your pool');
      score += 200;
    }
  }

  return { score, reasons, blocked };
}

const StatDisplay = ({ label, after, before }: { label: string, after: number, before?: number }) => {
  const diff = before !== undefined ? after - before : 0;
  if (diff <= 0) return null;
  
  return (
    <div className="flex gap-1.5 items-center bg-[#1f211f] px-1.5 py-0.5 rounded border border-gray-800">
      <span className="text-gray-500 font-bold">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-400">+{diff}</span>
        <span className={getStatColorClass(after)}>{after}</span>
      </div>
    </div>
  );
};

/**
 * The AcceleRATE the card ends up with. It reads as a plain chip while the archetype is unchanged
 * and calls attention to itself the moment an evo moves it, because that is the only time it is
 * news: AcceleRATE flips on sub-stat thresholds and height, none of which the card shows, so a
 * pick that quietly turns an Explosive card Controlled otherwise looks like a pure gain.
 */
const AccelerateBadge = ({
  after,
  before,
  size = 'md'
}: {
  after: AccelerateType;
  before?: AccelerateType;
  size?: 'sm' | 'md';
}) => {
  const changed = before !== undefined && before !== after;
  return (
    <div
      title={
        changed
          ? `AcceleRATE: ${before} → ${after}\nIn game: ${ACCELERATE_FAMILY[before!]} → ${ACCELERATE_FAMILY[after]}`
          : `AcceleRATE: ${after}\nIn game: ${ACCELERATE_FAMILY[after]}`
      }
      className={`flex gap-1 items-center rounded border whitespace-nowrap ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      } ${
        // Amber rather than green: a flipped archetype is a "look at this", not a gain — losing
        // Explosive is a change too, and the green everything else on the card uses would read it
        // as an improvement.
        changed
          ? 'bg-amber-950/40 border-amber-700/60'
          : 'bg-gray-800/80 border-gray-600'
      }`}
    >
      <span className={changed ? 'text-amber-300 font-bold' : 'text-white font-bold'}>RATE</span>
      <span className={changed ? 'text-amber-200 font-bold' : 'text-gray-300 font-bold'}>
        {changed && <span className="opacity-60 mr-0.5">{ACCELERATE_SHORT[before!]} →</span>}
        {ACCELERATE_SHORT[after]}
      </span>
    </div>
  );
};

/**
 * What the chem styles would do to the archetype: `3L/5C/2E` is three styles that leave the card
 * Lengthy, five Controlled, two Explosive. A card one point from a threshold reads the same on the
 * RATE chip as one nowhere near it, and this is where the difference shows — an evo that hands you
 * the archetype you want on every style is worth more than one where a single style reaches it.
 */
const AccelerateSpreadBadge = ({ spread }: { spread: Record<AccelerateFamily, number> }) => (
  <div
    title={`With a chemistry style applied: ${spread.Lengthy} Lengthy · ${spread.Controlled} Controlled · ${spread.Explosive} Explosive (of ${spread.Lengthy + spread.Controlled + spread.Explosive} styles, Basic included)`}
    className="flex gap-1 items-center bg-gray-800/80 px-2 py-0.5 rounded border border-gray-600 text-[10px] font-mono font-bold whitespace-nowrap"
  >
    <span className={spread.Lengthy > 0 ? 'text-sky-300' : 'text-gray-600'}>{spread.Lengthy}L</span>
    <span className="text-gray-600">/</span>
    <span className={spread.Controlled > 0 ? 'text-gray-200' : 'text-gray-600'}>{spread.Controlled}C</span>
    <span className="text-gray-600">/</span>
    <span className={spread.Explosive > 0 ? 'text-orange-300' : 'text-gray-600'}>{spread.Explosive}E</span>
  </div>
);

const PlayStyleDiffDisplay = ({ before, after }: { before?: PlayStylesData, after: PlayStylesData }) => {
  if (!before) return null;
  const beforeGold = new Set([...before.base.gold, ...before.ev.gold]);
  const afterGold = new Set([...after.base.gold, ...after.ev.gold]);
  const beforeSilver = new Set([...before.base.silver, ...before.ev.silver]);
  const afterSilver = new Set([...after.base.silver, ...after.ev.silver]);
  
  const newGold = [...afterGold].filter(x => !beforeGold.has(x));
  const newSilver = [...afterSilver].filter(x => !beforeSilver.has(x));
  
  if (newGold.length === 0 && newSilver.length === 0) return null;
  
  return (
    <div className="flex gap-1 flex-wrap mt-1.5 items-center">
      {newGold.map(ps => (
        <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`+ ${ps}`} className="w-8 h-8 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
      ))}
      {newSilver.map(ps => (
        <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={`+ ${ps}`} className="w-6 h-6 opacity-80" />
      ))}
    </div>
  );
};

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
  // Steps locked in by the chosen base. New paths start seeded with these and can't drop them.
  lockedPrefix?: string[];
  // The pool's must-haves and the stat targets from Filters. The builder never blocks a pick on
  // them — it's a manual builder — but every recommendation is aimed at them.
  evoFilters?: EvoFilters;
  disabledEvos?: string[];
  includedEvos?: string[];
  onToggleDisabled?: (evoId: string) => void;
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
  editingPath = null,
  lockedPrefix = [],
  evoFilters,
  disabledEvos = [],
  includedEvos,
  onToggleDisabled
}) => {
  const [selectedChain, setSelectedChain] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotIncluded, setShowNotIncluded] = useState<boolean>(false);

  /**
   * Which evos may be *recommended*, as distinct from merely listed.
   *
   * The grid is handed every evolution on purpose, so "Show Not Included" can surface one the team
   * keeps out of its pool and let the user add it by hand. Recommendations must not work off that
   * same list: an evo the user has left out of the pool, or disabled outright, should never be
   * suggested — and both surfaces here were suggesting them, invisibly, because the grid hid them
   * afterwards while the ranking had already counted them.
   */
  const recommendationPool = useMemo(
    () => evosPool.filter(id => (!includedEvos || includedEvos.includes(id)) && !disabledEvos.includes(id)),
    [evosPool, includedEvos, disabledEvos]
  );
  const canRecommend = useMemo(() => new Set(recommendationPool), [recommendationPool]);
  const [filterNewRarity, setFilterNewRarity] = useState(false);
  const [filterNewPosition, setFilterNewPosition] = useState(false);
  // The inverse of the two above. Each pair is a three-way choice, so turning one on clears its
  // opposite instead of leaving a combination that matches nothing.
  const [filterNoRarity, setFilterNoRarity] = useState(false);
  const [filterNoPosition, setFilterNoPosition] = useState(false);
  // Position match is a shade of grey the eligibility check can't express: an evo that names the
  // card's *primary* position is a different proposition from one that only matches a secondary
  // one, and both are "eligible".
  const [filterFitPosition, setFilterFitPosition] = useState(false);
  // Narrows the pool to the evos that leave the card on one chosen AcceleRATE archetype — the
  // question "which of these keeps me Explosive" can't be answered from the face stats on the
  // cards, since the archetype turns on acceleration/agility/strength and height.
  const [filterAccelerate, setFilterAccelerate] = useState<AccelerateType | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [localViewingEvo, setLocalViewingEvo] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  /**
   * The two steps the stat panel is comparing, as indices in the chain — -1 is the base card, and
   * both the same means nothing is being compared, so it shows the card as it stands. Clicking a
   * step pushes it in and drops the older of the two, which is how the workbench's chain reads
   * too: click one node, then another, and the panel spans them.
   */
  const [comparedNodes, setComparedNodes] = useState<[number, number]>([-1, -1]);
  /** The card the cursor is over, whose result the stat panel previews. */
  const [hoveredEvoId, setHoveredEvoId] = useState<string | null>(null);
  const compareNode = (idx: number) => setComparedNodes(([, previous]) => [previous, idx]);

  // 'a' is what opens the builder, so inside it the same key returns to the search box.
  useModal(isOpen, { onClose, focusRef: searchInputRef, focusKey: 'a' });

  // Populate the builder with the path being edited (or reset for a fresh path) whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    setSelectedChain(editingPath ? [...editingPath.chainIds] : [...lockedPrefix]);
    setSearchQuery('');
    setComparedNodes([-1, -1]);
  }, [isOpen, editingPath, lockedPrefix]);

  // Live simulation to check if the current chain is valid
  const validationResult = useMemo(() => {
    const res = simulateEvoChain(selectedChain, baseBio, baseOvr, baseStats, basePlayStyles);
    return { isValid: res.isValidChain, result: res };
  }, [selectedChain, baseBio, baseOvr, baseStats, basePlayStyles]);

  // A few evos deep, the best pick stops being visible one card at a time — what matters is where
  // the chain can still end up. So the same search Analyze uses runs from the current chain as its
  // prefix, shallow enough to land in a second or two, and offers the best continuations whole.
  const [chainRecs, setChainRecs] = useState<EvolutionPath[]>([]);
  const [isSearchingChains, setIsSearchingChains] = useState(false);
  // Set once a search has actually returned, so "nothing matches your filters" is only ever said
  // about a search that finished rather than one still running or one that errored.
  const [chainSearchSettled, setChainSearchSettled] = useState(false);
  const chainSearchHandle = useRef<EvoSearchHandle | null>(null);
  const chainKey = selectedChain.join('|');

  useEffect(() => {
    chainSearchHandle.current?.cancel();
    chainSearchHandle.current = null;

    if (!isOpen) {
      setChainRecs([]);
      setIsSearchingChains(false);
      setChainSearchSettled(false);
      return;
    }

    setChainRecs([]);
    setChainSearchSettled(false);
    setIsSearchingChains(true);

    const handle = runEvoSearch({
      poolIds: recommendationPool,
      maxDepth: REC_CHAIN_DEPTH,
      bio: baseBio,
      ovr: baseOvr,
      stats: baseStats,
      playStyles: basePlayStyles,
      // Same filters Analyze runs under, so a continuation the builder offers is one the user's
      // own must-haves and stat targets would accept. A must-have that can't be reached within
      // REC_CHAIN_DEPTH steps simply leaves the search with nothing to offer, which is the
      // honest answer rather than a suggestion that ignores it.
      filters: evoFilters,
      prefixChainIds: selectedChain
    });
    chainSearchHandle.current = handle;

    handle.promise
      .then(paths => {
        if (chainSearchHandle.current !== handle) return; // superseded by a newer chain
        chainSearchHandle.current = null;
        setIsSearchingChains(false);
        // analyzeEvolutions returns the Max-IGS picks first, then one per primary position.
        // The position-ranked ones are what this builder wants; IGS is the fallback when a
        // player's position has no weights of its own.
        const positioned = paths.filter(p => !p.name.startsWith('Max IGS'));
        const ranked = positioned.length > 0 ? positioned : paths;
        setChainRecs(
          ranked
            .filter(p => p.chainIds.length > selectedChain.length)
            .slice(0, MAX_CHAIN_RECOMMENDATIONS)
        );
        setChainSearchSettled(true);
      })
      .catch(err => {
        if (err?.name === 'AbortError') return; // a newer search already took over
        if (chainSearchHandle.current !== handle) return;
        chainSearchHandle.current = null;
        setIsSearchingChains(false);
        console.error('Chain recommendation search failed:', err);
      });

    return () => handle.cancel();
    // selectedChain is compared by its joined key so a re-render with an equal array can't
    // restart a search that is already running for it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, chainKey, recommendationPool, baseBio, baseOvr, baseStats, basePlayStyles, evoFilters]);

  if (!isOpen) return null;

  // Picking an evo appends it to the base and hands straight back to the player screen —
  // the chain is inspected and edited there, not in here.
  const handleAdd = (id: string) => applyChain([...selectedChain, id]);

  const applyChain = (chain: string[]) => {
    const result = simulateEvoChain(chain, baseBio, baseOvr, baseStats, basePlayStyles);
    const igs = Object.values(result.finalStats).reduce(
      (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
      0
    );
    onSave({
      id: editingPath ? editingPath.id : `manual-path-${Date.now()}`,
      // Appending keeps the path's own name (notably "Default"); a new branch gets an auto one.
      name: editingPath ? editingPath.name : `Custom ${result.finalOvr}/${chain.length}/${igs}`,
      description: editingPath ? editingPath.description : 'User created manual evolution path.',
      isRecommended: editingPath?.isRecommended ?? false,
      chainIds: chain,
      steps: result.steps
    });
  };

  const currentOvr = validationResult.result ? validationResult.result.finalOvr : baseOvr.base;
  const currentStats = validationResult.result ? validationResult.result.finalStats : baseStats;
  const currentPlayStyles = validationResult.result ? validationResult.result.finalPlayStyles : basePlayStyles;
  const currentBio = validationResult.result ? validationResult.result.finalBio : baseBio;

  // The player's own profile, when they've switched it on in Filters. Everything downstream is
  // opt-in on this: with it off the builder behaves exactly as it did before.
  //
  // Sorting by Fit counts as switching it on. Otherwise picking that sort would rank every evo by
  // a score nothing had computed — a list in its default order, silently.
  const useFit = evoFilters?.playstyleWeighting === true || sortMode === 'fit';
  const fitMode = controlModeFor(currentBio, evoFilters?.controlMode);
  const currentFit = useFit
    ? fitScore({ stats: currentStats, playStyles: currentPlayStyles, bio: currentBio, mode: fitMode })
    : null;

  // Unlike Fit, AcceleRATE isn't opt-in: it's a fact about the resulting card rather than a
  // judgement of it, so every card shows it whether or not the profile is switched on.
  const currentAccelerate = accelerateOf(currentStats, currentBio);

  /**
   * The card as it stood after a given step, and what the step is called. Indices are clamped
   * because a step can be removed while it is one of the two being compared.
   */
  const lastNode = selectedChain.length - 1;
  const nodeAt = (idx: number) => Math.max(-1, Math.min(idx, lastNode));
  const statsAt = (idx: number) =>
    idx < 0 ? baseStats : validationResult.result?.steps[idx]?.statsAfter ?? currentStats;
  const nodeName = (idx: number) => {
    if (idx < 0) return 'Base Card';
    const id = selectedChain[idx];
    if (id === undefined) return 'Base Card';
    return isPlayStyleNodeId(id) ? 'PlayStyle Pick' : availableEvolutions[id]?.name ?? id;
  };

  const [comparedFrom, comparedTo] = [nodeAt(comparedNodes[0]), nodeAt(comparedNodes[1])].sort((a, b) => a - b);
  const isComparing = comparedFrom !== comparedTo;

  const poolWithStatus = evosPool.map((id) => {
    const evo = availableEvolutions[id];
    const count = selectedChain.filter(eid => eid === id).length;
    const maxAllowed = evo?.maxRepeatable || 1;
    const limitReached = count >= maxAllowed;

    let isEligible = false;
    let reasons: string[] = [];
    let warnings: string[] = [];
    let expectedOvr = 0;
    let expectedIgs = 0;
    let expectedStats = null;
    let expectedPlayStyles = null;
    let recScore = 0;
    let recReasons: string[] = [];
    let recBlocked = false;
    let expectedFit: FitBreakdown | null = null;
    let expectedAccelerate: AccelerateType | null = null;
    let expectedSpread: Record<AccelerateFamily, number> | null = null;

    if (evo && !limitReached) {
      const validation = validateRequirement(evo, currentOvr, currentStats, currentPlayStyles, currentBio);
      isEligible = validation.eligible;
      reasons = validation.reasons;
      warnings = validation.warnings;

      if (isEligible) {
        const testRes = simulateEvoChain([...selectedChain, id], baseBio, baseOvr, baseStats, basePlayStyles);
        if (testRes.isValidChain) {
          expectedOvr = testRes.finalOvr;
          expectedStats = testRes.finalStats;
          expectedPlayStyles = testRes.finalPlayStyles;
          expectedIgs = Object.values(testRes.finalStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
          expectedAccelerate = accelerateOf(testRes.finalStats, testRes.finalBio);
          expectedSpread = accelerateSpread(testRes.finalStats, testRes.finalBio);

          if (currentFit) {
            expectedFit = fitScore({
              stats: testRes.finalStats,
              playStyles: testRes.finalPlayStyles,
              bio: testRes.finalBio,
              mode: fitMode
            });
          }

          const rec = getEvoRecommendation({
            evoId: id,
            positions: currentBio.primaryPositions,
            currentOvr,
            expectedOvr,
            currentStats,
            expectedStats,
            currentPlayStyles,
            expectedPlayStyles,
            filters: evoFilters,
            fitDelta: currentFit && expectedFit ? expectedFit.total - currentFit.total : undefined
          });
          // A warned pick is legal and can still be the right call, but it shouldn't collect a
          // thumbs-up unless it beats the clean options by a real margin rather than a hair.
          recScore = rec.score - warnings.length * 30;
          recReasons = rec.reasons;
          recBlocked = rec.blocked;
        }
      }
    }

    const expectedFaceStats = expectedStats ? Object.values(expectedStats).reduce((acc, f) => acc + f.baseFace, 0) : 0;

    // 2 = names the card's primary position, 1 = names a secondary one (or names none at all,
    // so it fits anybody), 0 = names positions this card doesn't have.
    let posMatchScore = 0;
    const evoPositions = evo?.requirements?.positions;
    if (evoPositions && evoPositions.length > 0) {
      const playerPositions = currentBio.primaryPositions.split(',').map(x => x.trim());
      if (evoPositions.includes(playerPositions[0])) {
        posMatchScore = 2;
      } else if (playerPositions.some(x => evoPositions.includes(x))) {
        posMatchScore = 1;
      }
    } else if (evo) {
      posMatchScore = 1;
    }

    return {
      id,
      evo,
      limitReached,
      isEligible,
      reasons,
      warnings,
      expectedOvr,
      expectedIgs,
      expectedFaceStats,
      expectedStats,
      expectedPlayStyles,
      recScore,
      recReasons,
      recBlocked,
      expectedFit,
      expectedAccelerate,
      expectedSpread,
      posMatchScore
    };
  });

  /**
   * What the stat panel is showing.
   *
   * Hovering a card in the pool answers the question you hovered it to ask — what this evo would do
   * to the card — by pointing the panel at the state that picking it would produce. Every card has
   * already worked that state out for its own summary, so this is only choosing which one to read.
   *
   * Hover wins over a pinned comparison because it is the transient thing: let go and the pinned
   * one is still there. A card that can't be picked has no such state, and the panel doesn't move.
   */
  const hoveredExpected =
    (hoveredEvoId ? poolWithStatus.find(p => p.id === hoveredEvoId)?.expectedStats : null) || null;

  // Not comparing anything is the card as it stands, on both sides, which is what leaves the panel
  // showing plain values with no arrows.
  const panelFrom = hoveredExpected ? currentStats : isComparing ? statsAt(comparedFrom) : currentStats;
  const panelTo = hoveredExpected || (isComparing ? statsAt(comparedTo) : currentStats);

  // What the recommendations are currently aiming at, spelled out next to them — otherwise a
  // shortlist narrowed by a filter set in another modal just looks arbitrary.
  const missingRequired = (evoFilters?.requiredEvos || []).filter(reqId => !selectedChain.includes(reqId));
  const filterTargets: string[] = [
    ...missingRequired.map(reqId => `must have ${availableEvolutions[reqId]?.name || reqId}`),
    ...([
      ['OVR', evoFilters?.ovr],
      ['PAC', evoFilters?.pac],
      ['SHO', evoFilters?.sho],
      ['PAS', evoFilters?.pas],
      ['DRI', evoFilters?.dri],
      ['DEF', evoFilters?.def],
      ['PHY', evoFilters?.phy],
      ['PS+', evoFilters?.psPlus],
      ['PS', evoFilters?.ps]
    ] as const).flatMap(([label, filter]) => {
      const parts: string[] = [];
      if (filter?.min !== undefined) parts.push(`${label} ≥ ${filter.min}`);
      // 99 is the app's default OVR ceiling rather than something the user asked for.
      if (filter?.max !== undefined && !(label === 'OVR' && filter.max >= 99)) parts.push(`${label} ≤ ${filter.max}`);
      return parts;
    })
  ];



  // Rank the candidates that qualified and badge only the strongest few, so RECOMMENDED
  // stays a shortlist rather than a label on most of the pool.
  const recommendedRank = new Map<string, number>();
  poolWithStatus
    .filter(p => canRecommend.has(p.id) && p.isEligible && !p.limitReached && !p.recBlocked && p.recReasons.length > 0)
    .sort((a, b) => b.recScore - a.recScore || b.expectedIgs - a.expectedIgs)
    .slice(0, MAX_CHAIN_RECOMMENDATIONS)
    .forEach((p, idx) => recommendedRank.set(p.id, idx + 1));

  // Sort: Eligible first, then ineligible, then limit reached — in every mode, since only an
  // addable evo has a simulated target to sort on. The chosen mode orders within a status group.
  poolWithStatus.sort((a, b) => {
    if (a.limitReached && !b.limitReached) return 1;
    if (!a.limitReached && b.limitReached) return -1;
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;

    // While Fit Position is on it is the point of the list, so it outranks the chosen sort.
    if (filterFitPosition && a.posMatchScore !== b.posMatchScore) return b.posMatchScore - a.posMatchScore;

    const aMaxOvr = a.evo.requirements.maxOvr || 99;
    const bMaxOvr = b.evo.requirements.maxOvr || 99;

    // Sorting on one face stat ranks by the gain the card is already showing (+9 DRI), not by the
    // resulting value — an evo that takes a 90 to 92 beats one that takes an 80 to 85 on totals,
    // but not on what you came here to add.
    if (isStatSort(sortMode)) {
      const gain = (p: typeof a) =>
        p.expectedStats ? p.expectedStats[sortMode].baseFace - currentStats[sortMode].baseFace : 0;
      const byGain = gain(b) - gain(a);
      if (byGain !== 0) return byGain;
    }

    switch (sortMode) {
      case 'rec':
        // A pick that would break a Filters max is still addable by hand, but it can't be near
        // the top of a list that answers "what should I take next".
        if (a.recBlocked !== b.recBlocked) return a.recBlocked ? 1 : -1;
        if (a.recScore !== b.recScore) return b.recScore - a.recScore;
        break;
      case 'reqOvr':
        if (aMaxOvr !== bMaxOvr) return aMaxOvr - bMaxOvr;
        break;
      case 'targetOvr':
        if (a.expectedOvr !== b.expectedOvr) return a.expectedOvr - b.expectedOvr;
        break;
      case 'igs':
        if (a.expectedIgs !== b.expectedIgs) return b.expectedIgs - a.expectedIgs;
        break;
      case 'base':
        if (a.expectedFaceStats !== b.expectedFaceStats) return b.expectedFaceStats - a.expectedFaceStats;
        break;
      case 'fit': {
        // An evo with no simulated result has no Fit either; those are already sorted below the
        // addable ones, so treating a missing score as 0 only orders them among themselves.
        const aFit = a.expectedFit?.total ?? 0;
        const bFit = b.expectedFit?.total ?? 0;
        if (aFit !== bFit) return bFit - aFit;
        break;
      }
      default:
        break;
    }

    // Default order, and the tiebreak every other mode falls back on: cheapest to enter first,
    // then the one that spends the least OVR, then the one that ends up with more base stats.
    if (aMaxOvr !== bMaxOvr) return aMaxOvr - bMaxOvr;
    if (a.expectedOvr !== b.expectedOvr) return a.expectedOvr - b.expectedOvr;
    return b.expectedFaceStats - a.expectedFaceStats;
  });

  // One predicate for the grid and for Enter-to-add both, so the evo Enter picks is always the
  // first one in the list the user is actually looking at.
  const matchesFilters = ({ id, evo, posMatchScore, expectedAccelerate }: typeof poolWithStatus[number]) => {
    if (!evo) return false;
    // Off, the grid is exactly the team's pool. On, it also shows what the pool leaves out, so an
    // evo can still be picked by hand.
    if (!showNotIncluded && !canRecommend.has(id)) return false;
    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterNewRarity && !evo.rarityChange) return false;
    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
    if (filterNoRarity && evo.rarityChange) return false;
    if (filterNoPosition && evo.positionsAdded && evo.positionsAdded.length > 0) return false;
    if (filterFitPosition && posMatchScore === 0) return false;
    // Only an addable evo has a resulting archetype at all: an ineligible or maxed-out card was
    // never simulated, so asking for one archetype drops it from the list rather than listing it
    // under a heading it can't answer to.
    if (filterAccelerate !== 'all' && expectedAccelerate !== filterAccelerate) return false;
    return true;
  };

  const visiblePool = poolWithStatus.filter(matchesFilters);

  const currentFaceStats = Object.values(currentStats).reduce((acc, f) => acc + f.baseFace, 0);
  const currentIgs = Object.values(currentStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
  const currentPsPlusCount = currentPlayStyles.base.gold.length + currentPlayStyles.ev.gold.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-4" onClick={onClose}>
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-[98vw] lg:max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] max-h-[98vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#1A1C1A] relative">
          <button onClick={onClose} className="absolute top-3 right-3 p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800 transition-colors z-30">
            <X className="w-5 h-5" />
          </button>

          {/* Top Side: Current Path */}
          {validationResult.result && (
            <div className="flex flex-col gap-2 p-3 pr-10 border-b border-gray-800 bg-[#121212] shrink-0 pt-8 md:pt-3">
              {/* Wraps rather than scrolling sideways, same as the chain on the workbench: the end
                  of a long build was hidden behind a swipe the browser reads as a back gesture. */}
              <div className="flex flex-wrap pt-2 pl-2 pb-2 items-center gap-x-1.5 gap-y-2">
                
                {/* Base Card Chip */}
                <div
                  onClick={() => compareNode(-1)}
                  title="Compare from here"
                  className={`bg-[#1f211f] text-gray-200 border p-1.5 rounded font-bold flex flex-col shadow gap-1 shrink-0 cursor-pointer transition-all ${
                    isComparing && (comparedFrom === -1 || comparedTo === -1)
                      ? 'border-[#EBB626] ring-1 ring-[#EBB626]'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                      {baseOvr.base}/{basePlayStyles.base.gold.length + (basePlayStyles.ev?.gold?.length || 0)}
                    </span>
                    <span className="text-[10.5px]">Base Card</span>
                  </div>
                  <div className="flex gap-2 items-center px-1 mb-0.5">
                    <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                      <span className="text-white font-bold">BS</span>
                      <span className="text-blue-400 font-bold">{Object.values(baseStats).reduce((acc, f) => acc + f.baseFace, 0)}</span>
                    </div>
                    <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                      <span className="text-white font-bold">IGS</span>
                      <span className="text-blue-400 font-bold">{Object.values(baseStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0)}</span>
                    </div>
                    <AccelerateBadge after={accelerateOf(baseStats, baseBio)} size="sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-0.5">
                    {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                      const val = baseStats[statKey as keyof StatsData].baseFace;
                      return (
                        <div key={statKey} className="flex gap-0.5 items-center bg-black/40 px-1 py-0.5 rounded text-[8.5px] shadow-inner border border-gray-800/50">
                          <span className="text-gray-400 uppercase">{statKey}</span>
                          <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const gold = [...basePlayStyles.base.gold, ...(basePlayStyles.ev?.gold || [])];
                    const silver = [...basePlayStyles.base.silver, ...(basePlayStyles.ev?.silver || [])];
                    if (gold.length === 0 && silver.length === 0) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1 mt-0.5 border-t border-gray-700/50 pt-1">
                        {gold.map(ps => (
                          <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (PS+)`} className="w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
                        ))}
                        {silver.map(ps => (
                          <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
                        ))}
                      </div>
                    );
                  })()}
                </div>
                {selectedChain.length > 0 && (
                  <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                )}

                {selectedChain.map((id, idx) => {
                  // PlayStyle picks are steps too, but they're edited from the player panel —
                  // here they only need to show so the chain reads in the right order.
                  if (isPlayStyleNodeId(id)) {
                    const picks = parsePlayStyleNodeId(id);
                    const invalid = validationResult.result?.steps[idx]?.validation.eligible === false;
                    return (
                      <React.Fragment key={`${id}-${idx}`}>
                        <div
                          onClick={() => compareNode(idx)}
                          title={invalid ? validationResult.result!.steps[idx].validation.reasons.join(' · ') : 'PlayStyle Pick — click to compare from here'}
                          className={`shrink-0 flex items-center gap-1.5 p-1.5 rounded border font-bold text-[10.5px] bg-yellow-950/25 text-yellow-300 cursor-pointer transition-all ${
                            invalid
                              ? 'border-red-600 ring-1 ring-red-700/60'
                              : isComparing && (comparedFrom === idx || comparedTo === idx)
                              ? 'border-[#EBB626] ring-1 ring-[#EBB626]'
                              : 'border-yellow-800/70 hover:border-yellow-600'
                          }`}
                        >
                          <Wand2 className="w-3 h-3 shrink-0" />
                          PlayStyle Pick
                          {picks.gold.map(ps => (
                            <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (PS+)`} className="w-4 h-4" />
                          ))}
                          {picks.silver.map(ps => (
                            <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-3.5 h-3.5" />
                          ))}
                        </div>
                        {idx < selectedChain.length - 1 && (
                          <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                        )}
                      </React.Fragment>
                    );
                  }

                  const evo = availableEvolutions[id];
                  if (!evo) return null;
                  const stepResult = validationResult.result!.steps[idx];
                  if (!stepResult) return null;
                  
                  const afterPsPlus = stepResult.playStylesAfter.base.gold.length + stepResult.playStylesAfter.ev.gold.length;
                  
                  return (
                    <React.Fragment key={`${id}-${idx}`}>
                      <div
                        onClick={() => compareNode(idx)}
                        title={`${evo.name} — click to compare from here`}
                        className={`group/node relative bg-[#1f211f] text-gray-200 border p-1.5 rounded font-bold flex flex-col shadow gap-1 shrink-0 cursor-pointer transition-all ${
                          isComparing && (comparedFrom === idx || comparedTo === idx)
                            ? 'border-[#EBB626] ring-1 ring-[#EBB626]'
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                            {(() => {
                              const prevOvr = idx === 0 ? baseOvr.base : validationResult.result!.steps[idx - 1].ovrAfter;
                              const ovrDiff = stepResult.ovrAfter - prevOvr;
                              return ovrDiff > 0 ? <span className="text-fcGreen font-bold text-[10px] mr-0.5">+{ovrDiff}</span> : null;
                            })()}
                            {stepResult.ovrAfter}/{afterPsPlus}
                          </span>
                          <span className="text-[10.5px]">{evo.name}</span>
                          <span className="font-bold text-[9.5px] tracking-wide font-mono opacity-90">
                            {formatEvoTerms(evo)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setLocalViewingEvo(id); }}
                            className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto shrink-0"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                        {/* What this step asks for and turns the card into, same badges as the pool
                            below and the chain on the player panel. */}
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
                        <div className="flex gap-2 items-center px-1 mb-0.5">
                          {(() => {
                            const prevStats = idx === 0 ? baseStats : validationResult.result!.steps[idx - 1].statsAfter;
                            const prevFace = Object.values(prevStats).reduce((a, b) => a + b.baseFace, 0);
                            const curFace = Object.values(stepResult.statsAfter).reduce((a, b) => a + b.baseFace, 0);
                            const bsDiff = curFace - prevFace;

                            const prevIgs = Object.values(prevStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                            const curIgs = Object.values(stepResult.statsAfter).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                            const igsDiff = curIgs - prevIgs;

                            return (
                              <>
                                <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                                  <span className="text-white font-bold">BS</span>
                                  <div className="flex items-baseline gap-0.5">
                                    {bsDiff > 0 && <span className="text-fcGreen font-bold text-[7.5px]">+{bsDiff}</span>}
                                    <span className="text-blue-400 font-bold">{curFace}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1 items-center bg-gray-800/80 px-1.5 py-0.5 rounded border border-gray-600 text-[9px]">
                                  <span className="text-white font-bold">IGS</span>
                                  <div className="flex items-baseline gap-0.5">
                                    {igsDiff > 0 && <span className="text-fcGreen font-bold text-[7.5px]">+{igsDiff}</span>}
                                    <span className="text-blue-400 font-bold">{curIgs}</span>
                                  </div>
                                </div>
                                {/* Compared against the step before, so a chain shows exactly
                                    where the archetype flipped. */}
                                <AccelerateBadge
                                  size="sm"
                                  after={accelerateOf(stepResult.statsAfter, stepResult.bioAfter)}
                                  before={accelerateOf(
                                    prevStats,
                                    idx === 0 ? baseBio : validationResult.result!.steps[idx - 1].bioAfter
                                  )}
                                />
                              </>
                            );
                          })()}
                        </div>
                        <div className="grid grid-cols-3 gap-0.5">
                          {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                            const val = stepResult.statsAfter[statKey as keyof StatsData].baseFace;
                            const prevStats = idx === 0 ? baseStats : validationResult.result!.steps[idx - 1].statsAfter;
                            const prevVal = prevStats[statKey as keyof StatsData].baseFace;
                            const diff = val - prevVal;
                            
                            let diffColor = "text-gray-300";
                            if (diff >= 8) diffColor = "text-purple-400 font-bold";
                            else if (diff >= 4) diffColor = "text-fcGreen font-bold";
                            else if (diff >= 2) diffColor = "text-lime-400 font-semibold";

                            return (
                              <div key={statKey} className="flex gap-0.5 items-center bg-black/40 px-1 py-0.5 rounded text-[8.5px] shadow-inner border border-gray-800/50">
                                <span className="text-gray-400 uppercase">{statKey}</span>
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
                          const prevPlayStyles = idx === 0 ? basePlayStyles : validationResult.result!.steps[idx - 1].playStylesAfter;
                          
                          const beforeGold = [...prevPlayStyles.base.gold, ...(prevPlayStyles.ev?.gold || [])];
                          const beforeSilver = [...prevPlayStyles.base.silver, ...(prevPlayStyles.ev?.silver || [])];
                          
                          const afterGold = [...stepResult.playStylesAfter.base.gold, ...(stepResult.playStylesAfter.ev?.gold || [])];
                          const afterSilver = [...stepResult.playStylesAfter.base.silver, ...(stepResult.playStylesAfter.ev?.silver || [])];
                          
                          const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
                          const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
                          
                          if (afterGold.length === 0 && afterSilver.length === 0) return null;
                          
                          return (
                            <div className="flex flex-wrap items-center gap-1 mt-0.5 border-t border-gray-700/50 pt-1">
                              {afterGold.map(ps => {
                                const isNew = addedGold.includes(ps);
                                return (
                                  <img 
                                    key={`g-${ps}`} 
                                    src={getPlayStyleIconUrl(ps, true)} 
                                    alt={ps} 
                                    title={`${ps} (PS+)`} 
                                    className={`w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)] ${isNew ? 'ring-[1.5px] ring-fcGreen ring-offset-[1.5px] ring-offset-[#1f211f] rounded-full' : ''}`} 
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
                                    className={`w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)] ${isNew ? 'ring-[1.5px] ring-fcGreen ring-offset-[1px] ring-offset-[#1f211f] rounded-full' : ''}`} 
                                  />
                                );
                              })}
                            </div>
                          );
                        })()}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newChain = [...selectedChain];
                            newChain.splice(idx, 1);
                            
                            const result = simulateEvoChain(newChain, baseBio, baseOvr, baseStats, basePlayStyles);
                            const igs = Object.values(result.finalStats).reduce(
                              (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
                              0
                            );
                            onSave({
                              id: editingPath ? editingPath.id : `manual-path-${Date.now()}`,
                              name: editingPath ? editingPath.name : `Custom ${result.finalOvr}/${newChain.length}/${igs}`,
                              description: editingPath ? editingPath.description : 'User created manual evolution path.',
                              isRecommended: editingPath?.isRecommended ?? false,
                              chainIds: newChain,
                              steps: result.steps
                            });
                          }}
                          className="absolute -top-1.5 -left-1.5 p-0.5 bg-red-900/90 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                          title={`Remove ${evo.name} from this path`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      {idx < selectedChain.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* The sub-stats of the chain as it stands. The chain above shows the six face values,
              but an evo is chosen on the sub-stats under them — agility against strength decides
              the archetype, and a face value can sit still while the stat you came for moves. No
              deltas here: the chips on the chain already say what each step added, and this is the
              answer to "where is the card now". */}
          <div className="p-3 border-b border-gray-800 bg-[#121212] shrink-0 flex flex-col gap-2">
            {isComparing && (
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="text-gray-500 uppercase tracking-wider font-semibold">Comparing</span>
                <span className="font-bold text-gray-200">{nodeName(comparedFrom)}</span>
                <span className="text-gray-600">➜</span>
                <span className="font-bold text-gray-200">{nodeName(comparedTo)}</span>
                <button
                  onClick={() => setComparedNodes([-1, -1])}
                  className="text-gray-500 hover:text-white border border-gray-700 hover:border-gray-500 rounded px-1.5 py-0.5 transition-colors"
                >
                  Show current
                </button>
              </div>
            )}
            <StatsGrid baseStats={panelFrom} previewStats={panelTo} activeChemBoosts={{}} dense />
          </div>

          {/* Bottom Side: Available Pool */}
          <div className="flex flex-col shrink-0">
            <div className="sticky top-0 z-20 p-3 border-b border-gray-800 bg-[#1f211f]/95 backdrop-blur flex flex-col gap-3">
              {/* Top Row: Title, Stats, Search */}
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Available in Pool</h3>
                <div className="hidden md:flex items-center gap-3 text-[11px] font-mono bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">OVR</span>
                    <span className="text-yellow-400 font-bold">{currentOvr}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">PS+</span>
                    <span className="text-yellow-400 font-bold">{currentPsPlusCount}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">BS</span>
                    <span className="text-blue-400 font-bold">{currentFaceStats}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-gray-500 font-bold">IGS</span>
                    <span className="text-blue-400 font-bold">{currentIgs}</span>
                  </div>
                  {/* Where the chain stands now, so the archetype on each pool card reads as a
                      change from something rather than a bare label. */}
                  <div className="flex gap-1 items-center" title={`AcceleRATE: ${currentAccelerate}`}>
                    <span className="text-gray-500 font-bold">RATE</span>
                    <span className="text-gray-200 font-bold">{ACCELERATE_SHORT[currentAccelerate]}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 text-[11px] font-mono bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                  {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                    const stat = currentStats[statKey as keyof StatsData];
                    if (!stat) return null;
                    const val = stat.baseFace;
                    return (
                      <div key={statKey} className="flex gap-1.5 items-center">
                        <span className="text-gray-500 font-bold uppercase">{statKey}</span>
                        <span className={getStatColorClass(val) + " font-bold"}>{val}</span>
                      </div>
                    );
                  })}
                  </div>
                </div>
                
                {/* Search Input on the right (top row) */}
                <div className="relative w-full xl:max-w-[250px]">
                  <input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search EVOs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const topEligible = poolWithStatus
                          .filter(matchesFilters)
                          .find(p => p.isEligible && !p.limitReached);
                        if (topEligible) {
                          handleAdd(topEligible.id);
                        }
                      }
                    }}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-10 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-fcGreen/50 focus:ring-1 focus:ring-fcGreen/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Sort & Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap items-center gap-1 bg-[#121212] border border-gray-800 rounded-lg p-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-gray-600 px-1">Sort</span>
                  {SORT_OPTIONS.map(({ mode, label, title }) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      title={title}
                      className={`px-1.5 py-1 text-[10px] font-bold rounded transition-colors whitespace-nowrap ${
                        sortMode === mode ? 'bg-fcGreen text-black shadow-sm' : 'text-gray-400 hover:bg-[#2A2D2A]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setFilterNewRarity(!filterNewRarity); setFilterNoRarity(false); }}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewRarity ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Rarity
                </button>
                <button
                  onClick={() => { setFilterNoRarity(!filterNoRarity); setFilterNewRarity(false); }}
                  title="Hide every evo that changes the card's rarity"
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNoRarity ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  Keep Rarity
                </button>
                <button
                  onClick={() => { setFilterNoPosition(!filterNoPosition); setFilterNewPosition(false); }}
                  title="Hide every evo that adds a position"
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNoPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  Keep Positions
                </button>
                <button
                  onClick={() => { setFilterNewPosition(!filterNewPosition); setFilterNoPosition(false); }}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Position
                </button>
                <button
                  onClick={() => setFilterFitPosition(!filterFitPosition)}
                  title="Only evos that name a position this card actually has — and the ones naming its primary position first"
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterFitPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  Fit Position
                </button>
                {/* The one filter that isn't a yes/no: five archetypes, and picking one is a
                    different question from picking another, so it gets a select rather than five
                    more toggles in a row that is already long. */}
                <div className="relative">
                  <select
                    value={filterAccelerate}
                    onChange={e => setFilterAccelerate(e.target.value as AccelerateType | 'all')}
                    title="Only evos that leave the card on this AcceleRATE archetype"
                    className={`appearance-none rounded-lg border pl-2 pr-6 py-1.5 text-[10px] font-bold cursor-pointer focus:outline-none ${
                      filterAccelerate !== 'all'
                        ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm'
                        : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                    }`}
                  >
                    <option value="all">Any AcceleRATE</option>
                    {ACCELERATE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      filterAccelerate !== 'all' ? 'text-black/70' : 'text-gray-500'
                    }`}
                  />
                </div>
                <button
                  onClick={() => setShowNotIncluded(!showNotIncluded)}
                  title="Show or hide not included evos"
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    showNotIncluded ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  Show Not Included
                </button>
              </div>
            </div>
            
            {(isSearchingChains || chainRecs.length > 0 || (chainSearchSettled && filterTargets.length > 0)) && (
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Wand2 className="w-3.5 h-3.5 text-fcGreen" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                    Recommended continuation
                  </span>
                  {isSearchingChains && (
                    <span className="text-[10px] text-gray-500 animate-pulse">searching {REC_CHAIN_DEPTH} deep…</span>
                  )}
                  {filterTargets.length > 0 && (
                    <span className="text-[10px] text-gray-500">
                      aiming at <span className="text-amber-400/90">{filterTargets.join(' · ')}</span>
                    </span>
                  )}
                </div>
                {chainSearchSettled && chainRecs.length === 0 && filterTargets.length > 0 && (
                  <div className="text-[11px] text-gray-500 bg-[#161816] border border-gray-800 rounded-xl p-3">
                    No continuation within {REC_CHAIN_DEPTH} steps satisfies those filters — pick manually, or loosen
                    them in Filters.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chainRecs.map(rec => {
                    const added = rec.chainIds
                      .slice(selectedChain.length)
                      .map(stepId => availableEvolutions[stepId]?.name || stepId);
                    const last = rec.steps?.[rec.steps.length - 1];
                    const finalOvr = last ? last.ovrAfter : currentOvr;
                    const finalIgs = last
                      ? Object.values(last.statsAfter).reduce(
                          (acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0),
                          0
                        )
                      : currentIgs;

                    return (
                      <div
                        key={rec.id}
                        className="flex items-center gap-3 bg-[#161816] border border-fcGreen/30 rounded-xl p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-mono text-xs font-extrabold text-white">
                              {finalOvr > currentOvr && (
                                <span className="text-fcGreen text-[10px] mr-0.5">+{finalOvr - currentOvr}</span>
                              )}
                              {finalOvr}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400">
                              IGS <span className="text-fcGreen">+{finalIgs - currentIgs}</span>{' '}
                              <span className="text-blue-400 font-bold">{finalIgs}</span>
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">{added.length} more EVOs</span>
                          </div>
                          <div className="text-[11px] text-gray-300 mt-1 leading-snug">
                            {added.join(' ➜ ')}
                          </div>
                        </div>
                        <button
                          onClick={() => applyChain(rec.chainIds)}
                          className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-green-900/60 text-green-400 hover:bg-green-500 hover:text-white transition-colors"
                          title="Add all of these to the chain"
                        >
                          Apply all
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {visiblePool.length === 0 ? (
                <div className="text-center py-6 text-gray-600 text-sm md:col-span-3 lg:col-span-4">
                  {poolWithStatus.length === 0
                    ? 'Your EVO pool is empty.'
                    // An archetype is often simply out of reach — a 190cm card can never come out
                    // Explosive — so an empty grid here has to say it was the filters, not the pool.
                    : 'No evo in the pool matches these filters.'}
                </div>
              ) : (
                visiblePool
                  .map(({ id, evo, limitReached, isEligible, reasons, warnings, expectedOvr, expectedIgs, expectedFaceStats, expectedStats, expectedPlayStyles, recReasons, expectedFit, expectedAccelerate, expectedSpread }) => {
                  if (!evo) return null;

                  const canAdd = !limitReached && isEligible;
                  const isDisabled = disabledEvos.includes(id);
                  // Two different reasons an evo can be outside the pool, and the card says which:
                  // one the team simply never added, versus one it switched off.
                  const isNotIncluded = !isDisabled && !canRecommend.has(id);
                  const isOutOfPool = isDisabled || isNotIncluded;
                  const excludedPositions = displayExcludedPositions(evo);
                  const recRank = recommendedRank.get(id);
                  const isRec = canAdd && recRank !== undefined;
                  
                  return (
                    <div 
                      key={id}
                      className={`relative group bg-[#161816] border rounded-xl p-3.5 pb-11 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer ${canAdd ? 'border-gray-800 hover:border-blue-500/50 hover:bg-[#1a1d1a] hover:-translate-y-0.5' : 'border-gray-800/30 opacity-70 grayscale-[0.2]'} ${isRec ? 'ring-1 ring-fcGreen/30' : ''} ${isOutOfPool ? 'opacity-50 grayscale' : ''}`}
                      onClick={() => setLocalViewingEvo(id)}
                      onMouseEnter={() => setHoveredEvoId(id)}
                      onMouseLeave={() => setHoveredEvoId(prev => (prev === id ? null : prev))}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex-1 min-w-0">
                          {/* Only ever visible with "Show Not Included" on, and then it is the
                              whole point: a greyed card has to say which way it is out of the
                              pool, because the two are undone by different buttons. */}
                          {isOutOfPool && (
                            <span className={`inline-block mb-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide border ${
                              isDisabled
                                ? 'bg-red-900/30 text-red-300 border-red-500/30'
                                : 'bg-gray-700/40 text-gray-300 border-gray-600/40'
                            }`}>
                              {isDisabled ? 'Disabled' : 'Not included'}
                            </span>
                          )}
                          {/* Name gets the room to wrap; the terms sit on their own line below so a
                              long name can't shred them into a one-number-per-line column. */}
                          <div className="flex items-start gap-2">
                            <h4 className={`font-bold text-sm leading-snug flex-1 min-w-0 transition-colors ${canAdd ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-500'}`}>
                              {canAdd && (
                                <span className="font-mono tracking-tight font-extrabold opacity-80 mr-1.5 text-white">
                                  {expectedOvr - currentOvr > 0 && <span className="text-fcGreen font-bold text-[10px] mr-0.5">+{expectedOvr - currentOvr}</span>}
                                  {expectedOvr}/{expectedPlayStyles ? (expectedPlayStyles.base.gold.length + expectedPlayStyles.ev.gold.length) : '?'}
                                </span>
                              )}
                              {isRec && (
                                <span
                                  title={recReasons && recReasons.length > 0 ? recReasons.join(' · ') : 'Recommended'}
                                  className="inline-flex align-middle items-center mr-1.5 p-0.5 rounded bg-fcGreen/20 text-fcGreen border border-fcGreen/40"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </span>
                              )}
                              <span>{evo.name}</span>
                            </h4>
                            <div className="flex gap-1 items-center shrink-0">
                              <button
                                  onClick={(e) => { e.stopPropagation(); setLocalViewingEvo(id); }}
                                  className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors"
                                  title="View details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {onToggleDisabled && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onToggleDisabled(id); }}
                                    className={`p-1 rounded-full transition-colors ${isDisabled ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-red-900/40 text-red-400 hover:bg-red-600 hover:text-white'}`}
                                    title={isDisabled ? "Enable Evo" : "Disable Evo"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                            </div>
                          </div>
                          <div className={`font-mono text-[11px] opacity-70 mt-0.5 whitespace-nowrap ${isNotIncluded ? 'line-through' : ''}`}>
                            {formatEvoTerms(evo)}
                          </div>
                          <div className="flex gap-x-2 gap-y-1.5 flex-wrap items-center mt-2">

                            {canAdd && expectedStats && (
                              <div className="flex gap-1 items-center bg-gray-800/80 px-2 py-0.5 rounded border border-gray-600 text-[10px]">
                                <span className="text-white font-bold">BS</span>
                                <div className="flex items-baseline gap-0.5">
                                  {expectedFaceStats - currentFaceStats > 0 && <span className="text-fcGreen font-bold text-[8px]">+{expectedFaceStats - currentFaceStats}</span>}
                                  <span className="text-blue-400 font-bold">{expectedFaceStats}</span>
                                </div>
                              </div>
                            )}
                            {canAdd && expectedStats && (
                              <div className="flex gap-1 items-center bg-gray-800/80 px-2 py-0.5 rounded border border-gray-600 text-[10px]">
                                <span className="text-white font-bold">IGS</span>
                                <div className="flex items-baseline gap-0.5">
                                  {expectedIgs - currentIgs > 0 && <span className="text-fcGreen font-bold text-[8px]">+{expectedIgs - currentIgs}</span>}
                                  <span className="text-blue-400 font-bold">{expectedIgs}</span>
                                </div>
                              </div>
                            )}
                            {canAdd && expectedAccelerate && (
                              <AccelerateBadge after={expectedAccelerate} before={currentAccelerate} />
                            )}
                            {canAdd && expectedSpread && (
                              <AccelerateSpreadBadge spread={expectedSpread} />
                            )}
                            {canAdd && currentFit && expectedFit && (
                              <div
                                className="flex gap-1 items-center bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50 text-[10px]"
                                title={
                                  `Stats ${expectedFit.stats.toFixed(1)} · PlayStyles ${expectedFit.playStyles.toFixed(1)} · Body ${expectedFit.body.toFixed(1)} (${expectedFit.accelerate})` +
                                  (expectedFit.playStyleDetail.length > 0
                                    ? `\n${expectedFit.playStyleDetail.slice(0, 5).map(d => `${d.name}${d.gold ? '+' : ''} ${d.points.toFixed(1)}`).join(' · ')}`
                                    : '')
                                }
                              >
                                <span className="text-amber-200 font-bold">FIT</span>
                                <div className="flex items-baseline gap-0.5">
                                  {expectedFit.total - currentFit.total > 0 && (
                                    <span className="text-fcGreen font-bold text-[8px]">
                                      +{(expectedFit.total - currentFit.total).toFixed(1)}
                                    </span>
                                  )}
                                  <span className="text-amber-300 font-bold">{expectedFit.total.toFixed(1)}</span>
                                </div>
                              </div>
                            )}
                            {evo.requirements.positions && evo.requirements.positions.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-red-950/40 rounded text-[9px] text-red-400 border border-red-900/50 font-bold whitespace-nowrap">
                                Req Pos: {evo.requirements.positions.join(', ')}
                              </span>
                            )}
                            {excludedPositions.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-red-950/40 rounded text-[9px] text-red-400 border border-red-900/50 font-bold whitespace-nowrap">
                                Excl Pos: {excludedPositions.join(', ')}
                              </span>
                            )}
                            {evo.positionsAdded && evo.positionsAdded.length > 0 && (
                              <span className="px-1.5 py-0.5 bg-purple-950/40 rounded text-[9px] text-purple-400 border border-purple-800/40 font-bold whitespace-nowrap">
                                + Pos: {evo.positionsAdded.join(', ')}
                              </span>
                            )}
                            {evo.rarityChange && (
                              <span className="px-1.5 py-0.5 bg-pink-950/40 rounded text-[9px] text-pink-400 border border-pink-800/40 font-bold whitespace-nowrap">
                                {evo.rarityChange}
                              </span>
                            )}
                            {evo.maxRepeatable && evo.maxRepeatable > 1 && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] border font-bold ${canAdd ? 'bg-fcGold/20 text-fcGold border-fcGold/40' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                Repeatable: {evo.maxRepeatable}
                              </span>
                            )}
                          </div>
                          {canAdd && expectedStats && expectedPlayStyles && (
                            <div className="mt-2 pt-2 border-t border-gray-800/50">
                              <div className="grid grid-cols-3 gap-1.5 mt-1">
                                {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                                  const val = expectedStats[statKey as keyof StatsData].baseFace;
                                  const prevVal = currentStats[statKey as keyof StatsData].baseFace;
                                  const diff = val - prevVal;
                                  
                                  const expectedSubSum = Object.values(expectedStats[statKey as keyof StatsData].subs).reduce((acc, sub) => acc + sub.base, 0);
                                  const prevSubSum = Object.values(currentStats[statKey as keyof StatsData].subs).reduce((acc, sub) => acc + sub.base, 0);
                                  const subDiff = expectedSubSum - prevSubSum;
                                  const showPlusZero = diff === 0 && subDiff > 0;
                                  
                                  let diffColor = "text-gray-300";
                                  if (diff >= 8) diffColor = "text-purple-400 font-bold";
                                  else if (diff >= 4) diffColor = "text-fcGreen font-bold";
                                  else if (diff >= 2) diffColor = "text-lime-400 font-semibold";

                                  return (
                                    <div key={statKey} className="flex gap-0.5 items-center bg-[#101210] px-1.5 py-1 rounded text-[8.5px] shadow-inner border border-gray-800/80">
                                      <span className="text-gray-500 font-bold uppercase">{statKey}</span>
                                      <div className="flex items-baseline gap-0.5 ml-auto">
                                        {diff > 0 && <span className={`${diffColor} text-[7px] leading-none tracking-tighter`}>+{diff}</span>}
                                        {showPlusZero && <span className={`text-gray-400 font-bold text-[7px] leading-none tracking-tighter`} title="Sub-stats increased">+0</span>}
                                        <span className={`font-black ${getStatColorClass(val)}`}>{val}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <PlayStyleDiffDisplay before={currentPlayStyles} after={expectedPlayStyles} />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!canAdd && !limitReached && reasons.length > 0 && (
                        <div className="mt-2 text-[10px] text-red-400/80 bg-red-950/20 p-1.5 rounded pr-8">
                          {reasons[0]} {reasons.length > 1 && `(+${reasons.length - 1} more)`}
                        </div>
                      )}

                      {/* Amber, not red, and the card stays addable — this is a "think twice",
                          not a rejection. */}
                      {canAdd && warnings.length > 0 && (
                        <div className="mt-2 flex items-start gap-1.5 text-[10px] text-amber-400/90 bg-amber-950/20 border border-amber-900/40 p-1.5 rounded pr-8">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-px" />
                          <span>
                            {warnings[0]} {warnings.length > 1 && `(+${warnings.length - 1} more)`}
                          </span>
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdd(id); }}
                        disabled={!canAdd}
                        className={`absolute bottom-3 right-3 p-1.5 rounded-full transition-colors shrink-0 shadow-lg z-10 ${canAdd ? 'bg-green-900/60 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-gray-800/80 text-gray-600 cursor-not-allowed'}`}
                        title={canAdd ? "Add Evo" : "Ineligible"}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      <EvoDetailsModal
        evoId={localViewingEvo}
        onClose={() => setLocalViewingEvo(null)}
        onAddEvo={(() => {
          const viewed = poolWithStatus.find(p => p.id === localViewingEvo);
          if (!viewed || viewed.limitReached || !viewed.isEligible) return undefined;
          return (id: string) => {
            handleAdd(id);
            setLocalViewingEvo(null);
          };
        })()}
      />
    </div>
  );
};
