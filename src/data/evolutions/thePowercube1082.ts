import { EvolutionDefinition } from '../../types/player';

export const thePowercube1082: EvolutionDefinition = {
  id: '1082',
  name: 'The Powercube',
  futbinLink: 'https://www.futbin.com/26/evolutions/1082/the-powercube',
  version: 'FC 26',
  description: 'UT Found in the Switzerland/Croatia Objective',
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['RM', 'RW']
  },
  ovrBoost: { boost: 30, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 95 },
    agility: { boost: 30, limit: 92 },
    balance: { boost: 40, limit: 95 },
    ballControl: { boost: 30, limit: 94 },
    curve: { boost: 40, limit: 97 },
    dribbling: { boost: 30, limit: 94 },
    finishing: { boost: 30, limit: 94 },
    jumping: { boost: 30, limit: 91 },
    longShots: { boost: 40, limit: 96 },
    penalties: { boost: 30, limit: 94 },
    positioning: { boost: 30, limit: 94 },
    reactions: { boost: 30, limit: 92 },
    shortPass: { boost: 30, limit: 92 },
    freekick: { boost: 40, limit: 97 },
    shotPower: { boost: 40, limit: 96 },
    sprintSpeed: { boost: 30, limit: 90 },
    stamina: { boost: 30, limit: 92 },
    strength: { boost: 40, limit: 96 },
    vision: { boost: 60, limit: 92 },
    volleys: { boost: 30, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Finesse Shot+', 'Incisive Pass+', 'Gamechanger+'],
    silver: ['Technical', 'Press Proven', 'Acrobatic']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (94)', 'Acceleration +30 (95)', 'Reactions +30 (92)', 'FK Acc. +40 (97)', 'Stamina +30 (92)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +30 (94)', 'Long Shots +40 (96)', 'Short Pass +30 (92)', 'Sprint Speed +30 (90)', 'Strength +40 (96)',
        'PlayStyle+: Incisive Pass (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +40 (97)', 'Dribbling +30 (94)', 'Att. Position +30 (94)', 'Volleys +30 (95)',
        'PlayStyle+: Gamechanger (3)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +30 (92)', 'Finishing +30 (94)', 'Penalties +30 (94)', 'Vision +30 (92)',
        'PlayStyle: Technical (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +40 (95)', 'Jumping +30 (91)', 'Shot Power +40 (96)', 'Vision +30 (92)',
        'PlayStyle: Press Proven (8)', 'PlayStyle: Acrobatic (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
