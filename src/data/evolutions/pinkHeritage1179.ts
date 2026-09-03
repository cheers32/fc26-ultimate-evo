import { EvolutionDefinition } from '../../types/player';

export const pinkHeritage1179: EvolutionDefinition = {
  id: '1179',
  name: 'Pink Heritage',
  futbinLink: 'https://www.futbin.com/26/evolutions/1179/pink-heritage',
  version: 'FC 26',
  description: 'Bring back the unforgettable pink card aura of a fan favourite Ukrainian winger.',
  descriptionZh: "重现那位球迷最爱的乌克兰边锋难忘的粉卡气场。｜适合：LW/LM 专用，+30 OVR。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    positions: ['LW', 'LM'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 35, limit: 97 },
    sprintSpeed: { boost: 35, limit: 98 },
    agility: { boost: 35, limit: 97 },
    balance: { boost: 35, limit: 95 },
    ballControl: { boost: 35, limit: 98 },
    dribbling: { boost: 35, limit: 97 },
    reactions: { boost: 35, limit: 94 },
    composure: { boost: 30, limit: 95 },
    curve: { boost: 30, limit: 96 },
    longPass: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 95 },
    finishing: { boost: 35, limit: 95 },
    longShots: { boost: 35, limit: 96 },
    penalties: { boost: 35, limit: 94 },
    positioning: { boost: 35, limit: 95 },
    shotPower: { boost: 35, limit: 97 },
    volleys: { boost: 35, limit: 94 },
    stamina: { boost: 30, limit: 94 }
  },
  weakFootBoost: 3,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Rapid', 'Technical', 'Low Driven Shot'],
    silver: ['Incisive Pass', 'Quick Step', 'Gamechanger', 'Pinged Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Ball Control +35 (98)', 'Long Shots +35 (96)',
        'Shot Power +35 (97)', 'Weak Foot +3 (4)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +35 (97)', 'Short Pass +30 (94)', 'Stamina +30 (94)',
        'Composure +30 (95)', 'Skill Moves +4 (5)', 'PlayStyle+: Rapid (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Dribbling +35 (97)', 'Finishing +35 (95)', 'Long Pass +30 (94)',
        'Att. Position +35 (95)', 'Sprint Speed +35 (98)', 'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Penalties +35 (94)', 'Reactions +35 (94)', 'Volleys +35 (94)',
        'PlayStyle+: Low Driven Shot (4)',
        'PlayStyle: Incisive Pass (7)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +35 (97)', 'Balance +35 (95)', 'Curve +30 (96)', 'Vision +30 (95)',
        'PlayStyle: Gamechanger (7)', 'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
