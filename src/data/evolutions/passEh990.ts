import { EvolutionDefinition } from '../../types/player';

export const passEh990: EvolutionDefinition = {
  id: '990',
  name: 'Pass, Eh',
  futbinLink: 'https://www.futbin.com/26/evolutions/990/pass-eh',
  version: 'FC 26',
  description: 'Slice open defenses with pinpoint vision and effortless distribution that keeps the attack flowing.',
  descriptionZh: "用精准的视野和轻松的分球撕开防线，让进攻持续流动。｜适合：任何位置，纯传球线 6 项，中场和边后卫最实用。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    crossing: { boost: 7, limit: 94 },
    curve: { boost: 7, limit: 94 },
    longPass: { boost: 7, limit: 94 },
    shortPass: { boost: 7, limit: 94 },
    freekick: { boost: 7, limit: 94 },
    vision: { boost: 7, limit: 94 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: ['Tiki Taka', 'Incisive Pass', 'Pinged Pass', 'Inventive']
  },
  playStylesLimit: {
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Crossing +7 (94)', 'Vision +7 (94)', 'Weak Foot +4 (5)',
        'PlayStyle: Tiki Taka (8)', 'PlayStyle: Incisive Pass (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Curve +7 (94)', 'Long Pass +7 (94)', 'Short Pass +7 (94)', 'FK Acc. +7 (94)',
        'PlayStyle: Pinged Pass (8)', 'PlayStyle: Inventive (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
