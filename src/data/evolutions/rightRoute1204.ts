import { EvolutionDefinition } from '../../types/player';

export const rightRoute1204: EvolutionDefinition = {
  id: '1204',
  name: 'Right Route',
  futbinLink: 'https://www.futbin.com/26/evolutions/1204/right-route',
  version: 'FC 26',
  description: 'Lengthy strides, new territory. Evolve your player and take the right route that changes everything.',
  descriptionZh: "大步流星，进入新领域。走上那条改变一切的正确路线。｜适合：ST 专用，+20 OVR。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['ST']
  },
  ovrBoost: { boost: 20, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 95 },
    sprintSpeed: { boost: 25, limit: 95 },
    jumping: { boost: 20, limit: 95 },
    stamina: { boost: 20, limit: 95 },
    // FUTBIN lists no cap for Strength on this one.
    strength: { boost: 30, limit: 99 },
    balance: { boost: 20, limit: 96 },
    ballControl: { boost: 20, limit: 95 },
    dribbling: { boost: 25, limit: 96 },
    reactions: { boost: 20, limit: 96 },
    composure: { boost: 20, limit: 94 },
    curve: { boost: 20, limit: 95 },
    shortPass: { boost: 20, limit: 95 },
    vision: { boost: 20, limit: 95 },
    finishing: { boost: 20, limit: 96 },
    longShots: { boost: 20, limit: 94 },
    shotPower: { boost: 20, limit: 95 },
    volleys: { boost: 20, limit: 95 }
  },
  weakFootBoost: 4,
  positionsAdded: ['RM'],
  playStylesAdded: {
    gold: ['Quick Step', 'Finesse Shot', 'Pinged Pass'],
    silver: ['Low Driven Shot', 'Rapid', 'Technical']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (96)', 'Acceleration +25 (95)', 'Sprint Speed +25 (95)',
        'Strength +30', 'Position: RM', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Long Shots +20 (94)', 'Shot Power +20 (95)', 'Volleys +20 (95)',
        'Weak Foot +4', 'Role: Inside Forward++'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +20 (95)', 'Short Pass +20 (95)', 'Vision +20 (95)',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Balance +20 (96)', 'Ball Control +20 (95)', 'Reactions +20 (96)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Rapid (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Dribbling +25 (96)', 'Finishing +20 (96)', 'Jumping +20 (95)',
        'Stamina +20 (95)', 'Composure +20 (94)', 'PlayStyle: Technical (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
