import { useCallback, useEffect, useRef, useState } from 'react';
import { Squad } from '../types/player';
import { EvoStatuses } from '../components/EvoPoolModal';

/**
 * The client for the shared store.
 *
 * Two scopes, deliberately:
 *
 *   library  — the evo and player catalogues. Global. Every team draws from them and every team
 *              can add to them, so an imported card shows up for everybody.
 *   team     — one account's worth of state: which evos it treats as required/included/disabled,
 *              and the squads it has built. Two teams looking at the same card can disagree about
 *              whether an evo is available to them, which is the whole point of a team.
 *
 * Nothing is cached in localStorage except which team was last open. The store is the source of
 * truth precisely so a second browser or a friend's machine sees the same thing.
 */

export interface TeamSummary {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface TeamState extends TeamSummary {
  evoStatuses: EvoStatuses;
  squads: Squad[];
}

const ACTIVE_TEAM_KEY = 'futEvo_active_team';
const ACTIVE_PLAYER_KEY = 'futEvo_active_player';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...init?.headers } : init?.headers
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const teamApi = {
  list: () => request<TeamSummary[]>('/api/teams'),
  create: (name: string) =>
    request<TeamSummary>('/api/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  get: (teamId: string) => request<TeamState>(`/api/teams/${teamId}`),
  patch: (teamId: string, patch: Partial<Omit<TeamState, 'squads'>>) =>
    request<TeamState>(`/api/teams/${teamId}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (teamId: string) => request<{ success: true }>(`/api/teams/${teamId}`, { method: 'DELETE' }),
  saveSquad: (teamId: string, squad: Squad) =>
    request<Squad>(`/api/teams/${teamId}/squads/${squad.id}`, {
      method: 'PUT',
      body: JSON.stringify(squad)
    }),
  deleteSquad: (teamId: string, squadId: string) =>
    request<{ success: true }>(`/api/teams/${teamId}/squads/${squadId}`, { method: 'DELETE' })
};

/** The team the browser was last looking at — a convenience, not state that belongs to the team. */
export function readActiveTeamId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_TEAM_KEY);
  } catch {
    return null;
  }
}

export function writeActiveTeamId(teamId: string | null): void {
  try {
    if (teamId) localStorage.setItem(ACTIVE_TEAM_KEY, teamId);
    else localStorage.removeItem(ACTIVE_TEAM_KEY);
  } catch {
    // Private mode; the team list is one click away either way.
  }
}

/**
 * The card the browser was last looking at. Same standing as the active team: a convenience for
 * this browser, not state the team owns — opening the app on another machine should not drag your
 * workbench somewhere else.
 */
export function readActivePlayerId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PLAYER_KEY);
  } catch {
    return null;
  }
}

export function writeActivePlayerId(playerId: string | null): void {
  try {
    if (playerId) localStorage.setItem(ACTIVE_PLAYER_KEY, playerId);
    else localStorage.removeItem(ACTIVE_PLAYER_KEY);
  } catch {
    // Private mode; the picker still opens on the default card.
  }
}

/**
 * A global catalogue — imported players, deleted database players. Shared by every team on
 * purpose: contributing a card should help everyone, not just the team that added it.
 */
export function useLibrary<T>(key: string, fallback: T): [T, (next: T) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  // A write made while the first read is still in flight must not be undone by that read.
  const dirty = useRef(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/library/${key}`)
      .then(res => (res.ok ? res.json() : null))
      .then((remote: T | null) => {
        if (!active || dirty.current) return;
        if (remote !== null) setValue(remote);
        setLoaded(true);
      })
      .catch(err => {
        console.error(`Failed to load library ${key}:`, err);
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [key]);

  const update = useCallback(
    (next: T) => {
      dirty.current = true;
      setValue(next);
      fetch(`/api/library/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(err => console.error(`Failed to save library ${key}:`, err));
    },
    [key]
  );

  return [value, update, loaded];
}

/**
 * Everything one team owns. Writes go to the server and update local state optimistically —
 * a squad change shouldn't wait on a round trip to show up on the pitch.
 */
export function useTeam(teamId: string | null) {
  const [team, setTeam] = useState<TeamState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    teamApi
      .get(teamId)
      .then(next => {
        if (active) setTeam(next);
      })
      .catch(err => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [teamId]);

  const setEvoStatuses = useCallback(
    (evoStatuses: EvoStatuses) => {
      if (!teamId) return;
      setTeam(prev => (prev ? { ...prev, evoStatuses } : prev));
      teamApi.patch(teamId, { evoStatuses }).catch(err => console.error('Failed to save pool:', err));
    },
    [teamId]
  );

  const saveSquad = useCallback(
    (squad: Squad) => {
      if (!teamId) return;
      setTeam(prev =>
        prev
          ? {
              ...prev,
              squads: prev.squads.some(s => s.id === squad.id)
                ? prev.squads.map(s => (s.id === squad.id ? squad : s))
                : [...prev.squads, squad]
            }
          : prev
      );
      teamApi.saveSquad(teamId, squad).catch(err => console.error('Failed to save squad:', err));
    },
    [teamId]
  );

  const deleteSquad = useCallback(
    (squadId: string) => {
      if (!teamId) return;
      setTeam(prev => (prev ? { ...prev, squads: prev.squads.filter(s => s.id !== squadId) } : prev));
      teamApi.deleteSquad(teamId, squadId).catch(err => console.error('Failed to delete squad:', err));
    },
    [teamId]
  );

  const rename = useCallback(
    (name: string) => {
      if (!teamId) return;
      setTeam(prev => (prev ? { ...prev, name } : prev));
      teamApi.patch(teamId, { name }).catch(err => console.error('Failed to rename team:', err));
    },
    [teamId]
  );

  return { team, loading, error, setEvoStatuses, saveSquad, deleteSquad, rename };
}
