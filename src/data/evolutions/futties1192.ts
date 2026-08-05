import { EvolutionDefinition } from '../../types/player';

export const futties1192: EvolutionDefinition = {
  id: '1192',
  name: 'FUTTIES',
  futbinLink: 'https://www.futbin.com/26/evolutions/1192/futties',
  version: 'FC 26',
  description: 'Turn your favourite player into a FUTTIES player. This item rarity offers two league links to chemistry and full chemistry in position!',
  cost: '500 Tokens / 100,000 Coins',
  requirements: {
    maxOvr: 96
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  rarityChange: 'Futties Evo',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['Rarity → Futties Evo (cosmetic only, no stat upgrades)']
    }
  ],
  maxRepeatable: 2
};
