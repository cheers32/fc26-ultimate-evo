import { EvolutionDefinition } from '../../types/player';

export const phdInDribbling1015: EvolutionDefinition = {
  id: '1015',
  name: 'PhD In Dribbling',
  futbinLink: 'https://www.futbin.com/26/evolutions/1015/phd-in-dribbling',
  version: 'FC 26',
  description: 'Found in the Japan Objective.',
  descriptionZh: "【准入】非 GK，OVR ≤91，PS+ ≤3。【收益】OVR +1（顶 99）；速度面板 +5（顶 93）；盘带面板 +5（顶 94）；PlayStyle+ 1 个（Technical）。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    // FUTBIN's label says "PlayStyle Max 3", but the in-game gate is 3 PlayStyle+.
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 99 },
  faceBoosts: {
    pac: { boost: 5, limit: 93 },
    dri: { boost: 5, limit: 94 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Technical'],
    silver: []
  },
  playStylesLimit: {
    gold: 3
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +1', 'PAC +5 (93)', 'DRI +5 (94)', 'PlayStyle+: Technical (3)']
    }
  ],
  maxRepeatable: 1
};
