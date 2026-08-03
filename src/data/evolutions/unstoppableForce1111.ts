import { EvolutionDefinition } from '../../types/player';

export const unstoppableForce1111: EvolutionDefinition = {
  id: '1111',
  name: 'Unstoppable Force',
  futbinLink: 'https://www.futbin.com/26/evolutions/1111/unstoppable-force',
  version: 'FC 26',
  description: 'Give your player the power to overwhelm any back line. Increase attacking presence, sharpen movement in the final third, and turn pressure into consistent goal threat.',
  cost: 'Season 9 Level 2 Reward',
  requirements: {
    maxOvr: 94,
    maxPlayStyles: 10,
    excludedPositions: ['CB'],
    notRarity: 'World Tour Silver Stars'
  },
  maxRepeatable: 5,
  ovrBoost: { boost: 3, limit: 97 },

  subStatBoosts: {
    acceleration: { boost: 5, limit: 96 },
    sprintSpeed: { boost: 5, limit: 97 },
    agility: { boost: 5, limit: 96 },
    balance: { boost: 5, limit: 98 },
    stamina: { boost: 3, limit: 97 },
    reactions: { boost: 5, limit: 97 },
    composure: { boost: 5, limit: 97 },
    positioning: { boost: 3, limit: 97 },
    vision: { boost: 3, limit: 96 },
    ballControl: { boost: 5, limit: 98 },
    crossing: { boost: 3, limit: 96 },
    dribbling: { boost: 5, limit: 97 },
    finishing: { boost: 3, limit: 97 },
    freekick: { boost: 3, limit: 97 },
    longPass: { boost: 3, limit: 97 },
    shortPass: { boost: 3, limit: 98 },
    shotPower: { boost: 3, limit: 96 },
    longShots: { boost: 2, limit: 96 },
    volleys: { boost: 2, limit: 96 },
    curve: { boost: 3, limit: 97 },
    penalties: { boost: 2, limit: 96 }
  },
  playStylesAdded: {
    gold: [],
    silver: ['Rapid', 'Incisive Pass', 'Finesse Shot', 'Low Driven Shot', 'Pinged Pass']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (97)',
        'Acceleration +5 (96)', 'Long Pass +3 (97)', 'Short Pass +3 (98)', 'FK Acc. +3 (97)',
        'PlayStyle: Rapid (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +5 (96)', 'Balance +5 (98)', 'Curve +3 (97)',
        'Dribbling +5 (97)', 'Stamina +3 (97)', 'Composure +5 (97)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +5 (98)', 'Finishing +3 (97)', 'Att. Position +3 (97)',
        'Reactions +5 (97)', 'Sprint Speed +5 (97)',
        'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Long Shots +2 (96)', 'Penalties +2 (96)', 'Shot Power +3 (96)', 'Volleys +2 (96)',
        'PlayStyle: Finesse Shot (7)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Crossing +3 (96)', 'Vision +3 (96)',
        'PlayStyle: Pinged Pass (7)'
      ]
    }
  ]
};
