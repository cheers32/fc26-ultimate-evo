import { EvolutionDefinition } from '../../types/player';

export const phdInDribbling1015: EvolutionDefinition = {
  id: '1015',
  name: 'PhD In Dribbling',
  futbinLink: 'https://www.futbin.com/26/evolutions/1015/phd-in-dribbling',
  version: 'FC 26',
  description: 'Found in the Japan Objective.',
  descriptionZh: "来自 Japan 目标。｜适合：非门将，只给速度和盘带面板各 +5，属于收尾补丁。",
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
