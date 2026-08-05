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
  chainIds: string[]; // List of EVO IDs in order e.g. ['1076', '1159']
  steps?: ChainStepResult[];
}

export interface ChainValidation {
  eligible: boolean;
  reasons: string[];
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
  requiredEvos?: string[];
  blockedEvos?: string[];
  newRarity?: boolean;
  newPosition?: boolean;
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

export interface SquadMember {
  // Unique per entry, not per player — the same player can be stored several times
  // in one squad under different evolution paths.
  id: string;
  playerId: string;
  playerState: PlayerEvoState;
  // The evolved player as it looked when added — the squad shows this, not the raw card.
  snapshot: {
    name: string;
    pathName: string;
    chainIds: string[];
    baseOvr: number;
    evoOvr: number;
  };
}

export interface Squad {
  id: string;
  name: string;
  members: SquadMember[];
  createdAt: number;
}
