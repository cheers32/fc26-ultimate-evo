import { EvolutionDefinition } from '../../types/player';

export const eliteMidfielder1159: EvolutionDefinition = {
  id: '1159',
  name: 'Elite Midfielder',
  futbinLink: 'https://www.futbin.com/26/evolutions/1159/elite-midfielder',
  version: 'FC 26',
  description: 'Transform your CDM into an elite dominant force with massive boosts across 5 levels.',
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CDM'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  faceBoosts: {
    pac: { boost: 30, limit: 92 },
    sho: { boost: 25, limit: 90 },
    phy: { boost: 30, limit: 95 }
  },
  subStatBoosts: {
    vision: { boost: 30, limit: 97 },
    crossing: { boost: 25, limit: 95 },
    freekick: { boost: 25, limit: 96 },
    shortPass: { boost: 30, limit: 98 },
    longPass: { boost: 30, limit: 98 },
    curve: { boost: 25, limit: 95 },
    agility: { boost: 25, limit: 95 },
    balance: { boost: 30, limit: 96 },
    reactions: { boost: 25, limit: 96 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 98 },
    interceptions: { boost: 30, limit: 97 },
    headingAcc: { boost: 25, limit: 92 },
    defAwareness: { boost: 30, limit: 97 },
    standTackle: { boost: 30, limit: 96 },
    slideTackle: { boost: 25, limit: 93 }
  },
  playStylesAdded: {
    gold: ['Intercept+', 'Pinged Pass+', 'Tiki Taka+', 'Anticipate+'],
    silver: ['Incisive Pass', 'Technical', 'Quick Step', 'Bruiser']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Stand Tackle +30 (96)', 'Reactions +25 (96)', 'Def. Aware +30 (97)', 'Pace Face +30 (92)', 'OVR +10 (97)',
        'PlayStyle+: Intercept (4)', 'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Short Pass +30 (98)', 'FK Acc. +25 (96)', 'Composure +30 (98)', 'Physical Face +30 (95)', 'Crossing +25 (95)', 'OVR +10 (97)',
        'PlayStyle+: Tiki Taka (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Slide Tackle +25 (93)', 'Shooting Face +25 (90)', 'Balance +30 (96)', 'Heading Acc. +25 (92)', 'Agility +25 (95)', 'OVR +10 (97)',
        'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Interceptions +30 (97)', 'Long Pass +30 (98)',
        'Weak Foot +4 (5)', 'Skill Moves +3 (4)',
        'PlayStyle: Incisive Pass (7)', 'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Dribbling +30 (97)', 'Vision +30 (97)', 'Curve +25 (95)', 'Ball Control +30 (97)',
        'PlayStyle: Quick Step (7)', 'PlayStyle: Bruiser (7)'
      ]
    }
  ]
};
