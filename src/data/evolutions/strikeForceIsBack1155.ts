import { EvolutionDefinition } from '../../types/player';

export const strikeForceIsBack1155: EvolutionDefinition = {
  id: '1155',
  name: 'Strike Force Is Back!',
  futbinLink: 'https://www.futbin.com/26/evolutions/1155/strike-force-is-back',
  version: 'FC 26',
  description: 'Found in the FUTTIES Token Store!',
  cost: '200 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 4,
    maxPlayStylesPlus: 4,
    positions: ['ST']
  },
  ovrBoost: { boost: 12, limit: 97 },
  faceBoosts: {
    pac: { boost: 12, limit: 97 },
    sho: { boost: 12, limit: 95 },
    pas: { boost: 12, limit: 92 },
    dri: { boost: 12, limit: 96 },
    def: { boost: 12, limit: 80 },
    phy: { boost: 12, limit: 90 }
  },
  subStatBoosts: {},
  weakFootBoost: 3,
  skillMovesBoost: 4,
  positionsAdded: ['RW', 'LW'],
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: ['Quick Step+', 'Finesse Shot+', 'Low Driven Shot+'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +6 (97)', 'Shooting Face +12 (95)', 'Weak Foot +3 (4)', 'Skill Moves +4 (5)',
        'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'OVR +6 (97)', 'Pace Face +12 (97)', 'Physical Face +12 (90)', 'Position RW',
        'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Passing Face +12 (92)', 'Dribbling Face +12 (96)', 'Defending Face +12 (80)', 'Position LW',
        'PlayStyle+: Low Driven Shot (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
