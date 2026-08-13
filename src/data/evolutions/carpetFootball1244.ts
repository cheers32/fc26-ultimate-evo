import { EvolutionDefinition } from '../../types/player';

export const carpetFootball1244: EvolutionDefinition = {
  id: '1244',
  name: 'Carpet Football',
  futbinLink: 'https://www.futbin.com/26/evolutions/1244/carpet-football',
  version: 'FC 26',
  description: 'Found in the Pre Season Token Store.',
  cost: 'Tokens — 500 Pre Season Tokens',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 30, limit: 98 },
  // Passing is raised as a face stat with no cap of its own — only the 99 ceiling holds it.
  faceBoosts: {
    pas: { boost: 40, limit: 99 }
  },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 94 },
    sprintSpeed: { boost: 27, limit: 94 },
    finishing: { boost: 30, limit: 95 },
    longShots: { boost: 25, limit: 95 },
    shotPower: { boost: 25, limit: 95 },
    agility: { boost: 35, limit: 96 },
    balance: { boost: 35, limit: 95 },
    ballControl: { boost: 28, limit: 99 },
    dribbling: { boost: 30, limit: 95 },
    reactions: { boost: 37, limit: 99 },
    composure: { boost: 35, limit: 94 },
    interceptions: { boost: 30, limit: 95 },
    defAwareness: { boost: 25, limit: 95 },
    standTackle: { boost: 30, limit: 95 },
    slideTackle: { boost: 30, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Technical', 'Pinged Pass'],
    silver: ['Long Ball Pass', 'Inventive']
  },
  playStylesLimit: { gold: 4, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)',
        'Passing +40',
        'Acceleration +25 (94)',
        'Finishing +30 (95)',
        'Sprint Speed +27 (94)',
        'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +35 (96)',
        'Balance +35 (95)',
        'Long Shots +25 (95)',
        'Shot Power +25 (95)',
        'PlayStyle: Long Ball Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball control +28',
        'Dribbling +30 (95)',
        'Reactions +37',
        'Composure +35 (94)',
        'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Interceptions +30 (95)',
        'Def. Aware +25 (95)',
        'Slide Tackle +30 (95)',
        'Stand Tackle +30 (95)',
        'PlayStyle: Inventive (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
