import { EvolutionDefinition } from '../../types/player';

export const theKiwiWall1012: EvolutionDefinition = {
  id: '1012',
  name: 'The Kiwi Wall',
  futbinLink: 'https://www.futbin.com/26/evolutions/1012/the-kiwi-wall',
  version: 'FC 26',
  description: 'Found in the New Zealand Objective!',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    notRarity: 'World Tour Silver Stars',
    positions: ['CB', 'LB', 'RB']
  },
  ovrBoost: { boost: 12, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 10, limit: 90 },
    aggression: { boost: 15, limit: 93 },
    agility: { boost: 10, limit: 90 },
    balance: { boost: 10, limit: 90 },
    ballControl: { boost: 10, limit: 92 },
    dribbling: { boost: 10, limit: 87 },
    headingAcc: { boost: 15, limit: 91 },
    interceptions: { boost: 15, limit: 94 },
    jumping: { boost: 15, limit: 92 },
    longPass: { boost: 15, limit: 93 },
    defAwareness: { boost: 15, limit: 93 },
    reactions: { boost: 10, limit: 94 },
    shortPass: { boost: 15, limit: 91 },
    slideTackle: { boost: 15, limit: 92 },
    sprintSpeed: { boost: 10, limit: 92 },
    standTackle: { boost: 15, limit: 93 },
    stamina: { boost: 15, limit: 92 },
    strength: { boost: 15, limit: 94 },
    vision: { boost: 15, limit: 93 },
    composure: { boost: 10, limit: 93 }
  },
  weakFootBoost: 4,
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +12 (93)', 'Acceleration +10 (90)', 'Jumping +15 (92)', 'Sprint Speed +10 (92)', 'Stamina +15 (92)', 'Strength +15 (94)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +15 (93)', 'Long Pass +15 (93)', 'Short Pass +15 (91)', 'Slide Tackle +15 (92)', 'Stand Tackle +15 (93)', 'Vision +15 (93)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +10 (90)', 'Balance +10 (90)', 'Ball Control +10 (92)', 'Dribbling +10 (87)', 'Reactions +10 (94)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Heading Acc. +15 (91)', 'Interceptions +15 (94)', 'Def. Aware +15 (93)', 'Composure +10 (93)', 'Weak Foot +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
