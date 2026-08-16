import type { AccelerateType } from './statUtils';

/**
 * What each PlayStyle is worth, expressed as *what it amplifies* rather than as a value per
 * position. A hand-filled 41 x 14 PlayStyle-by-position matrix is unmaintainable and drifts out
 * of agreement with itself (CM and CAM end up disagreeing about the same skill); this table has
 * one row per PlayStyle and lets POSITION_WEIGHTS decide what that row is worth where.
 *
 * Every number here is a first draft meant to be calibrated by the player who uses it — see
 * playstyleProfile.ts for the knobs that scale all of them at once.
 */

export type StatAxis = 'pac' | 'sho' | 'pas' | 'dri' | 'def' | 'phy';

/**
 * How much of the profile's full value a PlayStyle can earn.
 *
 *   core    — part of the way this player actually plays
 *   support — not their style, but it makes their style work
 *   muted   — deliberately kept alive at a fraction: strong in the game at large, off-plan here
 *   off     — worth nothing to this player, however good it is in the abstract
 */
export type PlayStyleTier = 'core' | 'support' | 'muted' | 'off';

export interface PlayStyleValue {
  /** The face-stat axes this PlayStyle makes better use of. Should sum to ~1. */
  axes: Partial<Record<StatAxis, number>>;
  tier: PlayStyleTier;
  /**
   * Sub-stats the card needs before the PlayStyle does anything real — Power Shot on 65 shooting
   * is a wasted slot. Keyed by the sub-stat names in StatsData. Scored as a ramp rather than a
   * cliff (see gateMultiplier), so a card that is close still gets most of the credit.
   */
  gate?: Record<string, number>;
  /** Minimum height in cm, for the PlayStyles that are really about winning a physical duel. */
  gateHeightCm?: number;
  /** Minimum skill moves — a trick PlayStyle on a 3* card can't do most of what it unlocks. */
  gateSkillMoves?: number;
  /**
   * AcceleRATE pairing. Rapid belongs on a Lengthy card and Quick Step on an Explosive one; put
   * them on the wrong archetype and the PlayStyle fights the run animation instead of helping it.
   */
  accelerate?: { prefers: AccelerateType[]; penalty: number };
  /** Same-axis crowding is handled generically, but a few pairs are the *same* skill twice. */
  overlaps?: string[];
  note?: string;
}

/**
 * Tuned for: direct through-balls, low driven finishing, agility dribbling AND pace dribbling,
 * a manually-controlled box-to-box CAM, AI-controlled defenders. Crossing, headers, long balls
 * and power shots are off the plan and score nothing.
 */
