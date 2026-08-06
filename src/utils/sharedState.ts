import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State that belongs to the project rather than to the browser it was entered in.
 *
 * Per-player builds already live in files behind /api/saves; imported players, deleted players,
 * disabled evos and squads did not — they sat in localStorage, so a second browser saw none of
 * them. These now live in files too, behind /api/app.
 *
 * localStorage stays on as a cache rather than the source of truth: it renders the last known
 * value on the first paint (no flash of an empty warehouse while the fetch is in flight) and
 * keeps the app usable if the dev server isn't answering. On mount the server copy wins; if the
 * server has nothing yet, whatever this browser already had is uploaded, so an existing setup
 * migrates on first load instead of being wiped by an empty server.
 *
 * Concurrent edits in two browsers are last-write-wins, the same as the per-player saves.
 */
export function useSharedState<T>(key: string, fallback: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) return JSON.parse(cached) as T;
    } catch (e) {
      // A corrupt cache shouldn't stop the app from starting; the server copy still loads below.
    }
    return fallback;
  });

  // Writes made before the server answers must not be overwritten by that answer.
  const dirty = useRef(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/app/${key}`)
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not stored'))))
      .then(remote => {
        if (!active || dirty.current) return;
        setValue(remote as T);
        try {
          localStorage.setItem(key, JSON.stringify(remote));
        } catch (e) {
          // Cache write failures are not worth failing the load over.
        }
      })
      .catch(() => {
        // Nothing on the server yet: seed it from this browser so an existing setup carries over.
        if (!active) return;
        const local = localStorage.getItem(key);
        if (local && local !== 'null') {
          fetch(`/api/app/${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: local
          }).catch(e => console.error(`Failed to seed shared state for ${key}:`, e));
        }
      });
    return () => {
      active = false;
    };
  }, [key]);

  const update = useCallback(
    (next: T) => {
      dirty.current = true;
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        // Ignore quota/private-mode failures — the server copy below is the one that matters.
      }
      fetch(`/api/app/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(e => console.error(`Failed to save shared state for ${key}:`, e));
    },
    [key]
  );

  return [value, update];
}
