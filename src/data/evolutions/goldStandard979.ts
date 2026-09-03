import { EvolutionDefinition } from '../../types/player';

export const goldStandard979: EvolutionDefinition = {
  id: '979',
  name: 'Gold Standard',
  futbinLink: 'https://www.futbin.com/26/evolutions/979/gold-standard',
  version: 'FC 26',
  description: 'Find in the new Token Store - 500 Tokens',
  descriptionZh: "【准入】OVR ≤92。【收益】OVR +50（顶 94）；速度线 2 项（最高 +50）、射门线 2 项（最高 +50）、传球线 3 项（最高 +50）、盘带线 6 项（最高 +40）、防守线 5 项（最高 +45）、身体线 4 项（最高 +50）；弱脚 +4；稀有度改为 National Pride。【其他】4 级 · 500 FoF Tokens。",
  cost: '500 FoF Tokens',
  requirements: {
    maxOvr: 92,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 50, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 92 },
    aggression: { boost: 50, limit: 92 },
    agility: { boost: 40, limit: 91 },
    balance: { boost: 40, limit: 90 },
    ballControl: { boost: 40, limit: 89 },
    dribbling: { boost: 40, limit: 90 },
    headingAcc: { boost: 45, limit: 94 },
    interceptions: { boost: 45, limit: 95 },
    jumping: { boost: 40, limit: 92 },
    longPass: { boost: 50, limit: 94 },
    longShots: { boost: 50, limit: 92 },
    defAwareness: { boost: 45, limit: 95 },
    reactions: { boost: 40, limit: 93 },
    shortPass: { boost: 50, limit: 94 },
    shotPower: { boost: 50, limit: 92 },
    slideTackle: { boost: 45, limit: 92 },
    sprintSpeed: { boost: 50, limit: 93 },
    standTackle: { boost: 45, limit: 95 },
    stamina: { boost: 40, limit: 92 },
    strength: { boost: 45, limit: 96 },
    vision: { boost: 50, limit: 94 },
    composure: { boost: 40, limit: 92 }
  },
  weakFootBoost: 4,
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (94)', 'Acceleration +50 (92)', 'Heading Acc. +45 (94)', 'Def. Aware +45 (95)', 'Stand Tackle +45 (95)', 'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Jumping +40 (92)', 'Short Pass +50 (94)', 'Slide Tackle +45 (92)', 'Sprint Speed +50 (93)', 'Stamina +40 (92)', 'Vision +50 (94)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +50 (92)', 'Interceptions +45 (95)', 'Long Shots +50 (92)', 'Shot Power +50 (92)', 'Strength +45 (96)', 'Composure +40 (92)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +40 (91)', 'Balance +40 (90)', 'Ball Control +40 (89)', 'Dribbling +40 (90)', 'Long Pass +50 (94)', 'Reactions +40 (93)'
      ]
    }
  ],
  maxRepeatable: 1
};
