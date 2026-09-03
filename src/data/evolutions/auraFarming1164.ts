import { EvolutionDefinition } from '../../types/player';

export const auraFarming1164: EvolutionDefinition = {
  id: '1164',
  name: 'Aura Farming',
  futbinLink: 'https://www.futbin.com/26/evolutions/1164/aura-farming',
  version: 'FC 26',
  description: 'Defending by vibes alone. Dropping into a delayed stance, backing off, and letting your reputation do the pressing.',
  descriptionZh: "纯靠气场防守：延迟站位、后退、让名气替你压迫。｜适合：CB 专用，+50 OVR，改造幅度极大。",
  cost: 'SBC Set Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    positions: ['CB']
  },
  ovrBoost: { boost: 50, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 94 },
    aggression: { boost: 50, limit: 94 },
    agility: { boost: 55, limit: 88 },
    balance: { boost: 55, limit: 87 },
    ballControl: { boost: 50, limit: 85 },
    dribbling: { boost: 50, limit: 85 },
    headingAcc: { boost: 50, limit: 96 },
    interceptions: { boost: 50, limit: 95 },
    jumping: { boost: 50, limit: 94 },
    longPass: { boost: 50, limit: 90 },
    defAwareness: { boost: 50, limit: 97 },
    reactions: { boost: 55, limit: 95 },
    shortPass: { boost: 50, limit: 94 },
    slideTackle: { boost: 50, limit: 97 },
    sprintSpeed: { boost: 50, limit: 93 },
    standTackle: { boost: 50, limit: 96 },
    stamina: { boost: 50, limit: 94 },
    strength: { boost: 50, limit: 96 },
    vision: { boost: 50, limit: 90 },
    composure: { boost: 50, limit: 94 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Intercept+', 'Anticipate+', 'Bruiser+'],
    silver: ['Pinged Pass', 'Quick Step', 'Block']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (97)', 'Agility +55 (88)', 'Balance +55 (87)', 'Long Pass +50 (90)', 'Short Pass +50 (94)', 'Sprint Speed +50 (93)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +50 (94)', 'Aggression +50 (94)', 'Strength +50 (96)', 'Vision +50 (90)', 'Weak Foot +4 (5)',
        'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +50 (85)', 'Dribbling +50 (85)', 'Reactions +55 (95)', 'Skill Moves +4 (5)',
        'PlayStyle+: Anticipate (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Heading Acc. +50 (96)', 'Interceptions +50 (95)', 'Def. Aware +50 (97)', 'Stand Tackle +50 (96)', 'Composure +50 (94)',
        'PlayStyle+: Bruiser (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Jumping +50 (94)', 'Slide Tackle +50 (97)', 'Stamina +50 (94)',
        'PlayStyle: Quick Step (7)', 'PlayStyle: Block (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
