import { EvolutionDefinition } from '../../types/player';

export const thePerfectBreak1195: EvolutionDefinition = {
  id: '1195',
  name: 'The Perfect Break',
  futbinLink: 'https://www.futbin.com/26/evolutions/1195/the-perfect-break',
  version: 'FC 26',
  description: 'Take a quick breather, then return with sharper skills, complete confidence on either foot and the dribbling to leave defenders behind.',
  cost: 'Free',
  trainingTime: '15 Mins',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 95 },
  subStatBoosts: {
    agility: { boost: 6, limit: 96 },
    balance: { boost: 6, limit: 96 },
    ballControl: { boost: 7, limit: 94 },
    dribbling: { boost: 8, limit: 97 },
    reactions: { boost: 7, limit: 94 },
    composure: { boost: 6, limit: 94 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: ['Technical', 'Trickster']
  },
  playStylesLimit: {
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Agility +6 (96)', 'Balance +6 (96)', 'Reactions +7 (94)', 'Skill Moves +4 (5)',
        'PlayStyle: Technical (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +7 (94)', 'Dribbling +8 (97)', 'Composure +6 (94)', 'Weak Foot +4 (5)',
        'PlayStyle: Trickster (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
