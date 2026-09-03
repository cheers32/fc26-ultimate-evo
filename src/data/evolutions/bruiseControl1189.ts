import { EvolutionDefinition } from '../../types/player';

export const bruiseControl1189: EvolutionDefinition = {
  id: '1189',
  name: 'Bruise Control',
  futbinLink: 'https://www.futbin.com/26/evolutions/1189/bruise-control',
  version: 'FC 26',
  description: 'The ultimate backline upgrade.',
  descriptionZh: "后防线的终极升级。｜适合：任何位置，防守和身体线为主。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 3, limit: 97 },
  subStatBoosts: {
    aggression: { boost: 20, limit: 96 },
    jumping: { boost: 20, limit: 95 },
    stamina: { boost: 20, limit: 95 },
    strength: { boost: 20, limit: 96 },
    headingAcc: { boost: 20, limit: 96 },
    interceptions: { boost: 20, limit: 97 },
    defAwareness: { boost: 20, limit: 98 },
    slideTackle: { boost: 20, limit: 97 },
    standTackle: { boost: 20, limit: 97 },
    reactions: { boost: 20, limit: 97 },
    composure: { boost: 20, limit: 96 },
    shortPass: { boost: 20, limit: 96 },
    vision: { boost: 20, limit: 96 }
  },
  playStylesAdded: {
    gold: ['Anticipate', 'Intercept', 'Bruiser'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (97)', 'Jumping +20 (95)', 'Def. Aware +20 (98)', 'Reactions +20 (97)',
        'Strength +20 (96)', 'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +20 (96)', 'Interceptions +20 (97)', 'Short Pass +20 (96)',
        'Stand Tackle +20 (97)', 'Stamina +20 (95)', 'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Heading Acc. +20 (96)', 'Slide Tackle +20 (97)', 'Vision +20 (96)',
        'Composure +20 (96)', 'PlayStyle+: Bruiser (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
