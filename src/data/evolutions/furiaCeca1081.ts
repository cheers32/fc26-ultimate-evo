import { EvolutionDefinition } from '../../types/player';

export const furiaCeca1081: EvolutionDefinition = {
  id: '1081',
  name: 'Furia Ceca',
  futbinLink: 'https://www.futbin.com/26/evolutions/1081/furia-ceca',
  version: 'FC 26',
  description: 'UT Found in the Czechia and Bosnia Objective',
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['LW', 'LM']
  },
  ovrBoost: { boost: 30, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 92 },
    aggression: { boost: 40, limit: 90 },
    agility: { boost: 30, limit: 92 },
    balance: { boost: 30, limit: 92 },
    ballControl: { boost: 40, limit: 96 },
    crossing: { boost: 30, limit: 93 },
    curve: { boost: 30, limit: 93 },
    dribbling: { boost: 40, limit: 96 },
    finishing: { boost: 40, limit: 92 },
    headingAcc: { boost: 30, limit: 94 },
    longPass: { boost: 30, limit: 93 },
    longShots: { boost: 45, limit: 96 },
    penalties: { boost: 40, limit: 90 },
    positioning: { boost: 40, limit: 92 },
    reactions: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 94 },
    freekick: { boost: 30, limit: 93 },
    shotPower: { boost: 45, limit: 96 },
    sprintSpeed: { boost: 30, limit: 92 },
    stamina: { boost: 40, limit: 92 },
    vision: { boost: 30, limit: 94 },
    volleys: { boost: 45, limit: 92 },
    composure: { boost: 30, limit: 92 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot+', 'Technical+', 'Power Shot+'],
    silver: ['Rapid', 'First Touch', 'Gamechanger']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (94)', 'Agility +30 (92)', 'Balance +30 (92)', 'Heading Acc. +30 (94)', 'FK Acc. +30 (93)', 'Sprint Speed +30 (92)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (92)', 'Reactions +30 (94)', 'Short Pass +30 (94)', 'Shot Power +45 (96)', 'Stamina +40 (92)',
        'PlayStyle+: Technical (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Crossing +30 (93)', 'Dribbling +40 (96)', 'Long Shots +45 (96)', 'Att. Position +40 (92)', 'Weak Foot +4 (5)',
        'PlayStyle+: Power Shot (3)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +40 (90)', 'Ball Control +40 (96)', 'Finishing +40 (92)', 'Vision +30 (94)', 'Volleys +45 (92)',
        'PlayStyle: Rapid (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Curve +30 (93)', 'Long Pass +30 (93)', 'Penalties +40 (90)', 'Composure +30 (92)',
        'PlayStyle: First Touch (8)', 'PlayStyle: Gamechanger (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
