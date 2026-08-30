import { PlayerBio, StatsData } from '../types/player';
import {
  BUILD_TEMPLATES,
  BuildTemplate,
  FIELDABLE_FLOORS,
  PASS_MARK,
  floorsOf
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
 * And it does not gate on the frame, which is the difference between judging a card and planning
 * one. Analyze refuses to plan a Lengthy build for a short card, because following that plan means
 * paying for strength the card can never cash in as an archetype. A card already built has paid
 * nothing: a 174cm Matthäus with 99 interceptions, 99 standing tackle and 96 strength has an Anchor
 * CDM's numbers whatever his height says, and scoring him only against the Explosive plans his
 * frame allowed rated him 87.9 as a failed ball-winner — a description of the rule, not of him. So
 * every plan the position allows is scored, and where the archetype is out of reach the reading is
 * marked `fallback` rather than thrown away.
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

/**
 * What missing a floor by `short` points costs, out of that floor's full price.
 *
 * A floor used to be a cliff: one point under and the whole cost landed. That made the model say
 * things it did not mean. A card a point short on five fieldable floors — balance 92, stamina 92,
 * ball control 92, where the floor is 93 — was charged forty points and came back rated as
 * unusable, which is not a description of that card, it is a description of the rule.
 *
 * It runs out to nothing at the same place a stat stops being worth anything at all: `WORTHLESS_AT`.
 * A stat that far under is genuinely the reason you stop picking the card and pays in full; one a
 * point short pays almost nothing, which is what a point is worth. The floors still say the same
 * thing about which stats a plan cannot do without — they just now say it by degree.
 */
const missCost = (floor: number, value: number, full: number) => {
  const span = Math.max(1, floor - WORTHLESS_AT);
  return full * Math.min(1, Math.max(0, floor - value) / span);
};

/**
 * Slots that are one position played from a side.
 *
 * A 4-2-3-1 fields three attacking midfielders, and the wide two are not the same job as the one in
 * the middle: they come inside onto the good foot and run in behind, so the plans a winger is judged
 * on are open to them and the pure playmaker plans are not the only answer. The middle one is judged
 * as a CAM and nothing else.
 *
 * The key is what a slot passes in; the label is what gets printed, because "CAM (L)" is a position
 * a person recognises and "CAM-L" is a lookup key.
 */
const SIDED: Record<string, { label: string; positions: string[] }> = {
  'CAM-L': { label: 'CAM (L)', positions: ['CAM', 'LW', 'LM'] },
  'CAM-R': { label: 'CAM (R)', positions: ['CAM', 'RW', 'RM'] }
};

/** The plain position behind a slot key — 'CAM-L' is a CAM. */
export const basePosition = (key: string): string =>
  SIDED[key.trim().toUpperCase()] ? key.trim().toUpperCase().split('-')[0] : key.trim().toUpperCase();

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

  for (const miss of under) {
    raw -= missCost(miss.floor, miss.value, miss.fieldable ? UNFIELDABLE_COST : SHORT_COST);
  }

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
  position: string,
  /**
   * Whether the card may be read wearing the best style it could legally take.
   *
   * Off by default, and the default is the honest one: a style is a choice you have not made yet,
   * and which one you would actually put on is your call rather than the model's. With it on, this
   * is the card as it would be fielded — 96 and 99 are the same stat once a +3 is on it — and the
   * style it assumed is named in the result so the number can be checked.
   */
  assumeChem = false
): PositionScore | null {
  const key = position.trim().toUpperCase();
  const sided = SIDED[key];
  const pos = sided ? sided.label : key;
  const wanted = sided ? sided.positions : [key];
  const height = parseHeightCm(bio.height);
  const plans = BUILD_TEMPLATES.filter(t => t.positions.some(p => wanted.includes(p)));
  if (plans.length === 0) return null;

  const subs = subValues(stats);
  let best: PositionScore | null = null;
  let bestIgs = -Infinity;

  for (const plan of plans) {
    for (const [style, boosts] of assumeChem ? STYLE_OPTIONS : BARE_ONLY) {
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
      // Ties go to the reading that leaves more card. Two styles a plan scores identically are not
      // the same style, and two plans a card scores identically are not the same plan — first past
      // the post made the answer depend on the order of the tables rather than on the card.
      const igs = Object.values(styled).reduce((a, b) => a + b, 0);
      if (!best || score > best.score || (score === best.score && igs > bestIgs)) {
        best = { score, position: pos, plan, style, archetype, fallback, under };
        bestIgs = igs;
      }
    }
  }

  return best;
}

/** The one reading available when no style may be assumed: the card as it stands. */
const BARE_ONLY: [string | null, Record<string, number>][] = [[null, {}]];

/** The card at each position it lists, best first. */
export function scoreCard(stats: StatsData, bio: PlayerBio, assumeChem = false): PositionScore[] {
  return bio.primaryPositions
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => scoreAtPosition(stats, bio, p, assumeChem))
    .filter((s): s is PositionScore => s !== null)
    .sort((a, b) => b.score - a.score);
}

/** The one number to put on a card: what it is worth at the position it is best at. */
export function bestScore(stats: StatsData, bio: PlayerBio, assumeChem = false): PositionScore | null {
  return scoreCard(stats, bio, assumeChem)[0] ?? null;
}
