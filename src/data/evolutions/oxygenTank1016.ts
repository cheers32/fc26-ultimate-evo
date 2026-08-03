import { EvolutionDefinition } from '../../types/player';

export const oxygenTank1016: EvolutionDefinition = {
  id: '1016',
  name: 'Oxygen Tank',
  futbinLink: 'https://www.futbin.com/26/evolutions/1016/oxygen-tank',
  version: 'FC 26',
  description: 'Found in the Republic of Korea Objective',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 7, limit: 93 },
  faceBoosts: {
    pac: { boost: 7, limit: 91 },
    sho: { boost: 7, limit: 90 },
    pas: { boost: 7, limit: 93 },
    dri: { boost: 7, limit: 93 },
    def: { boost: 7, limit: 92 },
    phy: { boost: 7, limit: 91 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Quick Step', 'Tiki Taka'],
    silver: ['Relentless', 'Press Proven', 'Incisive Pass']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +7 (93)', 'Pace Face +7 (91)', 'Shooting Face +7 (90)', 'Passing Face +7 (93)',
        'PlayStyle+: Quick Step (3)', 'PlayStyle: Relentless (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling Face +7 (93)', 'Defending Face +7 (92)', 'Physical Face +7 (91)',
        'PlayStyle+: Tiki Taka (3)', 'PlayStyle: Press Proven (8)', 'PlayStyle: Incisive Pass (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
