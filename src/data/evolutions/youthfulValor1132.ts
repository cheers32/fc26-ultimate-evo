import { EvolutionDefinition } from '../../types/player';

export const youthfulValor1132: EvolutionDefinition = {
  id: '1132',
  name: 'Youthful Valor',
  futbinLink: 'https://www.futbin.com/26/evolutions/1132/youthful-valor',
  version: 'FC 26',
  description: "Turn young ambition into a fearless wall by strengthening your player's defensive and physical stats.",
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM', 'CDM']
  },
  ovrBoost: { boost: 2, limit: 95 },
  faceBoosts: {
    def: { boost: 7, limit: 96 },
    phy: { boost: 7, limit: 96 }
  },
  subStatBoosts: {},
  positionsAdded: ['CM', 'CDM'],
  playStylesAdded: {
    gold: ['Anticipate'],
    silver: ['Anticipate', 'Intercept', 'Bruiser']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (95)', 'DEF +7 (96)', 'Position: CM', 'PlayStyle+: Anticipate (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'PHY +7 (96)', 'Position: CDM',
        'PlayStyle: Anticipate (8)', 'PlayStyle: Intercept (8)', 'PlayStyle: Bruiser (8)'
      ]
    }
  ],
  maxRepeatable: 2
};
