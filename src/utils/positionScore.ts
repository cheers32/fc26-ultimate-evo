import { PlayerBio, StatsData } from '../types/player';
import {
  BuildTemplate,
  FIELDABLE_FLOORS,
  PASS_MARK,
  floorsOf,
  templatesAvailable
} from '../data/buildTemplates';
import { STYLE_OPTIONS, withStyle } from './chem';
import { AccelerateFamily, calculateAccelerateFamily, parseHeightCm } from './statUtils';

/**
 * What a card is worth at a position, out of 100.
 *
 * The same model the recommendations run on, asked a different question. Analyze ranks builds
 * against each other inside a plan; this puts one number on a finished card so two of them can be
 * compared without a search — and so an evo can say what it is worth before you spend it.
 *
 * Three things it is not:
 *
 * It is not an OVR. OVR is EA's weighting of six face values; this is the position's own weighting
 * of the sub-stats underneath them, which is where the difference between two 97s lives.
 *
 * It is not a total. A card is scored on the plan it is best at for that position — a right-back is
 * either a Cafu full-back or a lockdown one, and being a mediocre both is not the average of the
 * two. The stats a plan is hurt by are subtracted, so points bought with strength on an Explosive
 * plan cost what they actually cost.
 *
 * It is not read bare. The card is scored under the best chemistry style that still reads the
 * plan's archetype, because that is the card that gets fielded — a stat at 93 and one at 99 are the
 * same stat once a style is on.
 *
 * PlayStyles are deliberately not in it yet.
 */

/**
 * Below this a stat contributes nothing. At end game a 78 and an 82 are the same stat — both are
 * the reason you stop picking the card — and the whole range that matters sits between here and 99.
 */
const WORTHLESS_AT = 80;

/** A stat at the cap. Nothing scores above it, so 100 means "as good as this position can be". */
const PERFECT_AT = 99;

/** What one missed fieldable floor costs. Five of them, so a card failing all five is unpickable. */
const UNFIELDABLE_COST = 8;

/** What one missed plan floor costs — real, but a plan played short is still that plan. */
const SHORT_COST = 4;

/** What a point of a stat the plan is hurt by costs, once it is past the pass mark. */
const AVOID_COST = 0.5;

/** A stat's contribution, 0–100: nothing at 80 or below, everything at 99. */
const pointsFor = (value: number) =>
  Math.max(0, Math.min(1, (value - WORTHLESS_AT) / (PERFECT_AT - WORTHLESS_AT))) * 100;

export interface PositionScore {
  /** 0–100. */
  score: number;
  position: string;
  /** The plan it scored best as — a card is worth what its best plan is worth, not their average. */
  plan: BuildTemplate;
  /** The style it was read under; null means bare. */
  style: string | null;
  archetype: AccelerateFamily;
  /** True when the plan's archetype was out of reach and it was read as Controlled. */
  fallback: boolean;
  /** Floors it misses under that style, worst first. */
  under: { key: string; value: number; floor: number; fieldable: boolean }[];
}

const subValues = (stats: StatsData): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const face of Object.values(stats)) {
    for (const [key, sub] of Object.entries(face.subs)) out[key] = sub.base;
  }
  return out;
};

/** One plan's verdict on one reading of the card. */
function scoreAgainst(subs: Record<string, number>, t: BuildTemplate) {
  let raw = 0;
  let total = 0;
  for (const [key, weight] of Object.entries(t.maximise)) {
    raw += pointsFor(subs[key] ?? 0) * weight;
    total += weight;
  }
  if (total > 0) raw /= total;

  // Points the plan is hurt by, charged rather than ignored — this is the strength-on-a-playmaker
  // case, where every point past the pass mark is spending the archetype the plan is built on.
  for (const key of t.avoid || []) {
    raw -= Math.max(0, (subs[key] ?? 0) - PASS_MARK) * AVOID_COST;
  }

  const under = Object.entries(floorsOf(t))
    .map(([key, floor]) => ({
      key,
      floor,
      value: subs[key] ?? 0,
      fieldable: key in FIELDABLE_FLOORS
    }))
    .filter(x => x.value < x.floor)
    .sort((a, b) => (b.floor - b.value) - (a.floor - a.value));

  for (const miss of under) raw -= miss.fieldable ? UNFIELDABLE_COST : SHORT_COST;

  return { score: Math.max(0, Math.min(100, raw)), under };
}

/**
 * What this card is worth at one position: its best plan there, read under the best style that
 * still reads that plan's archetype. Null when the position has no plan the card's frame allows —
 * a 176cm card has no Lengthy plan open to it whatever its stats say.
 */
export function scoreAtPosition(
  stats: StatsData,
  bio: PlayerBio,
  position: string
): PositionScore | null {
  const pos = position.trim().toUpperCase();
  const height = parseHeightCm(bio.height);
  const plans = templatesAvailable([pos], height).filter(t => t.positions.includes(pos));
  if (plans.length === 0) return null;

  const subs = subValues(stats);
  let best: PositionScore | null = null;

  for (const plan of plans) {
    for (const [style, boosts] of STYLE_OPTIONS) {
      const styled = style === null ? subs : withStyle(subs, boosts);
      const archetype = calculateAccelerateFamily(
        styled.acceleration ?? 50, styled.agility ?? 50, styled.strength ?? 50, height
      );
      // The plan's archetype, or Controlled where the card cannot reach it — the same fallback the
      // recommendations make, and marked the same way, so a Controlled reading never quietly passes
      // for the real thing.
      const fallback = archetype !== plan.archetype;
      if (fallback && archetype !== 'Controlled') continue;

      const { score, under } = scoreAgainst(styled, plan);
      if (!best || score > best.score) {
        best = { score, position: pos, plan, style, archetype, fallback, under };
      }
    }
  }

  return best;
}

/** The card at each position it lists, best first. */
export function scoreCard(stats: StatsData, bio: PlayerBio): PositionScore[] {
  return bio.primaryPositions
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => scoreAtPosition(stats, bio, p))
    .filter((s): s is PositionScore => s !== null)
    .sort((a, b) => b.score - a.score);
}

/** The one number to put on a card: what it is worth at the position it is best at. */
export function bestScore(stats: StatsData, bio: PlayerBio): PositionScore | null {
  return scoreCard(stats, bio)[0] ?? null;
}
