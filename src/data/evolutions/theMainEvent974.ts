import { EvolutionDefinition } from '../../types/player';

export const theMainEvent974: EvolutionDefinition = {
  id: '974',
  name: 'The Main Event',
  futbinLink: 'https://www.futbin.com/26/evolutions/974/the-main-event',
  version: 'FC 26',
  description: 'Find in the new Token Store - 2,000 Tokens.',
  cost: '2000 FoF Tokens',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['ST'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 50, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 96 },
    sprintSpeed: { boost: 50, limit: 96 },
    stamina: { boost: 50, limit: 93 },
    strength: { boost: 50, limit: 93 },
    agility: { boost: 50, limit: 96 },
    balance: { boost: 50, limit: 93 },
    dribbling: { boost: 50, limit: 93 },
    reactions: { boost: 50, limit: 95 },
    composure: { boost: 50, limit: 93 },
    curve: { boost: 50, limit: 95 },
    longPass: { boost: 50, limit: 92 },
    shortPass: { boost: 50, limit: 94 },
    vision: { boost: 50, limit: 94 },
    finishing: { boost: 45, limit: 97 },
    longShots: { boost: 45, limit: 96 },
    penalties: { boost: 45, limit: 97 },
    positioning: { boost: 45, limit: 97 },
    shotPower: { boost: 45, limit: 96 },
    volleys: { boost: 45, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Incisive Pass'],
    silver: ['Low Driven Shot', 'Gamechanger', 'Quick Step', 'First Touch']
  },
  playStylesLimit: {
    gold: 4,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (97)', 'Acceleration +50 (96)', 'Sprint Speed +50 (96)',
        'Stamina +50 (93)', 'Strength +50 (93)', 'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +50 (93)', 'Finishing +45 (97)', 'Att. Position +45 (97)',
        'Shot Power +45 (96)', 'Composure +50 (93)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Shots +45 (96)', 'Penalties +45 (97)', 'Volleys +45 (97)',
        'Skill Moves +4 (5)',
        'PlayStyle: Low Driven Shot (8)', 'PlayStyle: Gamechanger (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Long Pass +50 (92)', 'Reactions +50 (95)', 'Short Pass +50 (94)',
        'Vision +50 (94)', 'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Quick Step (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +50 (96)', 'Balance +50 (93)', 'Curve +50 (95)',
        'PlayStyle+: Incisive Pass (4)', 'PlayStyle: First Touch (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
