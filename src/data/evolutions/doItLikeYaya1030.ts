import { EvolutionDefinition } from '../../types/player';

export const doItLikeYaya1030: EvolutionDefinition = {
  id: '1030',
  name: 'Do it like Yaya',
  futbinLink: 'https://www.futbin.com/26/evolutions/1030/do-it-like-yaya',
  version: 'FC 26',
  description: 'Dominate the midfield the Yaya way. Power through challenges, glide past pressure with effortless control, and dictate the tempo with commanding presence.',
  descriptionZh: "用亚亚的方式统治中场：撞开对抗、在压迫中从容盘带、用统治力掌控节奏。｜适合：CM 专用，+30 OVR，六条线全加，B2B 中场的全面改造。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM']
  },
  ovrBoost: { boost: 30, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 90 },
    aggression: { boost: 25, limit: 95 },
    agility: { boost: 20, limit: 90 },
    balance: { boost: 20, limit: 90 },
    ballControl: { boost: 30, limit: 94 },
    curve: { boost: 30, limit: 92 },
    dribbling: { boost: 25, limit: 93 },
    finishing: { boost: 25, limit: 92 },
    headingAcc: { boost: 25, limit: 90 },
    interceptions: { boost: 25, limit: 92 },
    jumping: { boost: 25, limit: 92 },
    longPass: { boost: 30, limit: 94 },
    longShots: { boost: 25, limit: 95 },
    defAwareness: { boost: 25, limit: 91 },
    penalties: { boost: 25, limit: 92 },
    positioning: { boost: 25, limit: 93 },
    reactions: { boost: 30, limit: 94 },
    shortPass: { boost: 30, limit: 96 },
    freekick: { boost: 30, limit: 92 },
    shotPower: { boost: 25, limit: 94 },
    slideTackle: { boost: 25, limit: 91 },
    sprintSpeed: { boost: 20, limit: 90 },
    standTackle: { boost: 25, limit: 94 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 30, limit: 96 },
    vision: { boost: 30, limit: 96 },
    composure: { boost: 30, limit: 92 }
  },
  playStylesAdded: {
    gold: ['Incisive Pass', 'Pinged Pass'],
    silver: ['Power Shot']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (93)', 'Reactions +30 (94)', 'Short Pass +30 (96)', 'Shot Power +25 (94)', 'Stamina +30 (96)',
        'PlayStyle+: Incisive Pass (3)', 'PlayStyle+: Pinged Pass (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +20 (90)', 'Ball Control +30 (94)', 'Long Pass +30 (94)', 'Long Shots +25 (95)', 'Strength +30 (96)',
        'PlayStyle: Power Shot (8)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +25 (95)', 'Curve +30 (92)', 'Dribbling +25 (93)', 'Penalties +25 (92)', 'Sprint Speed +20 (90)', 'Stand Tackle +25 (94)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +20 (90)', 'Heading Acc. +25 (90)', 'Def. Aware +25 (91)', 'Att. Position +25 (93)', 'Vision +30 (96)', 'Composure +30 (92)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +20 (90)', 'Finishing +25 (92)', 'Interceptions +25 (92)', 'Jumping +25 (92)', 'FK Acc. +30 (92)', 'Slide Tackle +25 (91)'
      ]
    }
  ],
  maxRepeatable: 1
};
