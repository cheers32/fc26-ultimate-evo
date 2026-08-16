import { AccelerateFamily, calculateAccelerateFamily } from '../utils/statUtils';

/**
 * The finished cards worth building toward.
 *
 * A position is not a plan. Two strikers can both be ST, both be Lengthy, and want opposite things:
 * the one built around finishing and heading wants strength and jumping, and the one built around
 * beating a defender in the box is *ruined* by them, because AcceleRATE turns on agility minus
 * strength and every point of strength is spending the burst that made the card worth using.
 * Ranking those two against one list is how a shortlist ends up full of cards nobody would field.
 *
 * So every position here has two to four plans behind it, and they disagree with each other on
 * purpose — a Rock CB and a Pace CB want different evos out of the same pool.
 *
 * Three rules come from how the game is played rather than from the numbers:
 *
 * Nobody builds toward Controlled. Explosive and Lengthy are the two archetypes you aim at;
 * Controlled is where a card lands when it misses both. So every template names one of the two, and
 * Controlled appears only as a marked fallback where the plan survives it.
 *
 * At end game 90 is the pass mark, not a good score. Every stat a plan runs on has to pass, and
 * below that a build is not a worse version of the plan — it is a different card. That is what
 * `must` means here, and why floors are derived from it rather than tuned per stat. Stamina passes
 * at 94 on every plan, listed or not.
 *
 * Reactions and composure are on every plan, lightly. They are the two stats that change how a card
 * feels everywhere on the pitch, and a plan that never asks for them will happily hand back a
 * 99-finishing striker who is a second late to everything.
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
  /** Sub-stats that have to pass. The floors come from here; the weak link is measured here. */
  must: string[];
  /** Raised only where a plan needs more than the pass mark to be that plan at all. */
  floorOverrides?: Record<string, number>;
  /** Stats that cost the card something by going up. */
  avoid?: string[];
  /** EA's own role names for this plan, used to suggest it for a card that already plays it. */
  roles?: string[];
  /** One line on who this is, so a shortlist can be chosen without reading the weights. */
  blurb: string;
}

/** The end-game pass mark. Below this a stat is a fail, not a low score. */
export const PASS_MARK = 90;

/**
 * What a card has to reach to be worth putting on the pitch at all, whatever the plan is.
 *
 * These are not stats a plan gets to weigh against others — they are the difference between a card
 * you would field and one you would not, and a build that misses one is not recommended at all
 * rather than recommended with a note.
 *
 * - Pace and stamina, on every position. A defender who cannot turn and run with a winger, or who
 *   is walking at eighty minutes, does not do the job however well he reads the game.
 * - Balance and ball control, because they are what the card feels like on the ball at all: one
 *   that loses it under contact or takes two touches to turn stops getting picked.
 *
 * 93 rather than 90 because a chemistry style is worth +3 to +6: from 93 the card ends up at the 96
 * or 99 the build is actually for.
 */
export const FIELDABLE = 93;

export const FIELDABLE_FLOORS: Record<string, number> = {
  acceleration: FIELDABLE,
  sprintSpeed: FIELDABLE,
  stamina: FIELDABLE,
  balance: FIELDABLE,
  ballControl: FIELDABLE
};

/**
 * The floors that are read off the bare card even when a chemistry style is being assumed.
 *
 * Pace is the one thing a style must not be allowed to paper over. Everything else a style adds is
 * a bonus on top of a card that already works; a card that needs Shadow to reach 93 pace is a card
 * that is slow the moment the style is anything else, and at end game that is not a card. So the
 * pace floor is checked against the card as it is, and the rest against the card as it is fielded.
 */
export const BARE_FLOORS: Record<string, number> = {
  acceleration: FIELDABLE,
  sprintSpeed: FIELDABLE
};

/**
 * What each stat a plan runs on has to reach: the fieldable floors every plan is behind, plus 90 on
 * whatever this one names, plus anything it raises for itself.
 *
 * Derived rather than written per template so a plan cannot forget one — which is the bug this
 * closes: ten of these plans never named stamina in `must`, so a centre-back or a striker could be
 * recommended at any stamina at all and nothing in the model objected.
 */
export function floorsOf(t: BuildTemplate): Record<string, number> {
  const out: Record<string, number> = { ...FIELDABLE_FLOORS };
  for (const key of t.must) out[key] = Math.max(out[key] ?? 0, PASS_MARK);
  for (const [key, v] of Object.entries(t.floorOverrides || {})) out[key] = Math.max(out[key] ?? 0, v);
  return out;
}

