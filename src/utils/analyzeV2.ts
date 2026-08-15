import { EvolutionPath, StatsData } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';
import { ChainSearchInput, forEachChain, simulateEvoChain } from './evoEngine';
import { DEFAULT_SUBSTAT_WEIGHT, SUBSTAT_WEIGHTS } from './playstyleProfile';
import { POSITION_WEIGHTS } from './positionWeights';
import {
  AccelerateFamily,
  calculateAccelerateFamily,
  parseHeightCm
} from './statUtils';
import { achievableAccelerateFamilies } from './fitScore';

/**
 * Analyze V2 — ranked on what the card is missing rather than on what it adds up to.
 *
 * The original ranking maximises a total: raw IGS, or the face stats weighted by position. A total
 * hides a hole. A winger build can carry the best position-weighted score in the search and still
 * be unusable because it left agility at 78, and the only way to find that out was to open each
 * build and read the sub-stats — which is the manual checking this is meant to remove.
 *
 * So V2 scores the weak link. For each position it takes the sub-stats that position actually runs
 * on, and charges the build for however far its worst one falls short of end-game. A build with no
 * hole beats a build with a bigger total and a hole, which is the ranking a finished team wants.
 *
 * PlayStyles are deliberately not part of any of this — only stats and AcceleRATE, as asked. That
 * also keeps the ranking legible: every number in a V2 reason can be checked on the stat panel.
 */

/** What a sub-stat has to reach before it stops being the thing holding a card back. */
const ENDGAME_TARGET = 90;

/** How much a point of shortfall costs. Tuned so a 78 on a key stat sinks a build ~6 points. */
const SHORTFALL_COST = 0.5;

/**
 * A sub-stat is "key" for a position when the position leans on it. The weights are per position
 * and sum to about 1 across a listed set of ten or so, so a tenth is roughly "a full share".
 */
const KEY_WEIGHT = 0.08;

const FACE_KEYS = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'] as const;
type FaceKey = (typeof FACE_KEYS)[number];

const FACE_LABEL: Record<FaceKey, string> = {
  pac: 'PAC',
  sho: 'SHO',
  pas: 'PAS',
  dri: 'DRI',
  def: 'DEF',
  phy: 'PHY'
};

/** Only the best few per shortlist are kept; the rest of the search is thrown away as it goes. */
const PER_POSITION = 5;
const PER_EMPHASIS = 3;

const subValues = (stats: StatsData): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const face of Object.values(stats)) {
    for (const [key, sub] of Object.entries(face.subs)) out[key] = sub.base;
  }
  return out;
};

const keySubStatsFor = (pos: string): string[] => {
  const weights = SUBSTAT_WEIGHTS[pos.toUpperCase()];
  if (!weights) return [];
  return Object.entries(weights)
    .filter(([, w]) => w >= KEY_WEIGHT)
    .map(([k]) => k);
};

const prettySub = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .replace('Def Awareness', 'Def. Aware')
    .replace('Heading Acc', 'Heading')
    .trim();

interface Scored {
  /** Sub-stat weighted score for the position, 0-99, before the weak link is charged for. */
  raw: number;
  /** What the build is worth once its worst key sub-stat is paid for. */
  score: number;
  weakestKey: string;
  weakestValue: number;
}

/** What one position makes of a finished card. */
function scoreForPosition(subs: Record<string, number>, pos: string): Scored {
  const P = pos.toUpperCase();
  const weights = SUBSTAT_WEIGHTS[P];

  let raw = 0;
  if (weights) {
    // Normalised by the weights actually listed: the tables were written to rank cards against
    // each other at one position, so they sum to roughly — but not exactly — one, and an
    // un-normalised total reads as 109 out of 99. Dividing makes the number a stat again, and
    // makes two positions' scores comparable.
    let total = 0;
    for (const [key, w] of Object.entries(weights)) {
      raw += (subs[key] ?? 0) * w;
      total += w;
    }
    if (total > 0) raw /= total;
  } else {
    // No table for this position: fall back to a flat read so it still ranks rather than ties.
    const vals = Object.values(subs);
    raw = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
  }

  let weakestKey = '';
  let weakestValue = 99;
  for (const key of keySubStatsFor(P)) {
    const v = subs[key] ?? 0;
    if (v < weakestValue) {
      weakestValue = v;
      weakestKey = key;
    }
  }
  if (!weakestKey) weakestValue = ENDGAME_TARGET;

  const shortfall = Math.max(0, ENDGAME_TARGET - weakestValue);
  return { raw, score: raw - shortfall * SHORTFALL_COST, weakestKey, weakestValue };
}

interface Candidate {
  chainIds: string[];
  ovr: number;
  igs: number;
  faces: Record<FaceKey, number>;
  /** Per requested position, in the order they were asked for. */
  perPosition: Scored[];
  accelerate: AccelerateFamily;
  reachable: AccelerateFamily[];
}

const canonical = (ids: string[]) => [...ids].sort().join(',');

/**
 * Keeps the best `limit` by `score`, deduped on the set of evos — the same evos in a different
 * order are the same build to anyone reading the list.
 */
