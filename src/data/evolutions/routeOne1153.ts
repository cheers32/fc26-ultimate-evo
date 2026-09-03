import { EvolutionDefinition } from '../../types/player';

export const routeOne1153: EvolutionDefinition = {
  id: '1153',
  name: 'Route One',
  futbinLink: 'https://www.futbin.com/26/evolutions/1153/route-one',
  version: 'FC 26',
  description: 'A simple shift to fix your defensive depth. Add the center back position to any player and give their defending stats the precise upgrade needed to anchor your backline.',
  descriptionZh: "【准入】非 GK，OVR ≤95，PS+ ≤4。【收益】OVR +1（顶 96）；防守面板 +30（顶 95）；PlayStyle+ 2 个（Anticipate+、Pinged Pass+）；PlayStyle 2 个（Intercept、Block）；加位置 CB。【其他】1 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 96 },
  faceBoosts: {
    def: { boost: 30, limit: 95 }
  },
  subStatBoosts: {},
  positionsAdded: ['CB'],
  playStylesAdded: {
    gold: ['Anticipate+', 'Pinged Pass+'],
    silver: ['Intercept', 'Block']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (96)', 'Defending Face +30 (95)', 'Position CB',
        'PlayStyle+: Anticipate (4)', 'PlayStyle+: Pinged Pass (4)',
        'PlayStyle: Intercept (7)', 'PlayStyle: Block (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
