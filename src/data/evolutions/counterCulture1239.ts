import { EvolutionDefinition } from '../../types/player';

export const counterCulture1239: EvolutionDefinition = {
  id: '1239',
  name: 'Counter Culture',
  futbinLink: 'https://www.futbin.com/26/evolutions/1239/counter-culture',
  version: 'FC 26',
  description:
    "Skip the long buildup. Upgrade your player's pace, passing, and shooting to catch teams out on the transition and turn fast breaks into instant goals.",
  descriptionZh: "跳过冗长的组织。提升速度、传球和射门，在转换中打对手措手不及，把快攻变成即时进球。｜适合：非门将，速度射门传球各 +5，可重复 5 次。",
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
