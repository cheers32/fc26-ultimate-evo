import { EvolutionDefinition } from '../../types/player';

export const theFlyingDutchman1085: EvolutionDefinition = {
  id: '1085',
  name: 'The Flying Dutchman',
  futbinLink: 'https://www.futbin.com/26/evolutions/1085/the-flying-dutchman',
  version: 'FC 26',
  description: 'Found in the Netherlands/Portugal Objective',
  descriptionZh: "【准入】ST/CAM 专用，OVR ≤93，PS+ ≤3。【收益】OVR +25（顶 95）；速度线 2 项（最高 +30）、射门线 5 项（最高 +30）、传球线 4 项（最高 +30）、盘带线 6 项（最高 +30）、身体线 1 项（最高 +30）；弱脚 +4；花式 +4；PlayStyle+ 2 个（Finesse Shot、Incisive Pass）；PlayStyle 3 个（Technical、First Touch、Trickster）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 93,
    maxShooting: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['ST', 'CAM']
  },
  ovrBoost: { boost: 25, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 91 },
    sprintSpeed: { boost: 30, limit: 92 },
    positioning: { boost: 30, limit: 94 },
    finishing: { boost: 30, limit: 94 },
    shotPower: { boost: 30, limit: 92 },
    longShots: { boost: 20, limit: 92 },
    volleys: { boost: 20, limit: 90 },
    vision: { boost: 20, limit: 91 },
    longPass: { boost: 30, limit: 92 },
    shortPass: { boost: 30, limit: 92 },
    ballControl: { boost: 25, limit: 96 },
    dribbling: { boost: 30, limit: 97 },
    curve: { boost: 30, limit: 93 },
    agility: { boost: 30, limit: 95 },
    balance: { boost: 30, limit: 91 },
    reactions: { boost: 20, limit: 94 },
    composure: { boost: 20, limit: 93 },
    stamina: { boost: 30, limit: 93 }
  },
  playStylesAdded: {
    gold: ['Finesse Shot', 'Incisive Pass'],
    silver: ['Technical', 'First Touch', 'Trickster']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +25 (95)', 'Acceleration +30 (91)', 'Att. Position +30 (94)', 'Sprint Speed +30 (92)',
        'Weak Foot +4 (5)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +30 (97)', 'Finishing +30 (94)', 'Long Shots +20 (92)', 'Shot Power +30 (92)',
        'Stamina +30 (93)', 'Composure +20 (93)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +25 (96)', 'Reactions +20 (94)', 'Vision +20 (91)', 'Volleys +20 (90)',
        'Skill Moves +4 (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Long Pass +30 (92)', 'Short Pass +30 (92)',
        'PlayStyle+: Incisive Pass (3)',
        'PlayStyle: Technical (8)', 'PlayStyle: First Touch (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +30 (95)', 'Balance +30 (91)', 'Curve +30 (93)',
        'PlayStyle: Trickster (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
