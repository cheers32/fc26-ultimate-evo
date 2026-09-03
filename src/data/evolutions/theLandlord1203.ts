import { EvolutionDefinition } from '../../types/player';

export const theLandlord1203: EvolutionDefinition = {
  id: '1203',
  name: 'The Landlord',
  futbinLink: 'https://www.futbin.com/26/evolutions/1203/the-landlord',
  version: 'FC 26',
  description: 'Own the backline, collect every loose ball and make attackers pay rent for entering your space. Five PlayStyle+ upgrades turn your centre-back into the true landlord of the pitch.',
  descriptionZh: "【准入】CB 专用，OVR ≤95，PS+ ≤4。【收益】OVR +15（顶 96）；速度线 2 项（最高 +15）、传球线 4 项（最高 +30）、盘带线 3 项（最高 +30）、防守线 5 项（最高 +25）、身体线 4 项（最高 +30）；弱脚 +4；花式 +4；PlayStyle+ 5 个（Bruiser、Pinged Pass、Block、Anticipate、Relentless）；PlayStyle 4 个（Aerial Fortress、Intercept、Slide Tackle、Jockey）；稀有度改为 Futties。【其他】5 级 · 500 FC Points / 250,000 Coins。",
  cost: '500 FC Points / 250,000 Coins',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CB']
  },
  // Level 5 turns the card Futties — the preview card art changes to 16_futties, which is the
  // picker rarity rather than 119_futties_evo. So this evo does not only fill the gold slots, it
  // hands over the picker for whatever it leaves empty.
  rarityChange: 'Futties',
  ovrBoost: { boost: 15, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 15, limit: 94 },
    sprintSpeed: { boost: 15, limit: 94 },
    aggression: { boost: 30, limit: 95 },
    jumping: { boost: 30, limit: 95 },
    stamina: { boost: 30, limit: 97 },
    strength: { boost: 30, limit: 94 },
    agility: { boost: 30, limit: 90 },
    reactions: { boost: 25, limit: 94 },
    composure: { boost: 25, limit: 93 },
    crossing: { boost: 30, limit: 94 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 20, limit: 95 },
    vision: { boost: 30, limit: 94 },
    headingAcc: { boost: 25, limit: 96 },
    interceptions: { boost: 25, limit: 96 },
    defAwareness: { boost: 25, limit: 98 },
    slideTackle: { boost: 25, limit: 97 },
    standTackle: { boost: 25, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Bruiser', 'Pinged Pass', 'Block', 'Anticipate', 'Relentless'],
    silver: ['Aerial Fortress', 'Intercept', 'Slide Tackle', 'Jockey']
  },
  playStylesLimit: {
    gold: 5,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (96)', 'Acceleration +15 (94)', 'Crossing +30 (94)',
        'Short Pass +20 (95)', 'Sprint Speed +15 (94)', 'PlayStyle+: Bruiser (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Jumping +30 (95)', 'Long Pass +30 (95)', 'Slide Tackle +25 (97)',
        'Stand Tackle +25 (97)', 'PlayStyle+: Pinged Pass (5)',
        'PlayStyle: Aerial Fortress (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Heading Acc. +25 (96)', 'Interceptions +25 (96)', 'Def. Aware +25 (98)',
        'Skill Moves +4', 'PlayStyle+: Block (5)', 'PlayStyle: Intercept (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +30 (90)', 'Reactions +25 (94)', 'Vision +30 (94)',
        'Composure +25 (93)', 'PlayStyle+: Anticipate (5)', 'PlayStyle: Slide Tackle (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Aggression +30 (95)', 'Stamina +30 (97)', 'Strength +30 (94)',
        'Weak Foot +4', 'PlayStyle+: Relentless (5)', 'PlayStyle: Jockey (7)', '→ Futties'
      ]
    }
  ],
  maxRepeatable: 1
};
