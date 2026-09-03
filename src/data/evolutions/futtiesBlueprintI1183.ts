import { EvolutionDefinition } from '../../types/player';

export const futtiesBlueprintI1183: EvolutionDefinition = {
  id: '1183',
  name: 'FUTTIES Blueprint I',
  futbinLink: 'https://www.futbin.com/26/evolutions/1183/futties-blueprint-i',
  version: 'FC 26',
  description: 'The ultimate recipe to cook up a lethal, high-tier striker. Boost key stats to turn your midfield engine into a cold-blooded finisher.',
  descriptionZh: "打造致命高阶前锋的终极配方：提升关键属性，把你的中场引擎变成冷血终结者。｜适合：CAM 专用，+50 OVR，把中场改造成前锋。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CAM']
  },
  ovrBoost: { boost: 50, limit: 97 },
  subStatBoosts: {
    acceleration: { boost: 50, limit: 95 },
    agility: { boost: 50, limit: 96 },
    balance: { boost: 50, limit: 94 },
    ballControl: { boost: 50, limit: 95 },
    curve: { boost: 50, limit: 96 },
    dribbling: { boost: 50, limit: 94 },
    finishing: { boost: 50, limit: 96 },
    longShots: { boost: 50, limit: 95 },
    penalties: { boost: 50, limit: 96 },
    positioning: { boost: 50, limit: 96 },
    reactions: { boost: 50, limit: 96 },
    shotPower: { boost: 50, limit: 96 },
    sprintSpeed: { boost: 50, limit: 96 },
    volleys: { boost: 50, limit: 95 },
    composure: { boost: 50, limit: 96 }
  },
  weakFootBoost: 4,
  positionsAdded: ['ST'],
  rarityChange: 'Futties Evo',
  playStylesAdded: {
    gold: ['Finesse Shot+', 'Low Driven Shot+', 'Rapid+'],
    silver: ['Incisive Pass', 'Quick Step', 'Gamechanger', 'Technical', 'Tiki Taka']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +50 (97)', 'Acceleration +50 (95)', 'Sprint Speed +50 (96)', 'Composure +50 (96)', 'Weak Foot +4 (5)', 'Position ST'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Long Shots +50 (95)', 'Penalties +50 (96)', 'Att. Position +50 (96)', 'Volleys +50 (95)',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +50 (95)', 'Dribbling +50 (94)', 'Finishing +50 (96)', 'Reactions +50 (96)', 'Shot Power +50 (96)',
        'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Curve +50 (96)',
        'PlayStyle+: Rapid (4)', 'PlayStyle: Quick Step (7)', 'PlayStyle: Gamechanger (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Agility +50 (96)', 'Balance +50 (94)',
        'PlayStyle: Technical (7)', 'PlayStyle: Tiki Taka (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
