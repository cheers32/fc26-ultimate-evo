/**
 * Where you are, in the address bar.
 *
 * The app used to keep the team and the card it was showing in state and in localStorage only, so
 * every screen had the same address and Back left the site — from the third card you'd opened, to
 * whatever you were reading before you got here.
 *
 * Two parameters are enough, because those are the two things that decide what the page is:
 *
 *   /                              the team list
 *   /?team=tms…                    that team, on whichever card it last had
 *   /?team=tms…&player=rodri-91    that team, that card
 *
 * A share link (`?path=`) is a third thing entirely and is left alone here — it is read once on
 * arrival and stripped, and these helpers preserve any parameter they don't own.
 */

export const TEAM_PARAM = 'team';
export const PLAYER_PARAM = 'player';

export interface AppLocation {
  teamId: string | null;
  playerId: string | null;
}

export function readAppUrl(search: string = window.location.search): AppLocation {
  const params = new URLSearchParams(search);
  return {
    teamId: params.get(TEAM_PARAM) || null,
    playerId: params.get(PLAYER_PARAM) || null
  };
}

/** The path+query a given place in the app has, keeping any parameter this doesn't own. */
export function appUrlFor({ teamId, playerId }: AppLocation): string {
  const url = new URL(window.location.href);

  if (teamId) url.searchParams.set(TEAM_PARAM, teamId);
  else url.searchParams.delete(TEAM_PARAM);

  // Outside a team there is no card on screen, so naming one would describe a page that isn't there.
  if (teamId && playerId) url.searchParams.set(PLAYER_PARAM, playerId);
  else url.searchParams.delete(PLAYER_PARAM);

  return `${url.pathname}${url.search}${url.hash}`;
}

/** Where the browser currently says it is, in the same shape `appUrlFor` returns. */
export function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
