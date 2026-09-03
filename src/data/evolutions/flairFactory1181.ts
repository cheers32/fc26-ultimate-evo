import { EvolutionDefinition } from '../../types/player';

export const flairFactory1181: EvolutionDefinition = {
  id: '1181',
  name: 'Flair Factory',
  futbinLink: 'https://www.futbin.com/26/evolutions/1181/flair-factory',
  version: 'FC 26',
  description: 'The best entertainers always keep defenders guessing. Evolve your player and bring the two footed flair that makes every touch unpredictable.',
  descriptionZh: "【准入】OVR ≤95，PS+ ≤4。【收益】弱脚 +4；花式 +4；PlayStyle+ 1 个（Technical+）；PlayStyle 1 个（Low Driven Shot）。【其他】1 级 · 可重复 5 次 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 0, limit: 95 },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Technical+'],
    silver: ['Low Driven Shot']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Weak Foot +4 (5)', 'Skill Moves +4 (5)',
        'PlayStyle+: Technical (4)', 'PlayStyle: Low Driven Shot (7)'
      ]
    }
  ],
  maxRepeatable: 5
};
