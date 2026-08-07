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
 * keeps the app usable if the dev server isn't answering.
 *
 * The first load in a given browser *merges* its local copy into the server's instead of taking
 * the server's wholesale — otherwise whichever browser happened to load second would have its
 * own squads and imported players wiped by a store the first browser had already populated.
 * After that one-time merge the server copy simply wins, so deleting something doesn't get
 * undone by another browser uploading its stale copy back. Concurrent edits are last-write-wins,
 * the same as the per-player saves.
 */

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const hasId = (v: unknown): v is { id: string } =>
  !!v && typeof v === 'object' && 'id' in (v as object);

/** Union of what the server has and what this browser has, by the shape of the data. */
function mergeShared<T>(server: T, local: T): T {
  if (Array.isArray(server) && Array.isArray(local)) {
    // Records with ids (squads): keep both sides, matching on id.
    if (server.every(hasId) && local.every(hasId) && (server.length > 0 || local.length > 0)) {
      const seen = new Set(server.map(v => (v as { id: string }).id));
      return [...server, ...local.filter(v => !seen.has((v as { id: string }).id))] as T;
    }
    // Plain lists (disabled evos, deleted players): set union.
    return [...new Set([...server, ...local])] as T;
  }
  // Keyed records (custom players): keep every key, server wins where both have one.
  if (isPlainObject(server) && isPlainObject(local)) {
    return { ...local, ...server } as T;
  }
  return server;
}

export function useSharedState<T>(key: string, fallback: T): [T, (next: T) => void] {
  const readCache = (): T | null => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? (JSON.parse(cached) as T) : null;
    } catch (e) {
      // A corrupt cache shouldn't stop the app from starting; the server copy still loads below.
      return null;
    }
  };

  const [value, setValue] = useState<T>(() => readCache() ?? fallback);

  // Writes made before the server answers must not be overwritten by that answer.
  const dirty = useRef(false);

  useEffect(() => {
    let active = true;
    const mergedKey = `${key}__merged`;
    const alreadyMerged = localStorage.getItem(mergedKey) === '1';

    const push = (next: T) =>
      fetch(`/api/app/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(e => console.error(`Failed to save shared state for ${key}:`, e));

    const cache = (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        // Cache write failures are not worth failing the load over.
      }
    };

    fetch(`/api/app/${key}`)
      .then(res => (res.ok ? res.json() : null))
      .then((remote: T | null) => {
        if (!active || dirty.current) return;

        if (!alreadyMerged) {
          // One-time hand-off from this browser's localStorage into the shared store.
          const local = readCache();
          const merged = remote === null ? local ?? fallback : local === null ? remote : mergeShared(remote, local);
          localStorage.setItem(mergedKey, '1');
          setValue(merged);
          cache(merged);
          // Don't create a file just to say this browser had nothing to contribute.
          const isEmpty = Array.isArray(merged) ? merged.length === 0 : isPlainObject(merged) && Object.keys(merged).length === 0;
          if (!(remote === null && isEmpty) && JSON.stringify(merged) !== JSON.stringify(remote)) push(merged);
          return;
        }

        if (remote !== null) {
          setValue(remote);
          cache(remote);
        }
      })
      .catch(e => console.error(`Failed to load shared state for ${key}:`, e));

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
        localStorage.setItem(`${key}__merged`, '1');
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
