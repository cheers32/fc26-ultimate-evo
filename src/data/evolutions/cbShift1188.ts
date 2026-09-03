import { EvolutionDefinition } from '../../types/player';

export const cbShift1188: EvolutionDefinition = {
  id: '1188',
  name: 'CB Shift',
  futbinLink: 'https://www.futbin.com/26/evolutions/1188/cb-shift',
  version: 'FC 26',
  description: 'Apply the CB position to any qualified player.',
  descriptionZh: "【准入】非 CB，OVR ≤96。【收益】加位置 CB。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  positionsAdded: ['CB'],
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Position: CB',
        'Role: Defender++', 'Role: Stopper++', 'Role: Ball-Playing Defender++',
        'Role: Wide Back+'
      ]
    }
  ],
  maxRepeatable: 1
};
