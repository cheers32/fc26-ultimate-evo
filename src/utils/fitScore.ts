import { PlayerBio, PlayStylesData, StatsData } from '../types/player';
import { POSITION_WEIGHTS } from './positionWeights';
import { AccelerateType, calculateAccelerateType, parseHeightCm } from './statUtils';
import {
  GATE_FLOOR,
  GATE_RAMP,
  PLAYSTYLE_VALUES,
  PlayStyleValue,
  StatAxis
} from './playstyleValues';
import {
  BODY_FIT_POINTS,
  CONTROL_MULTIPLIERS,
  CONTROL_SUBSTAT_MULTIPLIERS,
  CROWDING_DISCOUNTS,
  ControlMode,
  DEFAULT_SUBSTAT_WEIGHT,
  OVERLAP_DISCOUNT,
  POSITION_BODY_PREFERENCE,
  PS_PLUS_POINTS,
  SILVER_RATIO,
  SUBSTAT_WEIGHTS,
  TIER_MULTIPLIERS,
  defaultControlMode
} from './playstyleProfile';

/**
 * "Fit": what a card is worth to one particular player, in one number.
 *
 * The path search's own ranking answers "which build has the most stats". This answers "which
 * build do *I* want", and it does so in the same units — position-score points, roughly 0-99 —
 * so the two can be compared, mixed, and reasoned about without a second scale to calibrate.
 *
 *   fit = sub-stat weighted position score
 *       + PlayStyle value (tier x gate x control mode x crowding)
 *       + AcceleRATE body fit
 *
 * Every taste-dependent number lives in playstyleProfile.ts; this file is only the arithmetic.
 */

export interface FitContext {
  stats: StatsData;
  playStyles: PlayStylesData;
  bio: PlayerBio;
  mode: ControlMode;
}

export interface FitBreakdown {
  total: number;
  stats: number;
  playStyles: number;
  body: number;
  accelerate: AccelerateType;
  /** Per-PlayStyle contributions, best first — what the UI shows when asked "why". */
  playStyleDetail: { name: string; gold: boolean; points: number }[];
}

const FACE_KEYS: StatAxis[] = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];

const cleanName = (ps: string) => ps.replace(/\+/g, '').trim();

export function positionsOf(bio: PlayerBio): string[] {
  return bio.primaryPositions.split(',').map(p => p.trim().toUpperCase()).filter(Boolean);
}

/** Primary position counts full, every other listed position counts half. */
function positionWeights(bio: PlayerBio): { pos: string; weight: number }[] {
  const positions = positionsOf(bio);
  if (positions.length === 0) return [{ pos: '', weight: 1 }];
  return positions.map((pos, idx) => ({ pos, weight: idx === 0 ? 1 : 0.5 }));
}

export function controlModeFor(bio: PlayerBio, explicit?: ControlMode): ControlMode {
  return explicit ?? defaultControlMode(bio.primaryPositions);
}

function subValue(stats: StatsData, key: string): number | undefined {
  for (const face of Object.values(stats)) {
    const sub = face.subs?.[key];
    if (sub) return sub.base;
  }
  return undefined;
}

export function accelerateOf(stats: StatsData, bio: PlayerBio): AccelerateType {
  return calculateAccelerateType(
    subValue(stats, 'acceleration') ?? 50,
    subValue(stats, 'agility') ?? 50,
    subValue(stats, 'strength') ?? 50,
    parseHeightCm(bio.height)
  );
}

/**
 * A gate ramps rather than cuts: at the threshold it is 1, GATE_RAMP points below it bottoms out
 * at GATE_FLOOR. The weakest requirement decides — a PlayStyle needing both vision and short pass
 * is only as good as whichever the card is worse at.
 */
function gateMultiplier(def: PlayStyleValue, stats: StatsData, bio: PlayerBio): number {
  let worst = 1;

  for (const [key, threshold] of Object.entries(def.gate || {})) {
    const value = subValue(stats, key);
    if (value === undefined) continue;
    const ramp = GATE_FLOOR + (1 - GATE_FLOOR) * ((value - threshold + GATE_RAMP) / GATE_RAMP);
    worst = Math.min(worst, Math.max(GATE_FLOOR, Math.min(1, ramp)));
  }

  if (def.gateHeightCm !== undefined) {
    const height = parseHeightCm(bio.height);
    if (height !== undefined && height < def.gateHeightCm) {
      worst = Math.min(worst, Math.max(GATE_FLOOR, 1 - (def.gateHeightCm - height) / 15));
    }
  }

  if (def.gateSkillMoves !== undefined && bio.skillMoves < def.gateSkillMoves) {
    worst = Math.min(worst, GATE_FLOOR);
  }

  return worst;
}

/**
 * How much of this PlayStyle's amplification lands on stats the position actually cares about,
 * normalised so a perfectly-aimed PlayStyle scores 1. Without the normalisation every value would
 * be scaled down by whatever the position's largest axis weight happens to be, and PS_PLUS_POINTS
 * would no longer mean what it says.
 */
