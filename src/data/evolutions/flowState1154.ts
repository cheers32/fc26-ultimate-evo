import { EvolutionDefinition } from '../../types/player';

export const flowState1154: EvolutionDefinition = {
  id: '1154',
  name: 'Flow State',
  futbinLink: 'https://www.futbin.com/26/evolutions/1154/flow-state',
  version: 'FC 26',
  description: 'Boosts passing and dribbling to help players move smoothly on the ball, link play with confidence, and create space in tight areas.',
  descriptionZh: "【准入】非 GK，OVR ≤95。【收益】OVR +1（顶 96）；传球面板 +5（顶 96）；盘带面板 +5（顶 96）；PlayStyle 3 个（Incisive Pass、Technical、Tiki Taka）。【其他】1 级 · 可重复 4 次 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  maxRepeatable: 4,
  ovrBoost: { boost: 1, limit: 96 },
  faceBoosts: {
    pas: { boost: 5, limit: 96 },
    dri: { boost: 5, limit: 96 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: [],
    silver: ['Incisive Pass', 'Technical', 'Tiki Taka']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (96)',
        'Passing Face +5 (96)',
        'Dribbling Face +5 (96)',
        'PlayStyle: Incisive Pass (7)',
        'PlayStyle: Technical (7)',
        'PlayStyle: Tiki Taka (7)'
      ]
    }
  ]
};
