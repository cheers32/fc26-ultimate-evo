import { EvolutionDefinition } from '../../types/player';

export const mrUndroppable1187: EvolutionDefinition = {
  id: '1187',
  name: 'Mr. Undroppable',
  futbinLink: 'https://www.futbin.com/26/evolutions/1187/mr-undroppable',
  version: 'FC 26',
  description: 'The ultimate club staple.',
  descriptionZh: "【准入】LB/RB 专用，非 CB，OVR ≤96，PS+ ≤4。【收益】OVR +30（顶 98）；速度线 2 项（最高 +30）、射门线 2 项（最高 +30）、传球线 5 项（最高 +30）、盘带线 6 项（最高 +30）、防守线 5 项（最高 +30）、身体线 4 项（最高 +30）；弱脚 +4；花式 +3；PlayStyle+ 4 个（Intercept、Quick Step、Jockey、Bruiser）；稀有度改为 Futties。【其他】5 级 · 200 FUTTIES Tokens。",
  cost: '200 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LB', 'RB'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    aggression: { boost: 30, limit: 95 },
    jumping: { boost: 30, limit: 92 },
    stamina: { boost: 30, limit: 95 },
    strength: { boost: 30, limit: 96 },
    agility: { boost: 30, limit: 97 },
    balance: { boost: 30, limit: 97 },
    ballControl: { boost: 30, limit: 94 },
    dribbling: { boost: 30, limit: 94 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 30, limit: 95 },
    crossing: { boost: 30, limit: 98 },
    curve: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 97 },
    vision: { boost: 30, limit: 97 },
    headingAcc: { boost: 30, limit: 92 },
    interceptions: { boost: 30, limit: 98 },
    defAwareness: { boost: 30, limit: 96 },
    slideTackle: { boost: 30, limit: 96 },
    standTackle: { boost: 30, limit: 97 },
    positioning: { boost: 30, limit: 95 },
    shotPower: { boost: 30, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: ['Intercept', 'Quick Step', 'Jockey', 'Bruiser'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)', 'Balance +30 (97)', 'Crossing +30 (98)', 'Slide Tackle +30 (96)',
        'Sprint Speed +30 (97)', 'Weak Foot +4 (5)', 'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (97)', 'Interceptions +30 (98)', 'Jumping +30 (92)',
        'Reactions +30 (95)', 'Short Pass +30 (97)', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +30 (94)', 'Long Pass +30 (95)', 'Def. Aware +30 (96)',
        'Att. Position +30 (95)', 'Stamina +30 (95)', 'PlayStyle+: Jockey (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Curve +30 (95)', 'Dribbling +30 (94)', 'Heading Acc. +30 (92)',
        'Shot Power +30 (95)', 'Strength +30 (96)', 'PlayStyle+: Bruiser (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Aggression +30 (95)', 'Agility +30 (97)', 'Stand Tackle +30 (97)',
        'Vision +30 (97)', 'Composure +30 (95)', 'Skill Moves +3 (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
