import { AccelerateFamily } from '../utils/statUtils';

/**
 * The finished cards worth building toward.
 *
 * A position is not a plan. Two strikers can both be ST, both be Lengthy, and want opposite things:
 * the one built around finishing and heading wants strength and jumping, and the one built around
 * beating a defender in the box is *ruined* by them, because AcceleRATE turns on agility minus
 * strength and every point of strength is spending the burst that made the card worth using.
 * Ranking those two against one list is how a shortlist ends up full of cards nobody would field.
 *
 * Three rules here come from how the game is actually played rather than from the numbers:
 *
 * Nobody builds toward Controlled. Explosive and Lengthy are the two archetypes you aim at;
 * Controlled is where a card lands when it misses both. So every template names one of the two, and
 * Controlled appears only as a marked fallback when the card cannot reach either.
 *
 * Reactions and composure are on every plan, lightly. They are the two stats that change how a card
 * feels in every position on the pitch, and a plan that never asks for them will happily hand back a
 * 99-finishing striker who is a second late to everything.
 *
 * Stats have floors, not gradients, and at end game the floor is 90. 78 agility on a dribbler is
 * not "slightly low", it is a card you put back, and no weighted average will ever say so because
 * eight good stats always cover for it. So every stat a plan actually runs on passes at 90 — below
 * that a build is not a worse version of the plan, it is a different card. Stamina passes at 92:
 * a card that cannot last ninety minutes is not one you build, whatever else the chain gave it.
 */
export interface BuildTemplate {
  id: string;
  /** What to call it on screen — short enough to head a shortlist. */
  name: string;
  /** Positions this plan makes sense at. */
  positions: string[];
  /** The archetype the card has to be able to read. A template is not a preference. */
  archetype: AccelerateFamily;
  /**
   * Whether Controlled is an acceptable landing spot when the card cannot reach `archetype`.
   * Marked on the row when it happens, never quietly.
   *
   * Only ever honoured on an Explosive template, and the asymmetry is the point: a card too big to
   * be Explosive is still the same plan on Controlled — a tall metronome passes exactly as well. A
   * card too small to be Lengthy is not a slower version of a destroyer, it is a different player,
   * and the strength that plan wants is precisely what ruins it. So Lengthy templates never fall
   * back; they simply do not apply.
   */
  controlledFallback?: boolean;
  /** Sub-stats the plan is built on, weighted. Normalised at use, so these are relative. */
  maximise: Record<string, number>;
  /** Sub-stats that must not be left behind. The weak link is the worst of these. */
  must: string[];
  /** Below these, the build is not on this plan at all. Hard gate, reported when nothing clears it. */
  floors: Record<string, number>;
  /** Stats that cost the card something by going up. */
  avoid?: string[];
  /** One line on who this is, so a shortlist can be chosen without reading the weights. */
  blurb: string;
}

