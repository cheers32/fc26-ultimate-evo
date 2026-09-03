import { EvolutionDefinition } from '../../types/player';

export const nationalPrideStarPart1_1112: EvolutionDefinition = {
  id: '1112',
  name: 'Make your National Pride Star - Part 1',
  futbinLink: 'https://www.futbin.com/26/evolutions/1112/make-your-national-pride-star-part-1',
  version: 'FC 26',
  description: "Inspired by the world's greatest international competitions, this Evolution brings elite prestige as you upgrade your player on their path to becoming a 5 PS+ superstar. Complete Part 1 to earn a comprehensive attribute upgrade and unlock the National Pride PlayStyles Lab.",
  descriptionZh: "【准入】OVR ≤94，PS+ ≤3。【收益】OVR +50（顶 95）；速度线 2 项（最高 +50）、射门线 5 项（最高 +50）、传球线 4 项（最高 +55）、盘带线 5 项（最高 +55）、防守线 4 项（最高 +50）、身体线 3 项（最高 +50）；稀有度改为 National Pride。【其他】4 级 · Season 9 Level 1 Reward。",
  cost: 'Season 9 Level 1 Reward',
  requirements: {
    maxOvr: 94,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 50, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 95 },
    agility: { boost: 50, limit: 97 },
    balance: { boost: 55, limit: 96 },
    curve: { boost: 55, limit: 96 },
    dribbling: { boost: 50, limit: 97 },
    finishing: { boost: 50, limit: 96 },
    interceptions: { boost: 50, limit: 90 },
    jumping: { boost: 50, limit: 92 },
    longPass: { boost: 55, limit: 96 },
    defAwareness: { boost: 50, limit: 90 },
    penalties: { boost: 45, limit: 94 },
    positioning: { boost: 50, limit: 95 },
    reactions: { boost: 50, limit: 95 },
    shortPass: { boost: 45, limit: 97 },
    shotPower: { boost: 50, limit: 96 },
    slideTackle: { boost: 50, limit: 92 },
    sprintSpeed: { boost: 50, limit: 95 },
    standTackle: { boost: 50, limit: 92 },
    stamina: { boost: 50, limit: 92 },
    strength: { boost: 50, limit: 92 },
    vision: { boost: 45, limit: 97 },
    volleys: { boost: 45, limit: 95 },
    composure: { boost: 50, limit: 95 }
  },
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (95)', 'Acceleration +50 (95)', 'Finishing +50 (96)', 'Att. Position +50 (95)', 'Shot Power +50 (96)', 'Sprint Speed +50 (95)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Curve +55 (96)', 'Long Pass +55 (96)', 'Penalties +45 (94)', 'Short Pass +45 (97)', 'Vision +45 (97)', 'Volleys +45 (95)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +50 (97)', 'Balance +55 (96)', 'Dribbling +50 (97)', 'Interceptions +50 (90)', 'Reactions +50 (95)', 'Composure +50 (95)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Jumping +50 (92)', 'Def. Aware +50 (90)', 'Slide Tackle +50 (92)', 'Stand Tackle +50 (92)', 'Stamina +50 (92)', 'Strength +50 (92)'
      ]
    }
  ],
  maxRepeatable: 1
};
