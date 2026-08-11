import { EvolutionDefinition } from '../../types/player';

export const backShortly1221: EvolutionDefinition = {
  id: '1221',
  name: 'Back Shortly',
  futbinLink: 'https://www.futbin.com/26/evolutions/1221/back-shortly',
  version: 'FC 26',
  description:
    'Some full backs change the game at both ends. Evolve your player and develop the attacking and defensive qualities that make them a constant threat.',
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LB']
  },
  ovrBoost: { boost: 15, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 95 },
    crossing: { boost: 25, limit: 96 },
    curve: { boost: 25, limit: 95 },
    finishing: { boost: 25, limit: 96 },
    headingAcc: { boost: 20, limit: 95 },
    interceptions: { boost: 20, limit: 96 },
    longPass: { boost: 25, limit: 95 },
    longShots: { boost: 25, limit: 96 },
    defAwareness: { boost: 20, limit: 95 },
    positioning: { boost: 25, limit: 95 },
    shortPass: { boost: 25, limit: 96 },
    shotPower: { boost: 25, limit: 94 },
    slideTackle: { boost: 20, limit: 97 },
    sprintSpeed: { boost: 20, limit: 95 },
    standTackle: { boost: 20, limit: 97 },
    vision: { boost: 25, limit: 95 },
    volleys: { boost: 25, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Anticipate', 'Pinged Pass', 'Rapid'],
    silver: ['Low Driven Shot', 'Finesse Shot', 'Intercept']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (96)', 'Acceleration +20 (95)', 'Positioning +25 (95)', 'Sprint Speed +20 (95)',
        'Weak Foot +4', 'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +25 (96)', 'Long Shots +25 (96)', 'Shot Power +25 (94)', 'Volleys +25 (95)',
        'Skills +4'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Crossing +25 (96)', 'Short Passing +25 (96)', 'Vision +25 (95)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Curve +25 (95)', 'Interceptions +20 (96)', 'Long Passing +25 (95)',
        'PlayStyle+: Rapid (4)', 'PlayStyle: Finesse Shot (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Heading Acc. +20 (95)', 'Def. Aware +20 (95)', 'Slide Tackle +20 (97)',
        'Stand Tackle +20 (97)', 'PlayStyle: Intercept (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
