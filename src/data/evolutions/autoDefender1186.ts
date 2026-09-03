import { EvolutionDefinition } from '../../types/player';

export const autoDefender1186: EvolutionDefinition = {
  id: '1186',
  name: 'Auto Defender',
  futbinLink: 'https://www.futbin.com/26/evolutions/1186/auto-defender',
  version: 'FC 26',
  description: 'Sit back, relax, let the defenders do the job for you.',
  descriptionZh: "往后一坐，放松，让后卫替你干活。｜适合：任何位置，防守线为主的小加成。",
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    aggression: { boost: 10, limit: 96 },
    strength: { boost: 10, limit: 96 },
    headingAcc: { boost: 10, limit: 97 },
    interceptions: { boost: 10, limit: 98 },
    defAwareness: { boost: 10, limit: 98 },
    slideTackle: { boost: 10, limit: 97 },
    standTackle: { boost: 10, limit: 98 },
    reactions: { boost: 10, limit: 97 },
    composure: { boost: 10, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  playStylesAdded: {
    gold: ['Anticipate', 'Intercept', 'Jockey'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Aggression +10 (96)', 'Interceptions +10 (98)',
        'Stand Tackle +10 (98)', 'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Heading Acc. +10 (97)', 'Reactions +10 (97)', 'Slide Tackle +10 (97)',
        'Weak Foot +4 (5)', 'PlayStyle+: Intercept (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Def. Aware +10 (98)', 'Strength +10 (96)', 'Composure +10 (97)',
        'Skill Moves +3 (4)', 'PlayStyle+: Jockey (4)'
      ]
    }
  ],
  maxRepeatable: 1
};
