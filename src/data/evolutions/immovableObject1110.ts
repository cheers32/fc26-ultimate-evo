import { EvolutionDefinition } from '../../types/player';

export const immovableObject1110: EvolutionDefinition = {
  id: '1110',
  name: 'Immovable Object',
  futbinLink: 'https://www.futbin.com/26/evolutions/1110/immovable-object',
  version: 'FC 26',
  description: 'Give your player the strength to hold the line. Improve defensive positioning, elevate physical presence, and bring composure to every challenge.',
  cost: 'Season 9 Level 1 Reward',
  requirements: {
    maxOvr: 93,
    maxPlayStyles: 10,
    notRarity: 'World Tour Silver Stars'
  },
  maxRepeatable: 3,
  ovrBoost: { boost: 3, limit: 96 },
  subStatBoosts: {
    acceleration: { boost: 5, limit: 95 },
    sprintSpeed: { boost: 5, limit: 95 },
    agility: { boost: 5, limit: 94 },
    balance: { boost: 5, limit: 91 },
    reactions: { boost: 5, limit: 97 },
    composure: { boost: 5, limit: 97 },
    shortPass: { boost: 5, limit: 95 },
    // 96 rather than the 95 first recorded: a van Dijk built with Leopard's Roar into this reads
    // 96 long pass in game, and every other stat of that card matches to the point.
    longPass: { boost: 5, limit: 96 },
    interceptions: { boost: 6, limit: 96 },
    headingAcc: { boost: 6, limit: 97 },
    defAwareness: { boost: 6, limit: 95 },
    standTackle: { boost: 6, limit: 97 },
    slideTackle: { boost: 6, limit: 96 },
    jumping: { boost: 3, limit: 96 },
    stamina: { boost: 3, limit: 96 },
    strength: { boost: 3, limit: 98 },
    aggression: { boost: 3, limit: 96 }
  },
  playStylesAdded: {
    gold: [],
    silver: ['Intercept', 'Bruiser', 'Anticipate', 'Aerial Fortress', 'Long Ball Pass']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (96)',
        'Acceleration +5 (95)', 'Sprint Speed +5 (95)',
        'Heading Acc. +6 (97)', 'Def. Aware +6 (95)', 'Stand Tackle +6 (97)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +3 (96)', 'Agility +5 (94)', 'Long Pass +5 (95)', 'Short Pass +5 (95)', 'Strength +3 (98)',
        'PlayStyle: Intercept (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +5 (91)', 'Reactions +5 (97)', 'Stamina +3 (96)', 'Composure +5 (97)',
        'PlayStyle: Bruiser (7)', 'PlayStyle: Anticipate (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Interceptions +6 (96)', 'Jumping +3 (96)', 'Slide Tackle +6 (96)',
        'PlayStyle: Aerial Fortress (7)', 'PlayStyle: Long Ball Pass (7)'
      ]
    }
  ]
};
