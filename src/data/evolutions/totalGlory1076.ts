import { EvolutionDefinition } from '../../types/player';

export const totalGlory1076: EvolutionDefinition = {
  id: '1076',
  name: 'Total Glory',
  futbinLink: 'https://www.futbin.com/26/evolutions/1076/total-glory',
  version: 'FC 26',
  description: "Elevate every aspect of your player's game and give them the final push for total glory.",
  descriptionZh: "【准入】非 GK，OVR ≤94。【收益】OVR +1（顶 99）；速度面板 +1（顶 95）；射门面板 +1（顶 96）；传球面板 +2（顶 96）；盘带面板 +2（顶 96）；防守面板 +1（顶 96）；身体面板 +1（顶 95）；弱脚 +2；稀有度改为 Glory Hunters。【其他】2 级 · Objective Group Reward。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 94,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 99 },
  faceBoosts: {
    pac: { boost: 1, limit: 95 },
    sho: { boost: 1, limit: 96 },
    pas: { boost: 2, limit: 96 },
    dri: { boost: 2, limit: 96 },
    def: { boost: 1, limit: 96 },
    phy: { boost: 1, limit: 95 }
  },
  subStatBoosts: {},
  weakFootBoost: 2,
  rarityChange: 'Glory Hunters',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +1', 'PAC +1 (95)', 'PAS +2 (96)', 'PHY +1 (95)']
    },
    {
      name: 'Level 2',
      upgrades: ['SHO +1 (96)', 'DRI +2 (96)', 'DEF +1 (96)', 'Weak Foot +2']
    }
  ],
  maxRepeatable: 1
};
