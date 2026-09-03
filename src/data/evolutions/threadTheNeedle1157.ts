import { EvolutionDefinition } from '../../types/player';

export const threadTheNeedle1157: EvolutionDefinition = {
  id: '1157',
  name: 'Thread the needle',
  futbinLink: 'https://www.futbin.com/26/evolutions/1157/thread-the-needle',
  version: 'FC 26',
  description: 'Thread the needle with precision by equipping your player with a collection of passing PlayStyles.',
  descriptionZh: "【准入】OVR ≤96，PS+ ≤3。【收益】PlayStyle+ 4 个（Incisive Pass+、Pinged Pass+、Tiki Taka+、Long Ball Pass+）。【其他】1 级 · Objective Reward。",
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
