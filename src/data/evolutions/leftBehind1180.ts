import { EvolutionDefinition } from '../../types/player';

export const leftBehind1180: EvolutionDefinition = {
  id: '1180',
  name: 'Left behind',
  futbinLink: 'https://www.futbin.com/26/evolutions/1180/left-behind',
  version: 'FC 26',
  description: 'The best left backs always had midfielder written all over them. Evolve your player and make the move into central midfield',
  cost: '250 FC Points / 50,000 Coins',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    agility: { boost: 30, limit: 97 },
    balance: { boost: 30, limit: 97 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 30, limit: 95 },
    interceptions: { boost: 30, limit: 95 },
    positioning: { boost: 30, limit: 95 },
    vision: { boost: 30, limit: 95 },
    ballControl: { boost: 30, limit: 97 },
    crossing: { boost: 30, limit: 95 },
    dribbling: { boost: 30, limit: 96 },
    finishing: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 96 },
    defAwareness: { boost: 30, limit: 95 },
    shotPower: { boost: 30, limit: 95 },
    standTackle: { boost: 30, limit: 95 },
    slideTackle: { boost: 30, limit: 95 },
    curve: { boost: 30, limit: 95 }
  },
  positionsAdded: ['CM'],
  playStylesAdded: {
    gold: ['Incisive Pass+', 'Pinged Pass+', 'Technical+'],
    silver: ['Intercept', 'Tiki Taka', 'First Touch']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  weakFootBoost: 4,
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Att. Position +30 (95)', 'Finishing +30 (95)', 'Shot Power +30 (95)',
        'Position CM', 'PlayStyle+: Incisive Pass (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Vision +30 (95)', 'Crossing +30 (95)', 'Short Pass +30 (96)',
        'PlayStyle: Intercept (7)', 'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Pass +30 (95)', 'Curve +30 (95)', 'Agility +30 (97)',
        'Weak Foot +4 (5)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Balance +30 (97)', 'Reactions +30 (95)', 'Ball Control +30 (97)',
        'Dribbling +30 (96)', 'Composure +30 (95)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Interceptions +30 (95)', 'Def. Aware +30 (95)', 'Stand Tackle +30 (95)', 'Slide Tackle +30 (95)',
        'PlayStyle: First Touch (7)', 'PlayStyle+: Technical (4)'
      ]
    }
  ]
};
