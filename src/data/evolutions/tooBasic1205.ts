import { EvolutionDefinition } from '../../types/player';

export const tooBasic1205: EvolutionDefinition = {
  id: '1205',
  name: 'Too Basic',
  futbinLink: 'https://www.futbin.com/26/evolutions/1205/too-basic',
  version: 'FC 26',
  description: 'Found in the FUTTIES Token Store.',
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5
  },
  ovrBoost: { boost: 5, limit: 97 },
  subStatBoosts: {
    sprintSpeed: { boost: 15, limit: 96 },
    strength: { boost: 15, limit: 96 },
    agility: { boost: 15, limit: 96 },
    ballControl: { boost: 15, limit: 96 },
    dribbling: { boost: 15, limit: 96 },
    composure: { boost: 15, limit: 96 },
    curve: { boost: 15, limit: 96 },
    longPass: { boost: 15, limit: 96 },
    shortPass: { boost: 15, limit: 96 },
    vision: { boost: 15, limit: 96 },
    penalties: { boost: 15, limit: 96 },
    positioning: { boost: 15, limit: 96 },
    shotPower: { boost: 15, limit: 96 },
    defAwareness: { boost: 15, limit: 96 },
    slideTackle: { boost: 15, limit: 96 },
    standTackle: { boost: 15, limit: 96 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5 (97)', 'Agility +15 (96)', 'Att. Position +15 (96)',
        'Short Pass +15 (96)', 'Slide Tackle +15 (96)', 'Strength +15 (96)',
        'Composure +15 (96)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +15 (96)', 'Long Pass +15 (96)', 'Def. Aware +15 (96)',
        'Shot Power +15 (96)', 'Sprint Speed +15 (96)', 'Weak Foot +4'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +15 (96)', 'Dribbling +15 (96)', 'Penalties +15 (96)',
        'Stand Tackle +15 (96)', 'Vision +15 (96)', 'Skill Moves +4'
      ]
    }
  ],
  maxRepeatable: 1
};
