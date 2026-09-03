import { EvolutionDefinition } from '../../types/player';

export const ninetySevenTimes1250: EvolutionDefinition = {
  id: '1250',
  name: '97 Times',
  futbinLink: 'https://www.futbin.com/26/evolutions/1250/97-times',
  version: 'FC 26',
  description:
    'Become the ultimate all-rounder in this EVO, boosting every core attribute and pace while unlocking elite skill moves and a perfect weak foot to dominate the pitch.',
  descriptionZh: "【准入】非 GK，OVR ≤97。【收益】OVR +4（顶 98）；射门面板 +4（顶 97）；传球面板 +4（顶 98）；盘带面板 +4（顶 97）；防守面板 +4（顶 97）；身体面板 +4（顶 97）；速度线 2 项（最高 +4）；弱脚 +4；花式 +4。【其他】2 级 · 150 FC Points / 50,000 Coins。",
  cost: '150 FC Points / 50,000 Coins',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 4, limit: 98 },
  // Raises five of the six face stats directly; pace moves through its two sub-stats instead.
  faceBoosts: {
    sho: { boost: 4, limit: 97 },
    pas: { boost: 4, limit: 98 },
    dri: { boost: 4, limit: 97 },
    def: { boost: 4, limit: 97 },
    phy: { boost: 4, limit: 97 }
  },
  subStatBoosts: {
    acceleration: { boost: 4, limit: 97 },
    sprintSpeed: { boost: 4, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +4 (98)', 'Passing +4 (98)', 'Defending +4 (97)', 'Physical +4 (97)', 'Weak Foot +4']
    },
    {
      name: 'Level 2',
      upgrades: [
        'Shooting +4 (97)',
        'Dribbling +4 (97)',
        'Acceleration +4 (97)',
        'Sprint Speed +4 (97)',
        'Skills +4'
      ]
    }
  ],
  trainingTime: '1 Week',
  maxRepeatable: 1
};
