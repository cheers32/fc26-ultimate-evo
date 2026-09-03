import { EvolutionDefinition } from '../../types/player';

export const bornStriker1202: EvolutionDefinition = {
  id: '1202',
  name: 'Born Striker',
  futbinLink: 'https://www.futbin.com/26/evolutions/1202/born-striker',
  version: 'FC 26',
  description: 'Apply the ST Position to any player.',
  descriptionZh: "【准入】OVR ≤96。【收益】加位置 ST。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  positionsAdded: ['ST'],
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Position: ST',
        'Role: Target Forward++', 'Role: False 9++', 'Role: Poacher++',
        'Role: Advanced Forward++'
      ]
    }
  ],
  maxRepeatable: 1
};
