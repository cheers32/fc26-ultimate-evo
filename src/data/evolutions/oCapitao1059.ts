import { EvolutionDefinition } from '../../types/player';

export const oCapitao1059: EvolutionDefinition = {
  id: '1059',
  name: 'O Capitão',
  futbinLink: 'https://www.futbin.com/26/evolutions/1059/o-capitao',
  version: 'FC 26',
  description: "An attacking fullback with pace, composure, and a thunderous strike. Become solid defensively, fearless going forward, and capable of defining moments on the biggest stage. Found in the Brazil Objective.",
  descriptionZh: "【准入】RB 专用，非 CB，OVR ≤92，PS+ ≤3。【收益】OVR +50（顶 94）；速度线 2 项（最高 +30）、射门线 6 项（最高 +45）、传球线 5 项（最高 +30）、盘带线 6 项（最高 +30）、防守线 5 项（最高 +30）、身体线 4 项（最高 +30）；PlayStyle+ 2 个（Jockey、Low Driven Shot）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['RB'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 50, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 94 },
    aggression: { boost: 30, limit: 92 },
    agility: { boost: 30, limit: 92 },
    balance: { boost: 30, limit: 93 },
    ballControl: { boost: 30, limit: 93 },
    crossing: { boost: 30, limit: 92 },
    curve: { boost: 30, limit: 92 },
    dribbling: { boost: 30, limit: 93 },
    finishing: { boost: 35, limit: 92 },
    headingAcc: { boost: 30, limit: 94 },
    interceptions: { boost: 30, limit: 94 },
    jumping: { boost: 30, limit: 92 },
    longPass: { boost: 30, limit: 94 },
    longShots: { boost: 30, limit: 92 },
    defAwareness: { boost: 30, limit: 93 },
    penalties: { boost: 35, limit: 90 },
    positioning: { boost: 35, limit: 92 },
    reactions: { boost: 30, limit: 93 },
    shortPass: { boost: 30, limit: 94 },
    shotPower: { boost: 45, limit: 96 },
    slideTackle: { boost: 30, limit: 94 },
    sprintSpeed: { boost: 30, limit: 94 },
    standTackle: { boost: 30, limit: 94 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 30, limit: 93 },
    vision: { boost: 30, limit: 92 },
    volleys: { boost: 35, limit: 90 },
    composure: { boost: 30, limit: 94 }
  },
  playStylesAdded: {
    gold: ['Jockey', 'Low Driven Shot'],
    silver: []
  },
  playStylesLimit: {
    gold: 3
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (94)', 'Balance +30 (93)', 'Interceptions +30 (94)', 'Jumping +30 (92)', 'Shot Power +45 (96)', 'Vision +30 (92)',
        'PlayStyle+: Jockey (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (94)', 'Long Shots +30 (92)', 'Def. Aware +30 (93)', 'Reactions +30 (93)', 'Stamina +30 (96)',
        'PlayStyle+: Low Driven Shot (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +30 (93)', 'Heading Acc. +30 (94)', 'Short Pass +30 (94)', 'Sprint Speed +30 (94)', 'Strength +30 (93)', 'Volleys +35 (90)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +30 (92)', 'Dribbling +30 (93)', 'Long Pass +30 (94)', 'Penalties +35 (90)', 'Att. Position +35 (92)', 'Stand Tackle +30 (94)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +30 (92)', 'Crossing +30 (92)', 'Curve +30 (92)', 'Finishing +35 (92)', 'Slide Tackle +30 (94)', 'Composure +30 (94)'
      ]
    }
  ],
  maxRepeatable: 1
};
