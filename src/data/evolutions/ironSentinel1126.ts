import { EvolutionDefinition } from '../../types/player';

export const ironSentinel1126: EvolutionDefinition = {
  id: '1126',
  name: 'Iron Sentinel',
  futbinLink: 'https://www.futbin.com/26/evolutions/1126/iron-sentinel',
  version: 'FC 26',
  description: 'Forge a midfield enforcer with elite tackling, strength, stamina, and composure. The Iron Sentinel shuts down attacks and controls the game from deep.',
  descriptionZh: "锻造一名中场执行者：精英级抢断、力量、体能和从容。铁闸能掐断进攻，并从后场掌控比赛。｜适合：CDM 专用，+25 OVR。",
  cost: '400 Tokens / 75,000 Coins',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CDM']
  },
  ovrBoost: { boost: 25, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 90 },
    sprintSpeed: { boost: 25, limit: 90 },
    aggression: { boost: 40, limit: 94 },
    jumping: { boost: 40, limit: 90 },
    stamina: { boost: 40, limit: 95 },
    strength: { boost: 40, limit: 90 },
    agility: { boost: 30, limit: 93 },
    balance: { boost: 30, limit: 90 },
    ballControl: { boost: 20, limit: 93 },
    dribbling: { boost: 20, limit: 92 },
    reactions: { boost: 30, limit: 94 },
    composure: { boost: 30, limit: 94 },
    crossing: { boost: 25, limit: 84 },
    curve: { boost: 25, limit: 90 },
    longPass: { boost: 25, limit: 95 },
    shortPass: { boost: 25, limit: 94 },
    vision: { boost: 25, limit: 91 },
    headingAcc: { boost: 40, limit: 93 },
    interceptions: { boost: 40, limit: 97 },
    defAwareness: { boost: 40, limit: 96 },
    slideTackle: { boost: 40, limit: 96 },
    standTackle: { boost: 40, limit: 95 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Intercept', 'Pinged Pass', 'Bruiser', 'Tiki Taka'],
    silver: ['Incisive Pass', 'Block', 'Long Ball Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +25 (96)', 'Acceleration +25 (90)', 'Agility +30 (93)', 'Balance +30 (90)',
        'Sprint Speed +25 (90)', 'Composure +30 (94)', 'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +25 (84)', 'Short Pass +25 (94)', 'Vision +25 (91)', 'Weak Foot +4 (5)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +25 (90)', 'Heading Acc. +40 (93)', 'Interceptions +40 (97)',
        'Long Pass +25 (95)', 'Def. Aware +40 (96)', 'PlayStyle: Block (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +20 (93)', 'Dribbling +20 (92)', 'Reactions +30 (94)',
        'Slide Tackle +40 (96)', 'Stand Tackle +40 (95)', 'PlayStyle+: Bruiser (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Aggression +40 (94)', 'Jumping +40 (90)', 'Stamina +40 (95)', 'Strength +40 (90)',
        'PlayStyle+: Tiki Taka (4)', 'PlayStyle: Long Ball Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
