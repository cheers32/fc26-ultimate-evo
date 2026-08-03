import { EvolutionDefinition } from '../../types/player';

export const theLittleBoyFromRosario1060: EvolutionDefinition = {
  id: '1060',
  name: 'The Little Boy from Rosario',
  futbinLink: 'https://www.futbin.com/26/evolutions/1060/the-little-boy-from-rosario',
  version: 'FC 26',
  description: 'Harness the powers of a generational talent with unmatched dribbling, inch-perfect through balls, and a magical left foot',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['RW', 'RM', 'ST']
  },
  ovrBoost: { boost: 25, limit: 94 },
  subStatBoosts: {
    agility: { boost: 35, limit: 95 },
    balance: { boost: 35, limit: 95 },
    ballControl: { boost: 35, limit: 96 },
    crossing: { boost: 35, limit: 95 },
    curve: { boost: 35, limit: 94 },
    dribbling: { boost: 35, limit: 96 },
    finishing: { boost: 35, limit: 95 },
    longPass: { boost: 35, limit: 97 },
    longShots: { boost: 35, limit: 94 },
    penalties: { boost: 35, limit: 93 },
    positioning: { boost: 35, limit: 94 },
    reactions: { boost: 35, limit: 95 },
    shortPass: { boost: 35, limit: 97 },
    freekick: { boost: 35, limit: 95 },
    shotPower: { boost: 35, limit: 93 },
    stamina: { boost: 35, limit: 94 },
    vision: { boost: 35, limit: 97 },
    volleys: { boost: 35, limit: 93 },
    composure: { boost: 35, limit: 94 }
  },
  playStylesAdded: {
    gold: ['Tiki Taka', 'Incisive Pass', 'Finesse Shot'],
    silver: ['Quick Step', 'Pinged Pass', 'Technical', 'Inventive']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +25 (94)', 'Reactions +35 (95)', 'Short Pass +35 (97)', 'Volleys +35 (93)',
        'PlayStyle+: Tiki Taka (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +35 (96)', 'Long Pass +35 (97)', 'Penalties +35 (93)', 'Att. Position +35 (94)',
        'PlayStyle+: Incisive Pass (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +35 (94)', 'Finishing +35 (95)', 'Vision +35 (97)', 'Composure +35 (94)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +35 (95)', 'Crossing +35 (95)', 'Dribbling +35 (96)', 'Shot Power +35 (93)',
        'PlayStyle: Quick Step (8)', 'PlayStyle: Pinged Pass (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +35 (95)', 'Long Shots +35 (94)', 'FK Acc. +35 (95)', 'Stamina +35 (94)',
        'PlayStyle: Technical (8)', 'PlayStyle: Inventive (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
