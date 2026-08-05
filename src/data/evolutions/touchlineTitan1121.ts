import { EvolutionDefinition } from '../../types/player';

export const touchlineTitan1121: EvolutionDefinition = {
  id: '1121',
  name: 'Touchline Titan',
  futbinLink: 'https://www.futbin.com/26/evolutions/1121/touchline-titan',
  version: 'FC 26',
  description: 'Build an impenetrable wall on the wing. Transform your fullback into a defensive relentless force, bringing unmatched stability and total security to your backline.',
  cost: '500 FUTTIES Tokens',
  requirements: {
    maxOvr: 95,
    maxPlayStylesPlus: 4,
    notRarity: 'World Tour Silver Stars',
    positions: ['RB'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 94 },
    sprintSpeed: { boost: 30, limit: 94 },
    aggression: { boost: 30, limit: 94 },
    jumping: { boost: 30, limit: 95 },
    stamina: { boost: 30, limit: 94 },
    strength: { boost: 30, limit: 95 },
    agility: { boost: 30, limit: 95 },
    balance: { boost: 30, limit: 95 },
    dribbling: { boost: 30, limit: 94 },
    crossing: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 96 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 94 },
    headingAcc: { boost: 30, limit: 96 },
    interceptions: { boost: 30, limit: 96 },
    defAwareness: { boost: 30, limit: 96 },
    slideTackle: { boost: 30, limit: 97 },
    standTackle: { boost: 30, limit: 97 }
  },
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: ['Jockey', 'Quick Step', 'Anticipate', 'Slide Tackle'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Acceleration +30 (94)', 'Crossing +30 (94)',
        'Sprint Speed +30 (94)', 'Vision +30 (94)', 'PlayStyle+: Jockey (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +30 (95)', 'Balance +30 (95)', 'Curve +30 (96)',
        'Long Pass +30 (95)', 'Short Pass +30 (94)', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Dribbling +30 (94)', 'Heading Acc. +30 (96)', 'Interceptions +30 (96)',
        'Def. Aware +30 (96)', 'Stand Tackle +30 (97)', 'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +30 (94)', 'Jumping +30 (95)', 'Slide Tackle +30 (97)',
        'Stamina +30 (94)', 'Strength +30 (95)', 'PlayStyle+: Slide Tackle (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: ['No upgrades at this level']
    }
  ],
  maxRepeatable: 1
};
