import { EvolutionDefinition } from '../../types/player';

export const windUpMerchant1184: EvolutionDefinition = {
  id: '1184',
  name: 'Wind-Up Merchant',
  futbinLink: 'https://www.futbin.com/26/evolutions/1184/wind-up-merchant',
  version: 'FC 26',
  description: "Transform into an elite dark-arts CDM built to stop counter-attacks, master the tactical foul, and live rent-free in your opponent's head. Peak housery.",
  descriptionZh: "【准入】CDM 专用，OVR ≤96，PS+ ≤4。【收益】OVR +30（顶 97）；速度线 2 项（最高 +30）、射门线 2 项（最高 +30）、传球线 3 项（最高 +30）、盘带线 6 项（最高 +30）、防守线 5 项（最高 +40）、身体线 4 项（最高 +40）；弱脚 +4；PlayStyle+ 4 个（Intercept+、Bruiser+、Incisive Pass+、Pinged Pass+）；PlayStyle 2 个（Tiki Taka、Anticipate）；稀有度改为 Futties。【其他】5 级 · 600 FUTTIES Tokens / 175,000 Coins。",
  cost: '600 FUTTIES Tokens / 175,000 Coins',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CDM']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 92 },
    aggression: { boost: 40, limit: 99 },
    agility: { boost: 30, limit: 95 },
    balance: { boost: 30, limit: 94 },
    ballControl: { boost: 30, limit: 94 },
    dribbling: { boost: 30, limit: 95 },
    headingAcc: { boost: 30, limit: 94 },
    interceptions: { boost: 30, limit: 96 },
    jumping: { boost: 30, limit: 96 },
    longPass: { boost: 30, limit: 96 },
    longShots: { boost: 30, limit: 94 },
    defAwareness: { boost: 30, limit: 95 },
    reactions: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 97 },
    shotPower: { boost: 30, limit: 94 },
    slideTackle: { boost: 40, limit: 96 },
    sprintSpeed: { boost: 30, limit: 92 },
    standTackle: { boost: 40, limit: 99 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 40, limit: 99 },
    vision: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 95 }
  },
  weakFootBoost: 4,
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: ['Intercept+', 'Bruiser+', 'Incisive Pass+', 'Pinged Pass+'],
    silver: ['Tiki Taka', 'Anticipate']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Reactions +30 (95)', 'Short Pass +30 (97)', 'Stand Tackle +40', 'Stamina +30 (96)',
        'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +30 (94)', 'Heading Acc. +30 (94)', 'Long Shots +30 (94)', 'Strength +40', 'Vision +30 (97)',
        'PlayStyle+: Bruiser (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Acceleration +30 (92)', 'Aggression +40', 'Dribbling +30 (95)', 'Long Pass +30 (96)', 'Def. Aware +30 (95)',
        'PlayStyle+: Incisive Pass (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +30 (95)', 'Shot Power +30 (94)', 'Slide Tackle +40 (96)', 'Composure +30 (95)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +30 (94)', 'Interceptions +30 (96)', 'Jumping +30 (96)', 'Sprint Speed +30 (92)', 'Weak Foot +4 (5)',
        'PlayStyle: Anticipate (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
