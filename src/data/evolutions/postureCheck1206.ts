import { EvolutionDefinition } from '../../types/player';

export const postureCheck1206: EvolutionDefinition = {
  id: '1206',
  name: 'Posture Check',
  futbinLink: 'https://www.futbin.com/26/evolutions/1206/posture-check',
  version: 'FC 26',
  description: 'Found in the FUTTIES Token Store.',
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CM']
  },
  ovrBoost: { boost: 10, limit: 97 },
  subStatBoosts: {
    aggression: { boost: 15, limit: 97 },
    stamina: { boost: 25, limit: 96 },
    strength: { boost: 15, limit: 98 },
    longPass: { boost: 25, limit: 97 },
    shortPass: { boost: 25, limit: 97 },
    vision: { boost: 15, limit: 97 },
    interceptions: { boost: 25, limit: 98 },
    defAwareness: { boost: 15, limit: 98 },
    slideTackle: { boost: 28, limit: 97 },
    standTackle: { boost: 15, limit: 98 }
  },
  weakFootBoost: 4,
  positionsAdded: ['CDM'],
  playStylesAdded: {
    gold: ['Anticipate', 'Intercept', 'Bruiser', 'Pinged Pass'],
    silver: ['Incisive Pass', 'Jockey']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10 (97)', 'Long Pass +25 (97)', 'Stand Tackle +15 (98)',
        'Strength +15 (98)', 'Position: CDM',
        'PlayStyle+: Anticipate (4)', 'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +15 (97)', 'Interceptions +25 (98)', 'Slide Tackle +28 (97)',
        'Vision +15 (97)', 'PlayStyle+: Bruiser (4)', 'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Def. Aware +15 (98)', 'Short Pass +25 (97)', 'Stamina +25 (96)',
        'Weak Foot +4', 'PlayStyle: Incisive Pass (7)', 'PlayStyle: Jockey (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
