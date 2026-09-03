import { EvolutionDefinition } from '../../types/player';

export const classOnGrass1254: EvolutionDefinition = {
  id: '1254',
  name: 'Class on Grass',
  futbinLink: 'https://www.futbin.com/26/evolutions/1254/class-on-grass',
  version: 'FC 26',
  description: "True class needs no introduction. Evolve your player and unlock the complete striking game that makes them stand out on every pitch. Found in the Pre Season Token Store.",
  descriptionZh: "【准入】OVR ≤97，PS+ ≤4。【收益】OVR +30（顶 98）；速度线 2 项（最高 +35）、射门线 4 项（最高 +35）、传球线 3 项（最高 +30）、盘带线 5 项（最高 +30）、身体线 2 项（最高 +35）；弱脚 +4；花式 +5；PlayStyle+ 4 个（Finesse Shot、Low Driven Shot、Power Shot、Rapid）；PlayStyle 4 个（Quick Step、Incisive Pass、Gamechanger、First Touch）；加位置 ST。【其他】5 级 · Tokens — 200 Pre Season Tokens。",
  cost: 'Tokens — 200 Pre Season Tokens',
  requirements: {
    maxOvr: 97,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 30, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 35, limit: 97 },
    sprintSpeed: { boost: 35, limit: 96 },
    positioning: { boost: 35, limit: 98 },
    finishing: { boost: 35, limit: 98 },
    shotPower: { boost: 35, limit: 97 },
    longShots: { boost: 35, limit: 96 },
    balance: { boost: 30, limit: 98 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 98 },
    reactions: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 98 },
    curve: { boost: 30, limit: 97 },
    shortPass: { boost: 30, limit: 96 },
    vision: { boost: 30, limit: 94 },
    stamina: { boost: 35, limit: 95 },
    strength: { boost: 35, limit: 98 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 5,
  positionsAdded: ['ST'],
  playStylesAdded: {
    gold: ['Finesse Shot', 'Low Driven Shot', 'Power Shot', 'Rapid'],
    silver: ['Quick Step', 'Incisive Pass', 'Gamechanger', 'First Touch']
  },
  playStylesLimit: { gold: 5, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)',
        'Acceleration +35 (97)',
        'Positioning +35 (98)',
        'Sprint Speed +35 (96)',
        'Position: ST',
        'PlayStyle+: Finesse Shot (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +35 (98)',
        'Long Shots +35 (96)',
        'Shot Power +35 (97)',
        'Weak Foot +4',
        'PlayStyle+: Low Driven Shot (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +30 (98)',
        'Curve +30 (97)',
        'Short Passing +30 (96)',
        'Vision +30 (94)',
        'PlayStyle+: Power Shot (5)',
        'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +30 (97)',
        'Dribbling +30 (98)',
        'Reactions +30 (97)',
        'Composure +30 (98)',
        'Skills +5',
        'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Stamina +35 (95)',
        'Strength +35 (98)',
        'PlayStyle+: Rapid (5)',
        'PlayStyle: Gamechanger (7)',
        'PlayStyle: First Touch (7)'
      ]
    }
  ],
  trainingTime: '1 Month',
  maxRepeatable: 1
};
