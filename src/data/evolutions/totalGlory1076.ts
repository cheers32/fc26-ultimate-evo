import { EvolutionDefinition } from '../../types/player';

export const totalGlory1076: EvolutionDefinition = {
  id: '1076',
  name: 'Total Glory',
  futbinLink: 'https://www.futbin.com/26/evolutions/1076/total-glory',
  version: 'FC 26',
  description: "Elevate every aspect of your player's game and give them the final push for total glory.",
  descriptionZh: "全面提升球员的每一个方面，给他们通往完全荣耀的最后一推。｜适合：非门将，六围各 +1~2，纯收尾补丁。",
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
