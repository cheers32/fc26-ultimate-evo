import { EvolutionDefinition } from '../../types/player';

export const streetSoccer988: EvolutionDefinition = {
  id: '988',
  name: 'Street Soccer',
  futbinLink: 'https://www.futbin.com/26/evolutions/988/street-soccer',
  version: 'FC 26',
  description: "From concrete courts to the biggest stages, showcase how raw talent becomes unstoppable. Found in the Street Soccer Objective.",
  descriptionZh: "【准入】CM 专用，OVR ≤91，PS+ ≤3。【收益】OVR +35（顶 92）；身体面板 +30（顶 89）；速度线 2 项（最高 +35）、射门线 4 项（最高 +35）、传球线 6 项（最高 +35）、盘带线 6 项（最高 +35）、防守线 5 项（最高 +35）；弱脚 +4；PlayStyle+ 2 个（Intercept、Incisive Pass）；PlayStyle 3 个（Quick Step、Tiki Taka、Finesse Shot）。【其他】5 级 · Objective Group Reward。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM']
  },
  ovrBoost: { boost: 35, limit: 92 },
  faceBoosts: {
    phy: { boost: 30, limit: 89 }
  },
  subStatBoosts: {
    acceleration: { boost: 35, limit: 90 },
    agility: { boost: 35, limit: 92 },
    balance: { boost: 35, limit: 91 },
    ballControl: { boost: 35, limit: 95 },
    crossing: { boost: 35, limit: 92 },
    curve: { boost: 35, limit: 92 },
    dribbling: { boost: 35, limit: 95 },
    finishing: { boost: 35, limit: 89 },
    headingAcc: { boost: 35, limit: 90 },
    interceptions: { boost: 35, limit: 92 },
    longPass: { boost: 35, limit: 95 },
    longShots: { boost: 35, limit: 94 },
    defAwareness: { boost: 35, limit: 92 },
    positioning: { boost: 35, limit: 90 },
    reactions: { boost: 35, limit: 91 },
    shortPass: { boost: 35, limit: 95 },
    // Futbin literally shows "Free Kick +91 | 35" here, transposed against every other row on
    // this card (boost 30-35, limit 89-95) — read as a swap and corrected to match that pattern.
    freekick: { boost: 35, limit: 91 },
    shotPower: { boost: 35, limit: 91 },
    slideTackle: { boost: 35, limit: 90 },
    sprintSpeed: { boost: 35, limit: 90 },
    standTackle: { boost: 35, limit: 92 },
    vision: { boost: 35, limit: 95 },
    composure: { boost: 35, limit: 91 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Intercept', 'Incisive Pass'],
    silver: ['Quick Step', 'Tiki Taka', 'Finesse Shot']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +35 (92)', 'Dribbling +35 (95)', 'Long Shots +35 (94)', 'Short Pass +35 (95)', 'Vision +35 (95)', 'Weak Foot +4 (5)',
        'PlayStyle+: Intercept (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +35 (90)', 'Ball Control +35 (95)', 'Crossing +35 (92)', 'Curve +35 (92)', 'Long Pass +35 (95)',
        'PlayStyle+: Incisive Pass (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Def. Aware +35 (92)', 'FK Acc. +35 (91)', 'Shot Power +35 (91)', 'Sprint Speed +35 (90)', 'Composure +35 (91)',
        'PlayStyle: Quick Step (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +35 (92)', 'Interceptions +35 (92)', 'Att. Position +35 (90)', 'Reactions +35 (91)', 'Stand Tackle +35 (92)',
        'PlayStyle: Tiki Taka (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Physical Face +30 (89)', 'Balance +35 (91)', 'Finishing +35 (89)', 'Heading Acc. +35 (90)', 'Slide Tackle +35 (90)',
        'PlayStyle: Finesse Shot (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
