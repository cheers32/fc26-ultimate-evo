import { analyzeEvolutions } from './evoEngine';
import { analyzeEvolutionsV2, V2Feedback } from './analyzeV2';
import { EvolutionPath, PlayerBio, OvrData, StatsData, PlayStylesData, EvoFilters } from '../types/player';

export interface EvoSearchRequest {
  poolIds: string[];
  maxDepth: number;
  bio: PlayerBio;
  ovr: OvrData;
  stats: StatsData;
  playStyles: PlayStylesData;
  filters?: EvoFilters;
  prefixChainIds: string[];
  /** Which ranking to run. V2 scores the weak link; see analyzeV2.ts. */
  version?: 1 | 2;
  /** This card's thumbs. V2 only: hides what you turned down, keeps what you liked. */
  feedback?: V2Feedback;
}

export type EvoSearchResponse =
  | { type: 'progress'; nodesVisited: number }
  | { type: 'done'; paths: EvolutionPath[] }
  | { type: 'error'; message: string };

// The search is a deep DFS that runs for tens of seconds at the depths the app uses, so it
// lives in a worker: the main thread stays interactive and the run can simply be terminated.
self.onmessage = (e: MessageEvent<EvoSearchRequest>) => {
  const req = e.data;
  try {
    const onProgress = (nodesVisited: number) => {
      const msg: EvoSearchResponse = { type: 'progress', nodesVisited };
      self.postMessage(msg);
    };
    const paths =
      req.version === 2
        ? analyzeEvolutionsV2({
            poolIds: req.poolIds,
            maxDepth: req.maxDepth,
            baseBio: req.bio,
            baseOvr: req.ovr,
            baseStats: req.stats,
            basePlayStyles: req.playStyles,
            filters: req.filters,
            prefixChainIds: req.prefixChainIds,
            feedback: req.feedback,
            onProgress
          })
        : analyzeEvolutions(
            req.poolIds,
            req.maxDepth,
            req.bio,
            req.ovr,
            req.stats,
            req.playStyles,
            req.filters,
            req.prefixChainIds,
            onProgress
          );
    const msg: EvoSearchResponse = { type: 'done', paths };
    self.postMessage(msg);
  } catch (err) {
    const msg: EvoSearchResponse = {
      type: 'error',
      message: err instanceof Error ? err.message : String(err)
    };
    self.postMessage(msg);
  }
};
