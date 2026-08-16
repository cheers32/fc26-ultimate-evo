export interface SubStat {
  label: string;
  base: number;
  boost: number;
  limit: number;
  w: number;
}

export interface FaceStat {
  label: string;
  baseFace: number;
  evFace: number;
  subs: Record<string, SubStat>;
}

export interface OvrData {
  base: number;
  boost: number;
  limit: number;
}

export interface PlayStylesData {
  limits: {
    gold: number;
    silver: number;
  };
  base: {
    gold: string[];
    silver: string[];
  };
  ev: {
    gold: string[];
    silver: string[];
  };
}

export interface PlayerBio {
  name: string;
  club: string;
  nation: string;
  league: string;
  title: string;
  primaryPositions: string;
  height: string;
  footAge: string;
  bodyType?: string;
  weakFoot: number;
  skillMoves: number;
  rarity: string;
  roles: Record<string, string[]>;
}

export type StatsData = Record<string, FaceStat>;
export type ChemStylesData = Record<string, Record<string, number>>;

export interface PlayerData {
  id: string;
  futbinLink: string;
  avatarUrl: string;
  bio: PlayerBio;
  ovr: OvrData;
  playStyles: PlayStylesData;
  stats: StatsData;
  parentId?: string;
  rebasedFromEvos?: string[];
}

// Evolution Data Schemas for FC 26
export interface EvolutionRequirement {
  maxOvr: number;
  /** Floor as well as a ceiling — the continuation evos require the OVR their earlier part ends on. */
  minOvr?: number;
  maxPace?: number;
  maxShooting?: number;
  maxDefending?: number;
  maxPhysicality?: number;
  maxWeakFoot?: number;
  maxSkillMoves?: number;
  maxPlayStylesPlus?: number;
  maxPlayStyles?: number;
  maxTotalPositions?: number;
  positions?: string[];
  excludedPositions?: string[];
  rarity?: string;
  notRarity?: string;
}

export interface EvolutionLevel {
  name: string;
  upgrades: string[];
}

export interface EvolutionDefinition {
  id: string; // e.g. '1076', '1159'
  name: string;
  futbinLink: string;
  version: 'FC 26';
  description: string;
  cost?: string;
  requirements: EvolutionRequirement;
  ovrBoost: {
    boost: number;
    limit: number;
  };
  faceBoosts?: Record<string, { boost: number; limit: number }>;
  subStatBoosts: Record<string, { boost: number; limit: number }>;
  weakFootBoost?: number;
  skillMovesBoost?: number;
  positionsAdded?: string[];
  rarityChange?: string;
  playStylesAdded: {
    gold: string[];
    silver: string[];
  };
  playStylesLimit?: {
    gold?: number;
    silver?: number;
  };
  levels?: EvolutionLevel[];
  maxRepeatable?: number;
  trainingTime?: string;
  // Ships switched off (expired/irrelevant evos). Seeded into the user's disabled list once,
  // so re-enabling one in the UI still sticks.
  defaultDisabled?: boolean;
}

export interface ChainStepResult {
  evoId: string;
  evoName: string;
  futbinLink: string;
  validation: ChainValidation;
  ovrAfter: number;
  statsAfter: StatsData;
  playStylesAfter: PlayStylesData;
  bioAfter: PlayerBio;
}

export interface EvolutionPath {
  id: string;
  name: string;
  description: string;
  isRecommended?: boolean;
  isFavorite?: boolean;
  /**
   * Which colour the star wears — a shortlist marker, not a ranking. Every tier is equally a save:
   * `isFavorite` is what protects a build from Clear Unstarred and what puts it on the team, so a
   * tier without it means nothing. Absent on a starred build reads as the first colour.
   */
  starTier?: 1 | 2 | 3 | 4 | 5;
  /**
   * How far the build has actually been played in game: the index of the last step that's done, so
   * -1 (or absent) is "not started". Evos are applied in chain order, so one pointer says it —
   * everything up to it is done and everything after it isn't.
   */
  doneUpTo?: number;
  // Steps of the build in order: EVO ids e.g. ['1076', '1159'], plus at most one 'ps:...' entry
  // for the PlayStyles the player picked themselves (see PLAYSTYLE_NODE_PREFIX in evoEngine).
  chainIds: string[];
  steps?: ChainStepResult[];
  // Legacy: PlayStyle picks used to hang off the path instead of being a step in it. Only read,
  // to migrate old saves — see migratePlayStylePicks in App.tsx.
  freePlayStyles?: { gold: string[]; silver: string[] };
}

