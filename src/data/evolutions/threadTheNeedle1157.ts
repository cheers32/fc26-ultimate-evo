import { EvolutionDefinition } from '../../types/player';

export const threadTheNeedle1157: EvolutionDefinition = {
  id: '1157',
  name: 'Thread the needle',
  futbinLink: 'https://www.futbin.com/26/evolutions/1157/thread-the-needle',
  version: 'FC 26',
  description: 'Thread the needle with precision by equipping your player with a collection of passing PlayStyles.',
  descriptionZh: "用一组传球类 PlayStyle 武装你的球员，穿针引线般精准。｜适合：任何位置，只给 PlayStyle 不加数值。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStylesPlus: 3
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Incisive Pass+', 'Pinged Pass+', 'Tiki Taka+', 'Long Ball Pass+'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'PlayStyle+: Incisive Pass (4)', 'PlayStyle+: Pinged Pass (4)', 'PlayStyle+: Tiki Taka (4)', 'PlayStyle+: Long Ball Pass (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