const SHARP = { reactions: 0.06, composure: 0.06 };

export const BUILD_TEMPLATES: BuildTemplate[] = [
  // ---- Centre-back -----------------------------------------------------------------------------
  {
    id: 'rock-cb',
    name: 'Rock CB',
    positions: ['CB'],
    archetype: 'Lengthy',
    maximise: { strength: 0.17, defAwareness: 0.17, headingAcc: 0.15, standTackle: 0.13, jumping: 0.11, interceptions: 0.1, aggression: 0.07, ...SHARP },
    must: ['strength', 'defAwareness', 'headingAcc', 'standTackle', 'jumping'],
    roles: ['Centre-Half', 'Stopper'],
    blurb: 'Wins the ball, wins the header, wins the shove.'
  },
  {
    id: 'pace-cb',
    name: 'Pace CB',
    positions: ['CB'],
    archetype: 'Lengthy',
    maximise: { sprintSpeed: 0.18, defAwareness: 0.16, standTackle: 0.14, acceleration: 0.14, interceptions: 0.12, strength: 0.1, headingAcc: 0.08, ...SHARP },
    must: ['sprintSpeed', 'acceleration', 'defAwareness', 'standTackle', 'strength'],
    floorOverrides: { sprintSpeed: 92 },
    roles: ['Centre-Half', 'Ball-Playing Defender'],
    blurb: 'Plays a high line and dares you to run in behind.'
  },
  {
    id: 'sweeper-cb',
    name: 'Sweeper CB',
    positions: ['CB'],
    archetype: 'Explosive',
    maximise: { defAwareness: 0.18, interceptions: 0.16, acceleration: 0.14, standTackle: 0.14, agility: 0.12, sprintSpeed: 0.1, shortPass: 0.04, ...SHARP },
    must: ['defAwareness', 'interceptions', 'standTackle', 'acceleration', 'agility'],
    roles: ['Ball-Playing Defender', 'Stopper'],
    blurb: 'Reads it early and steps out to take it.'
  },
  {
    id: 'ball-playing-cb',
    name: 'Ball-Playing CB',
    positions: ['CB'],
    archetype: 'Lengthy',
    maximise: { defAwareness: 0.18, standTackle: 0.15, shortPass: 0.13, interceptions: 0.12, strength: 0.11, longPass: 0.1, headingAcc: 0.09, ...SHARP },
    must: ['defAwareness', 'standTackle', 'strength', 'shortPass', 'headingAcc'],
    roles: ['Ball-Playing Defender'],
    blurb: 'Defends the box and starts the move.'
  },

  // ---- Full-back -------------------------------------------------------------------------------
  {
    id: 'cafu-fb',
    name: 'Cafu Full-Back',
    positions: ['LB', 'RB', 'LWB', 'RWB'],
    archetype: 'Explosive',
    maximise: { acceleration: 0.17, sprintSpeed: 0.15, stamina: 0.14, crossing: 0.12, agility: 0.1, dribbling: 0.1, standTackle: 0.1, ...SHARP },
    must: ['acceleration', 'sprintSpeed', 'stamina', 'crossing', 'standTackle'],
    roles: ['Attacking Wingback', 'Wingback'],
    blurb: 'Ninety minutes of touchline. Attacks first, defends second.'
  },
  {
    id: 'lockdown-fb',
    name: 'Lockdown Full-Back',
    positions: ['LB', 'RB', 'LWB', 'RWB'],
    archetype: 'Explosive',
    maximise: { defAwareness: 0.17, standTackle: 0.16, interceptions: 0.13, acceleration: 0.12, sprintSpeed: 0.11, stamina: 0.1, strength: 0.04, aggression: 0.07, ...SHARP },
    must: ['defAwareness', 'standTackle', 'interceptions', 'acceleration', 'stamina'],
    roles: ['Fullback', 'Falseback'],
    blurb: 'The winger gets past him once a season.'
  },
  {
    id: 'flying-wingback',
    name: 'Flying Wing-Back',
    positions: ['LB', 'RB', 'LWB', 'RWB'],
    archetype: 'Lengthy',
    maximise: { sprintSpeed: 0.18, stamina: 0.16, strength: 0.13, crossing: 0.12, standTackle: 0.12, defAwareness: 0.11, acceleration: 0.1, ...SHARP },
    must: ['sprintSpeed', 'stamina', 'standTackle', 'defAwareness', 'strength'],
    roles: ['Wingback', 'Attacking Wingback'],
    blurb: 'Long strides, and gets back every time.'
  },

  // ---- Holding midfield ------------------------------------------------------------------------
  {
    id: 'anchor',
    name: 'Anchor CDM',
    positions: ['CDM', 'CM'],
    archetype: 'Lengthy',
    maximise: { defAwareness: 0.18, standTackle: 0.16, interceptions: 0.13, strength: 0.11, headingAcc: 0.09, shortPass: 0.08, stamina: 0.08, aggression: 0.07, ...SHARP },
    must: ['defAwareness', 'standTackle', 'interceptions', 'strength', 'stamina'],
    roles: ['Holding', 'Centre-Half'],
    blurb: 'Sits in front of the back four and does not move.'
  },
  {
    id: 'ball-winner',
    name: 'Ball-Winner',
    positions: ['CDM', 'CM'],
    archetype: 'Explosive',
    maximise: { interceptions: 0.17, standTackle: 0.16, defAwareness: 0.14, stamina: 0.12, agility: 0.1, acceleration: 0.11, shortPass: 0.06, aggression: 0.08, ...SHARP },
    must: ['interceptions', 'standTackle', 'defAwareness', 'stamina', 'agility'],
    avoid: ['strength'],
    roles: ['Holding', 'Box-To-Box'],
    blurb: 'Hunts it down. Second to the ball is never his problem.'
  },

  // ---- Central midfield ------------------------------------------------------------------------
  {
    id: 'playmaker',
    name: 'Deep-Lying Playmaker',
    positions: ['CM', 'CDM', 'CAM'],
    archetype: 'Explosive',
    // A tall metronome is a real card, and it is Controlled. Allowed, but said out loud.
    controlledFallback: true,
    maximise: { shortPass: 0.16, vision: 0.16, ballControl: 0.13, longPass: 0.12, curve: 0.08, agility: 0.08, stamina: 0.07, ...SHARP },
    must: ['shortPass', 'vision', 'ballControl', 'composure', 'reactions', 'stamina'],
    roles: ['Deep-Lying Playmaker', 'Playmaker', 'Classic 10'],
    blurb: 'Sets the tempo — every pass on, nothing rushed.'
  },
  {
    id: 'box-to-box',
    name: 'Box-to-Box Engine',
    positions: ['CM', 'CDM'],
    archetype: 'Lengthy',
    maximise: { stamina: 0.17, strength: 0.13, shortPass: 0.12, standTackle: 0.12, sprintSpeed: 0.11, dribbling: 0.1, interceptions: 0.1, longShots: 0.03, ...SHARP },
    must: ['stamina', 'shortPass', 'standTackle', 'strength', 'composure'],
    roles: ['Box-To-Box'],
    blurb: 'Covers both boxes and is still there at ninety.'
  },
  {
    id: 'engine-cm',
    name: 'Engine CM',
    positions: ['CM', 'CDM'],
    archetype: 'Explosive',
    maximise: { stamina: 0.17, acceleration: 0.13, dribbling: 0.13, shortPass: 0.13, agility: 0.11, standTackle: 0.11, ballControl: 0.1, ...SHARP },
    must: ['stamina', 'acceleration', 'shortPass', 'dribbling', 'standTackle'],
    avoid: ['strength'],
    roles: ['Box-To-Box', 'Playmaker'],
    blurb: 'Small, quick, everywhere. Turns out of trouble instead of holding it off.'
  },

  // ---- Attacking midfield ----------------------------------------------------------------------
  {
    id: 'maradona-cam',
    name: 'Maradona CAM',
    positions: ['CAM', 'LW', 'RW', 'LM', 'RM'],
    archetype: 'Explosive',
    maximise: { agility: 0.18, dribbling: 0.18, balance: 0.14, ballControl: 0.13, acceleration: 0.13, shortPass: 0.06, vision: 0.06, ...SHARP },
    must: ['agility', 'dribbling', 'ballControl', 'balance', 'acceleration', 'composure'],
    // The floors are the point of this template. Everything below them is the kind of build that
    // looks fine as a total and feels like a lorry on the pitch.
    floorOverrides: { agility: 92, dribbling: 92, balance: 92 },
    // Strength is the whole trap on this one: it adds to PHY and IGS while spending the very gap
    // that makes the card Explosive.
    avoid: ['strength', 'aggression'],
    roles: ['Classic 10', 'Playmaker', 'Inside Forward'],
    blurb: 'Turns in a phone box. Low, quick and impossible to press.'
  },
  {
    id: 'classic-10',
    name: 'Classic 10',
    positions: ['CAM', 'CF'],
    archetype: 'Explosive',
    controlledFallback: true,
    maximise: { vision: 0.18, shortPass: 0.15, ballControl: 0.13, curve: 0.12, longPass: 0.1, freekick: 0.08, dribbling: 0.08, longShots: 0.04, ...SHARP },
    must: ['vision', 'shortPass', 'ballControl', 'composure', 'curve'],
    roles: ['Classic 10', 'Playmaker'],
    blurb: 'Plays the pass nobody else sees, from a standing start.'
  },
  {
    id: 'shadow-striker',
    name: 'Shadow Striker',
    positions: ['CAM', 'CF', 'ST'],
    archetype: 'Explosive',
    maximise: { finishing: 0.18, positioning: 0.16, acceleration: 0.14, agility: 0.12, longShots: 0.11, dribbling: 0.1, shotPower: 0.07, ...SHARP },
    must: ['finishing', 'positioning', 'acceleration', 'agility', 'composure'],
    avoid: ['strength'],
    roles: ['Shadow Striker', 'Inside Forward', 'False 9'],
    blurb: 'Arrives late from deep and finishes first time.'
  },

  // ---- Wide ------------------------------------------------------------------------------------
  {
    id: 'speed-winger',
    name: 'Speed Winger',
    positions: ['LW', 'RW', 'LM', 'RM'],
    archetype: 'Explosive',
    maximise: { acceleration: 0.2, sprintSpeed: 0.16, agility: 0.15, dribbling: 0.15, balance: 0.12, ballControl: 0.08, stamina: 0.06, ...SHARP },
    must: ['acceleration', 'sprintSpeed', 'agility', 'dribbling', 'stamina'],
    floorOverrides: { acceleration: 94, sprintSpeed: 92 },
    avoid: ['strength'],
    roles: ['Winger', 'Wide Midfielder'],
    blurb: 'Knocks it past the full-back and goes.'
  },
  {
    id: 'inside-forward',
    name: 'Inside Forward',
    positions: ['LW', 'RW', 'LM', 'RM'],
    archetype: 'Explosive',
    maximise: { finishing: 0.17, dribbling: 0.15, curve: 0.13, agility: 0.13, acceleration: 0.12, longShots: 0.11, ballControl: 0.11, ...SHARP },
    must: ['finishing', 'dribbling', 'agility', 'acceleration', 'curve'],
    avoid: ['strength'],
    roles: ['Inside Forward', 'Wide Playmaker'],
    blurb: 'Comes inside onto the good foot and bends it.'
  },
  {
    id: 'power-winger',
    name: 'Power Winger',
    positions: ['LW', 'RW', 'LM', 'RM'],
    archetype: 'Lengthy',
    maximise: { sprintSpeed: 0.19, strength: 0.14, dribbling: 0.13, finishing: 0.13, acceleration: 0.12, ballControl: 0.11, stamina: 0.08, ...SHARP },
    must: ['sprintSpeed', 'dribbling', 'finishing', 'strength', 'stamina'],
    floorOverrides: { sprintSpeed: 94 },
    roles: ['Winger', 'Inside Forward'],
    blurb: 'Gets to full speed and nobody gets him off it.'
  },

  // ---- Striker ---------------------------------------------------------------------------------
  {
    id: 'ronaldo-st',
    name: 'Ronaldo ST',
    positions: ['ST', 'CF'],
    archetype: 'Lengthy',
    maximise: { finishing: 0.18, positioning: 0.15, shotPower: 0.13, headingAcc: 0.12, sprintSpeed: 0.11, jumping: 0.1, longShots: 0.09, ...SHARP },
    must: ['finishing', 'positioning', 'shotPower', 'sprintSpeed', 'composure'],
    floorOverrides: { finishing: 92 },
    roles: ['Advanced Forward', 'Complete Forward'],
    blurb: 'Arrives and finishes — in the air or off either foot.'
  },
  {
    id: 'target-st',
    name: 'Target Man',
    positions: ['ST', 'CF'],
    archetype: 'Lengthy',
    maximise: { strength: 0.18, headingAcc: 0.17, jumping: 0.14, finishing: 0.13, shotPower: 0.12, positioning: 0.1, ballControl: 0.04, ...SHARP },
    must: ['strength', 'headingAcc', 'finishing', 'jumping', 'positioning'],
    roles: ['Target Forward', 'Complete Forward'],
    blurb: 'Holds it up, wins everything in the air.'
  },
  {
    id: 'poacher',
    name: 'Poacher',
    positions: ['ST', 'CF'],
    archetype: 'Explosive',
    maximise: { finishing: 0.2, positioning: 0.17, acceleration: 0.15, agility: 0.12, balance: 0.1, shotPower: 0.1, ballControl: 0.04, ...SHARP },
    must: ['finishing', 'positioning', 'acceleration', 'agility', 'composure'],
    floorOverrides: { finishing: 94, positioning: 92 },
    avoid: ['strength'],
    roles: ['Poacher', 'Advanced Forward'],
    blurb: 'Lives on the shoulder. One touch, in.'
  }
];

