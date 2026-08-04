import { EvolutionDefinition } from '../../types/player';

export const rapidResilience1147: EvolutionDefinition = {
  id: '1147',
  name: 'Rapid Resilience',
  futbinLink: 'https://www.futbin.com/26/evolutions/1147/rapid-resilience',
  version: 'FC 26',
  description: 'First to the ball, last to give up. Evolve your player and develop the pace, physicality and defensive quality that makes them unbeatable in every duel.',
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 7, limit: 94 },
    sprintSpeed: { boost: 7, limit: 94 },
    aggression: { boost: 7, limit: 94 },
    stamina: { boost: 7, limit: 94 },
    strength: { boost: 7, limit: 95 },
    headingAcc: { boost: 7, limit: 95 },
    interceptions: { boost: 7, limit: 95 },
    defAwareness: { boost: 7, limit: 95 },
    standTackle: { boost: 7, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Anticipate', 'Bruiser', 'Quick Step'],
    silver: ['Intercept', 'Jockey', 'Block']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (95)', 'Acceleration +7 (94)', 'Interceptions +7 (95)',
        'Sprint Speed +7 (94)', 'PlayStyle+: Anticipate (4)', 'PlayStyle: Intercept (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Heading Acc. +7 (95)', 'Def. Aware +7 (95)', 'Stand Tackle +7 (95)',
        'PlayStyle+: Bruiser (4)', 'PlayStyle: Jockey (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +7 (94)', 'Stamina +7 (94)', 'Strength +7 (95)',
        'PlayStyle+: Quick Step (4)', 'PlayStyle: Block (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
