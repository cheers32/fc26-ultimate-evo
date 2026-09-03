import { EvolutionDefinition } from '../../types/player';

export const theMetronome1152: EvolutionDefinition = {
  id: '1152',
  name: 'The Metronome',
  futbinLink: 'https://www.futbin.com/26/evolutions/1152/the-metronome',
  version: 'FC 26',
  description: 'Dictate the tempo and dominate the center of the pitch. Transform your versatile midfielder into the ultimate link between defense and attack.',
  descriptionZh: "【准入】CM 专用，OVR ≤96，PS+ ≤4。【收益】OVR +30（顶 98）；速度线 2 项（最高 +30）、射门线 4 项（最高 +30）、传球线 4 项（最高 +35）、盘带线 5 项（最高 +30）、防守线 4 项（最高 +25）；弱脚 +4；花式 +4；PlayStyle+ 4 个（Pinged Pass+、Finesse Shot+、Incisive Pass+、Gamechanger+）；PlayStyle 4 个（Tiki Taka、Technical、Intercept、First Touch）；加位置 CAM；稀有度改为 Futties。【其他】5 级 · 700 FUTTIES Tokens / 200,000 Coins。",
  cost: '700 FUTTIES Tokens / 200,000 Coins',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CM']
  },
  ovrBoost: { boost: 30, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 93 },
    sprintSpeed: { boost: 30, limit: 93 },
    positioning: { boost: 30, limit: 95 },
    finishing: { boost: 30, limit: 95 },
    longShots: { boost: 30, limit: 95 },
    shotPower: { boost: 30, limit: 95 },
    vision: { boost: 35, limit: 98 },
    balance: { boost: 30, limit: 95 },
    curve: { boost: 35, limit: 95 },
    longPass: { boost: 35, limit: 95 },
    shortPass: { boost: 35, limit: 96 },
    ballControl: { boost: 30, limit: 98 },
    dribbling: { boost: 30, limit: 98 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 30, limit: 94 },
    interceptions: { boost: 25, limit: 95 },
    defAwareness: { boost: 25, limit: 95 },
    slideTackle: { boost: 25, limit: 94 },
    standTackle: { boost: 25, limit: 96 }
  },
  positionsAdded: ['CAM'],
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: ['Pinged Pass+', 'Finesse Shot+', 'Incisive Pass+', 'Gamechanger+'],
    silver: ['Tiki Taka', 'Technical', 'Intercept', 'First Touch']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)', 'Acceleration +30 (93)', 'Att. Position +30 (95)', 'Sprint Speed +30 (93)',
        'Position CAM', 'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +30 (95)', 'Long Shots +30 (95)', 'Shot Power +30 (95)', 'Vision +35 (98)',
        'Weak Foot +4 (5)', 'Skill Moves +4 (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +30 (95)', 'Curve +35 (95)', 'Long Pass +35 (95)', 'Short Pass +35 (96)',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +30 (98)', 'Dribbling +30 (98)', 'Reactions +30 (95)', 'Composure +30 (94)',
        'PlayStyle+: Incisive Pass (4)', 'PlayStyle: Intercept (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Interceptions +25 (95)', 'Def. Aware +25 (95)', 'Slide Tackle +25 (94)', 'Stand Tackle +25 (96)',
        'PlayStyle+: Gamechanger (4)', 'PlayStyle: First Touch (7)'
      ]
    }
  ]
};
