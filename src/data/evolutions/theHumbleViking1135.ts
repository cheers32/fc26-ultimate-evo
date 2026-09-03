import { EvolutionDefinition } from '../../types/player';

export const theHumbleViking1135: EvolutionDefinition = {
  id: '1135',
  name: 'The Humble Viking',
  futbinLink: 'https://www.futbin.com/26/evolutions/1135/the-humble-viking',
  version: 'FC 26',
  description: 'Strength and speed combine with ruthless finishing. Defenders get overpowered, spaces get attacked, and matches are decided in seconds. Staying humble, of course.',
  descriptionZh: "【准入】ST 专用，OVR ≤94，PS+ ≤3。【收益】OVR +30（顶 96）；速度线 2 项（最高 +35）、射门线 6 项（最高 +35）、传球线 1 项（最高 +35）、盘带线 6 项（最高 +35）、身体线 4 项（最高 +25）；弱脚 +4；PlayStyle+ 4 个（Finesse Shot、Low Driven Shot、Rapid、Precision Header）；PlayStyle 4 个（Quick Step、Gamechanger、Aerial Fortress、Enforcer）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['ST']
  },
  ovrBoost: { boost: 30, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 35, limit: 94 },
    sprintSpeed: { boost: 35, limit: 94 },
    aggression: { boost: 25, limit: 93 },
    jumping: { boost: 25, limit: 95 },
    stamina: { boost: 25, limit: 93 },
    strength: { boost: 25, limit: 97 },
    agility: { boost: 35, limit: 92 },
    balance: { boost: 35, limit: 92 },
    ballControl: { boost: 35, limit: 92 },
    dribbling: { boost: 35, limit: 92 },
    reactions: { boost: 35, limit: 96 },
    composure: { boost: 35, limit: 96 },
    curve: { boost: 35, limit: 95 },
    finishing: { boost: 35, limit: 96 },
    longShots: { boost: 35, limit: 95 },
    penalties: { boost: 35, limit: 97 },
    positioning: { boost: 35, limit: 95 },
    shotPower: { boost: 35, limit: 97 },
    volleys: { boost: 35, limit: 97 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Low Driven Shot', 'Rapid', 'Precision Header'],
    silver: ['Quick Step', 'Gamechanger', 'Aerial Fortress', 'Enforcer']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (96)', 'Acceleration +35 (94)', 'Finishing +35 (96)',
        'Long Shots +35 (95)', 'Att. Position +35 (95)', 'Shot Power +35 (97)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +35 (92)', 'Balance +35 (92)', 'Sprint Speed +35 (94)',
        'Weak Foot +4 (5)', 'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +35 (95)', 'Penalties +35 (97)', 'Stamina +25 (93)',
        'Strength +25 (97)', 'Volleys +35 (97)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +25 (93)', 'Ball Control +35 (92)', 'Dribbling +35 (92)',
        'Reactions +35 (96)', 'PlayStyle+: Rapid (4)', 'PlayStyle+: Precision Header (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Jumping +25 (95)', 'Composure +35 (96)',
        'PlayStyle: Gamechanger (7)', 'PlayStyle: Aerial Fortress (7)',
        'PlayStyle: Enforcer (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
