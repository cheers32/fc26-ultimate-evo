import { PlayStylesData, PlayerBio, StatsData } from '../types/player';
import { PLAYSTYLE_VALUES } from './playstyleValues';
import { accelerateOf, bestFreePicks, controlModeFor, playStyleValue } from './fitScore';
import { ControlMode } from './playstyleProfile';
import { applyFreePlayStyles, buildPlayStyleNodeId, canPickPlayStyles, effectiveGoldLimit } from './evoEngine';
import { playStyleScoreAt } from './playStyleScore';

/**
 * What a finished chain's PlayStyles are, and what they could still be made into.
 *
 * A build's PlayStyles are not a property of its stats, and a ranking that ignores them recommends
 * chains nobody would finish. Two failures do the damage, and neither shows up in a stat score:
 *
 * The slots get polluted. Slots are first-come, first-served — a PlayStyle an evo forces onto the
 * card takes a gold slot that is then gone. Five evos each handing out one PlayStyle nobody wants
 * leave a card with 99s and no room for the four that the position actually runs on.
 *
 * The set never comes together. Nothing in the chain hands out the PlayStyles the plan needs, so
 * the card arrives correct on every stat and missing the thing that makes the position work.
 *
 * Both have the same fix, and it is a fix the search can make rather than one to be discovered by
 * hand afterwards: some evos change the card's rarity, and a handful of rarities let the player
 * assign PlayStyles themselves. So a chain that ends on one of those rarities is not merely a chain
 * with different stats — it is a chain whose empty slots are worth whatever the best PlayStyles for
 * the position are worth, and this is what says how much that is.
 *
 * The picks are returned as a chain node, so a recommendation arrives with them already in it.
 */

/** A PlayStyle worth less than this to the position is not doing a job — see `wasted`. */
const NOT_DOING_A_JOB = 0.5;

export interface PsPlan {
  /** 0–100 for the card as it would end up, picks included. */
  score: number;
  /** 0–100 as the chain leaves it, before any pick — the gap between the two is what a picker buys. */
  before: number;
  /** True when the finished card's rarity hands out the picker. */
  canPick: boolean;
  /** The picks to make. Empty when the card cannot pick, or when nothing is left worth picking. */
  picks: { gold: string[]; silver: string[] };
  /** Those picks as a chain node, so the build carries them. Null when there are none. */
  node: string | null;
  /** Gold slots held by PlayStyles this position has no use for — what "polluted" means, named. */
  wasted: string[];
  /** The best PlayStyles for this position the finished card still doesn't have. */
  missing: string[];
  /** Gold slots still empty after the picks — nothing left worth putting in them. */
  emptyGold: number;
}

/**
 * The PlayStyle outlook for one finished card at one position.
 *
 * `stats` is the card as it would be fielded — with the chemistry style the rest of the row is
 * scored under already applied. PlayStyle values are gated on sub-stats, and a gate is exactly
 * where the bare card and the fielded one give different answers, so passing the bare block here
 * while the stats beside it are styled is the same inconsistency that used to fail a build on a
 * stamina its own style would have carried.
 */
export function psPlanFor(
  stats: StatsData,
  playStyles: PlayStylesData,
  bio: PlayerBio,
  position: string,
  mode?: ControlMode
): PsPlan {
  const pos = position.trim().toUpperCase();
  const here: PlayerBio = { ...bio, primaryPositions: pos };
  const controlMode = controlModeFor(bio, mode);
  const accelerate = accelerateOf(stats, bio);

  const before = playStyleScoreAt(stats, playStyles, bio, pos, { mode: controlMode }).score;
  const canPick = canPickPlayStyles(bio.rarity);

  const picks = canPick
    ? bestFreePicks({ stats, playStyles, bio: here, mode: controlMode })
    : { gold: [], silver: [] };
  const filled = canPick ? applyFreePlayStyles(playStyles, picks) : playStyles;

  const after = playStyleScoreAt(stats, filled, bio, pos, { mode: controlMode });

  // Gold slots spent on nothing. Only gold is reported: a silver slot on a PlayStyle the position
  // ignores costs almost nothing, and there are eight of them, but a card has four gold slots and
  // one wasted is a quarter of what its PlayStyles could have been.
  const heldGold = [...filled.base.gold, ...filled.ev.gold];
  const wasted = heldGold.filter(
    name => playStyleValue(name, true, { stats, playStyles: filled, bio: here, mode: controlMode }, accelerate) < NOT_DOING_A_JOB
  );

  return {
    score: after.score,
    before,
    canPick,
    picks,
    node: picks.gold.length + picks.silver.length > 0 ? buildPlayStyleNodeId(picks) : null,
    wasted,
    missing: after.missing,
    emptyGold: Math.max(0, effectiveGoldLimit(filled) - heldGold.length)
  };
}

/** Every PlayStyle the model knows, for callers that need the vocabulary. */
export const KNOWN_PLAYSTYLES = Object.keys(PLAYSTYLE_VALUES);
