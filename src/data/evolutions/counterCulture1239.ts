import { EvolutionDefinition } from '../../types/player';

export const counterCulture1239: EvolutionDefinition = {
  id: '1239',
  name: 'Counter Culture',
  futbinLink: 'https://www.futbin.com/26/evolutions/1239/counter-culture',
  version: 'FC 26',
  description:
    "Skip the long buildup. Upgrade your player's pace, passing, and shooting to catch teams out on the transition and turn fast breaks into instant goals.",
  descriptionZh: "【准入】非 GK，OVR ≤96，PS+ ≤4。【收益】OVR +3（顶 97）；速度面板 +5（顶 95）；射门面板 +5（顶 97）；传球面板 +5（顶 97）；弱脚 +4；PlayStyle+ 3 个（Low Driven Shot、Finesse Shot、First Touch）；PlayStyle 3 个（Rapid、Gamechanger、Technical）。【其他】2 级 · 可重复 5 次 · Season 10 — Level 1 Reward。",
  cost: 'Season 10 — Level 1 Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 97 },
  faceBoosts: {
    pac: { boost: 5, limit: 95 },
    sho: { boost: 5, limit: 97 },
    pas: { boost: 5, limit: 97 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Low Driven Shot', 'Finesse Shot', 'First Touch'],
    silver: ['Rapid', 'Gamechanger', 'Technical']
  },
  playStylesLimit: { gold: 5, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (97)',
        'Pace +5 (95)',
        'Weak Foot +4',
        'PlayStyle+: Low Driven Shot (5)',
        'PlayStyle+: Finesse Shot (5)',
        'PlayStyle: Rapid (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Shooting +5 (97)',
        'Passing +5 (97)',
        'PlayStyle+: First Touch (5)',
        'PlayStyle: Gamechanger (7)',
        'PlayStyle: Technical (7)'
      ]
    }
  ],
  maxRepeatable: 5
};