function offer(list: Candidate[], cand: Candidate, limit: number, score: (c: Candidate) => number) {
  const key = canonical(cand.chainIds);
  const at = list.findIndex(c => canonical(c.chainIds) === key);
  if (at >= 0) {
    if (score(cand) <= score(list[at])) return;
    list.splice(at, 1);
  }
  if (list.length >= limit && score(cand) <= score(list[list.length - 1])) return;
  let i = list.length;
  while (i > 0 && score(list[i - 1]) < score(cand)) i--;
  list.splice(i, 0, cand);
  if (list.length > limit) list.length = limit;
}

export function analyzeEvolutionsV2(input: ChainSearchInput): EvolutionPath[] {
  const { baseBio, baseOvr, baseStats, basePlayStyles } = input;

  const positions = baseBio.primaryPositions
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);
  const rankPositions = positions.length > 0 ? positions : ['ST'];
  const height = parseHeightCm(baseBio.height);

  const byPosition: Candidate[][] = rankPositions.map(() => []);
  const byEmphasis: Record<FaceKey, Candidate[]> = {
    pac: [],
    sho: [],
    pas: [],
    dri: [],
    def: [],
    phy: []
  };

  forEachChain(input, (chainIds, state) => {
    const subs = subValues(state.stats);
    const faces = FACE_KEYS.reduce((acc, k) => {
      acc[k] = state.stats[k]?.baseFace ?? 0;
      return acc;
    }, {} as Record<FaceKey, number>);

    const cand: Candidate = {
      chainIds: [...chainIds],
      ovr: state.ovr,
      igs: Object.values(subs).reduce((a, b) => a + b, 0),
      faces,
      perPosition: rankPositions.map(pos => scoreForPosition(subs, pos)),
      accelerate: calculateAccelerateFamily(
        subs.acceleration ?? 50,
        subs.agility ?? 50,
        subs.strength ?? 50,
        height
      ),
      reachable: [...achievableAccelerateFamilies(state.stats, state.bio)]
    };

    byPosition.forEach((list, i) => offer(list, cand, PER_POSITION, c => c.perPosition[i].score));

    // The emphasis shortlists answer "make this stat as big as you can" — so they rank on the
    // stat itself, and the weak link is reported rather than charged for. Asking for maximum
    // Passing and being handed the build with the best *balance* would not be an answer.
    FACE_KEYS.forEach(k =>
      offer(byEmphasis[k], cand, PER_EMPHASIS, c => c.faces[k] * 100 + c.perPosition[0].score)
    );
  });

  // Merge, keeping every label a build earned: one build is often both "best at CAM" and "most
  // Passing", and saying so is more useful than showing it twice.
  const merged: { cand: Candidate; labels: string[] }[] = [];
  const add = (cand: Candidate, label: string) => {
    const key = canonical(cand.chainIds);
    const existing = merged.find(m => canonical(m.cand.chainIds) === key);
    if (existing) {
      if (!existing.labels.includes(label)) existing.labels.push(label);
    } else {
      merged.push({ cand, labels: [label] });
    }
  };

  rankPositions.forEach((pos, i) => {
    byPosition[i].forEach((cand, n) => add(cand, `${pos}${n + 1}`));
  });
  FACE_KEYS.forEach(k => {
    // A stat this position does not use is noise — nobody wants "max DEF" on a winger.
    const weight = POSITION_WEIGHTS[rankPositions[0].toUpperCase()]?.[k] ?? 0;
    if (weight < 0.1) return;
    byEmphasis[k].forEach((cand, n) => add(cand, `Max ${FACE_LABEL[k]}${n > 0 ? n + 1 : ''}`));
  });

  // The order they are handed back in is the recommendation: by what the card's own first position
  // makes of them, weak link and all.
  merged.sort((a, b) => b.cand.perPosition[0].score - a.cand.perPosition[0].score);

  return merged.map(({ cand, labels }, idx) => {
    const full = simulateEvoChain(cand.chainIds, baseBio, baseOvr, baseStats, basePlayStyles);
    const primary = cand.perPosition[0];

    const faceLine = FACE_KEYS.filter(k => (POSITION_WEIGHTS[rankPositions[0].toUpperCase()]?.[k] ?? 0) >= 0.15)
      .map(k => `${FACE_LABEL[k]} ${cand.faces[k]}`)
      .join(' ');

    const weak =
      primary.weakestValue >= ENDGAME_TARGET
        ? `no key stat under ${ENDGAME_TARGET}`
        : `weakest ${prettySub(primary.weakestKey)} ${primary.weakestValue}`;

    const others = cand.reachable.filter(f => f !== cand.accelerate);
    const rate = others.length > 0
      ? `${cand.accelerate} (${others.join('/')} on chem)`
      : cand.accelerate;

    const evoNames = cand.chainIds.map(id => availableEvolutions[id]?.name || id).join(' ➜ ');

    return {
      id: `v2-path-${Date.now()}-${idx}`,
      // Just the rank. The chip is a tab in a row of twenty, so it has room for a position in the
      // order and nothing else — everything a build earned is in the reason line below it.
      name: `#${idx + 1}`,
      // The reason, in the order it is worth reading: what it is best at, how good it is there,
      // what is missing, what it ends up as, then how it was built.
      description: `${labels.join(' · ')} — ${rankPositions[0]} ${primary.score.toFixed(1)} · ${weak} · OVR ${cand.ovr} · ${faceLine} · ${rate} · ${cand.chainIds.length} evos — ${evoNames}`,
      isRecommended: true,
      chainIds: [...cand.chainIds],
      steps: full.steps
    };
  });
}
