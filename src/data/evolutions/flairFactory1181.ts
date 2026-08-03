import { EvolutionDefinition } from '../../types/player';

export const flairFactory1181: EvolutionDefinition = {
  id: '1181',
  name: 'Flair Factory',
  futbinLink: 'https://www.futbin.com/26/evolutions/1181/flair-factory',
  version: 'FC 26',
  description: 'The best entertainers always keep defenders guessing. Evolve your player and bring the two footed flair that makes every touch unpredictable.',
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
