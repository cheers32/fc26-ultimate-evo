import { EvolutionDefinition } from '../../types/player';

export const futties1192: EvolutionDefinition = {
  id: '1192',
  name: 'FUTTIES',
  futbinLink: 'https://www.futbin.com/26/evolutions/1192/futties',
  version: 'FC 26',
  description: 'Turn your favourite player into a FUTTIES player. This item rarity offers two league links to chemistry and full chemistry in position!',
  descriptionZh: "把你最喜欢的球员变成 FUTTIES 球员。这个稀有度提供两条联赛链接和本位置满契合！｜适合：任何位置，只改稀有度不加数值，可重复 2 次。",
  cost: '500 Tokens / 100,000 Coins',
  requirements: {
    maxOvr: 96
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['Rarity → Futties (cosmetic only, no stat upgrades)']
    }
  ],
  maxRepeatable: 2
};
