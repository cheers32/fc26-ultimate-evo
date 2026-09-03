import { EvolutionDefinition } from '../../types/player';

export const hiddenGem1011: EvolutionDefinition = {
  id: '1011',
  name: 'Hidden Gem',
  futbinLink: 'https://www.futbin.com/26/evolutions/1011/hidden-gem',
  version: 'FC 26',
  description: "Uncover a true hidden gem who elevates dribbling with sharper control, quicker turns, and silky close touches. Found in the Uzbekistan/Qatar Objective.",
  descriptionZh: "【准入】LM/LW 专用，非 LB，OVR ≤91，PS+ ≤3。【收益】OVR +35（顶 93）；速度线 2 项（最高 +40）、射门线 4 项（最高 +35）、传球线 6 项（最高 +35）、盘带线 6 项（最高 +40）、身体线 1 项（最高 +35）；花式 +4；PlayStyle+ 2 个（Technical、Quick Step）；PlayStyle 5 个（Finesse Shot、Trickster、Pinged Pass、Low Driven Shot、Rapid）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['LM', 'LW'],
    excludedPositions: ['LB']
  },
  ovrBoost: { boost: 35, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 40, limit: 92 },
    agility: { boost: 40, limit: 96 },
    balance: { boost: 40, limit: 96 },
    ballControl: { boost: 40, limit: 94 },
    crossing: { boost: 35, limit: 92 },
    curve: { boost: 35, limit: 94 },
    dribbling: { boost: 40, limit: 96 },
    finishing: { boost: 35, limit: 92 },
    longPass: { boost: 35, limit: 91 },
    longShots: { boost: 35, limit: 93 },
    positioning: { boost: 35, limit: 92 },
    reactions: { boost: 40, limit: 93 },
    shortPass: { boost: 35, limit: 92 },
    freekick: { boost: 35, limit: 89 },
    shotPower: { boost: 35, limit: 93 },
    sprintSpeed: { boost: 40, limit: 92 },
    stamina: { boost: 35, limit: 90 },
    vision: { boost: 35, limit: 93 },
    composure: { boost: 40, limit: 93 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Technical', 'Quick Step'],
    silver: ['Finesse Shot', 'Trickster', 'Pinged Pass', 'Low Driven Shot', 'Rapid']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +35 (93)', 'Agility +40 (96)', 'Sprint Speed +40 (92)', 'Stamina +35 (90)', 'Vision +35 (93)',
        'PlayStyle+: Technical (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +40 (92)', 'Crossing +35 (92)', 'Curve +35 (94)', 'Dribbling +40 (96)', 'Skill Moves +4 (4)',
        'PlayStyle+: Quick Step (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +40 (96)', 'Att. Position +35 (92)', 'Short Pass +35 (92)', 'Composure +40 (93)',
        'PlayStyle: Finesse Shot (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Finishing +35 (92)', 'Long Pass +35 (91)', 'Long Shots +35 (93)', 'FK Acc. +35 (89)',
        'PlayStyle: Trickster (8)', 'PlayStyle: Pinged Pass (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball Control +40 (94)', 'Reactions +40 (93)', 'Shot Power +35 (93)',
        'PlayStyle: Low Driven Shot (8)', 'PlayStyle: Rapid (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
