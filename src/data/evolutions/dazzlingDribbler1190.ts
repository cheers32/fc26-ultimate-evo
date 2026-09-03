import { EvolutionDefinition } from '../../types/player';

export const dazzlingDribbler1190: EvolutionDefinition = {
  id: '1190',
  name: 'Dazzling Dribbler',
  futbinLink: 'https://www.futbin.com/26/evolutions/1190/dazzling-dribbler',
  version: 'FC 26',
  description: 'Unlocked by completing the Chime Challenge objective',
  descriptionZh: "完成 Chime Challenge 目标解锁。｜适合：任何位置，只加盘带线 6 项。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {
    agility: { boost: 10, limit: 97 },
    balance: { boost: 10, limit: 96 },
    ballControl: { boost: 10, limit: 97 },
    dribbling: { boost: 10, limit: 98 },
    reactions: { boost: 10, limit: 95 },
    composure: { boost: 10, limit: 95 }
  },
  weakFootBoost: 3,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Technical+', 'Rapid+'],
    silver: ['Quick Step', 'Incisive Pass', 'Finesse Shot', 'Low Driven Shot']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Agility +10 (97)', 'Dribbling +10 (98)', 'Skill Moves +4 (5)',
        'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Balance +10 (96)', 'Reactions +10 (95)', 'Weak Foot +3 (4)',
        'PlayStyle+: Rapid (4)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +10 (97)', 'Composure +10 (95)',
        'PlayStyle: Incisive Pass (7)', 'PlayStyle: Finesse Shot (7)', 'PlayStyle: Low Driven Shot (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
