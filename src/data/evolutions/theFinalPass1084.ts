import { EvolutionDefinition } from '../../types/player';

export const theFinalPass1084: EvolutionDefinition = {
  id: '1084',
  name: 'The Final Pass',
  futbinLink: 'https://www.futbin.com/26/evolutions/1084/the-final-pass',
  version: 'FC 26',
  description: 'Found in the Norway/Belgium Objective',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 93,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM']
  },
  ovrBoost: { boost: 30, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 92 },
    agility: { boost: 20, limit: 90 },
    balance: { boost: 20, limit: 90 },
    ballControl: { boost: 30, limit: 92 },
    crossing: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 95 },
    dribbling: { boost: 25, limit: 92 },
    finishing: { boost: 25, limit: 92 },
    interceptions: { boost: 25, limit: 88 },
    longPass: { boost: 30, limit: 97 },
    longShots: { boost: 25, limit: 95 },
    penalties: { boost: 25, limit: 92 },
    positioning: { boost: 25, limit: 93 },
    reactions: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 96 },
    freekick: { boost: 30, limit: 94 },
    shotPower: { boost: 25, limit: 94 },
    sprintSpeed: { boost: 20, limit: 92 },
    standTackle: { boost: 25, limit: 92 },
    stamina: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 96 },
    volleys: { boost: 30, limit: 93 },
    composure: { boost: 30, limit: 91 }
  },
  playStylesAdded: {
    gold: ['Incisive Pass', 'Press Proven', 'Pinged Pass'],
    silver: ['Tiki Taka', 'Inventive', 'Long Ball Pass']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  weakFootBoost: 4,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (94)', 'Ball Control +30 (92)', 'Dribbling +25 (92)', 'Interceptions +25 (88)',
        'FK Acc. +30 (94)', 'Stand Tackle +25 (92)', 'Composure +30 (91)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +20 (92)', 'Crossing +30 (94)', 'Penalties +25 (92)', 'Stamina +30 (94)', 'Vision +30 (96)',
        'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Finishing +25 (92)', 'Att. Position +25 (93)', 'Sprint Speed +20 (92)',
        'PlayStyle+: Incisive Pass (3)',
        'PlayStyle: Tiki Taka (8)', 'PlayStyle: Inventive (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +20 (90)', 'Balance +20 (90)', 'Long Shots +25 (95)', 'Reactions +30 (94)',
        'Shot Power +25 (94)', 'Volleys +30 (93)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Curve +30 (95)', 'Long Pass +30 (97)', 'Short Pass +30 (96)',
        'PlayStyle+: Press Proven (3)', 'PlayStyle+: Pinged Pass (3)',
        'PlayStyle: Long Ball Pass (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
