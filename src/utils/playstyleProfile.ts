import type { PlayStyleTier } from './playstyleValues';

/**
 * The knobs. Everything about "what is a good evo for me" that is taste rather than mechanics
 * lives here, in one file, so it can be tuned without touching any scoring code.
 *
 * Written for: 4-2-3-1, direct through-balls, low driven finishing, agility and pace dribbling
 * both, a manually-controlled box-to-box CAM that gets dragged back to defend, AI-controlled
 * midfield and defence, end-game squad meant to last months at Elite level.
 */

/**
 * Whether the player is actually holding the stick for this card. It changes what a PlayStyle is
 * worth more than position does: the AI never uses a trick, and never runs itself out of stamina.
 */
export type ControlMode = 'manual' | 'ai';

/** Positions played by the person, not the AI, unless a card says otherwise. */
export const MANUAL_BY_DEFAULT = ['CAM', 'LW', 'RW', 'ST', 'CF', 'LM', 'RM'];

export function defaultControlMode(primaryPositions: string): ControlMode {
  const positions = primaryPositions.split(',').map(p => p.trim().toUpperCase());
  return positions.some(p => MANUAL_BY_DEFAULT.includes(p)) ? 'manual' : 'ai';
}

/**
 * What one PlayStyle+ is worth in position-score points — the exchange rate between skills and
 * the stat panel, and the single most important number in the file. At 4.5, a PlayStyle+ that
 * fits the plan is worth roughly 27 points spread across the six face stats, which means an evo
 * that grants free PlayStyle picks will usually beat an evo that only moves numbers.
 */
export const PS_PLUS_POINTS = 4.5;

/** A silver PlayStyle does the same thing, weaker. */
export const SILVER_RATIO = 1 / 3;

export const TIER_MULTIPLIERS: Record<PlayStyleTier, number> = {
  core: 1,
  support: 0.55,
  muted: 0.15,
  off: 0
};

/**
 * Crowding. The second PlayStyle pushing the same axis is worth half, the third a quarter — this
 * is what stops the optimiser from filling every free slot with the same idea (Rapid AND Quick
 * Step AND Footwork) instead of covering the card's actual gaps.
 */
export const CROWDING_DISCOUNTS = [1, 0.5, 0.25];
/** Two PlayStyles listed as `overlaps` of each other are nearer duplicates than same-axis ones. */
export const OVERLAP_DISCOUNT = 0.4;

/**
 * How much each PlayStyle is worth depending on who is driving. Anything not listed is 1.
 */
export const CONTROL_MULTIPLIERS: Record<ControlMode, Record<string, number>> = {
  manual: {
    Relentless: 1.5,
    'Press Proven': 1.4,
    Technical: 1.3,
    Trickster: 1.3,
    'Quick Step': 1.2,
    Rapid: 1.2,
    // The player does the defending on this card by hand; the AI-assist PlayStyles matter less.
    Anticipate: 0.6,
    Jockey: 0.6,
    Intercept: 0.8,
    Block: 0.7
  },
  ai: {
    // An AI defender lives on positioning and prediction.
    Anticipate: 1.5,
    Jockey: 1.4,
    Intercept: 1.4,
    Block: 1.3,
    // The AI does not dribble, and does not sprint itself into the ground either.
    Trickster: 0.3,
    Technical: 0.5,
    Footwork: 0.4,
    Relentless: 0.8,
    'Press Proven': 1.1
  }
};

/**
 * Sub-stat weighting, because at Elite level the face stat is a summary that hides the two or
 * three numbers that decide whether a card feels good. Only the sub-stats that matter for a
 * position are listed; everything else falls back to DEFAULT_SUBSTAT_WEIGHT rather than zero, so
 * cards don't end up tied.
 *
 * Weights are per position and sum to ~1 within the listed set.
 */
export const DEFAULT_SUBSTAT_WEIGHT = 0.02;

