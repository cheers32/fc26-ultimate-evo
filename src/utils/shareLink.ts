/**
 * Builds and reads the `?path=` link that carries a whole build in a URL.
 *
 * The shape follows FUTBIN's builder — the card first, then the chain, joined by underscores:
 *
 *   https://…/?path=rodri-91_1188_1177_1184
 *
 * Player ids and evo ids never contain an underscore, which is what makes the separator safe. A
 * PlayStyle pick is a step like any other, and its id (`ps:Finesse Shot+|Tiki Taka`) does contain
 * characters a query string would mangle, so every segment is percent-encoded on the way out and
 * decoded on the way back in. That leaves the common case — a chain of plain evos — perfectly
 * readable, and only a build with a PlayStyle pick in it looks encoded.
 */

export const SHARE_PARAM = 'path';

export interface SharedBuild {
  playerId: string;
  chainIds: string[];
}

/** The link to hand someone else. Absolute, so it survives being pasted anywhere. */
export function buildShareUrl(playerId: string, chainIds: string[], origin?: string): string {
  const base = origin ?? `${window.location.origin}${window.location.pathname}`;
  const value = [playerId, ...chainIds].map(encodeURIComponent).join('_');
  return `${base}?${SHARE_PARAM}=${value}`;
}

/**
 * Reads a build out of a query string, or null when there isn't one.
 *
 * The raw parameter is pulled out by hand rather than through URLSearchParams: that decodes the
 * whole value once before we get to split it, which turns a `+` inside a PlayStyle name into a
 * space and leaves no way to tell an encoded separator from a literal one.
 */
export function parseShareUrl(search: string): SharedBuild | null {
  const match = search.match(new RegExp(`[?&]${SHARE_PARAM}=([^&]*)`));
  if (!match) return null;

  const segments = match[1].split('_').filter(Boolean);
  if (segments.length === 0) return null;

  const decoded = segments.map(s => {
    try {
      return decodeURIComponent(s);
    } catch {
      // A hand-edited link can carry a stray '%'; keep the segment as typed rather than throwing
      // the whole build away for it.
      return s;
    }
  });

  const [playerId, ...chainIds] = decoded;
  if (!playerId) return null;
  return { playerId, chainIds };
}

/**
 * Drops the parameter once the build has been taken out of it, so a reload doesn't add the same
 * build a second time and the address bar stops advertising a link the page has moved on from.
 */
export function clearShareParam(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(SHARE_PARAM)) return;
  url.searchParams.delete(SHARE_PARAM);
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}
