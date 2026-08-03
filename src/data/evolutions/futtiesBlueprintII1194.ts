import { EvolutionDefinition } from '../../types/player';

export const futtiesBlueprintII1194: EvolutionDefinition = {
  id: '1194',
  name: 'FUTTIES Blueprint II',
  futbinLink: 'https://www.futbin.com/26/evolutions/1194/futties-blueprint-ii',
  version: 'FC 26',
  description: 'The final touches on your masterclass striker. Inject the ultimate finishing, composure, and raw instinct needed to turn those half-chances into guaranteed goals.',
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    rarity: 'Futties Evo',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 98 },
  faceBoosts: {
    sho: { boost: 5, limit: 98 },
    dri: { boost: 5, limit: 97 },
    phy: { boost: 30, limit: 83 }
  },
  subStatBoosts: {
    longPass: { boost: 50, limit: 95 },
    shortPass: { boost: 50, limit: 95 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Incisive Pass+'],
    silver: ['Pinged Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (98)', 'Shooting Face +5 (98)', 'Physical Face +30 (83)', 'Skill Moves +4 (5)',
        'PlayStyle+: Incisive Pass (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling Face +5 (97)', 'Long Pass +50 (95)', 'Short Pass +50 (95)',
        'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
