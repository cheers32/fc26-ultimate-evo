import { EvolutionDefinition } from '../../types/player';

export const youShallNotPass1178: EvolutionDefinition = {
  id: '1178',
  name: 'You Shall Not Pass',
  futbinLink: 'https://www.futbin.com/26/evolutions/1178/you-shall-not-pass',
  version: 'FC 26',
  description: 'Draw a line and dare attackers to cross it.',
  descriptionZh: "【准入】CB 专用，OVR ≤95，PS+ ≤3。【收益】PlayStyle+ 4 个（Bruiser、Anticipate、Intercept、Quick Step）。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 95,
    maxPlayStylesPlus: 3,
    positions: ['CB']
  },
  ovrBoost: { boost: 0, limit: 95 },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Bruiser', 'Anticipate', 'Intercept', 'Quick Step'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'PlayStyle+: Bruiser (4)', 'PlayStyle+: Anticipate (4)',
        'PlayStyle+: Intercept (4)', 'PlayStyle+: Quick Step (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
