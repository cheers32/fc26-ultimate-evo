import { analyzeEvolutions } from './evoEngine';
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
    const paths = analyzeEvolutions(
      req.poolIds,
      req.maxDepth,
      req.bio,
      req.ovr,
      req.stats,
      req.playStyles,
      req.filters,
      req.prefixChainIds,
      nodesVisited => {
        const msg: EvoSearchResponse = { type: 'progress', nodesVisited };
        self.postMessage(msg);
      }
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
