import { EvolutionDefinition } from '../../types/player';

export const maxSweat1201: EvolutionDefinition = {
  id: '1201',
  name: 'Max Sweat',
  futbinLink: 'https://www.futbin.com/26/evolutions/1201/max-sweat',
  version: 'FC 26',
  description: 'Found in the FUTTIES Daily Login Objective.',
  descriptionZh: "【准入】RW 专用，非 CB，OVR ≤96，PS+ ≤3。【收益】OVR +30（顶 97）；速度线 2 项（最高 +30）、射门线 6 项（最高 +30）、传球线 5 项（最高 +30）、盘带线 6 项（最高 +30）、身体线 2 项（最高 +20）；弱脚 +3；花式 +5；PlayStyle+ 4 个（Quick Step、Rapid、Finesse Shot、Low Driven Shot）；PlayStyle 3 个（Incisive Pass、Technical、Pinged Pass）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    positions: ['RW'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    stamina: { boost: 20, limit: 94 },
    strength: { boost: 20, limit: 90 },
    agility: { boost: 30, limit: 97 },
    balance: { boost: 30, limit: 96 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 97 },
    reactions: { boost: 30, limit: 93 },
    composure: { boost: 30, limit: 94 },
    crossing: { boost: 30, limit: 92 },
    curve: { boost: 30, limit: 94 },
    longPass: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 92 },
    finishing: { boost: 30, limit: 93 },
    longShots: { boost: 30, limit: 94 },
    penalties: { boost: 20, limit: 93 },
    positioning: { boost: 30, limit: 96 },
    shotPower: { boost: 30, limit: 94 },
    volleys: { boost: 20, limit: 93 }
  },
  weakFootBoost: 3,
  skillMovesBoost: 5,
  playStylesAdded: {
    gold: ['Quick Step', 'Rapid', 'Finesse Shot', 'Low Driven Shot'],
    silver: ['Incisive Pass', 'Technical', 'Pinged Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Balance +30 (96)', 'Curve +30 (94)', 'Sprint Speed +30 (97)',
        'Strength +20 (90)', 'Weak Foot +3 (4)', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +30 (97)', 'Dribbling +30 (97)', 'Att. Position +30 (96)',
        'Short Pass +30 (94)', 'Skill Moves +5', 'PlayStyle+: Rapid (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Acceleration +30 (97)', 'Ball Control +30 (97)', 'Finishing +30 (93)',
        'Vision +30 (92)', 'PlayStyle+: Finesse Shot (4)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Crossing +30 (92)', 'Penalties +20 (93)', 'Reactions +30 (93)',
        'Shot Power +30 (94)', 'Stamina +20 (94)', 'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Long Pass +30 (94)', 'Long Shots +30 (94)', 'Volleys +20 (93)',
        'Composure +30 (94)', 'PlayStyle: Technical (7)', 'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
