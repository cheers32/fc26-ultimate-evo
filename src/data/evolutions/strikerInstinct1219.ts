import { EvolutionDefinition } from '../../types/player';

export const strikerInstinct1219: EvolutionDefinition = {
  id: '1219',
  name: 'Striker Instinct',
  futbinLink: 'https://www.futbin.com/26/evolutions/1219/striker-instinct',
  version: 'FC 26',
  description: 'A clinical finisher in front of the goal.',
  cost: 'SBC Set Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 4, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 4, limit: 96 },
    aggression: { boost: 4, limit: 94 },
    agility: { boost: 4, limit: 97 },
    balance: { boost: 4, limit: 97 },
    ballControl: { boost: 7, limit: 97 },
    curve: { boost: 5, limit: 93 },
    dribbling: { boost: 7, limit: 97 },
    finishing: { boost: 7, limit: 98 },
    headingAcc: { boost: 6, limit: 95 },
    jumping: { boost: 4, limit: 94 },
    longShots: { boost: 4, limit: 97 },
    penalties: { boost: 7, limit: 98 },
    positioning: { boost: 7, limit: 97 },
    reactions: { boost: 6, limit: 96 },
    shortPass: { boost: 5, limit: 94 },
    shotPower: { boost: 7, limit: 98 },
    sprintSpeed: { boost: 4, limit: 96 },
    stamina: { boost: 6, limit: 97 },
    strength: { boost: 6, limit: 94 },
    vision: { boost: 5, limit: 94 },
    volleys: { boost: 4, limit: 95 },
    composure: { boost: 6, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  // All four are plain PlayStyles on Futbin — the "| 7" beside them is the PlayStyle cap, not a
  // PlayStyle+ grant.
  playStylesAdded: {
    gold: [],
    silver: ['Finesse Shot', 'Low Driven Shot', 'Power Shot', 'Gamechanger']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (97)', 'Finishing +7 (98)', 'Heading Acc. +6 (95)', 'Long Shots +4 (97)',
        'Shot Power +7 (98)', 'PlayStyle: Finesse Shot (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'OVR +2 (97)', 'Curve +5 (93)', 'Penalties +7 (98)', 'Short Passing +5 (94)',
        'Vision +5 (94)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +4 (94)', 'Jumping +4 (94)', 'Positioning +7 (97)', 'Stamina +6 (97)',
        'Strength +6 (94)', 'Volleys +4 (95)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Acceleration +4 (96)', 'Agility +4 (97)', 'Balance +4 (97)', 'Reactions +6 (96)',
        'Sprint Speed +4 (96)', 'PlayStyle: Power Shot (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball Control +7 (97)', 'Dribbling +7 (97)', 'Composure +6 (97)', 'Weak Foot +4 (5)',
        'Skills +3 (4)', 'PlayStyle: Gamechanger (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
