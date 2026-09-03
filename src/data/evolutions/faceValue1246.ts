import { EvolutionDefinition } from '../../types/player';

export const faceValue1246: EvolutionDefinition = {
  id: '1246',
  name: 'Face Value',
  futbinLink: 'https://www.futbin.com/26/evolutions/1246/face-value',
  version: 'FC 26',
  description: 'Worth more than face value.',
  descriptionZh: "【准入】非 GK，OVR ≤97，PS+ ≤4。【收益】OVR +7（顶 97）；速度面板 +7（顶 95）；射门面板 +7（顶 95）；传球面板 +10（顶 97）；盘带面板 +7（顶 95）；防守面板 +7（顶 95）；身体面板 +7（顶 95）；弱脚 +4；花式 +4；PlayStyle+ 2 个（Pinged Pass、Tiki Taka）；PlayStyle 2 个（Low Driven Shot、Gamechanger）。【其他】2 级 · Objective Reward — Assist in 20。",
  cost: 'Objective Reward — Assist in 20',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 7, limit: 97 },
  // Every upgrade lands on the face stat rather than the subs underneath it.
  faceBoosts: {
    pac: { boost: 7, limit: 95 },
    sho: { boost: 7, limit: 95 },
    pas: { boost: 10, limit: 97 },
    dri: { boost: 7, limit: 95 },
    def: { boost: 7, limit: 95 },
    phy: { boost: 7, limit: 95 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Pinged Pass', 'Tiki Taka'],
    silver: ['Low Driven Shot', 'Gamechanger']
  },
  playStylesLimit: { gold: 5, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +7 (97)',
        'Pace +7 (95)',
        'Shooting +7 (95)',
        'Passing +10 (97)',
        'Weak Foot +4',
        'PlayStyle+: Pinged Pass (5)',
        'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +7 (95)',
        'Defending +7 (95)',
        'Physical +7 (95)',
        'Skills +4',
        'PlayStyle+: Tiki Taka (5)',
        'PlayStyle: Gamechanger (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
