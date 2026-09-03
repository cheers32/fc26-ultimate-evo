import { EvolutionDefinition } from '../../types/player';

export const laMasiaSpark1118: EvolutionDefinition = {
  id: '1118',
  name: 'La Masia Spark',
  futbinLink: 'https://www.futbin.com/26/evolutions/1118/la-masia-spark',
  version: 'FC 26',
  description: 'Ignite La Masia magic with electric dribbling, sharp creativity, and fearless wing play, turning a rising talent into a dazzling wide threat ready to shine on the biggest stage.',
  descriptionZh: "点燃拉玛西亚的魔力：电光石火的盘带、锐利的创造力和无畏的边路发挥，把新星变成耀眼的边路威胁。｜适合：RM/RW 专用，+30 OVR。",
  cost: '750 Tokens / 250,000 Coins',
  defaultDisabled: true,
  requirements: {
    maxOvr: 94,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['RM', 'RW']
  },
  ovrBoost: { boost: 30, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 95 },
    sprintSpeed: { boost: 30, limit: 95 },
    jumping: { boost: 20, limit: 90 },
    stamina: { boost: 20, limit: 92 },
    agility: { boost: 40, limit: 94 },
    balance: { boost: 40, limit: 93 },
    ballControl: { boost: 40, limit: 94 },
    dribbling: { boost: 40, limit: 94 },
    reactions: { boost: 40, limit: 94 },
    composure: { boost: 40, limit: 93 },
    crossing: { boost: 30, limit: 97 },
    curve: { boost: 30, limit: 96 },
    longPass: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 95 },
    freekick: { boost: 30, limit: 94 },
    vision: { boost: 30, limit: 96 },
    finishing: { boost: 40, limit: 93 },
    longShots: { boost: 40, limit: 97 },
    penalties: { boost: 30, limit: 90 },
    positioning: { boost: 40, limit: 96 },
    shotPower: { boost: 40, limit: 92 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Technical', 'Rapid', 'Inventive'],
    silver: ['Low Driven Shot', 'Incisive Pass', 'Trickster']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (96)', 'Jumping +20 (90)', 'Short Pass +30 (95)', 'Stamina +20 (92)',
        'Vision +30 (96)', 'Weak Foot +4 (5)', 'Skill Moves +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +40 (94)', 'Curve +30 (96)', 'Dribbling +40 (94)', 'Long Pass +30 (95)',
        'FK Acc. +30 (94)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Acceleration +30 (95)', 'Finishing +40 (93)', 'Penalties +30 (90)',
        'Composure +40 (93)', 'PlayStyle+: Technical (4)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Balance +40 (93)', 'Long Shots +40 (97)', 'Att. Position +40 (96)',
        'Sprint Speed +30 (95)', 'PlayStyle+: Rapid (4)', 'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball Control +40 (94)', 'Crossing +30 (97)', 'Reactions +40 (94)',
        'Shot Power +40 (92)', 'PlayStyle+: Inventive (4)', 'PlayStyle: Trickster (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
