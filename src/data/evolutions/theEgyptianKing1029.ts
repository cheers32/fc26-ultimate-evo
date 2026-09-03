import { EvolutionDefinition } from '../../types/player';

export const theEgyptianKing1029: EvolutionDefinition = {
  id: '1029',
  name: 'The Egyptian King',
  futbinLink: 'https://www.futbin.com/26/evolutions/1029/the-egyptian-king',
  version: 'FC 26',
  description: "Channel Mohamed Salah's explosive pace, razor-sharp dribbling, and ice-cold finishing to deliver greatness fit for the king.",
  descriptionZh: "【准入】RW 专用，OVR ≤91，PS+ ≤3。【收益】OVR +20（顶 93）；速度线 2 项（最高 +30）、射门线 6 项（最高 +35）、传球线 5 项（最高 +30）、盘带线 6 项（最高 +35）、身体线 1 项（最高 +30）；PlayStyle+ 2 个（Finesse Shot、Quick Step）；PlayStyle 4 个（Technical、Rapid、Low Driven Shot、Tiki Taka）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['RW']
  },
  ovrBoost: { boost: 20, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 94 },
    agility: { boost: 35, limit: 95 },
    balance: { boost: 35, limit: 95 },
    ballControl: { boost: 35, limit: 95 },
    crossing: { boost: 30, limit: 92 },
    curve: { boost: 30, limit: 94 },
    dribbling: { boost: 35, limit: 95 },
    finishing: { boost: 35, limit: 97 },
    longPass: { boost: 30, limit: 94 },
    longShots: { boost: 15, limit: 90 },
    penalties: { boost: 15, limit: 90 },
    positioning: { boost: 35, limit: 97 },
    reactions: { boost: 35, limit: 95 },
    shortPass: { boost: 30, limit: 94 },
    shotPower: { boost: 15, limit: 92 },
    sprintSpeed: { boost: 30, limit: 94 },
    stamina: { boost: 30, limit: 92 },
    vision: { boost: 30, limit: 94 },
    volleys: { boost: 15, limit: 90 },
    composure: { boost: 35, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Finesse Shot', 'Quick Step'],
    silver: ['Technical', 'Rapid', 'Low Driven Shot', 'Tiki Taka']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (93)', 'Agility +35 (95)', 'Crossing +30 (92)', 'Dribbling +35 (95)', 'Finishing +35 (97)',
        'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (94)', 'Balance +35 (95)', 'Att. Position +35 (97)', 'Short Pass +30 (94)',
        'PlayStyle+: Quick Step (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Pass +30 (94)', 'Reactions +35 (95)', 'Sprint Speed +30 (94)', 'Volleys +15 (90)',
        'PlayStyle: Technical (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +35 (95)', 'Curve +30 (94)', 'Penalties +15 (90)', 'Shot Power +15 (92)', 'Stamina +30 (92)',
        'PlayStyle: Rapid (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Long Shots +15 (90)', 'Vision +30 (94)', 'Composure +35 (95)',
        'PlayStyle: Low Driven Shot (8)', 'PlayStyle: Tiki Taka (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
