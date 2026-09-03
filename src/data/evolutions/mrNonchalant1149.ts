import { EvolutionDefinition } from '../../types/player';

export const mrNonchalant1149: EvolutionDefinition = {
  id: '1149',
  name: 'Mr. Nonchalant',
  futbinLink: 'https://www.futbin.com/26/evolutions/1149/mr-nonchalant',
  version: 'FC 26',
  description: 'Cool under pressure, smooth on the ball. Glide past defenders, pick the perfect pass, and finish with confidence. No rush, no panic, just pure class.',
  descriptionZh: "压力下从容，球在脚下顺滑。晃过后卫、送出完美的传球、自信地终结。不急不躁，纯粹的格调。｜适合：CAM 专用，+20 OVR，传球盘带线全加。",
  cost: '500 Tokens / 175,000 Coins',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CAM']
  },
  ovrBoost: { boost: 20, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 94 },
    sprintSpeed: { boost: 25, limit: 93 },
    agility: { boost: 30, limit: 94 },
    balance: { boost: 30, limit: 93 },
    ballControl: { boost: 30, limit: 95 },
    dribbling: { boost: 30, limit: 94 },
    reactions: { boost: 30, limit: 93 },
    composure: { boost: 30, limit: 93 },
    crossing: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 96 },
    shortPass: { boost: 30, limit: 96 },
    freekick: { boost: 30, limit: 95 },
    vision: { boost: 30, limit: 95 },
    finishing: { boost: 15, limit: 94 },
    positioning: { boost: 15, limit: 95 },
    shotPower: { boost: 15, limit: 92 }
  },
  skillMovesBoost: 4,
  positionsAdded: ['RW'],
  playStylesAdded: {
    gold: ['Technical', 'Finesse Shot', 'Incisive Pass', 'Rapid'],
    silver: ['Tiki Taka', 'Pinged Pass', 'Inventive']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (95)', 'Acceleration +25 (94)', 'Finishing +15 (94)',
        'Att. Position +15 (95)', 'Skill Moves +4 (5)', 'Position: RW'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +30 (94)', 'Shot Power +15 (92)', 'Sprint Speed +25 (93)',
        'Vision +30 (95)', 'Composure +30 (93)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +30 (95)', 'Crossing +30 (94)', 'Short Pass +30 (96)',
        'FK Acc. +30 (95)', 'PlayStyle+: Technical (4)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +30 (94)', 'Balance +30 (93)', 'Curve +30 (95)', 'Long Pass +30 (96)',
        'PlayStyle+: Incisive Pass (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Reactions +30 (93)', 'PlayStyle+: Rapid (4)', 'PlayStyle: Inventive (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
