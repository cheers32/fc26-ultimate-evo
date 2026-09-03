import { EvolutionDefinition } from '../../types/player';

export const thePerfect10_1120: EvolutionDefinition = {
  id: '1120',
  name: 'The Perfect 10',
  futbinLink: 'https://www.futbin.com/26/evolutions/1120/the-perfect-10',
  version: 'FC 26',
  description: 'Transform into a true playmaker who controls the tempo and delivers in the decisive moments. Become crafted for flawless control, pure class and footballing perfection.',
  descriptionZh: "变成真正的组织者，掌控节奏并在决定性时刻交出答案。为完美的控制、纯粹的格调和足球意义上的完美而打造。｜适合：CAM 专用，+50 OVR，六线全加，前腰的顶级改造。",
  cost: '1000 FUTTIES Tokens',
  requirements: {
    maxOvr: 95,
    maxPlayStylesPlus: 4,
    notRarity: 'World Tour Silver Stars',
    positions: ['CAM']
  },
  ovrBoost: { boost: 50, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 40, limit: 92 },
    sprintSpeed: { boost: 40, limit: 92 },
    aggression: { boost: 50, limit: 90 },
    jumping: { boost: 50, limit: 90 },
    stamina: { boost: 50, limit: 92 },
    strength: { boost: 50, limit: 90 },
    agility: { boost: 50, limit: 95 },
    balance: { boost: 50, limit: 94 },
    ballControl: { boost: 50, limit: 97 },
    dribbling: { boost: 50, limit: 98 },
    reactions: { boost: 50, limit: 94 },
    composure: { boost: 50, limit: 94 },
    crossing: { boost: 50, limit: 94 },
    curve: { boost: 50, limit: 95 },
    longPass: { boost: 50, limit: 97 },
    shortPass: { boost: 50, limit: 98 },
    freekick: { boost: 50, limit: 94 },
    vision: { boost: 50, limit: 96 },
    finishing: { boost: 50, limit: 95 },
    headingAcc: { boost: 50, limit: 88 },
    longShots: { boost: 50, limit: 96 },
    penalties: { boost: 50, limit: 92 },
    positioning: { boost: 50, limit: 96 },
    shotPower: { boost: 50, limit: 95 },
    volleys: { boost: 50, limit: 92 }
  },
  skillMovesBoost: 4,
  rarityChange: 'National Pride',
  playStylesAdded: {
    gold: ['Incisive Pass', 'Finesse Shot', 'Technical', 'First Touch'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (98)', 'Ball Control +50 (97)', 'Dribbling +50 (98)',
        'Att. Position +50 (96)', 'Vision +50 (96)', 'Skill Moves +4 (5)',
        'PlayStyle+: Incisive Pass (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +40 (92)', 'Agility +50 (95)', 'Finishing +50 (95)',
        'Short Pass +50 (98)', 'Strength +50 (90)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +50 (94)', 'Long Pass +50 (97)', 'Shot Power +50 (95)',
        'Sprint Speed +40 (92)', 'Stamina +50 (92)', 'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Jumping +50 (90)', 'Long Shots +50 (96)', 'Reactions +50 (94)',
        'FK Acc. +50 (94)', 'Volleys +50 (92)', 'PlayStyle+: First Touch (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Aggression +50 (90)', 'Crossing +50 (94)', 'Curve +50 (95)',
        'Heading Acc. +50 (88)', 'Penalties +50 (92)', 'Composure +50 (94)'
      ]
    }
  ],
  maxRepeatable: 1
};
