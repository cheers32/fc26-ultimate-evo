/**
 * The one path that is not a plan.
 *
 * Every other build on a card is a proposal — something Analyze suggested or you sketched out.
 * Current is the opposite: it is the record of what you have actually done in game, and it is the
 * only one that cannot be reconstructed if it is lost. Analyze can be run again; a hand-built
 * variant can be built again; what you spent your evos on last month cannot.
 *
 * So it is treated as a different kind of thing throughout: always saved, never swept up by Clear,
 * never quietly unstarred by an edit, and deletable only through a confirmation that cannot be hit
 * by accident. Green is reserved for it, so a green star on a card means one thing and only one.
 *
 * It used to be called Default, which described where it sat in the list rather than what it is.
 * The id and the old name are still recognised, because they are in saved data.
 */
export const DEFAULT_PATH_ID = 'default-path';

/** What the record is called now. */
export const IN_GAME_PATH_NAME = 'Current';

/** Green in STAR_TIERS. Reserved: the star cycle on every other build skips it. */
export const IN_GAME_STAR_TIER = 4;

/**
 * Which build is the record, by the name on it rather than by its id.
 *
 * The id would be the tidier test and it is the wrong one: the synthesised `default-path` is only
 * the placeholder a card starts on, and the moment a build gets saved it carries an id of its own.
 * What actually marks the record across every card here is the name, on saved paths with ids like
 * `chiellini-92-0`. Renaming a build to Current makes it the record; renaming it away stops it
 * being one. That is the same rule read both ways. "Default" is the old name for the same thing and
 * still counts — the data on disk was written under it.
 */
export const isInGamePath = (path: { id?: string; name?: string } | undefined) =>
  path?.id === DEFAULT_PATH_ID ||
  ['current', 'default'].includes((path?.name || '').trim().toLowerCase());

/**
 * The card with nothing done to it, kept as a chip of its own.
 *
 * Current is where your build lives and it moves as you play; this never does. It is the reference
 * you compare against — what the evos have actually bought you — so it holds no evos, takes no
 * edits, and cannot be deleted. Every other chip on the card is something you can change; this one
 * is the fixed point that makes the others readable.
 */
export const BASE_CARD_PATH_ID = 'base-card-path';

export const isBaseCardPath = (path: { id?: string } | undefined) =>
  path?.id === BASE_CARD_PATH_ID;

/**
 * What to print on a build.
 *
 * The record is called Current now; the saves on disk still say Default, and rewriting them to
 * change a label is the kind of migration that loses a build when it goes wrong. So the old name is
 * read and the new one is shown, and both mean the same thing to `isInGamePath`.
 */
export const pathLabel = (path: { id?: string; name?: string } | undefined) =>
  isInGamePath(path) ? IN_GAME_PATH_NAME : path?.name || '';