export interface ChainValidation {
  eligible: boolean;
  reasons: string[];
  // Things that make the step a questionable idea without making it illegal — the evo can still
  // be picked, and the path search may still choose it, just not on a coin flip.
  warnings: string[];
}

export interface StatFilter { 
  min?: number; 
  max?: number; 
  subs?: Record<string, { min?: number; max?: number }>; 
}
export interface EvoFilters {
  ovr?: StatFilter;
  pac?: StatFilter;
  sho?: StatFilter;
  pas?: StatFilter;
  dri?: StatFilter;
  def?: StatFilter;
  phy?: StatFilter;
  psPlus?: StatFilter;
  ps?: StatFilter;
  /**
   * Which build templates V2 ranks against. Empty or absent means every plan the card's positions
   * and frame allow — the app pre-selects the one or two it suggests, and clearing them is how you
   * ask to see the lot.
   */
  templateIds?: string[];
  requiredEvos?: string[];
  blockedEvos?: string[];
  newRarity?: boolean;
  newPosition?: boolean;
  /**
   * The opposite pair: keep rarity and positions as they are. Nothing that changes them is
   * recommended — not by Analyze, not by the builder's thumbs-up or its continuations — since a
   * card the player wants left alone can't use those evos however well they score.
   */
  noRarityChange?: boolean;
  noPositionChange?: boolean;
  /**
   * Rank by "fit" — the player's own PlayStyle/sub-stat profile — instead of by raw stat totals.
   * Off by default: it changes what every recommendation in the app means, so it is opt-in.
   */
  playstyleWeighting?: boolean;
  /**
   * Keep only builds that can be made to read one of these AcceleRATEs.
   *
   * "Can be made to" is the point: a chemistry style is a free choice at the point of use and moves
   * all three stats the archetype is decided by, so a build counts if *any* style — Basic included
   * — lands it on one of these. Empty or absent means any archetype will do.
   */
  accelerate?: import('../utils/statUtils').AccelerateType[];
  /**
   * The same idea under the archetype the game prints. Kept apart from `accelerate` rather than
   * derived from it because the two systems disagree about where the line falls — a card can be
   * Controlled in game and Controlled Explosive by the seven-way thresholds.
   */
  accelerateFamily?: import('../utils/statUtils').AccelerateFamily[];
  /** Who drives this card. Decides which half of the PlayStyle weights applies. */
  controlMode?: 'manual' | 'ai';
}

export interface PlayerEvoState {
  activePathId: string;
  expandedPathIds: string[];
  comparePathId?: string | null;
  evosPool: string[];
  generatedPaths: EvolutionPath[];
  manualPaths: EvolutionPath[];
  evoFilters: EvoFilters;
  // Index into the active path's chainIds that is treated as the starting point for new
  // auto/manual builds. -1 means the raw card. Steps up to and including it are locked in
  // as a prefix; any earlier step can be made the base again by selecting it.
  baseIndex?: number;
}

/**
 * Who stands in one slot.
 *
 * A build belongs to its player — it is saved by starring it, and lives in the team's `savedPaths`
 * under that player's id. So a slot doesn't store a build, it points at one: this player, this
 * chain. Clearing a slot takes the card off the pitch and leaves the build where it was.
 */
export interface SquadSlot {
  playerId: string;
  chainIds: string[];
}

export interface Squad {
  id: string;
  name: string;
  createdAt: number;
  /** Which formation the pitch draws. Only 4-2-3-1 exists so far. */
  formation?: string;
  /** Slot id -> who stands there. Twenty-three of them, and they are the whole squad. */
  slots: Record<string, SquadSlot>;
}
