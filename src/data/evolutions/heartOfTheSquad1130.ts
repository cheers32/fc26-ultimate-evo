import { EvolutionDefinition } from '../../types/player';

export const heartOfTheSquad1130: EvolutionDefinition = {
  id: '1130',
  name: 'Heart of the Squad',
  futbinLink: 'https://www.futbin.com/26/evolutions/1130/heart-of-the-squad',
  version: 'FC 26',
  description: 'The heartbeat of the team. Sharp, composed and always driving the squad forward when it matters most.',
  cost: '150 Tokens / 30,000 Coins',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 3, limit: 93 },
    sprintSpeed: { boost: 3, limit: 93 },
    stamina: { boost: 5, limit: 95 },
    agility: { boost: 3, limit: 95 },
    balance: { boost: 6, limit: 93 },
    ballControl: { boost: 3, limit: 95 },
    dribbling: { boost: 6, limit: 95 },
    reactions: { boost: 3, limit: 93 },
    composure: { boost: 3, limit: 93 },
    crossing: { boost: 6, limit: 93 },
    curve: { boost: 6, limit: 93 },
    longPass: { boost: 3, limit: 95 },
    shortPass: { boost: 3, limit: 95 },
    vision: { boost: 3, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Technical', 'Incisive Pass', 'Trickster'],
    silver: ['Technical', 'Quick Step', 'Pinged Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (95)', 'Acceleration +3 (93)', 'Ball Control +3 (95)',
        'Sprint Speed +3 (93)', 'Stamina +5 (95)', 'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +3 (95)', 'Balance +6 (93)', 'Long Pass +3 (95)', 'Short Pass +3 (95)',
        'PlayStyle+: Incisive Pass (4)', 'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Crossing +6 (93)', 'Curve +6 (93)', 'Dribbling +6 (95)', 'Vision +3 (95)',
        'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Reactions +3 (93)', 'Composure +3 (93)',
        'PlayStyle+: Trickster (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 2
};
