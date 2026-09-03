import { EvolutionDefinition } from '../../types/player';

export const oxygenTank1016: EvolutionDefinition = {
  id: '1016',
  name: 'Oxygen Tank',
  futbinLink: 'https://www.futbin.com/26/evolutions/1016/oxygen-tank',
  version: 'FC 26',
  description: 'Found in the Republic of Korea Objective',
  descriptionZh: "【准入】OVR ≤91，PS+ ≤3。【收益】OVR +7（顶 93）；速度面板 +7（顶 91）；射门面板 +7（顶 90）；传球面板 +7（顶 93）；盘带面板 +7（顶 93）；防守面板 +7（顶 92）；身体面板 +7（顶 91）；PlayStyle+ 2 个（Quick Step、Tiki Taka）；PlayStyle 3 个（Relentless、Press Proven、Incisive Pass）。【其他】2 级 · Objective Reward。",
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
