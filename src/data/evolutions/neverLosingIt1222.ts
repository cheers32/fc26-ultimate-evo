import { EvolutionDefinition } from '../../types/player';

export const neverLosingIt1222: EvolutionDefinition = {
  id: '1222',
  name: 'Never Losing It',
  futbinLink: 'https://www.futbin.com/26/evolutions/1222/never-losing-it',
  version: 'FC 26',
  description: 'Found in the Gauntlet.',
  descriptionZh: "来自 Gauntlet。｜适合：CM 专用，+30 OVR。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CM']
  },
  ovrBoost: { boost: 30, limit: 97 },
  subStatBoosts: {
    aggression: { boost: 30, limit: 95 },
    agility: { boost: 40, limit: 96 },
    balance: { boost: 40, limit: 94 },
    ballControl: { boost: 40, limit: 96 },
    curve: { boost: 30, limit: 95 },
    dribbling: { boost: 30, limit: 95 },
    interceptions: { boost: 30, limit: 95 },
    longShots: { boost: 30, limit: 95 },
    defAwareness: { boost: 30, limit: 95 },
    reactions: { boost: 30, limit: 95 },
    shortPass: { boost: 30, limit: 96 },
    slideTackle: { boost: 30, limit: 94 },
    standTackle: { boost: 30, limit: 95 },
    stamina: { boost: 30, limit: 95 },
    strength: { boost: 40, limit: 97 },
    vision: { boost: 30, limit: 95 }
  },
  skillMovesBoost: 3,
  playStylesAdded: {
    gold: ['Intercept', 'Pinged Pass', 'Bruiser'],
    silver: ['Tiki Taka', 'Incisive Pass', 'Press Proven']
  },
  // Futbin's summary caps this at 4 PlayStyles+ and 7 PlayStyles, and levels 2 and 4 print the
  // same 4. Level 1 alone prints "PlayStyle+: Intercept (2)" — a lower cap than the evo's own
  // summary, which this app has no way to express per level. The summary's 4 is used; if Intercept+
  // turns out to be withheld from a card holding three PlayStyles+, that stray 2 is why.
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (97)', 'Curve +30 (95)', 'Long Shots +30 (95)', 'Short Passing +30 (96)',
        'Vision +30 (95)', 'PlayStyle+: Intercept (2)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +40 (96)', 'Balance +40 (94)', 'Ball Control +40 (96)', 'Reactions +30 (95)',
        'PlayStyle+: Pinged Pass (4)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Dribbling +30 (95)', 'Interceptions +30 (95)', 'Def. Aware +30 (95)',
        'Stand Tackle +30 (95)', 'Skills +3', 'PlayStyle+: Bruiser (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +30 (95)', 'Slide Tackle +30 (94)', 'Stamina +30 (95)', 'Strength +40 (97)',
        'PlayStyle: Incisive Pass (7)', 'PlayStyle: Press Proven (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