/** The templates that make sense for a card, by the positions it can play. */
export function templatesFor(positions: string[]): BuildTemplate[] {
  const own = new Set(positions.map(p => p.trim().toUpperCase()).filter(Boolean));
  return BUILD_TEMPLATES.filter(t => t.positions.some(p => own.has(p)));
}

/**
 * Whether a card can read an archetype at all, before any stat or style is considered. Height is
 * the one input no evo can change: below 185 a card will never be Lengthy, above 182 it will never
 * be Explosive. This is what stops a 180cm icon being handed a Lengthy destroyer plan that quietly
 * demoted itself to Controlled — a plan the card cannot carry out is not a fallback, it is the
 * wrong plan, and printing it is how a shortlist fills up with strength on a playmaker.
 */
export function archetypePossible(fam: AccelerateFamily, heightCm?: number): boolean {
  if (heightCm === undefined) return true;
  if (fam === 'Lengthy') return heightCm >= 185;
  if (fam === 'Explosive') return heightCm <= 182;
  return true;
}

/** Whether a plan is worth offering for a card at all: right position, reachable archetype. */
export function templatesAvailable(positions: string[], heightCm?: number): BuildTemplate[] {
  return templatesFor(positions).filter(
    t => archetypePossible(t.archetype, heightCm) || (t.controlledFallback === true && t.archetype === 'Explosive')
  );
}

