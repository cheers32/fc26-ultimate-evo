import { EvolutionDefinition } from '../../types/player';

export const floorRaiser1182: EvolutionDefinition = {
  id: '1182',
  name: 'Floor Raiser',
  futbinLink: 'https://www.futbin.com/26/evolutions/1182/floor-raiser',
  version: 'FC 26',
  description: 'True quality has no off switch. Evolve your player and develop the complete game that makes them truly elite.',
  descriptionZh: "真正的质量没有开关。培养出让球员真正跻身精英的完整能力。｜适合：非门将，多条线小幅补齐。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 95 },
  faceBoosts: {
    pac: { boost: 2, limit: 95 }
  },
  subStatBoosts: {
    agility: { boost: 2, limit: 95 },
    ballControl: { boost: 2, limit: 96 },
    dribbling: { boost: 2, limit: 96 },
    finishing: { boost: 3, limit: 96 },
    jumping: { boost: 20, limit: 99 },
    positioning: { boost: 3, limit: 96 },
    reactions: { boost: 3, limit: 95 },
    shortPass: { boost: 20, limit: 99 },
    shotPower: { boost: 3, limit: 96 },
    stamina: { boost: 3, limit: 96 },
    composure: { boost: 3, limit: 96 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Low Driven Shot+'],
    silver: ['Quick Step', 'Finesse Shot', 'Technical']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Pace Face +2 (95)', 'Finishing +3 (96)', 'Att. Position +3 (96)', 'Shot Power +3 (96)',
        'PlayStyle+: Low Driven Shot (4)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +2 (95)', 'Ball Control +2 (96)', 'Reactions +3 (95)', 'Short Pass +20', 'Skill Moves +4 (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Dribbling +2 (96)', 'Jumping +20', 'Stamina +3 (96)', 'Composure +3 (96)',
        'PlayStyle: Finesse Shot (7)', 'PlayStyle: Technical (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
