import { EvolutionDefinition } from '../../types/player';

export const shutdown1146: EvolutionDefinition = {
  id: '1146',
  name: 'Shutdown',
  futbinLink: 'https://www.futbin.com/26/evolutions/1146/shutdown',
  version: 'FC 26',
  description: 'Take control, block attacks and win duels.',
  descriptionZh: "【准入】OVR ≤94，PS+ ≤3。【收益】OVR +1（顶 99）；防守线 3 项（最高 +20）；PlayStyle+ 2 个（Jockey、Anticipate）。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    interceptions: { boost: 20, limit: 96 },
    defAwareness: { boost: 20, limit: 96 },
    standTackle: { boost: 20, limit: 96 }
  },
  playStylesAdded: {
    gold: ['Jockey', 'Anticipate'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Interceptions +20 (96)', 'Def. Aware +20 (96)',
        'Stand Tackle +20 (96)', 'PlayStyle+: Jockey (4)', 'PlayStyle+: Anticipate (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
