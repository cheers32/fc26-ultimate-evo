import { PathFeedback, PlayerBio, StatsData } from '../types/player';

/**
 * One build, one key, whatever order the search happened to find its evos in. Without this the same
 * three evos are three different records and every count drawn from them is wrong.
 */
export const chainKeyOf = (chainIds: string[]) => [...chainIds].sort().join(',');

/** Feedback is stored across every card in one map, so the record has to name the card too. */
export const feedbackKeyOf = (playerId: string, chainIds: string[]) =>
  `${playerId}|${chainKeyOf(chainIds)}`;

/** Every sub-stat of a finished card, flattened — the form a retune can actually read. */
export function flattenSubs(stats: StatsData): Record<string, number> {
  const out: Record<string, number> = {};
  for (const face of Object.values(stats)) {
    for (const [key, sub] of Object.entries(face.subs)) out[key] = sub.base;
  }
  return out;
}

/** What this card's thumbs mean to a search: what to hide, and what to keep whatever happens. */
export function feedbackForPlayer(
  store: Record<string, PathFeedback>,
  playerId: string
): { down: string[]; up: string[]; byChain: Record<string, PathFeedback> } {
  const down: string[] = [];
  const up: string[] = [];
  const byChain: Record<string, PathFeedback> = {};
  for (const record of Object.values(store)) {
    if (record.playerId !== playerId) continue;
    byChain[record.chainKey] = record;
    (record.verdict === 'down' ? down : up).push(record.chainKey);
  }
  return { down, up, byChain };
}

/** The record written when a row is rated, with the numbers as they were at the time. */
export function makeFeedback(
  verdict: 'up' | 'down',
  playerId: string,
  bio: PlayerBio,
  chainIds: string[],
  finalOvr: number,
  finalStats: StatsData,
  extras: { templateId?: string; reasons?: string[]; archetype?: string; heightCm?: number }
): PathFeedback {
  const subs = flattenSubs(finalStats);
  return {
    verdict,
    playerId,
    playerName: bio.name,
    chainKey: chainKeyOf(chainIds),
    chainIds: [...chainIds],
    templateId: extras.templateId,
    reasons: extras.reasons,
    snapshot: {
      ovr: finalOvr,
      igs: Object.values(subs).reduce((a, b) => a + b, 0),
      positions: bio.primaryPositions,
      heightCm: extras.heightCm,
      archetype: extras.archetype,
      subs
    },
    at: Date.now()
  };
}

/** Which plan a V2 row was listed under, read back off the reason line it prints. */
export function templateIdFromDescription(
  description: string | undefined,
  names: { id: string; name: string }[]
): string | undefined {
  if (!description) return undefined;
  return names.find(n => description.includes(n.name))?.id;
}
