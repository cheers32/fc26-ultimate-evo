import { EvolutionDefinition } from '../../types/player';

export const stillGotIt1223: EvolutionDefinition = {
  id: '1223',
  name: 'Still Got It',
  futbinLink: 'https://www.futbin.com/26/evolutions/1223/still-got-it',
  version: 'FC 26',
  // FUTBIN also gates this on "Born before 1996-01-08"; the requirement schema has no age field,
  // so that check is not modelled here — same as the earlier Still Got It (1119).
  description: 'The revival starts here. Evolve your player and unlock the qualities that bring them back to their very best. Also requires the player to be born before 1996-01-08.',
  descriptionZh: "复苏从这里开始。解锁让球员回到最佳状态的那些能力。要求球员出生于 1996-01-08 之前。｜适合：非门将的老将，+15 OVR，速度传球盘带线。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 15, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 40, limit: 96 },
    sprintSpeed: { boost: 40, limit: 95 },
    agility: { boost: 20, limit: 96 },
    balance: { boost: 20, limit: 95 },
    ballControl: { boost: 20, limit: 95 },
    curve: { boost: 20, limit: 94 },
    dribbling: { boost: 20, limit: 96 },
    longPass: { boost: 20, limit: 94 },
    reactions: { boost: 20, limit: 94 },
    shortPass: { boost: 20, limit: 95 },
    composure: { boost: 20, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Rapid', 'Low Driven Shot', 'Gamechanger'],
    silver: ['Technical', 'First Touch', 'Finesse Shot']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (96)', 'Acceleration +40 (96)', 'Sprint Speed +40 (95)',
        'Weak Foot +4', 'PlayStyle+: Rapid (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Curve +20 (94)', 'Long Passing +20 (94)', 'Short Passing +20 (95)',
        'Skills +4', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +20 (96)', 'Balance +20 (95)', 'Reactions +20 (94)',
        'PlayStyle+: Gamechanger (4)', 'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +20 (95)', 'Dribbling +20 (96)', 'Composure +20 (95)',
        'PlayStyle: First Touch (7)', 'PlayStyle: Finesse Shot (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
