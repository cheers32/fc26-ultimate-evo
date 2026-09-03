import { EvolutionDefinition } from '../../types/player';

export const iDoAbsolutes1034: EvolutionDefinition = {
  id: '1034',
  name: 'I Do Absolutes',
  futbinLink: 'https://www.futbin.com/26/evolutions/1034/i-do-absolutes',
  version: 'FC 26',
  description: 'No ifs, or maybes. Channel Sadio Mane\'s fearless direct play that made him one of the best football players in the world.',
  descriptionZh: "【准入】LW 专用，OVR ≤91，PS+ ≤3。【收益】OVR +30（顶 93）；速度线 2 项（最高 +30）、射门线 6 项（最高 +30）、传球线 4 项（最高 +30）、盘带线 6 项（最高 +30）、防守线 1 项（最高 +30）、身体线 2 项（最高 +30）；PlayStyle+ 2 个（Rapid、Low Driven Shot）；PlayStyle 5 个（Quick Step、Technical、Finesse Shot、Gamechanger、Aerial Fortress）；加位置 RM。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['LW']
  },
  ovrBoost: { boost: 30, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 95 },
    agility: { boost: 30, limit: 94 },
    balance: { boost: 30, limit: 96 },
    ballControl: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 94 },
    dribbling: { boost: 30, limit: 94 },
    finishing: { boost: 30, limit: 96 },
    headingAcc: { boost: 30, limit: 95 },
    jumping: { boost: 30, limit: 95 },
    longPass: { boost: 20, limit: 92 },
    longShots: { boost: 30, limit: 93 },
    penalties: { boost: 30, limit: 93 },
    positioning: { boost: 30, limit: 96 },
    reactions: { boost: 30, limit: 93 },
    shortPass: { boost: 20, limit: 92 },
    shotPower: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 95 },
    stamina: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 94 },
    volleys: { boost: 30, limit: 93 },
    composure: { boost: 30, limit: 93 }
  },
  positionsAdded: ['RM'],
  playStylesAdded: {
    gold: ['Rapid', 'Low Driven Shot'],
    silver: ['Quick Step', 'Technical', 'Finesse Shot', 'Gamechanger', 'Aerial Fortress']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (93)', 'Curve +30 (94)', 'Dribbling +30 (94)', 'Jumping +30 (95)', 'Shot Power +30 (97)',
        'PlayStyle+: Rapid (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (95)', 'Long Shots +30 (93)', 'Reactions +30 (93)', 'Short Pass +20 (92)', 'Stamina +30 (94)',
        'PlayStyle+: Low Driven Shot (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +30 (94)', 'Long Pass +20 (92)', 'Sprint Speed +30 (95)', 'Volleys +30 (93)',
        'Position RM',
        'PlayStyle: Quick Step (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +30 (94)', 'Penalties +30 (93)', 'Att. Position +30 (96)', 'Composure +30 (93)',
        'PlayStyle: Technical (8)', 'PlayStyle: Finesse Shot (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +30 (96)', 'Finishing +30 (96)', 'Heading Acc. +30 (95)', 'Vision +30 (94)',
        'PlayStyle: Gamechanger (8)', 'PlayStyle: Aerial Fortress (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
