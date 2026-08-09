import { EvolutionDefinition } from '../../types/player';

export const fullbackForce1216: EvolutionDefinition = {
  id: '1216',
  name: 'Fullback Force',
  futbinLink: 'https://www.futbin.com/26/evolutions/1216/fullback-force',
  version: 'FC 26',
  description: 'Secure the sidelines with lockdown defense and physical strength. Outlast opponents and shield your team to victory.',
  cost: '225 Tokens / 175,000 Coins',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['RB'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 96 },
    sprintSpeed: { boost: 30, limit: 96 },
    aggression: { boost: 35, limit: 97 },
    stamina: { boost: 35, limit: 92 },
    strength: { boost: 35, limit: 97 },
    agility: { boost: 30, limit: 90 },
    balance: { boost: 30, limit: 92 },
    reactions: { boost: 30, limit: 95 },
    composure: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 97 },
    freekick: { boost: 30, limit: 90 },
    vision: { boost: 30, limit: 90 },
    longShots: { boost: 50, limit: 95 },
    shotPower: { boost: 50, limit: 96 },
    interceptions: { boost: 35, limit: 97 },
    defAwareness: { boost: 35, limit: 94 },
    slideTackle: { boost: 35, limit: 96 },
    standTackle: { boost: 35, limit: 98 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Bruiser', 'Pinged Pass', 'Quick Step'],
    silver: ['Rapid', 'Intercept', 'Power Shot']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Agility +30 (90)', 'Balance +30 (92)',
        'Reactions +30 (95)', 'Shot Power +50 (96)', 'Sprint Speed +30 (96)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +30 (96)', 'Long Pass +30 (95)', 'Composure +30 (95)',
        'Skill Moves +4', 'PlayStyle+: Bruiser (4)', 'PlayStyle: Rapid (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Shots +50 (95)', 'FK Acc. +30 (90)', 'Strength +35 (97)',
        'Vision +30 (90)', 'Weak Foot +4', 'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +35 (97)', 'Interceptions +35 (97)', 'Def. Aware +35 (94)',
        'Short Pass +30 (97)', 'PlayStyle: Intercept (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Slide Tackle +35 (96)', 'Stand Tackle +35 (98)', 'Stamina +35 (92)',
        'PlayStyle+: Quick Step (4)', 'PlayStyle: Power Shot (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
