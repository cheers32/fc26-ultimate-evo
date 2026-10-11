import { EvolutionDefinition } from '../../types/player';

/**
 * The caps here were re-read off a finished card. Pedri 90 run through Everything at Once → El
 * Bandido → Max Sweat lands on 96/94/93/96/97/95 Passing, 96/96/97/97/97/94 Dribbling,
 * 95/54/82/94/86 Defending and 81/99/90/81 Physical, and six of the transcribed caps could not
 * produce that: Stamina (94 → 99), Reactions (93 → 97), Long Pass (94 → 97), Vision (92 → 96),
 * Curve (94 → 95) and Agility, which was one too high (97 → 96). Stand Tackle is not on the level
 * cards at all, and his went 92 → 94, so it is added at the level the rest of that step sits on.
 */
export const maxSweat1201: EvolutionDefinition = {
  id: '1201',
  name: 'Max Sweat',
  nameZh: "极限汗水",
  futbinLink: 'https://www.futbin.com/26/evolutions/1201/max-sweat',
  version: 'FC 26',
  description: 'Found in the FUTTIES Daily Login Objective.',
  descriptionZh: "来自 FUTTIES 每日登录目标。｜适合：RW 专用，+30 OVR。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    positions: ['RW'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    stamina: { boost: 20, limit: 99 },
    strength: { boost: 20, limit: 90 },
    agility: { boost: 30, limit: 96 },
    balance: { boost: 30, limit: 96 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 97 },
    reactions: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 94 },
    crossing: { boost: 30, limit: 92 },
    curve: { boost: 30, limit: 95 },
    longPass: { boost: 30, limit: 97 },
    shortPass: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 96 },
    finishing: { boost: 30, limit: 93 },
    longShots: { boost: 30, limit: 94 },
    penalties: { boost: 20, limit: 93 },
    positioning: { boost: 30, limit: 96 },
    standTackle: { boost: 20, limit: 94 },
    shotPower: { boost: 30, limit: 94 },
    volleys: { boost: 20, limit: 93 }
  },
  weakFootBoost: 3,
  skillMovesBoost: 5,
  playStylesAdded: {
    gold: ['Quick Step', 'Rapid', 'Finesse Shot', 'Low Driven Shot'],
    silver: ['Incisive Pass', 'Technical', 'Pinged Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Balance +30 (96)', 'Curve +30 (95)', 'Sprint Speed +30 (97)',
        'Strength +20 (90)', 'Weak Foot +3 (4)', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +30 (96)', 'Dribbling +30 (97)', 'Att. Position +30 (96)',
        'Short Pass +30 (94)', 'Skill Moves +5', 'PlayStyle+: Rapid (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Acceleration +30 (97)', 'Ball Control +30 (97)', 'Finishing +30 (93)',
        'Vision +30 (96)', 'PlayStyle+: Finesse Shot (4)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Crossing +30 (92)', 'Penalties +20 (93)', 'Reactions +30 (97)',
        'Shot Power +30 (94)', 'Stamina +20 (99)', 'Stand Tackle +20 (94)', 'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Long Pass +30 (97)', 'Long Shots +30 (94)', 'Volleys +20 (93)',
        'Composure +30 (94)', 'PlayStyle: Technical (7)', 'PlayStyle: Pinged Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
