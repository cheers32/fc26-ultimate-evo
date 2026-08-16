import { chemStyles } from '../data/chemStyles';

/**
 * The chemistry style is part of the card, not a footnote to it.
 *
 * Everything that judges a build — the archetype it reads, the floors it clears, what a position
 * makes of it — has to read the card the way it gets fielded, which is with a style on. These are
 * the primitives all of that shares, in one place so the ranking and the scoring cannot drift into
 * disagreeing about what a card's stats are.
 */

/**
 * Every style, plus playing the card bare. Bare is one of the options because a style is a choice
 * and occasionally the wrong one: the styles that would lift a stat can be the same ones that spend
 * the archetype the plan is built on.
 */
export const STYLE_OPTIONS: [string | null, Record<string, number>][] = [
  [null, {}],
  ...Object.entries(chemStyles)
];

/** The card as it reads with a style on, capped where the game caps it. */
export function withStyle(
  subs: Record<string, number>,
  boosts: Record<string, number>
): Record<string, number> {
  const out: Record<string, number> = { ...subs };
  for (const [key, boost] of Object.entries(boosts)) out[key] = Math.min(99, (subs[key] ?? 0) + boost);
  return out;
}

/** The most any single style adds to a stat. */
export const BEST_BOOST: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  for (const boosts of Object.values(chemStyles)) {
    for (const [key, boost] of Object.entries(boosts)) out[key] = Math.max(out[key] ?? 0, boost);
  }
  return out;
})();

/**
 * The best case stat by stat — more than any one style can deliver at once, and deliberately so.
 * For searching, where the cost of being optimistic is a build kept one pass too long and the cost
 * of being exact is a build cut before anyone weighed it. Stats a plan is hurt by are left bare:
 * the best case there is the style that doesn't touch them.
 */
export function optimistic(subs: Record<string, number>, avoid: string[] = []): Record<string, number> {
  const out: Record<string, number> = { ...subs };
  const leave = new Set(avoid);
  for (const [key, value] of Object.entries(subs)) {
    if (!leave.has(key)) out[key] = Math.min(99, value + (BEST_BOOST[key] ?? 0));
  }
  return out;
}
