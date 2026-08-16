import { analyzeEvolutions } from './evoEngine';
import { analyzeEvolutionsV2, V2Diagnosis, V2Feedback } from './analyzeV2';
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
  /**
   * How to read the card, V2 only. Both by default, and they are genuinely two answers: the bare
   * card is what you are holding, the styled one is what you would field. A build can be the best
   * available under one reading and not exist under the other, and which of those you want depends
   * on whether the style is already decided.
   */
  readings?: ('bare' | 'chem')[];
  /** This card's thumbs. V2 only: hides what you turned down, keeps what you liked. */
  feedback?: V2Feedback;
}

export type EvoSearchResponse =
  | { type: 'progress'; nodesVisited: number }
  | { type: 'done'; paths: EvolutionPath[]; diagnosis?: V2Diagnosis }
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
    let diagnosis: V2Diagnosis | undefined;
    const runV2 = () => {
      const readings = req.readings && req.readings.length > 0 ? req.readings : ['bare', 'chem'];
      const out: EvolutionPath[] = [];
      // A build both readings arrive at is one build, and it keeps the bare entry — the one that
      // promises less. Dropped before the numbering rather than after, or the second list comes
      // back as C1, C4, C5 and reads as though three of them went missing.
      const seen = new Set<string>();
      for (const reading of readings) {
        const found = analyzeEvolutionsV2({
          poolIds: req.poolIds,
          maxDepth: req.maxDepth,
          baseBio: req.bio,
          baseOvr: req.ovr,
          baseStats: req.stats,
          basePlayStyles: req.playStyles,
          filters: { ...(req.filters || {}), assumeChemStyle: reading === 'chem' },
          prefixChainIds: req.prefixChainIds,
          feedback: req.feedback,
          onProgress,
          // The readings differ on what a stat can reach, so the kindest of them is reported: a
          // floor that is out of reach even at its most optimistic is out of reach.
          report: d => {
            if (!diagnosis) { diagnosis = d; return; }
            diagnosis = {
              visited: diagnosis.visited + d.visited,
              floors: diagnosis.floors.map((f, i) => ({ ...f, best: Math.max(f.best, d.floors[i]?.best ?? 0) }))
            };
          }
        });
        // Numbered within its own reading and named for it, because the two lists answer different
        // questions and interleaving them would leave a #2 that is better than a #1.
        let rank = 0;
        for (const path of found) {
          const key = [...path.chainIds].sort().join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          rank += 1;
          out.push({
            ...path,
            id: `${path.id}-${reading}`,
            name: reading === 'chem' ? `C${rank}` : `#${rank}`,
            description:
              (reading === 'chem' ? 'with a chem style · ' : 'bare card · ') + path.description
          });
        }
      }
      return out;
    };

    const paths =
      req.version === 2
        ? runV2()
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
    const msg: EvoSearchResponse = { type: 'done', paths, diagnosis };
    self.postMessage(msg);
  } catch (err) {
    const msg: EvoSearchResponse = {
      type: 'error',
      message: err instanceof Error ? err.message : String(err)
    };
    self.postMessage(msg);
  }
};
