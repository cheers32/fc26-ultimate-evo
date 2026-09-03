import { EvolutionDefinition } from '../../types/player';

export const chasingTheSpotlight984: EvolutionDefinition = {
  id: '984',
  name: 'Chasing the Spotlight',
  futbinLink: 'https://www.futbin.com/26/evolutions/984/chasing-the-spotlight',
  version: 'FC 26',
  description: 'The spotlight finds those who earn it. Elevate every moment, outshine the rest, and finish with unforgettable authority.',
  descriptionZh: "【准入】非 CB，OVR ≤92，PS+ ≤3。【收益】OVR +3（顶 94）；速度线 2 项（最高 +3）、射门线 6 项（最高 +8）、传球线 5 项（最高 +5）、盘带线 6 项（最高 +5）、身体线 2 项（最高 +3）；弱脚 +4；花式 +4；PlayStyle+ 2 个（Rapid、Low Driven Shot）；PlayStyle 2 个（Incisive Pass、Gamechanger）。【其他】5 级 · Objective Group Reward。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 3, limit: 94 },
  subStatBoosts: {
    acceleration: { boost: 3, limit: 95 },
    aggression: { boost: 3, limit: 90 },
    agility: { boost: 5, limit: 96 },
    balance: { boost: 5, limit: 95 },
    ballControl: { boost: 5, limit: 96 },
    crossing: { boost: 2, limit: 96 },
    curve: { boost: 2, limit: 94 },
    dribbling: { boost: 5, limit: 95 },
    finishing: { boost: 5, limit: 94 },
    longPass: { boost: 5, limit: 96 },
    longShots: { boost: 3, limit: 94 },
    penalties: { boost: 3, limit: 96 },
    positioning: { boost: 5, limit: 95 },
    reactions: { boost: 2, limit: 94 },
    shortPass: { boost: 5, limit: 95 },
    freekick: { boost: 2, limit: 94 },
    shotPower: { boost: 3, limit: 94 },
    sprintSpeed: { boost: 3, limit: 95 },
    strength: { boost: 3, limit: 90 },
    volleys: { boost: 8, limit: 96 },
    composure: { boost: 2, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Rapid', 'Low Driven Shot'],
    silver: ['Incisive Pass', 'Gamechanger']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (94)', 'Aggression +3 (90)', 'Finishing +5 (94)', 'Att. Position +5 (95)', 'Weak Foot +4 (5)',
        'PlayStyle: Incisive Pass (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +3 (95)', 'Agility +5 (96)', 'Balance +5 (95)', 'Crossing +2 (96)', 'Shot Power +3 (94)', 'Volleys +5 (95)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Shots +3 (94)', 'Penalties +3 (96)', 'Sprint Speed +3 (95)', 'Strength +3 (90)', 'Volleys +3 (96)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Dribbling +5 (95)', 'Reactions +2 (94)', 'Composure +2 (97)', 'Skill Moves +4 (4)',
        'PlayStyle+: Rapid (3)', 'PlayStyle+: Low Driven Shot (3)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball Control +5 (96)', 'Curve +2 (94)', 'Long Pass +5 (96)', 'Short Pass +5 (95)', 'FK Acc. +2 (94)',
        'PlayStyle: Gamechanger (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
