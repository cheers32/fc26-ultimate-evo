import { EvolutionDefinition } from '../../types/player';

export const nationalPrideStarPart2_1114: EvolutionDefinition = {
  id: '1114',
  name: 'Make Your National Pride Star - Part 2',
  futbinLink: 'https://www.futbin.com/26/evolutions/1114/make-your-national-pride-star-part-2',
  version: 'FC 26',
  description: "Inspired by the world's greatest international competitions, this Evolution brings elite prestige as you upgrade your player on their path to becoming a 5 PS+ superstar. Complete Part 2 to unlock additional attributes alongside maximum pace.",
  descriptionZh: "【准入】OVR ≤95，OVR ≥95，PS+ ≤3。【收益】OVR +2（顶 97）；速度线 2 项（最高 +50）、射门线 1 项（最高 +10）、传球线 2 项（最高 +10）、盘带线 1 项（最高 +10）、身体线 1 项（最高 +10）；弱脚 +4；花式 +4。【其他】2 级 · Season 9 Level 14 Reward。",
  cost: 'Season 9 Level 14 Reward',
  requirements: {
    maxOvr: 95,
    minOvr: 95,
    maxPlayStylesPlus: 3,
    rarity: 'National Pride'
  },
  ovrBoost: { boost: 2, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 99 },
    aggression: { boost: 10, limit: 92 },
    ballControl: { boost: 10, limit: 97 },
    crossing: { boost: 10, limit: 96 },
    longShots: { boost: 10, limit: 94 },
    freekick: { boost: 10, limit: 97 },
    sprintSpeed: { boost: 50, limit: 99 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Acceleration +50 (99)', 'Long Shots +10 (94)', 'Sprint Speed +50 (99)', 'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'OVR +2 (97)', 'Aggression +10 (92)', 'Ball Control +10 (97)', 'Crossing +10 (96)', 'FK Acc. +10 (97)', 'Skill Moves +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
