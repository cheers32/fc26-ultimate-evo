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
  /**
   * A Chinese summary of what the evo asks for and what it gives, shown under the English.
   *
   * Generated from this file's own numbers rather than translated from the blurb: the blurb is
   * marketing and says nothing about caps or entry requirements, which is what you actually read
   * an evo's page to find out.
   */
  descriptionZh?: string;
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
   * Considered and turned down, but not thrown away.
   *
   * The star answers "keep this", and there was no way to say the other useful thing: that a build
   * has been looked at and ruled out. Without it the only way to stop a build cluttering the row is
   * Clear Unstarred, which deletes it — so the next Analyze run offers it again, and it gets ruled
   * out again, with nothing on the card remembering that it ever was.
   *
   * Struck through and sorted to the end, kept like any other saved build, and never swept by
   * Clear. It is a third state alongside starred and unstarred, not a colour of star.
   */
  discarded?: boolean;
  /**
   * Tucked into the Discarded drawer.
   *
   * Kept apart from `discarded` because they answer different questions: that one is a judgement
   * about the build, this one is where the chip sits. Ruling a build out does not move it — a chip
   * that jumps somewhere else the moment you click it costs you your place in the row — so nothing
   * but a drag ever puts one in the drawer, or takes it back out.
   */
  filed?: boolean;
  /**
   * How far the build has actually been played in game: the index of the last step that's done, so
   * -1 (or absent) is "not started". Evos are applied in chain order, so one pointer says it —
   * everything up to it is done and everything after it isn't.
   */
  doneUpTo?: number;
  /**
   * The chemistry style the build was judged under, where it was judged at all. A recommendation
   * that clears its floors only with a style on is a recommendation about a card wearing it, so the
   * style travels with the build and the app puts it on when the build is opened — otherwise the
   * row says stamina 93 while the stat panel says 87 and both are right.
   */
  chemStyle?: string | null;
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
/**
 * A verdict on one recommended build.
 *
 * The snapshot is the point. A thumb on its own says "this one was wrong" and nothing else — it
 * cannot tell a retune whether the objection was the strength, the stamina, the cost or the
 * archetype, and by the time anyone looks at it the ranking has changed and the row it was cast on
 * no longer exists. Storing the numbers as they were judged means a proposed change to the model
 * can be replayed against exactly what you saw and either agrees with you or does not.
 *
 * Kept in the global library rather than per team: this is your taste, and it does not change
 * because you switched squads.
 */
export interface PathFeedback {
  verdict: 'up' | 'down';
  playerId: string;
  playerName?: string;
  /** Order-independent, so one build is one record however the search happened to find it. */
  chainKey: string;
  chainIds: string[];
  /** Which plan the row was listed under, when it came from V2. */
  templateId?: string;
  /** Why, on a thumbs-down. Free of these a down vote is not actionable. */
  reasons?: string[];
  /** The row exactly as it was judged. */
  snapshot: {
    ovr: number;
    igs: number;
    positions: string;
    heightCm?: number;
    archetype?: string;
    /** Every sub-stat of the finished card, so any weight can be re-examined later. */
    subs: Record<string, number>;
  };
  at: number;
}

/** Why a build was turned down. Short, mutually distinguishable, and about the card not the app. */
export const FEEDBACK_REASONS: { id: string; label: string; hint: string }[] = [
  { id: 'wrong-accelerate', label: 'Wrong AcceleRATE', hint: 'Lands on an archetype this card should not be' },
  { id: 'wasted-stats', label: 'Wasted stats', hint: 'Spends the chain on stats this player has no use for' },
  { id: 'key-stat-low', label: 'Key stat too low', hint: 'A stat the position runs on is short' },
  { id: 'stamina', label: 'Stamina', hint: 'Cannot last ninety minutes' },
  { id: 'too-slow', label: 'Too slow', hint: 'Pace or agility not where it needs to be' },
  { id: 'too-expensive', label: 'Costs too much', hint: 'Not worth the tokens or the objectives' },
  { id: 'blocks-later', label: 'Blocks later evos', hint: 'Raises OVR past evos still worth doing' },
  { id: 'better-exists', label: 'Something else is better', hint: 'A different build on this card beats it outright' }
];

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
  /**
   * Whether to model the August 2026 rule change: every card holds five PlayStyle+ and assigns its
   * own PlayStyles regardless of rarity. Absent means on — it is how the game works now, and a
   * default that has to be switched on is a default that is wrong for most people.
   *
   * Off restores the old rules, which is what every build planned before the change was reasoned
   * under: four gold slots that only a handful of rarities let you choose.
   */
  openPlayStyles?: boolean;
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
  /**
   * Use each evo at most once, whatever its repeat limit says. On by default: a chain that spends
   * two of its steps on the same card is usually the search finding the same idea twice, and the
   * second run is worth a fraction of the first once the caps have bitten.
   *
   * Absent means on — these were added after builds were already saved, and an old state should
   * behave the way the app does now.
   */
  oneUsePerEvo?: boolean;
  /**
   * Use at most one evo per rarity it grants. On by default: rarity does not stack, so a second
   * evo granting the rarity a step already gave is spending a step on nothing.
   */
  oneEvoPerRarity?: boolean;
  /**
   * Judge every build with the best chemistry style it could legally wear.
   *
   * Off by default, so a build is read as the card actually is. With it on, a stat at 93 and one at
   * 99 are the same stat wherever a style would carry it, the archetype is whatever some style can
   * make it, and the row says which style it assumed — which is the right reading when a style is
   * going on the card anyway, and the wrong one when you want to know what you are really holding.
   */
  assumeChemStyle?: boolean;
  /**
   * Which readings Analyze should come back with.
   *
   * Both by default, and they are two answers rather than one answer and a variant: the bare list
   * is what the card is, the chem list is what it would be fielded as, and a build can top one and
   * be absent from the other. Narrow it when the style is already decided either way.
   */
  analyzeReadings?: 'both' | 'bare' | 'chem';
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

/**
 * Where a PlayStyle pick goes in a chain.
 *
 *   n            the pick node already at step n
 *   'new'        appended at the end
 *   { after: n } inserted directly after step n
 */
export type PickTarget = number | 'new' | { after: number };
