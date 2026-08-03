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
  // Defaults to true (opt-out, not opt-in) — see hasCustomizablePlaystyleRarity in evoEngine.ts
  requireCustomizableRarity?: boolean;
  requiredEvos?: string[];
}
