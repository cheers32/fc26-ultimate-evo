import { EvolutionDefinition } from '../../types/player';

export const elKaiser987: EvolutionDefinition = {
  id: '987',
  name: 'El Kaiser',
  futbinLink: 'https://www.futbin.com/26/evolutions/987/el-kaiser',
  version: 'FC 26',
  description: 'Turn defense into dominance. Anticipate every move, crush every challenge, and set the tone from the back with relentless control and elite presence.',
  descriptionZh: "把防守变成统治。预判每一次移动、碾碎每一次挑战，用无情的控制力和精英级气场从后场定下基调。｜适合：CB 专用，防守和身体线全上。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CB']
  },
  ovrBoost: { boost: 20, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 90 },
    aggression: { boost: 15, limit: 93 },
    agility: { boost: 20, limit: 88 },
    balance: { boost: 20, limit: 87 },
    ballControl: { boost: 15, limit: 89 },
    curve: { boost: 20, limit: 85 },
    dribbling: { boost: 15, limit: 85 },
    headingAcc: { boost: 15, limit: 93 },
    interceptions: { boost: 15, limit: 95 },
    jumping: { boost: 15, limit: 91 },
    longPass: { boost: 30, limit: 95 },
    longShots: { boost: 30, limit: 90 },
    defAwareness: { boost: 15, limit: 95 },
    reactions: { boost: 25, limit: 94 },
    shortPass: { boost: 25, limit: 90 },
    freekick: { boost: 50, limit: 91 },
    shotPower: { boost: 50, limit: 93 },
    slideTackle: { boost: 15, limit: 95 },
    sprintSpeed: { boost: 20, limit: 90 },
    standTackle: { boost: 15, limit: 94 },
    stamina: { boost: 15, limit: 91 },
    strength: { boost: 15, limit: 95 },
    composure: { boost: 15, limit: 93 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Anticipate', 'Bruiser'],
    silver: ['Intercept', 'Quick Step', 'Dead Ball']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (93)', 'Agility +20 (88)', 'Balance +20 (87)', 'Curve +20 (85)', 'Long Shots +30 (90)', 'Shot Power +50 (93)',
        'PlayStyle: Intercept (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +20 (90)', 'Ball Control +15 (89)', 'Long Pass +30 (95)', 'Reactions +25 (94)', 'Short Pass +25 (90)', 'FK Acc. +50 (91)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Dribbling +15 (85)', 'Interceptions +15 (95)', 'Jumping +15 (91)', 'Slide Tackle +15 (95)', 'Stamina +15 (91)', 'Composure +15 (93)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +15 (93)', 'Heading Acc. +15 (93)', 'Sprint Speed +20 (90)', 'Weak Foot +4 (5)',
        'PlayStyle+: Anticipate (3)', 'PlayStyle+: Bruiser (3)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Def. Aware +15 (95)', 'Stand Tackle +15 (94)', 'Strength +15 (95)',
        'PlayStyle: Quick Step (8)', 'PlayStyle: Dead Ball (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
