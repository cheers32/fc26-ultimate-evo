import { EvolutionDefinition } from '../../types/player';

export const elBandido1062: EvolutionDefinition = {
  id: '1062',
  name: 'El Bandido',
  futbinLink: 'https://www.futbin.com/26/evolutions/1062/el-bandido',
  version: 'FC 26',
  description: 'A creative maestro with a golden left foot, elite vision, deadly long shots, and the flair to unlock any defence with moments of pure magic.',
  descriptionZh: "【准入】CAM 专用，OVR ≤92，PS+ ≤3。【收益】OVR +20（顶 94）；速度线 2 项（最高 +25）、射门线 6 项（最高 +25）、传球线 6 项（最高 +30）、盘带线 6 项（最高 +30）、身体线 1 项（最高 +30）；花式 +4；PlayStyle+ 3 个（Technical、Incisive Pass、Finesse Shot）；PlayStyle 3 个（Tiki Taka、First Touch、Trickster）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CAM']
  },
  ovrBoost: { boost: 20, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 91 },
    agility: { boost: 30, limit: 95 },
    balance: { boost: 30, limit: 95 },
    ballControl: { boost: 30, limit: 95 },
    crossing: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 94 },
    dribbling: { boost: 30, limit: 96 },
    finishing: { boost: 25, limit: 93 },
    longPass: { boost: 30, limit: 95 },
    longShots: { boost: 25, limit: 95 },
    penalties: { boost: 25, limit: 92 },
    positioning: { boost: 25, limit: 93 },
    reactions: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 96 },
    freekick: { boost: 30, limit: 93 },
    shotPower: { boost: 25, limit: 93 },
    sprintSpeed: { boost: 25, limit: 91 },
    stamina: { boost: 30, limit: 91 },
    vision: { boost: 30, limit: 95 },
    volleys: { boost: 25, limit: 96 },
    composure: { boost: 30, limit: 93 }
  },
  playStylesAdded: {
    gold: ['Technical', 'Incisive Pass', 'Finesse Shot'],
    silver: ['Tiki Taka', 'First Touch', 'Trickster']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  skillMovesBoost: 4,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (94)', 'Long Pass +30 (95)', 'Sprint Speed +25 (91)', 'Vision +30 (95)', 'Composure +30 (93)',
        'PlayStyle+: Technical (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +25 (91)', 'Balance +30 (95)', 'Crossing +30 (94)', 'Att. Position +25 (93)',
        'Skill Moves +4 (5)',
        'PlayStyle+: Incisive Pass (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Finishing +25 (93)', 'Reactions +30 (94)', 'FK Acc. +30 (93)', 'Stamina +30 (91)', 'Volleys +25 (96)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +30 (95)', 'Penalties +25 (92)', 'Short Pass +30 (96)', 'Shot Power +25 (93)',
        'PlayStyle: Tiki Taka (8)', 'PlayStyle: First Touch (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +30 (95)', 'Curve +30 (94)', 'Dribbling +30 (96)', 'Long Shots +25 (95)',
        'PlayStyle: Trickster (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
