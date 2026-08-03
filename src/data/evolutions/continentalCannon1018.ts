import { EvolutionDefinition } from '../../types/player';

export const continentalCannon1018: EvolutionDefinition = {
  id: '1018',
  name: 'Continental Cannon',
  futbinLink: 'https://www.futbin.com/26/evolutions/1018/continental-cannon',
  version: 'FC 26',
  description: 'Asia/Oceania Group Reward',
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 0, limit: 91 },
  subStatBoosts: {
    curve: { boost: 10, limit: 96 },
    finishing: { boost: 5, limit: 96 },
    longShots: { boost: 5, limit: 95 },
    penalties: { boost: 5, limit: 95 },
    positioning: { boost: 5, limit: 96 },
    shotPower: { boost: 5, limit: 96 },
    volleys: { boost: 5, limit: 95 },
    composure: { boost: 10, limit: 96 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    // Futbin lists Finesse Shot / Low Driven Shot as PlayStyles+ at levels 1-2, then lists the
    // same two names again as regular PlayStyles at level 3 — since they're already gold by
    // then, that second grant is a no-op, so only the gold entries are encoded here.
    gold: ['Finesse Shot', 'Low Driven Shot'],
    silver: []
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Long Shots +5 (95)', 'Att. Position +5 (96)', 'Weak Foot +4 (5)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Curve +10 (96)', 'Finishing +5 (96)', 'Volleys +5 (95)',
        'PlayStyle+: Low Driven Shot (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Penalties +5 (95)', 'Shot Power +5 (96)', 'Composure +10 (96)',
        'PlayStyle: Finesse Shot (8)', 'PlayStyle: Low Driven Shot (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