function axisFit(def: PlayStyleValue, pos: string): number {
  const weights = POSITION_WEIGHTS[pos];
  if (!weights) {
    return FACE_KEYS.reduce((sum, k) => sum + (def.axes[k] || 0), 0) / FACE_KEYS.length;
  }
  const peak = Math.max(...FACE_KEYS.map(k => weights[k] || 0));
  if (peak <= 0) return 0;
  return FACE_KEYS.reduce((sum, k) => sum + (def.axes[k] || 0) * (weights[k] || 0), 0) / peak;
}

/** Value of one PlayStyle in isolation — before crowding against the ones already on the card. */
export function playStyleValue(
  name: string,
  isGold: boolean,
  ctx: FitContext,
  accelerate: AccelerateType
): number {
  const def = PLAYSTYLE_VALUES[cleanName(name)];
  if (!def) return 0;

  const tier = TIER_MULTIPLIERS[def.tier];
  if (tier <= 0) return 0;

  const fit = positionWeights(ctx.bio).reduce(
    (acc, { pos, weight }) => ({
      sum: acc.sum + axisFit(def, pos) * weight,
      weight: acc.weight + weight
    }),
    { sum: 0, weight: 0 }
  );
  const positionFit = fit.weight > 0 ? fit.sum / fit.weight : 0;
  if (positionFit <= 0) return 0;

  const modeMultiplier = CONTROL_MULTIPLIERS[ctx.mode][cleanName(name)] ?? 1;
  const accelerateMultiplier =
    def.accelerate && !def.accelerate.prefers.includes(accelerate) ? def.accelerate.penalty : 1;

  return (
    PS_PLUS_POINTS *
    (isGold ? 1 : SILVER_RATIO) *
    tier *
    positionFit *
    gateMultiplier(def, ctx.stats, ctx.bio) *
    modeMultiplier *
    accelerateMultiplier
  );
}

interface CrowdingState {
  /** How many PlayStyles already lean on each axis. */
  axisCount: Partial<Record<StatAxis, number>>;
  taken: Set<string>;
}

function newCrowding(): CrowdingState {
  return { axisCount: {}, taken: new Set() };
}

function dominantAxis(def: PlayStyleValue): StatAxis {
  return FACE_KEYS.reduce((best, k) => ((def.axes[k] || 0) > (def.axes[best] || 0) ? k : best), FACE_KEYS[0]);
}

/**
 * The value a PlayStyle adds *given what the card already has*. Two PlayStyles pushing the same
 * axis are not worth twice one of them — this is what stops an optimiser from filling every free
 * slot with the same idea instead of covering the card's gaps.
 */
function marginalValue(name: string, isGold: boolean, ctx: FitContext, accelerate: AccelerateType, crowding: CrowdingState): number {
  const def = PLAYSTYLE_VALUES[cleanName(name)];
  if (!def) return 0;

  const raw = playStyleValue(name, isGold, ctx, accelerate);
  if (raw <= 0) return 0;

  const used = crowding.axisCount[dominantAxis(def)] || 0;
  let discount = CROWDING_DISCOUNTS[Math.min(used, CROWDING_DISCOUNTS.length - 1)];
  if (def.overlaps?.some(other => crowding.taken.has(other))) discount *= OVERLAP_DISCOUNT;

  return raw * discount;
}

function commit(name: string, crowding: CrowdingState): void {
  const def = PLAYSTYLE_VALUES[cleanName(name)];
  if (!def) return;
  const axis = dominantAxis(def);
  crowding.axisCount[axis] = (crowding.axisCount[axis] || 0) + 1;
  crowding.taken.add(cleanName(name));
}

/** Total PlayStyle value on a card, applying crowding best-first. */
export function playStylesScore(
  ctx: FitContext,
  accelerate: AccelerateType
): { total: number; detail: { name: string; gold: boolean; points: number }[] } {
  const gold = [...ctx.playStyles.base.gold, ...ctx.playStyles.ev.gold];
  const silver = [...ctx.playStyles.base.silver, ...ctx.playStyles.ev.silver];

  const entries = [
    ...gold.map(name => ({ name, gold: true })),
    ...silver.map(name => ({ name, gold: false }))
  ]
    .map(entry => ({ ...entry, raw: playStyleValue(entry.name, entry.gold, ctx, accelerate) }))
    .sort((a, b) => b.raw - a.raw);

  const crowding = newCrowding();
  const detail: { name: string; gold: boolean; points: number }[] = [];
  let total = 0;

  for (const entry of entries) {
    const points = marginalValue(entry.name, entry.gold, ctx, accelerate, crowding);
    if (points > 0) detail.push({ name: entry.name, gold: entry.gold, points });
    total += points;
    commit(entry.name, crowding);
  }

  return { total, detail };
}

/**
 * Position score at sub-stat resolution. The face stat is a summary that hides the two or three
 * numbers that decide how a card feels — 90 pace built from 95 acceleration is a different card
 * from 90 pace built from 95 sprint speed, and at Elite level that difference is the whole point.
 */
