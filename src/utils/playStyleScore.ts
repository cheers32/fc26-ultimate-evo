import { PlayStylesData, PlayerBio, StatsData } from '../types/player';
import { PLAYSTYLE_VALUES } from './playstyleValues';
import { controlModeFor, accelerateOf, playStyleValue, playStylesScore } from './fitScore';
import { ControlMode } from './playstyleProfile';
import { withStyleStats } from './chem';
import { chemStyles } from '../data/chemStyles';

/**
 * What a card's PlayStyles are worth at a position, out of 100 — kept apart from the stat score on
 * purpose.
 *
 * The two answer different questions and averaging them destroys both. A card with 99s and no
 * PlayStyles and a card with modest stats and exactly the right ones can land on the same combined
 * number while needing opposite next steps: one wants a PlayStyle evo, the other wants stats. Split,
 * each number names its own gap.
 *
 * It is also not independent of the stats, and that is the point rather than a flaw: a PlayStyle is
 * worth what the card can do with it. Power Shot on 65 shooting is a wasted slot, Quick Step on a
 * Lengthy card fights the run animation, and a trick PlayStyle on a 3-star card cannot do most of
 * what it unlocks. All of that is already modelled as gates in PLAYSTYLE_VALUES; this puts the
 * result on a 0–100 scale.
 *
 * 100 means the slots this card has are filled with the best PlayStyles this position could want,
 * on a card whose stats fully support them. So the number falls for three separate reasons, and
 * hovering says which: the wrong PlayStyles for the position, the right ones on stats too low to
 * use them, or slots left empty.
 */

export interface PlayStyleScore {
  /** 0–100. */
  score: number;
  position: string;
  /** The card's own PlayStyles, best first, with what each is worth here. */
  detail: { name: string; gold: boolean; points: number }[];
  /** What the same slots would be worth filled perfectly — the 100 this is measured against. */
  ideal: number;
  /** The best PlayStyles for this position the card doesn't have, best first. */
  missing: string[];
}

/** The card as it would be with stats that support anything — how the ceiling is measured. */
function perfectStats(stats: StatsData): StatsData {
  const out: StatsData = {};
  for (const [faceKey, face] of Object.entries(stats)) {
    out[faceKey] = {
      ...face,
      baseFace: 99,
      subs: Object.fromEntries(
        Object.entries(face.subs || {}).map(([key, sub]) => [key, { ...sub, base: 99 }])
      )
    };
  }
  return out;
}

export function playStyleScoreAt(
  stats: StatsData,
  playStyles: PlayStylesData,
  bio: PlayerBio,
  position: string,
  opts: {
    mode?: ControlMode;
    /**
     * The chemistry style the card is being read under, if any. PlayStyle values are gated on
     * sub-stats, and a gate is exactly where the bare card and the fielded one answer differently
     * — Power Shot on 92 shot power is not the PlayStyle it is on 89 — so this has to be the same
     * style the position score beside it was read under, or the two disagree about one card.
     */
    style?: string | null;
  } = {}
): PlayStyleScore {
  const pos = position.trim().toUpperCase();
  const { mode } = opts;
  if (opts.style) stats = withStyleStats(stats, chemStyles[opts.style] || {});
  // Scored at one position rather than across the card's list, so the number can be compared with
  // the stat score beside it — both are answering "here, at this position".
  const here: PlayerBio = { ...bio, primaryPositions: pos };
  const controlMode = controlModeFor(bio, mode);
  const accelerate = accelerateOf(stats, bio);

  const actual = playStylesScore({ stats, playStyles, bio: here, mode: controlMode }, accelerate);

  // The ceiling: this card's own slots, filled with the best PlayStyles for the position, on stats
  // that support them. Its own archetype is kept — a Lengthy card is not marked down for lacking
  // the PlayStyles that only suit an Explosive one, it is measured against the best Lengthy set.
  const ideal = (() => {
    const goldSlots = Math.max(playStyles.limits?.gold ?? 4, 0);
    const silverSlots = Math.max(playStyles.limits?.silver ?? 8, 0);
    const ceilingStats = perfectStats(stats);
    const ceilingCtx = { stats: ceilingStats, bio: here, mode: controlMode };

    const ranked = Object.keys(PLAYSTYLE_VALUES)
      .map(name => ({
        name,
        value: playStyleValue(name, true, { ...ceilingCtx, playStyles }, accelerate)
      }))
      .filter(x => x.value > 0)
      .sort((a, b) => b.value - a.value)
      .map(x => x.name);

    const best: PlayStylesData = {
      limits: playStyles.limits,
      base: {
        gold: ranked.slice(0, goldSlots),
        silver: ranked.slice(goldSlots, goldSlots + silverSlots)
      },
      ev: { gold: [], silver: [] }
    };

    const ceiling = playStylesScore({ ...ceilingCtx, playStyles: best }, accelerate);
    return { total: ceiling.total, ranked };
  })();

  const held = new Set(
    [
      ...playStyles.base.gold, ...playStyles.ev.gold,
      ...playStyles.base.silver, ...playStyles.ev.silver
    ].map(n => n.replace(/\+/g, '').trim())
  );

  return {
    score: ideal.total > 0 ? Math.max(0, Math.min(100, (actual.total / ideal.total) * 100)) : 0,
    position: pos,
    detail: actual.detail.sort((a, b) => b.points - a.points),
    ideal: ideal.total,
    missing: ideal.ranked.filter(name => !held.has(name)).slice(0, 3)
  };
}

/** The card's PlayStyles scored at each position it lists, best first. */
export function playStyleScoreCard(
  stats: StatsData,
  playStyles: PlayStylesData,
  bio: PlayerBio,
  mode?: ControlMode
): PlayStyleScore[] {
  return bio.primaryPositions
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => playStyleScoreAt(stats, playStyles, bio, p, { mode }))
    .sort((a, b) => b.score - a.score);
}
