import { EvolutionDefinition } from '../../types/player';

export const stillGotIt1119: EvolutionDefinition = {
  id: '1119',
  name: 'Still Got It',
  futbinLink: 'https://www.futbin.com/26/evolutions/1119/still-got-it',
  version: 'FC 26',
  // FUTBIN also gates this on "Born before 1996-07-10"; the requirement schema has no age
  // field, so that check is not modelled here.
  description: 'Dust off the boots and oil the hips. Proves your veteran still has the sauce. Also requires the player to be born before 1996-07-10.',
  descriptionZh: "【准入】CM/CAM 专用，OVR ≤85，PS+ ≤3。【收益】OVR +50（顶 94）；射门面板 +50（顶 92）；速度线 2 项（最高 +50）、传球线 6 项（最高 +50）、盘带线 6 项（最高 +60）、身体线 3 项（最高 +40）；弱脚 +4；花式 +2；PlayStyle+ 4 个（Incisive Pass、Pinged Pass、Tiki Taka、Press Proven）；PlayStyle 6 个（Rapid、First Touch、Long Ball Pass、Inventive、Whipped Pass、Finesse Shot）。【其他】5 级 · Free。",
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 85,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM', 'CAM']
  },
  ovrBoost: { boost: 50, limit: 94 },
  faceBoosts: {
    sho: { boost: 50, limit: 92 }
  },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 92 },
    sprintSpeed: { boost: 50, limit: 92 },
    aggression: { boost: 40, limit: 88 },
    stamina: { boost: 40, limit: 95 },
    strength: { boost: 40, limit: 88 },
    agility: { boost: 60, limit: 94 },
    balance: { boost: 60, limit: 94 },
    ballControl: { boost: 60, limit: 95 },
    dribbling: { boost: 60, limit: 96 },
    reactions: { boost: 60, limit: 92 },
    composure: { boost: 60, limit: 91 },
    crossing: { boost: 50, limit: 94 },
    curve: { boost: 50, limit: 93 },
    longPass: { boost: 50, limit: 92 },
    shortPass: { boost: 50, limit: 95 },
    freekick: { boost: 50, limit: 93 },
    vision: { boost: 50, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 2,
  playStylesAdded: {
    gold: ['Incisive Pass', 'Pinged Pass', 'Tiki Taka', 'Press Proven'],
    silver: ['Rapid', 'First Touch', 'Long Ball Pass', 'Inventive', 'Whipped Pass', 'Finesse Shot']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (94)', 'SHO +50 (92)', 'Acceleration +50 (92)', 'Sprint Speed +50 (92)',
        'Vision +50 (95)', 'PlayStyle+: Incisive Pass (4)', 'PlayStyle: Rapid (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +60 (94)', 'Curve +50 (93)', 'Long Pass +50 (92)', 'Short Pass +50 (95)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: First Touch (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +60 (95)', 'Dribbling +60 (96)', 'Stamina +40 (95)',
        'Composure +60 (91)', 'PlayStyle+: Tiki Taka (4)', 'PlayStyle: Long Ball Pass (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +40 (88)', 'Crossing +50 (94)', 'FK Acc. +50 (93)', 'Strength +40 (88)',
        'PlayStyle: Inventive (7)', 'PlayStyle: Whipped Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +60 (94)', 'Reactions +60 (92)', 'Weak Foot +4 (5)', 'Skill Moves +2 (4)',
        'PlayStyle+: Press Proven (4)', 'PlayStyle: Finesse Shot (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
