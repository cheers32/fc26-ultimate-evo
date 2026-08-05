import { EvolutionDefinition } from '../../types/player';

export const bailOut1198: EvolutionDefinition = {
  id: '1198',
  name: 'Bail Out',
  futbinLink: 'https://www.futbin.com/26/evolutions/1198/bail-out',
  version: 'FC 26',
  description: 'For when your defence completely collapses. Give your keeper the ultimate boost to pull off impossible, controller-saving heroics in the 90th minute.',
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['GK']
  },
  ovrBoost: { boost: 30, limit: 96 },
  subStatBoosts: {
    diving: { boost: 30, limit: 96 },
    handling: { boost: 30, limit: 96 },
    kicking: { boost: 30, limit: 95 },
    reflexes: { boost: 30, limit: 95 },
    gkPositioning: { boost: 30, limit: 97 },
    reactions: { boost: 30, limit: 96 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Footwork', 'Deflector', 'Cross Claimer'],
    silver: ['Pinged Pass', 'Far Reach', 'Rush Out', 'Trickster']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (96)', 'Diving +30 (96)', 'Handling +30 (96)', 'GK Positioning +30 (97)',
        'Weak Foot +4 (5)', 'PlayStyle+: Footwork (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Kicking +30 (95)', 'Reflexes +30 (95)', 'Skill Moves +4 (5)',
        'PlayStyle+: Deflector (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Reactions +30 (96)', 'PlayStyle+: Cross Claimer (4)',
        'PlayStyle: Far Reach (7)', 'PlayStyle: Rush Out (7)', 'PlayStyle: Trickster (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
