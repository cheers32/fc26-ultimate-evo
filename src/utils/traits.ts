import { PlayerBio, StatsData } from '../types/player';
import { BuildTemplate, PASS_MARK, floorsOf } from '../data/buildTemplates';
import { scoreAtPosition } from './positionScore';

/**
 * What a card is good and bad at, in words, the way the game itself puts it on a player page.
 *
 * Deliberately not a second scoring system. It reads the same sub-stats the position score does and
 * says them out loud, because a number tells you where a card stands and a sentence tells you what
 * to do about it — "weak in the air 67" sends you looking for a heading evo in a way that
 * "Defending 96" never will.
 *
 * A trait is only a strength or a weakness *for a position*. A centre-back's 45 finishing is not a
 * weakness and a winger's is; what decides it is the plan that position is scored on, so the same
 * card reads differently at right-back and in midfield — which is the point.
 *
 * Stats only, as asked. PlayStyles have their own score and would drown these out: "Finesse Shot+"
 * is a fact about the card, not about what it can do.
 */

interface Trait {
  label: string;
  /** Said when the card is good at it. */
  good: string;
  /** Said when it isn't. */
  bad: string;
  subs: string[];
}

/**
 * Grouped the way a player thinks about a card rather than one line per sub-stat: nobody decides
 * anything from "standing tackle 91", they decide from "wins the ball cleanly".
 */
const TRAITS: Trait[] = [
  { label: 'Acceleration', good: 'Explosive off the mark', bad: 'Slow off the mark', subs: ['acceleration'] },
  { label: 'Top speed', good: 'Runs away from people', bad: 'Gets run past', subs: ['sprintSpeed'] },
  { label: 'Agility', good: 'Turns in a phone box', bad: 'Turns like a lorry', subs: ['agility', 'balance'] },
  { label: 'Close control', good: 'Glued to his foot', bad: 'Heavy first touch', subs: ['ballControl', 'dribbling'] },
  { label: 'Composure', good: 'Unhurried on the ball', bad: 'Rushed under pressure', subs: ['composure', 'reactions'] },
  { label: 'Finishing', good: 'Finishes what he gets', bad: 'Wasteful in front of goal', subs: ['finishing', 'positioning'] },
  { label: 'Shooting from range', good: 'Dangerous from distance', bad: 'No threat from distance', subs: ['longShots', 'shotPower'] },
  { label: 'Short passing', good: 'Keeps it moving', bad: 'Gives it away', subs: ['shortPass', 'vision'] },
  { label: 'Long passing', good: 'Switches play at will', bad: 'Cannot switch play', subs: ['longPass'] },
  { label: 'Crossing', good: 'Delivers from wide', bad: 'Nothing from wide areas', subs: ['crossing', 'curve'] },
  { label: 'Set pieces', good: 'A threat from dead balls', bad: 'Not a dead-ball taker', subs: ['freekick', 'penalties'] },
  { label: 'Tackling', good: 'Wins the ball cleanly', bad: 'Dives in and misses', subs: ['standTackle', 'slideTackle'] },
  { label: 'Reading the game', good: 'Reads it before it happens', bad: 'Caught out of position', subs: ['interceptions', 'defAwareness'] },
  { label: 'Aerial ability', good: 'Wins everything in the air', bad: 'Loses his headers', subs: ['headingAcc', 'jumping'] },
  { label: 'Strength', good: 'Impossible to shrug off', bad: 'Bullied off the ball', subs: ['strength', 'aggression'] },
  { label: 'Stamina', good: 'Still there at ninety', bad: 'Walking by seventy', subs: ['stamina'] }
];

export interface TraitVerdict {
  label: string;
  /** The sentence to print. */
  text: string;
  /** The trait's value on this card, 0–99 — shown so the claim can be checked. */
  value: number;
  /** Which sub-stat carried it, for the tooltip. */
  detail: string;
}

export interface CardVerdict {
  position: string;
  plan: BuildTemplate;
  strengths: TraitVerdict[];
  weaknesses: TraitVerdict[];
}

const subValues = (stats: StatsData): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const face of Object.values(stats)) {
    for (const [key, sub] of Object.entries(face.subs)) out[key] = sub.base;
  }
  return out;
};

const pretty = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
    .replace('Def Awareness', 'Def. awareness').replace('Heading Acc', 'Heading').trim();

/**
 * Three things this card does well and three it doesn't, judged at one position.
 *
 * Relevance comes from the plan the position score picked, so the two always agree about what the
 * card is being asked to do. A trait the plan has no use for can be neither: a centre-back is not
 * praised for his crossing and not blamed for it either.
 */
export function verdictAt(stats: StatsData, bio: PlayerBio, position: string, count = 3): CardVerdict | null {
  const score = scoreAtPosition(stats, bio, position);
  if (!score) return null;

  const subs = subValues(stats);
  const floors = floorsOf(score.plan);
  const weights = score.plan.maximise;

  const rated = TRAITS.map(trait => {
    const present = trait.subs.filter(key => subs[key] !== undefined);
    if (present.length === 0) return null;

    const value = present.reduce((sum, key) => sum + subs[key], 0) / present.length;
    // What this position asks of it: what the plan maximises, plus anything it gates on — a floor
    // is the plan saying "this has to be there" even when it never weighted it.
    const relevance = present.reduce(
      (sum, key) => sum + (weights[key] ?? 0) + (floors[key] !== undefined ? 0.05 : 0),
      0
    );
    const worst = present.reduce((low, key) => (subs[key] < subs[low] ? key : low), present[0]);
    const best = present.reduce((high, key) => (subs[key] > subs[high] ? key : high), present[0]);

    return { trait, value, relevance, worst, best };
  }).filter((x): x is NonNullable<typeof x> => x !== null && x.relevance > 0);

  // A strength has to be genuinely good, not merely the best of a bad card: ranked on how far past
  // the pass mark it is, weighted by how much the position leans on it.
  const strengths = [...rated]
    .filter(x => x.value >= PASS_MARK)
    .sort((a, b) => (b.value - PASS_MARK) * b.relevance - (a.value - PASS_MARK) * a.relevance)
    .slice(0, count)
    .map(x => ({
      label: x.trait.label,
      text: x.trait.good,
      value: Math.round(x.value),
      detail: `${pretty(x.best)} ${subs[x.best]}`
    }));

  const strong = new Set(strengths.map(s => s.label));

  // A weakness is a shortfall the position actually feels. Measured against the plan's own floor
  // where it has one, so a stat the plan gates at 93 counts as short at 91.
  const weaknesses = [...rated]
    .filter(x => !strong.has(x.trait.label))
    .map(x => {
      const target = Math.max(
        PASS_MARK,
        ...x.trait.subs.map(key => floors[key] ?? 0)
      );
      return { ...x, gap: Math.max(0, target - x.value) };
    })
    .filter(x => x.gap > 0)
    .sort((a, b) => b.gap * b.relevance - a.gap * a.relevance)
    .slice(0, count)
    .map(x => ({
      label: x.trait.label,
      text: x.trait.bad,
      value: Math.round(x.value),
      detail: `${pretty(x.worst)} ${subs[x.worst]}`
    }));

  return { position: score.position, plan: score.plan, strengths, weaknesses };
}
