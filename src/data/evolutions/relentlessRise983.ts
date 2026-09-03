import { EvolutionDefinition } from '../../types/player';

export const relentlessRise983: EvolutionDefinition = {
  id: '983',
  name: 'Relentless Rise',
  futbinLink: 'https://www.futbin.com/26/evolutions/983/relentless-rise',
  version: 'FC 26',
  description: 'UT Found in the Haiti/Panama Objective',
  descriptionZh: "【准入】ST/LW/RW 专用，OVR ≤91，PS+ ≤3。【收益】OVR +50（顶 92）；速度线 2 项（最高 +35）、射门线 6 项（最高 +35）、传球线 4 项（最高 +35）、盘带线 6 项（最高 +35）、防守线 1 项（最高 +35）、身体线 1 项（最高 +35）；弱脚 +4；花式 +3；PlayStyle+ 2 个（Finesse Shot+、Technical+）；PlayStyle 6 个（Incisive Pass、Low Driven Shot、Tiki Taka、Rapid、Quick Step、Gamechanger）。【其他】5 级 · Free / Objective。",
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['ST', 'LW', 'RW']
  },
  ovrBoost: { boost: 50, limit: 92 },
  subStatBoosts: {
    acceleration: { boost: 35, limit: 94 },
    agility: { boost: 35, limit: 92 },
    balance: { boost: 35, limit: 91 },
    ballControl: { boost: 35, limit: 95 },
    curve: { boost: 35, limit: 93 },
    dribbling: { boost: 35, limit: 95 },
    finishing: { boost: 35, limit: 95 },
    headingAcc: { boost: 35, limit: 88 },
    longPass: { boost: 35, limit: 89 },
    longShots: { boost: 35, limit: 91 },
    penalties: { boost: 35, limit: 88 },
    positioning: { boost: 35, limit: 93 },
    reactions: { boost: 35, limit: 92 },
    shortPass: { boost: 35, limit: 90 },
    shotPower: { boost: 35, limit: 95 },
    sprintSpeed: { boost: 35, limit: 94 },
    stamina: { boost: 35, limit: 89 },
    vision: { boost: 35, limit: 90 },
    volleys: { boost: 35, limit: 88 },
    composure: { boost: 35, limit: 93 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  playStylesAdded: {
    gold: ['Finesse Shot+', 'Technical+'],
    silver: ['Incisive Pass', 'Low Driven Shot', 'Tiki Taka', 'Rapid', 'Quick Step', 'Gamechanger']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (92)', 'Ball Control +35 (95)', 'Curve +35 (93)', 'Finishing +35 (95)', 'Sprint Speed +35 (94)',
        'Skill Moves +3 (4)', 'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +35 (94)', 'Agility +35 (92)', 'Dribbling +35 (95)', 'Att. Position +35 (93)', 'Shot Power +35 (95)',
        'PlayStyle+: Technical (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +35 (91)', 'Long Shots +35 (91)', 'Vision +35 (90)', 'Composure +35 (93)',
        'Weak Foot +4 (5)', 'PlayStyle: Incisive Pass (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Heading Acc. +35 (88)', 'Reactions +35 (92)', 'Short Pass +35 (90)', 'Volleys +35 (88)',
        'PlayStyle: Low Driven Shot (8)', 'PlayStyle: Tiki Taka (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Long Pass +35 (89)', 'Penalties +35 (88)', 'Stamina +35 (89)',
        'PlayStyle: Rapid (8)', 'PlayStyle: Quick Step (8)', 'PlayStyle: Gamechanger (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
