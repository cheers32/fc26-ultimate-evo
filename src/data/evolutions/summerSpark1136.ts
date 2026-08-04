import { EvolutionDefinition } from '../../types/player';

export const summerSpark1136: EvolutionDefinition = {
  id: '1136',
  name: 'Summer Spark',
  futbinLink: 'https://www.futbin.com/26/evolutions/1136/summer-spark',
  version: 'FC 26',
  description: "Turn up the heat and light up the pitch. Ignite your player's creativity with sharper dribbling, quicker turns, and pinpoint passing that slices through defences.",
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 94 },
  subStatBoosts: {
    agility: { boost: 6, limit: 96 },
    balance: { boost: 6, limit: 96 },
    ballControl: { boost: 6, limit: 95 },
    dribbling: { boost: 6, limit: 96 },
    reactions: { boost: 6, limit: 95 },
    composure: { boost: 6, limit: 95 },
    curve: { boost: 6, limit: 95 },
    longPass: { boost: 6, limit: 96 },
    shortPass: { boost: 6, limit: 96 },
    vision: { boost: 6, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Tiki Taka', 'Technical'],
    silver: ['Tiki Taka', 'Technical']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (94)', 'Balance +6 (96)', 'Dribbling +6 (96)', 'Short Pass +6 (96)',
        'PlayStyle+: Tiki Taka (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Long Pass +6 (96)', 'Reactions +6 (95)', 'Vision +6 (95)', 'Composure +6 (95)',
        'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +6 (96)', 'Ball Control +6 (95)', 'Curve +6 (95)',
        'PlayStyle: Tiki Taka (7)', 'PlayStyle: Technical (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