export const SUBSTAT_WEIGHTS: Record<string, Record<string, number>> = {
  ST: {
    finishing: 0.20, positioning: 0.12, acceleration: 0.16, shotPower: 0.10,
    dribbling: 0.10, ballControl: 0.08, agility: 0.08, balance: 0.06,
    strength: 0.06,
    composure: 0.08, reactions: 0.08
  },
  CF: {
    finishing: 0.16, positioning: 0.10, acceleration: 0.14, dribbling: 0.14,
    ballControl: 0.10, shortPass: 0.10, agility: 0.10, balance: 0.06,
    vision: 0.06,
    composure: 0.08, reactions: 0.08
  },
  LW: {
    acceleration: 0.20, dribbling: 0.16, agility: 0.14, balance: 0.12,
    ballControl: 0.10, sprintSpeed: 0.10, finishing: 0.08, shortPass: 0.05,
    composure: 0.08, reactions: 0.08
  },
  RW: {
    acceleration: 0.20, dribbling: 0.16, agility: 0.14, balance: 0.12,
    ballControl: 0.10, sprintSpeed: 0.10, finishing: 0.08, shortPass: 0.05,
    composure: 0.08, reactions: 0.08
  },
  LM: {
    acceleration: 0.18, dribbling: 0.15, agility: 0.13, balance: 0.10,
    ballControl: 0.10, sprintSpeed: 0.10, shortPass: 0.09, stamina: 0.08,
    finishing: 0.07,
    composure: 0.08, reactions: 0.08
  },
  RM: {
    acceleration: 0.18, dribbling: 0.15, agility: 0.13, balance: 0.10,
    ballControl: 0.10, sprintSpeed: 0.10, shortPass: 0.09, stamina: 0.08,
    finishing: 0.07,
    composure: 0.08, reactions: 0.08
  },
  CAM: {
    // The manually-driven box-to-box role: passing and touch first, but stamina is not optional.
    shortPass: 0.18, vision: 0.15, dribbling: 0.14, acceleration: 0.12,
    ballControl: 0.10, agility: 0.10, stamina: 0.08, balance: 0.07,
    composure: 0.08, reactions: 0.08
  },
  CM: {
    shortPass: 0.18, vision: 0.12, dribbling: 0.12, stamina: 0.11,
    acceleration: 0.10, ballControl: 0.10, agility: 0.08, defAwareness: 0.08,
    interceptions: 0.06,
    composure: 0.08, reactions: 0.08
  },
  CDM: {
    defAwareness: 0.22, interceptions: 0.16, standTackle: 0.16, shortPass: 0.12,
    strength: 0.10, stamina: 0.08, acceleration: 0.06,
    composure: 0.08, reactions: 0.08
  },
  CB: {
    defAwareness: 0.26, standTackle: 0.22, interceptions: 0.14, strength: 0.12,
    sprintSpeed: 0.10, acceleration: 0.07, aggression: 0.04,
    jumping: 0.02,
    composure: 0.08, reactions: 0.08
  },
  LB: {
    defAwareness: 0.16, standTackle: 0.14, sprintSpeed: 0.16, acceleration: 0.14,
    interceptions: 0.10, stamina: 0.10, shortPass: 0.08, agility: 0.06, balance: 0.06,
    composure: 0.08, reactions: 0.08
  },
  RB: {
    defAwareness: 0.16, standTackle: 0.14, sprintSpeed: 0.16, acceleration: 0.14,
    interceptions: 0.10, stamina: 0.10, shortPass: 0.08, agility: 0.06, balance: 0.06,
    composure: 0.08, reactions: 0.08
  },
  LWB: {
    sprintSpeed: 0.17, acceleration: 0.15, stamina: 0.13, defAwareness: 0.13,
    standTackle: 0.12, dribbling: 0.09, shortPass: 0.08, interceptions: 0.07, balance: 0.06,
    composure: 0.08, reactions: 0.08
  },
  RWB: {
    sprintSpeed: 0.17, acceleration: 0.15, stamina: 0.13, defAwareness: 0.13,
    standTackle: 0.12, dribbling: 0.09, shortPass: 0.08, interceptions: 0.07, balance: 0.06,
    composure: 0.08, reactions: 0.08
  }
};

/**
 * Sub-stats this player wants pinned at 99 on a card they actually build, not merely "high".
 * A linear weight can't express that: it values 90 -> 91 the same as 98 -> 99, when the whole
 * point is landing on the ceiling. These pay out on top of the weighted score, ramping from
 * MUST_MAX_FLOOR so a card that is close still gets partial credit.
 */
export const MUST_MAX_SUBSTATS: Record<string, number> = {
  composure: 2,
  reactions: 2
};
export const MUST_MAX_FLOOR = 94;

/**
 * Stamina on a card the player drives themselves is worth far more than the position table says,
 * because that card covers the whole pitch by hand for 90 minutes. Applied on top of the position
 * weights above.
 */
export const CONTROL_SUBSTAT_MULTIPLIERS: Record<ControlMode, Record<string, number>> = {
  manual: { stamina: 1.6, agility: 1.15, balance: 1.15, composure: 1.1 },
  ai: { stamina: 0.7, defAwareness: 1.2, reactions: 1.2, positioning: 1.2 }
};

/**
 * Body targets per position, since the answer was "depends on the position": the front line wants
 * to be small and explosive, the back line wants to be big and lengthy. Used to value the
 * AcceleRATE archetype a card ends up with, not to reject a card for being the wrong shape.
 */
export const POSITION_BODY_PREFERENCE: Record<string, 'explosive' | 'lengthy' | 'either'> = {
  ST: 'either', CF: 'explosive', LW: 'explosive', RW: 'explosive',
  LM: 'explosive', RM: 'explosive', CAM: 'explosive', CM: 'either',
  CDM: 'lengthy', CB: 'lengthy', LB: 'either', RB: 'either', LWB: 'either', RWB: 'either'
};

/** How many position-score points a perfectly-matched AcceleRATE archetype is worth. */
export const BODY_FIT_POINTS = 2;
