/**
 * The one path that is not a plan.
 *
 * Every other build on a card is a proposal — something Analyze suggested or you sketched out. The
 * Default path is the opposite: it is the record of what you have actually done in game, and it is
 * the only one that cannot be reconstructed if it is lost. Analyze can be run again; a hand-built
 * variant can be built again; what you spent your evos on last month cannot.
 *
 * So it is treated as a different kind of thing throughout: always saved, never swept up by Clear,
 * never quietly unstarred by an edit, and deletable only through a confirmation that cannot be hit
 * by accident. Green is reserved for it, so a green star on a card means one thing and only one.
 */
export const DEFAULT_PATH_ID = 'default-path';

/** Green in STAR_TIERS. Reserved: the star cycle on every other build skips it. */
export const IN_GAME_STAR_TIER = 4;

/**
 * Which build is the record, by the name on it rather than by its id.
 *
 * The id would be the tidier test and it is the wrong one: the synthesised `default-path` is only
 * the placeholder a card starts on, and the moment a build gets saved it carries an id of its own.
 * What actually marks the record across every card here is the name — "Default" is the convention
 * already in the data, on saved paths with ids like `chiellini-92-0`. Renaming a build to Default
 * makes it the record; renaming it away stops it being one. That is the same rule read both ways.
 */
export const isInGamePath = (path: { id?: string; name?: string } | undefined) =>
  path?.id === DEFAULT_PATH_ID || (path?.name || '').trim().toLowerCase() === 'default';
