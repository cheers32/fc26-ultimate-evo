import { EvolutionDefinition } from '../../types/player';

export const vaVaVoom1241: EvolutionDefinition = {
  id: '1241',
  name: 'Va Va Voom',
  futbinLink: 'https://www.futbin.com/26/evolutions/1241/va-va-voom',
  version: 'FC 26',
  description: 'Found in the Pre Season Token Store.',
  cost: 'Tokens — 1,000 Pre Season Tokens',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['CB', 'GK']
  },
  ovrBoost: { boost: 30, limit: 98 },
  // Pace is raised as a face stat with no cap of its own — only the 99 ceiling holds it.
  faceBoosts: {
    pac: { boost: 40, limit: 99 }
  },
  subStatBoosts: {
    finishing: { boost: 30, limit: 96 },
    positioning: { boost: 30, limit: 96 },
    shotPower: { boost: 30, limit: 96 },
    longShots: { boost: 30, limit: 95 },
    penalties: { boost: 30, limit: 95 },
    volleys: { boost: 30, limit: 96 },
    curve: { boost: 25, limit: 95 },
    longPass: { boost: 25, limit: 94 },
    shortPass: { boost: 25, limit: 95 },
    agility: { boost: 30, limit: 96 },
    balance: { boost: 30, limit: 99 },
    ballControl: { boost: 30, limit: 99 },
    dribbling: { boost: 30, limit: 96 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 25, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Low Driven Shot', 'Technical'],
    silver: ['Finesse Shot', 'First Touch']
  },
  playStylesLimit: { gold: 4, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)',
        'Pace +40',
        'Finishing +30 (96)',
        'Positioning +30 (96)',
        'Shot Power +30 (96)',
        'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Long Shots +30 (95)',
        'Penalties +30 (95)',
        'Short Passing +25 (95)',
        'Volleys +30 (96)',
        'PlayStyle: Finesse Shot (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +30 (96)',
        'Balance +30',
        'Curve +25 (95)',
        'Long Passing +25 (94)',
        'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball control +30',
        'Dribbling +30 (96)',
        'Reactions +30 (95)',
        'Composure +25 (95)',
        'PlayStyle: First Touch (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
