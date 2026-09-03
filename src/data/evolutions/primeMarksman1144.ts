import { EvolutionDefinition } from '../../types/player';

export const primeMarksman1144: EvolutionDefinition = {
  id: '1144',
  name: 'Prime Marksman',
  futbinLink: 'https://www.futbin.com/26/evolutions/1144/prime-marksman',
  version: 'FC 26',
  description: 'Stay calm under pressure and turn chances into goals.',
  descriptionZh: "在压力下保持冷静，把机会变成进球。｜适合：任何位置，只加三项射门 sub，小补丁。",
  cost: 'Objective Reward',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    finishing: { boost: 20, limit: 96 },
    longShots: { boost: 20, limit: 96 },
    shotPower: { boost: 20, limit: 96 }
  },
  playStylesAdded: {
    gold: ['Power Shot', 'Low Driven Shot'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Finishing +20 (96)', 'Long Shots +20 (96)', 'Shot Power +20 (96)',
        'PlayStyle+: Power Shot (4)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