export const PLAYSTYLE_VALUES: Record<string, PlayStyleValue> = {
  // --- Shooting ---------------------------------------------------------------------------
  'Low Driven Shot': {
    axes: { sho: 1 },
    tier: 'core',
    gate: { shotPower: 80, finishing: 78 }
  },
  'Finesse Shot': {
    axes: { sho: 0.8, dri: 0.2 },
    tier: 'core',
    gate: { curve: 80, finishing: 80 },
    note: 'The strongest shooting PlayStyle in the game. Was held at a fraction as off-plan; that was the model disagreeing with how the game is actually won.'
  },
  'Power Shot': { axes: { sho: 1 }, tier: 'off' },
  'Chip Shot': { axes: { sho: 1 }, tier: 'off' },

  // --- Passing ----------------------------------------------------------------------------
  'Incisive Pass': {
    axes: { pas: 1 },
    tier: 'core',
    gate: { vision: 80, shortPass: 82 },
    note: 'The core of a through-ball game: this is the one to build around.'
  },
  'Dead Ball': {
    axes: { pas: 1 },
    tier: 'support',
    gate: { freekick: 80, curve: 80 },
    note: 'Takes set pieces but does not build around them — a small bonus, never a reason to pick an evo.'
  },
  'Pinged Pass': {
    axes: { pas: 1 },
    tier: 'core',
    gate: { longPass: 80, shortPass: 80 },
    note: 'Driven passes arrive faster and flatter, which is most of what a passing game is doing.'
  },
  'Long Ball Pass': { axes: { pas: 1 }, tier: 'off' },
  'Tiki Taka': {
    axes: { pas: 1 },
    tier: 'support',
    gate: { shortPass: 82 },
    overlaps: ['Incisive Pass'],
    note: 'Real, and a tier below the two it shares a slot with.'
  },
  'Whipped Pass': { axes: { pas: 1 }, tier: 'off' },
  'Inventive': { axes: { pas: 1 }, tier: 'off' },

  // --- Dribbling --------------------------------------------------------------------------
  'Technical': {
    axes: { dri: 1 },
    tier: 'core',
    gate: { agility: 80, balance: 78, ballControl: 82 }
  },
  'Trickster': {
    axes: { dri: 1 },
    tier: 'core',
    gate: { agility: 82, ballControl: 85 },
    gateSkillMoves: 4,
    overlaps: ['Technical']
  },
  'Quick Step': {
    axes: { pac: 0.8, dri: 0.2 },
    tier: 'core',
    gate: { acceleration: 82 },
    accelerate: {
      prefers: ['Explosive', 'Mostly Explosive', 'Controlled Explosive', 'Controlled'],
      penalty: 0.5
    },
    overlaps: ['Rapid'],
    note: 'The acceleration half of the pace pair — wants an agile, explosive card.'
  },
  'Rapid': {
    axes: { pac: 0.7, dri: 0.3 },
    tier: 'core',
    gate: { sprintSpeed: 85 },
    accelerate: { prefers: ['Lengthy', 'Mostly Lengthy', 'Controlled Lengthy'], penalty: 0.55 },
    overlaps: ['Quick Step'],
    note: 'The top-speed half — wants a lengthy card that can actually run away from people.'
  },
  'First Touch': {
    axes: { dri: 0.6, pas: 0.4 },
    tier: 'core',
    gate: { ballControl: 82 },
    note: 'Receiving a through ball cleanly is what makes the through ball game work.'
  },
  'Footwork': {
    axes: { dri: 1 },
    tier: 'support',
    gate: { agility: 80, ballControl: 82 },
    overlaps: ['Technical']
  },
  'Gamechanger': {
    axes: { dri: 0.5, sho: 0.3, pas: 0.2 },
    tier: 'core',
    gate: { composure: 80, ballControl: 82 },
    note: 'Axes are a guess — see the question about what it actually does for you.'
  },

  // --- Defending --------------------------------------------------------------------------
  'Anticipate': {
    axes: { def: 1 },
    tier: 'core',
    gate: { defAwareness: 80 },
    note: 'The single best PlayStyle on an AI-controlled defender.'
  },
  'Jockey': {
    axes: { def: 0.8, dri: 0.2 },
    tier: 'core',
    gate: { defAwareness: 78 }
  },
  'Intercept': {
    axes: { def: 1 },
    tier: 'core',
    gate: { interceptions: 80, defAwareness: 78 },
    overlaps: ['Anticipate']
  },
  'Block': {
    axes: { def: 0.7, phy: 0.3 },
    tier: 'support',
    gate: { defAwareness: 78 }
  },
  'Slide Tackle': { axes: { def: 1 }, tier: 'support', gate: { slideTackle: 82 } },
  'Bruiser': { axes: { phy: 1 }, tier: 'off' },
  'Enforcer': { axes: { phy: 0.6, def: 0.4 }, tier: 'off' },

  // --- Physical / other -------------------------------------------------------------------
  'Relentless': {
    axes: { phy: 1 },
    tier: 'core',
    gate: { stamina: 85 },
    note: 'The battery. On the card that is manually dragged back to defend every possession this is the whole point.'
  },
  'Press Proven': {
    axes: { phy: 0.6, def: 0.4 },
    tier: 'core',
    gate: { stamina: 82, aggression: 78 },
    overlaps: ['Relentless']
  },
  'Acrobatic': { axes: { sho: 0.6, dri: 0.4 }, tier: 'off' },
  // Set pieces and crosses are a standing source of goals at both ends, so a card that wins the ball
  // in the air is doing a job — a tier below the ones that decide open play.
  'Aerial Fortress': {
    axes: { phy: 0.6, def: 0.4 },
    tier: 'support',
    gate: { headingAcc: 80, jumping: 82 },
    gateHeightCm: 185
  },
  'Precision Header': {
    axes: { sho: 0.5, phy: 0.5 },
    tier: 'support',
    gate: { headingAcc: 82, jumping: 80 },
    gateHeightCm: 183,
    overlaps: ['Aerial Fortress']
  },
  'Far Reach': { axes: { dri: 1 }, tier: 'off', note: 'Confirm what this does in FC 26 before giving it weight.' },

  // --- GK — the outfield pool never sees these, listed so the table is complete -------------
  'Rush Out': { axes: {}, tier: 'off' },
  'Cross Claimer': { axes: {}, tier: 'off' },
  'Deflector': { axes: {}, tier: 'off' },
  'Far Throw': { axes: {}, tier: 'off' },
  'Long Throw': { axes: {}, tier: 'off' }
};

/**
 * A gate is a ramp, not a cliff: a card 10 points short of the requirement still gets a third of
 * the value, and it climbs from there. A hard cutoff would make one stat point flip an evo
 * between "best in the pool" and "worthless", which is both wrong and impossible to read.
 */
export const GATE_RAMP = 10;
export const GATE_FLOOR = 0.3;
