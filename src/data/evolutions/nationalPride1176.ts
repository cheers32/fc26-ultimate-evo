import { EvolutionDefinition } from '../../types/player';

export const nationalPride1176: EvolutionDefinition = {
  id: '1176',
  name: 'National Pride',
  futbinLink: 'https://www.futbin.com/26/evolutions/1176/national-pride',
  version: 'FC 26',
  description: 'Turn any player into a National Pride player!',
  descriptionZh: "【准入】OVR ≤94。【收益】稀有度改为 National Pride。【其他】1 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 94,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 0, limit: 94 },
  subStatBoosts: {},
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Rarity: National Pride'
      ]
    }
  ],
  maxRepeatable: 1
};
