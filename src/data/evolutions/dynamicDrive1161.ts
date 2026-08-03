import { EvolutionDefinition } from '../../types/player';

export const dynamicDrive1161: EvolutionDefinition = {
  id: '1161',
  name: 'Dynamic Drive',
  futbinLink: 'https://www.futbin.com/26/evolutions/1161/dynamic-drive',
  version: 'FC 26',
  description: 'Dynamic players change games in an instant. Evolve your player and bring the speed, strength and creativity that makes them a constant threat.',
  cost: 'Free',
  trainingTime: '15 Mins',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 96 },
  faceBoosts: {
    pac: { boost: 5, limit: 94 },
    pas: { boost: 5, limit: 96 },
    phy: { boost: 5, limit: 94 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Pinged Pass+', 'Quick Step+'],
    silver: ['Low Driven Shot', 'First Touch']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (96)', 'Pace Face +5 (94)', 'Passing Face +5 (96)',
        'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Physical Face +5 (94)',
        'PlayStyle+: Quick Step (4)', 'PlayStyle: Low Driven Shot (7)', 'PlayStyle: First Touch (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
