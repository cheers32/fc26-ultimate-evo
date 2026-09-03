import { EvolutionDefinition } from '../../types/player';

/**
 * One of the four "Max" evos — pace straight to 99 and nothing else. FUTBIN prints no OVR cap on this one, unlike its three siblings, so none is modelled — 99 stands in for no constraint.
 *
 * FUTBIN prints the boost as +98 with no cap, which is the point: it is not a boost so much as an
 * instruction to fill the face. That makes it worth exactly what the card is short of 99 there, so
 * it belongs on a card with a real hole rather than one already in the high 90s — and it belongs
 * last in a chain, since it will be worth less after anything else has raised the same face.
 */
export const maxPace1236: EvolutionDefinition = {
  id: '1236',
  name: 'Max Pace',
  futbinLink: 'https://www.futbin.com/26/evolutions/1236/max-pace',
  version: 'FC 26',
  description: 'Boost your player to 99 Pace. Season 10 level 28 reward.',
  descriptionZh: "【准入】非 GK，OVR ≤99。【收益】OVR +2（顶 99）；速度面板 +98（顶 99）。【其他】1 级 · Season 10 — Level 28 Reward。",
  cost: 'Season 10 — Level 28 Reward',
  requirements: {
    maxOvr: 99,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 2, limit: 99 },
  faceBoosts: {
    pac: { boost: 98, limit: 99 }
  },
  subStatBoosts: {},
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    { name: 'Level 1', upgrades: ['OVR +2', 'Pace +98'] }
  ],
  maxRepeatable: 1
};
