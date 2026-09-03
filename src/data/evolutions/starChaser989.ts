import { EvolutionDefinition } from '../../types/player';

export const starChaser989: EvolutionDefinition = {
  id: '989',
  name: 'Star Chaser',
  futbinLink: 'https://www.futbin.com/26/evolutions/989/star-chaser',
  version: 'FC 26',
  description: 'Built for the fast lane. Lock down attackers with relentless defending and explosive pace that leaves challengers in the dust.',
  descriptionZh: "【准入】OVR ≤91，PS+ ≤3。【收益】OVR +3（顶 93）；速度线 2 项（最高 +10）、防守线 5 项（最高 +10）；弱脚 +4；PlayStyle+ 2 个（Quick Step、Jockey）；PlayStyle 4 个（Intercept、Anticipate、Aerial Fortress、Inventive）。【其他】3 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars'
  },
  ovrBoost: { boost: 3, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 10, limit: 89 },
    headingAcc: { boost: 10, limit: 92 },
    interceptions: { boost: 10, limit: 92 },
    defAwareness: { boost: 10, limit: 95 },
    slideTackle: { boost: 10, limit: 92 },
    sprintSpeed: { boost: 10, limit: 92 },
    standTackle: { boost: 10, limit: 95 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Quick Step', 'Jockey'],
    silver: ['Intercept', 'Anticipate', 'Aerial Fortress', 'Inventive']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (93)', 'Acceleration +10 (89)', 'Sprint Speed +10 (92)', 'Weak Foot +4 (5)',
        'PlayStyle: Intercept (8)', 'PlayStyle: Anticipate (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Heading Acc. +10 (92)', 'Interceptions +10 (92)', 'Def. Aware +10 (95)',
        'PlayStyle: Aerial Fortress (8)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Slide Tackle +10 (92)', 'Stand Tackle +10 (95)',
        'PlayStyle+: Quick Step (3)', 'PlayStyle+: Jockey (3)', 'PlayStyle: Inventive (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
