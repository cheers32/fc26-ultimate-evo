import { EvolutionDefinition } from '../../types/player';

export const hardYards1243: EvolutionDefinition = {
  id: '1243',
  name: 'Hard Yards',
  futbinLink: 'https://www.futbin.com/26/evolutions/1243/hard-yards',
  version: 'FC 26',
  description:
    'The hard yards are earned, never given. Develop the qualities that make a player a force in every duel, every sprint and every moment that matters.',
  cost: 'Season 10 — Level 8 Reward',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 98 },
  faceBoosts: {
    pac: { boost: 5, limit: 95 },
    pas: { boost: 5, limit: 95 },
    def: { boost: 5, limit: 98 },
    phy: { boost: 5, limit: 96 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Bruiser', 'Jockey', 'Intercept'],
    silver: ['Anticipate', 'Pinged Pass', 'Quick Step']
  },
  playStylesLimit: { gold: 5, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (98)',
        'Pace +5 (95)',
        'Passing +5 (95)',
        'PlayStyle+: Bruiser (5)',
        'PlayStyle+: Jockey (5)',
        'PlayStyle: Anticipate (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending +5 (98)',
        'Physical +5 (96)',
        'PlayStyle+: Intercept (5)',
        'PlayStyle: Pinged Pass (7)',
        'PlayStyle: Quick Step (7)'
      ]
    }
  ],
  maxRepeatable: 5
};
