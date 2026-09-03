import { EvolutionDefinition } from '../../types/player';

export const perfectLinkUp1145: EvolutionDefinition = {
  id: '1145',
  name: 'Perfect Link Up',
  futbinLink: 'https://www.futbin.com/26/evolutions/1145/perfect-link-up',
  version: 'FC 26',
  description: 'Build smarter play with quick thinking and short passes.',
  descriptionZh: "【准入】OVR ≤94，PS+ ≤3。【收益】OVR +1（顶 99）；传球线 3 项（最高 +20）；PlayStyle+ 2 个（Pinged Pass、Incisive Pass）。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    longPass: { boost: 20, limit: 96 },
    shortPass: { boost: 20, limit: 96 },
    vision: { boost: 20, limit: 96 }
  },
  playStylesAdded: {
    gold: ['Pinged Pass', 'Incisive Pass'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Long Pass +20 (96)', 'Short Pass +20 (96)', 'Vision +20 (96)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle+: Incisive Pass (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