export const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'playmaker',
    name: 'Deep-Lying Playmaker',
    positions: ['CM', 'CDM', 'CAM'],
    archetype: 'Explosive',
    // A tall metronome is a real card, and it is Controlled. Allowed, but said out loud.
    controlledFallback: true,
    maximise: { shortPass: 0.16, vision: 0.16, ballControl: 0.12, composure: 0.12, longPass: 0.1, reactions: 0.1, agility: 0.1, curve: 0.07, stamina: 0.07 },
    must: ['shortPass', 'vision', 'composure', 'reactions', 'ballControl', 'stamina'],
    floors: { shortPass: 90, vision: 90, composure: 90, reactions: 90, ballControl: 90, stamina: 92, agility: 90 },
    blurb: 'Sets the tempo — every pass on, nothing rushed.'
  },
  {
    id: 'anchor',
    name: 'Anchor CDM',
    positions: ['CDM', 'CM', 'CB'],
    archetype: 'Lengthy',
    maximise: { defAwareness: 0.2, standTackle: 0.18, interceptions: 0.14, strength: 0.12, headingAcc: 0.1, composure: 0.08, shortPass: 0.08, stamina: 0.06, jumping: 0.04, reactions: 0.06 },
    must: ['defAwareness', 'standTackle', 'interceptions', 'strength', 'stamina'],
    floors: { defAwareness: 90, standTackle: 90, interceptions: 90, strength: 90, stamina: 92, composure: 90 },
    blurb: 'Sits in front of the back four and does not move.'
  },
  {
    id: 'maradona-cam',
    name: 'Maradona CAM',
    positions: ['CAM', 'CF', 'LW', 'RW', 'LM', 'RM'],
    archetype: 'Explosive',
    maximise: { agility: 0.18, dribbling: 0.18, balance: 0.14, ballControl: 0.13, acceleration: 0.13, composure: 0.09, shortPass: 0.08, vision: 0.07, reactions: 0.06 },
    must: ['agility', 'dribbling', 'ballControl', 'balance', 'acceleration', 'composure', 'stamina'],
    // The floors are the point of this template. Everything below them is the kind of build that
    // looks fine as a total and feels like a lorry on the pitch.
    floors: { agility: 90, dribbling: 90, ballControl: 90, balance: 90, acceleration: 90, composure: 90, stamina: 92 },
    // Strength is the whole trap on this one: it adds to PHY and IGS while spending the very gap
    // that makes the card Explosive.
    avoid: ['strength', 'aggression'],
    blurb: 'Turns in a phone box. Low, quick and impossible to press.'
  },
  {
    id: 'ronaldo-st',
    name: 'Ronaldo ST',
    positions: ['ST', 'CF', 'LW', 'RW'],
    archetype: 'Lengthy',
    maximise: { finishing: 0.18, positioning: 0.16, shotPower: 0.14, headingAcc: 0.12, jumping: 0.1, sprintSpeed: 0.1, longShots: 0.08, strength: 0.06, composure: 0.06, reactions: 0.06 },
    must: ['finishing', 'positioning', 'composure', 'shotPower', 'sprintSpeed', 'stamina'],
    floors: { finishing: 90, positioning: 90, composure: 90, shotPower: 90, sprintSpeed: 90, stamina: 92, jumping: 90 },
    blurb: 'Arrives and finishes — in the air or off either foot.'
  },
  {
    id: 'speed-winger',
    name: 'Speed Winger',
    positions: ['LW', 'RW', 'LM', 'RM', 'ST'],
    archetype: 'Explosive',
    maximise: { acceleration: 0.2, sprintSpeed: 0.16, agility: 0.15, dribbling: 0.15, balance: 0.12, finishing: 0.08, ballControl: 0.08, stamina: 0.06, reactions: 0.06, composure: 0.06 },
    must: ['acceleration', 'sprintSpeed', 'agility', 'dribbling', 'stamina'],
    floors: { acceleration: 90, sprintSpeed: 90, agility: 90, dribbling: 90, stamina: 92, balance: 90 },
    avoid: ['strength'],
    blurb: 'Knocks it past the full-back and goes.'
  },
  {
    id: 'target-st',
    name: 'Target Man',
    positions: ['ST', 'CF'],
    archetype: 'Lengthy',
    maximise: { strength: 0.18, headingAcc: 0.18, jumping: 0.15, finishing: 0.14, shotPower: 0.12, positioning: 0.1, composure: 0.07, sprintSpeed: 0.06, reactions: 0.06 },
    must: ['strength', 'headingAcc', 'finishing', 'jumping', 'positioning', 'stamina'],
    floors: { strength: 90, headingAcc: 90, finishing: 90, jumping: 90, positioning: 90, stamina: 92 },
    blurb: 'Holds it up, wins everything in the air.'
  },
  {
    id: 'ball-playing-cb',
    name: 'Ball-Playing CB',
    positions: ['CB', 'CDM'],
    archetype: 'Lengthy',
    maximise: { defAwareness: 0.2, standTackle: 0.16, interceptions: 0.13, strength: 0.12, headingAcc: 0.11, shortPass: 0.1, jumping: 0.08, composure: 0.06, longPass: 0.04, reactions: 0.06 },
    must: ['defAwareness', 'standTackle', 'strength', 'headingAcc', 'composure', 'stamina'],
    floors: { defAwareness: 90, standTackle: 90, strength: 90, headingAcc: 90, composure: 90, stamina: 92, jumping: 90 },
    blurb: 'Defends the box and starts the move.'
  },
  {
    id: 'attacking-fullback',
    name: 'Attacking Full-Back',
    positions: ['LB', 'RB', 'LWB', 'RWB'],
    archetype: 'Explosive',
    maximise: { acceleration: 0.18, sprintSpeed: 0.16, stamina: 0.14, standTackle: 0.12, defAwareness: 0.11, crossing: 0.1, agility: 0.1, dribbling: 0.05, interceptions: 0.04, reactions: 0.06, composure: 0.06 },
    must: ['acceleration', 'sprintSpeed', 'stamina', 'standTackle', 'defAwareness'],
    floors: { acceleration: 90, sprintSpeed: 90, stamina: 92, standTackle: 90, defAwareness: 90 },
    blurb: 'Up and down the touchline for ninety minutes.'
  },
  {
    id: 'box-to-box',
    name: 'Box-to-Box Engine',
    positions: ['CM', 'CDM', 'CAM'],
    archetype: 'Lengthy',
    maximise: { stamina: 0.16, shortPass: 0.13, strength: 0.12, standTackle: 0.12, sprintSpeed: 0.11, dribbling: 0.1, composure: 0.09, interceptions: 0.09, longShots: 0.08, reactions: 0.06 },
    must: ['stamina', 'shortPass', 'standTackle', 'strength', 'composure'],
    floors: { stamina: 92, shortPass: 90, standTackle: 90, strength: 90, composure: 90 },
    blurb: 'Covers both boxes and is still there at ninety.'
  }
];

/** The templates that make sense for a card, by the positions it can play. */
export function templatesFor(positions: string[]): BuildTemplate[] {
  const own = new Set(positions.map(p => p.trim().toUpperCase()).filter(Boolean));
  return BUILD_TEMPLATES.filter(t => t.positions.some(p => own.has(p)));
}