export function substatScore(stats: StatsData, bio: PlayerBio, mode: ControlMode): number {
  const perPosition = positionWeights(bio).map(({ pos, weight }) => {
    const table = SUBSTAT_WEIGHTS[pos];
    const modeMultipliers = CONTROL_SUBSTAT_MULTIPLIERS[mode];

    let weighted = 0;
    let totalWeight = 0;

    for (const face of Object.values(stats)) {
      for (const [key, sub] of Object.entries(face.subs || {})) {
        const base = table?.[key] ?? DEFAULT_SUBSTAT_WEIGHT;
        const w = base * (modeMultipliers[key] ?? 1);
        weighted += sub.base * w;
        totalWeight += w;
      }
    }

    return { score: totalWeight > 0 ? weighted / totalWeight : 0, weight };
  });

  const totalWeight = perPosition.reduce((sum, p) => sum + p.weight, 0);
  return totalWeight > 0
    ? perPosition.reduce((sum, p) => sum + p.score * p.weight, 0) / totalWeight
    : 0;
}

/** How well the card's AcceleRATE archetype matches what the position wants. */
export function bodyFit(accelerate: AccelerateType, bio: PlayerBio): number {
  const preferences = positionsOf(bio).map(pos => POSITION_BODY_PREFERENCE[pos] || 'either');
  if (preferences.length === 0) return 0;

  const factorFor = (preference: 'explosive' | 'lengthy' | 'either'): number => {
    if (preference === 'either') return 0.5;
    const towardsExplosive: Record<AccelerateType, number> = {
      Explosive: 1,
      'Mostly Explosive': 0.7,
      Controlled: 0.3,
      'Mostly Lengthy': 0.1,
      Lengthy: 0
    };
    const value = towardsExplosive[accelerate];
    return preference === 'explosive' ? value : 1 - value;
  };

  const best = Math.max(...preferences.map(factorFor));
  return best * BODY_FIT_POINTS;
}

/**
 * Fit as judged for one position only. The search ranks a separate shortlist per position the
 * player lists, so each of those has to be scored as if that were the only position on the card.
 */
export function fitForPosition(ctx: FitContext, pos: string): number {
  return fitScore({ ...ctx, bio: { ...ctx.bio, primaryPositions: pos } }).total;
}

export function fitScore(ctx: FitContext): FitBreakdown {
  const accelerate = accelerateOf(ctx.stats, ctx.bio);
  const stats = substatScore(ctx.stats, ctx.bio, ctx.mode);
  const { total: playStyles, detail } = playStylesScore(ctx, accelerate);
  const body = bodyFit(accelerate, ctx.bio);

  return {
    total: stats + playStyles + body,
    stats,
    playStyles,
    body,
    accelerate,
    playStyleDetail: detail.sort((a, b) => b.points - a.points)
  };
}

/**
 * The best use of a card's free PlayStyle slots.
 *
 * Free picks change nothing but the PlayStyle lists, so the optimal fill can be computed once the
 * chain is known rather than searched over — and because crowding makes the value function
 * submodular, filling greedily by marginal value is within a constant factor of optimal while
 * costing nothing next to the path search.
 *
 * Slots are first-come, first-served in game: a PlayStyle an evo forces onto the card occupies a
 * slot the player can no longer use. That is why unlocking free picks *early* is worth more than
 * unlocking them late, and why this returns the fill for the card as it stands.
 */
export function bestFreePicks(ctx: FitContext): { gold: string[]; silver: string[]; gain: number } {
  const accelerate = accelerateOf(ctx.stats, ctx.bio);
  const crowding = newCrowding();

  const existingGold = [...ctx.playStyles.base.gold, ...ctx.playStyles.ev.gold];
  const existingSilver = [...ctx.playStyles.base.silver, ...ctx.playStyles.ev.silver];

  // Seed the crowding state with what the card already carries, best-first, so a pick is only
  // credited with what it adds on top.
  [...existingGold.map(n => ({ n, gold: true })), ...existingSilver.map(n => ({ n, gold: false }))]
    .sort((a, b) => playStyleValue(b.n, b.gold, ctx, accelerate) - playStyleValue(a.n, a.gold, ctx, accelerate))
    .forEach(({ n }) => commit(n, crowding));

  const held = new Set([...existingGold, ...existingSilver].map(cleanName));
  const candidates = Object.keys(PLAYSTYLE_VALUES).filter(name => !held.has(name));

  let gain = 0;

  const pick = (slots: number, isGold: boolean): string[] => {
    const chosen: string[] = [];
    for (let i = 0; i < slots; i++) {
      let best: { name: string; points: number } | null = null;
      for (const name of candidates) {
        if (held.has(name)) continue;
        const points = marginalValue(name, isGold, ctx, accelerate, crowding);
        if (points > 0 && (!best || points > best.points)) best = { name, points };
      }
      if (!best) break;
      chosen.push(best.name);
      held.add(best.name);
      commit(best.name, crowding);
      gain += best.points;
    }
    return chosen;
  };

  const goldSlots = Math.max(0, ctx.playStyles.limits.gold - existingGold.length);
  const silverSlots = Math.max(0, ctx.playStyles.limits.silver - existingSilver.length);

  const gold = pick(goldSlots, true);
  const silver = pick(silverSlots, false);

  return { gold, silver, gain };
}
