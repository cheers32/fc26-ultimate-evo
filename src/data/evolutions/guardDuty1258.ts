import { EvolutionDefinition } from '../../types/player';

/**
 * One of the handful of evos that takes a card past four PlayStyle+ — and the only one so far that
 * does it while being a defensive upgrade for a midfielder rather than a centre-back evo.
 */
export const guardDuty1258: EvolutionDefinition = {
  id: '1258',
  name: 'Guard Duty',
  futbinLink: 'https://www.futbin.com/26/evolutions/1258/guard-duty',
  version: 'FC 26',
  description: 'Found in the Upgrades section of SBCs.',
  descriptionZh: "来自 SBC 的 Upgrades 板块。｜适合：任何位置，防守身体线为主。",
  cost: 'SBC Set Reward',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 7, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 10, limit: 96 },
    sprintSpeed: { boost: 10, limit: 96 },
    agility: { boost: 8, limit: 97 },
    balance: { boost: 8, limit: 94 },
    reactions: { boost: 8, limit: 95 },
    composure: { boost: 15, limit: 96 },
    shortPass: { boost: 10, limit: 94 },
    longPass: { boost: 10, limit: 95 },
    headingAcc: { boost: 12, limit: 98 },
    interceptions: { boost: 12, limit: 98 },
    defAwareness: { boost: 12, limit: 98 },
    slideTackle: { boost: 12, limit: 97 },
    // FUTBIN prints no cap for Stand Tackle on this one, on the summary or on level 3.
    standTackle: { boost: 12, limit: 99 },
    jumping: { boost: 8, limit: 96 },
    stamina: { boost: 8, limit: 97 },
    strength: { boost: 8, limit: 97 },
    aggression: { boost: 8, limit: 98 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Intercept', 'Aerial Fortress', 'Jockey'],
    silver: ['Bruiser', 'Anticipate', 'Pinged Pass']
  },
  playStylesLimit: {
    gold: 5,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +7 (98)', 'Acceleration +10 (96)', 'Sprint Speed +10 (96)',
        'Heading Acc. +12 (98)', 'Interceptions +12 (98)', 'Def. Aware +12 (98)',
        'PlayStyle+: Intercept (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Jumping +8 (96)', 'Long Pass +10 (95)', 'Stamina +8 (97)', 'Strength +8 (97)',
        'Weak Foot +4', 'PlayStyle: Bruiser (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +8 (98)', 'Short Pass +10 (94)', 'Slide Tackle +12 (97)', 'Stand Tackle +12',
        'PlayStyle+: Aerial Fortress (5)', 'PlayStyle: Anticipate (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +8 (97)', 'Balance +8 (94)', 'Reactions +8 (95)', 'Composure +15 (96)',
        'PlayStyle+: Jockey (5)', 'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
