import { EvolutionDefinition } from '../../types/player';

export const thePerfectBreak1195: EvolutionDefinition = {
  id: '1195',
  name: 'The Perfect Break',
  futbinLink: 'https://www.futbin.com/26/evolutions/1195/the-perfect-break',
  version: 'FC 26',
  description: 'Take a quick breather, then return with sharper skills, complete confidence on either foot and the dribbling to leave defenders behind.',
  descriptionZh: "喘口气再回来，技术更锐利、双脚都自信、盘带能把后卫甩在身后。｜适合：非门将，只加盘带线 6 项。",
  cost: 'Free',
  trainingTime: '15 Mins',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 95 },
  subStatBoosts: {
    agility: { boost: 6, limit: 96 },
    balance: { boost: 6, limit: 96 },
    ballControl: { boost: 7, limit: 94 },
    dribbling: { boost: 8, limit: 97 },
    reactions: { boost: 7, limit: 94 },
    composure: { boost: 6, limit: 94 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: ['Technical', 'Trickster']
  },
  // Seven, not the eight FUTBIN prints.
  //
  // Every other evo in the training camp caps plain PlayStyles at seven, and this one behaved like
  // them in game: a card sitting on seven came out of it with seven, with Trickster — its level 2
  // grant — nowhere to go. FUTBIN's page says 8 on the summary and on both levels, and is wrong,
  // which is the kind of thing only a card that has actually run the evo can settle.
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Agility +6 (96)', 'Balance +6 (96)', 'Reactions +7 (94)', 'Skill Moves +4 (5)',
        'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +7 (94)', 'Dribbling +8 (97)', 'Composure +6 (94)', 'Weak Foot +4 (5)',
        'PlayStyle: Trickster (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
