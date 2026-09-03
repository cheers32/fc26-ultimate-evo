import { EvolutionDefinition } from '../../types/player';

export const speedMerchant1160: EvolutionDefinition = {
  id: '1160',
  name: 'Speed Merchant',
  futbinLink: 'https://www.futbin.com/26/evolutions/1160/speed-merchant',
  version: 'FC 26',
  description: 'Not faster than the cars, just faster than everyone else. Evolve your player and develop the explosive pace that makes them impossible to catch.',
  descriptionZh: "不是比车快，只是比场上所有人都快。培养出让人追不上的爆发速度。｜适合：除中卫和门将外，速度和射门线，边路球员。",
  cost: '500 FUTTIES Tokens / 100,000 Coins',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['CB', 'GK']
  },
  ovrBoost: { boost: 15, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    finishing: { boost: 30, limit: 95 },
    positioning: { boost: 30, limit: 95 },
    shotPower: { boost: 30, limit: 95 },
    longShots: { boost: 30, limit: 94 },
    penalties: { boost: 30, limit: 94 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Rapid+', 'Low Driven Shot+', 'Quick Step+'],
    silver: ['Gamechanger', 'Power Shot', 'Enforcer']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (97)', 'Acceleration +30 (97)', 'Sprint Speed +30 (97)',
        'PlayStyle+: Rapid (4)', 'PlayStyle: Gamechanger (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +30 (95)', 'Att. Position +30 (95)', 'Shot Power +30 (95)',
        'PlayStyle+: Low Driven Shot (4)', 'PlayStyle: Power Shot (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Shots +30 (94)', 'Penalties +30 (94)', 'Weak Foot +4 (5)',
        'PlayStyle+: Quick Step (4)', 'PlayStyle: Enforcer (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
