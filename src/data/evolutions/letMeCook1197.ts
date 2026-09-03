import { EvolutionDefinition } from '../../types/player';

export const letMeCook1197: EvolutionDefinition = {
  id: '1197',
  name: 'Let Me Cook',
  futbinLink: 'https://www.futbin.com/26/evolutions/1197/let-me-cook',
  version: 'FC 26',
  description: 'Move your wide player into the center of the pitch with massive upgrades to passing and dribbling. Get them on the ball and let them cook.',
  descriptionZh: "把你的边路球员挪到中路，并大幅提升传球和盘带。让他拿球，然后开火。｜适合：LM/RM 专用，+20 OVR 并改位置。",
  cost: '500 Tokens / 150,000 Coins',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LM', 'RM']
  },
  ovrBoost: { boost: 20, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 94 },
    sprintSpeed: { boost: 30, limit: 94 },
    agility: { boost: 30, limit: 93 },
    balance: { boost: 30, limit: 96 },
    ballControl: { boost: 30, limit: 96 },
    dribbling: { boost: 30, limit: 93 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 30, limit: 95 },
    crossing: { boost: 30, limit: 93 },
    curve: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 97 },
    shortPass: { boost: 30, limit: 97 },
    freekick: { boost: 30, limit: 95 },
    vision: { boost: 30, limit: 97 },
    longShots: { boost: 20, limit: 97 },
    shotPower: { boost: 20, limit: 96 }
  },
  skillMovesBoost: 4,
  positionsAdded: ['CAM'],
  playStylesAdded: {
    gold: ['Incisive Pass', 'Finesse Shot', 'Pinged Pass', 'Tiki Taka'],
    silver: ['Quick Step', 'Low Driven Shot', 'First Touch', 'Press Proven']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (97)', 'Agility +30 (93)', 'Balance +30 (96)', 'Curve +30 (95)',
        'Shot Power +20 (96)', 'Sprint Speed +30 (94)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (94)', 'Composure +30 (95)', 'Skill Moves +4 (5)',
        'Position: CAM', 'PlayStyle+: Incisive Pass (4)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +30 (96)', 'Crossing +30 (93)', 'Dribbling +30 (93)',
        'Long Shots +20 (97)', 'Reactions +30 (95)', 'Vision +30 (97)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Short Pass +30 (97)', 'FK Acc. +30 (95)',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle+: Pinged Pass (4)',
        'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Long Pass +30 (97)', 'PlayStyle+: Tiki Taka (4)',
        'PlayStyle: First Touch (7)', 'PlayStyle: Press Proven (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