/**
 * The one or two plans this card is already closest to.
 *
 * Three signals, in the order a person would use them. What EA already thinks the card is — a role
 * printed at ++ is the game saying this player does this — then whether the card already reads the
 * plan's archetype with no help at all, and only then the stats. Stats alone would nominate a Target
 * Man for every big striker in the game; the roles are what separate the one who plays that way.
 *
 * Roles count for less the further down the position list they sit. A card's first position is the
 * one it is actually bought for, and without that decay a seven-position midfielder gets suggested
 * whatever plan its sixth position happens to be good at.
 *
 * The stat term is deliberately small. Comparing weighted means across plans that lean on different
 * stats is apples to oranges — passing stats read higher than shooting stats on almost every card —
 * so it is a tiebreak between plans the roles rate equally, not a ranking of its own.
 */
export function suggestTemplates(
  positions: string[],
  subs: Record<string, number>,
  roles: Record<string, string[]> | undefined,
  heightCm?: number,
  limit = 2
): string[] {
  const available = templatesAvailable(positions, heightCm);
  if (available.length === 0) return [];

  const bare = calculateAccelerateFamily(
    subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, heightCm
  );

  const own = new Map<string, number>();
  positions.forEach((pos, i) => {
    const weight = Math.max(0.3, 1 - 0.15 * i);
    for (const raw of roles?.[pos.trim().toLowerCase()] || []) {
      const name = raw.replace(/\+/g, '').trim().toLowerCase();
      const worth = ((raw.match(/\+/g) || []).length >= 2 ? 20 : 10) * weight;
      own.set(name, Math.max(own.get(name) ?? 0, worth));
    }
  });

  return available
    .map(t => {
      let fit = 0;
      let total = 0;
      for (const [key, w] of Object.entries(t.maximise)) {
        fit += (subs[key] ?? 0) * w;
        total += w;
      }
      if (total > 0) fit /= total;

      fit += Math.max(0, ...(t.roles || []).map(n => own.get(n.toLowerCase()) ?? 0));
      if (bare === t.archetype) fit += 6;

      return { t, fit };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, limit)
    .map(x => x.t.id);
}
