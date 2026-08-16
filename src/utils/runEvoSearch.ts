import { EvolutionPath } from '../types/player';
import type { V2Diagnosis } from './analyzeV2';
import type { EvoSearchRequest, EvoSearchResponse } from './evoSearch.worker';

export interface EvoSearchResult {
  paths: EvolutionPath[];
  /** Why nothing came back, when nothing did. V2 only — see V2Diagnosis. */
  diagnosis?: V2Diagnosis;
}

export interface EvoSearchHandle {
  /** Resolves with the paths found, or rejects with the worker's error. */
  promise: Promise<EvoSearchResult>;
  /** Stops the search. The promise rejects with an `AbortError`. */
  cancel: () => void;
}

/**
 * Runs the path search off the main thread. Cancelling terminates the worker outright rather
 * than waiting for the DFS to unwind, so the UI never has to sit through a run it abandoned.
 */
export function runEvoSearch(
  request: EvoSearchRequest,
  onProgress?: (nodesVisited: number) => void
): EvoSearchHandle {
  const worker = new Worker(new URL('./evoSearch.worker.ts', import.meta.url), {
    type: 'module'
  });

  let settled = false;
  let rejectPromise: (reason: Error) => void = () => {};

  // The worker reports every few thousand nodes, which is far more often than a counter needs
  // to repaint. Forwarding each one re-renders the whole tree and starves the commit, leaving
  // the UI visibly stuck on stale output — so only the newest count gets through per tick.
  const PROGRESS_THROTTLE_MS = 250;
  let lastProgressAt = 0;

  const promise = new Promise<EvoSearchResult>((resolve, reject) => {
    rejectPromise = reject;

    worker.onmessage = (e: MessageEvent<EvoSearchResponse>) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        const now = Date.now();
        if (now - lastProgressAt >= PROGRESS_THROTTLE_MS) {
          lastProgressAt = now;
          onProgress?.(msg.nodesVisited);
        }
        return;
      }
      settled = true;
      worker.terminate();
      if (msg.type === 'done') resolve({ paths: msg.paths, diagnosis: msg.diagnosis });
      else reject(new Error(msg.message));
    };

    worker.onerror = (e) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(new Error(e.message || 'Evolution search failed'));
    };

    worker.postMessage(request);
  });

  return {
    promise,
    cancel: () => {
      if (settled) return;
      settled = true;
      worker.terminate();
      const err = new Error('Evolution search cancelled');
      err.name = 'AbortError';
      rejectPromise(err);
    }
  };
}
