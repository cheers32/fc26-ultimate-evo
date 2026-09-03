import { EvolutionDefinition } from '../../types/player';

export const nationalPride1176: EvolutionDefinition = {
  id: '1176',
  name: 'National Pride',
  futbinLink: 'https://www.futbin.com/26/evolutions/1176/national-pride',
  version: 'FC 26',
  description: 'Turn any player into a National Pride player!',
  descriptionZh: "把任何球员变成 National Pride 球员！｜适合：任何位置，只改稀有度（解锁自选 PlayStyle），不加数值。",
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
