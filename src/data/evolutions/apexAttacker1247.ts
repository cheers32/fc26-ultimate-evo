import { EvolutionDefinition } from '../../types/player';

export const apexAttacker1247: EvolutionDefinition = {
  id: '1247',
  name: 'Apex Attacker',
  futbinLink: 'https://www.futbin.com/26/evolutions/1247/apex-attacker',
  version: 'FC 26',
  description: 'Give a player all the tools they need to become a World Class Striker.',
  descriptionZh: "给球员成为世界级中锋所需的一切工具。｜适合：任何位置，不加数值，纯送弱脚花式和五个 PlayStyle。",
  cost: 'Objective Reward — Score in 25',
  requirements: {
    maxOvr: 97,
    maxTotalPositions: 5,
    maxPlayStylesPlus: 4
  },
  // Moves no numbers at all: five PlayStyle+, the ST position, and the two skill bars.
  ovrBoost: { boost: 0, limit: 97 },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  positionsAdded: ['ST'],
  playStylesAdded: {
    gold: ['Finesse Shot', 'Low Driven Shot', 'Incisive Pass', 'Rapid', 'Technical'],
    silver: []
  },
  playStylesLimit: { gold: 5 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Weak Foot +4',
        'Position: ST',
        'PlayStyle+: Finesse Shot (5)',
        'PlayStyle+: Low Driven Shot (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Skills +4',
        'PlayStyle+: Incisive Pass (5)',
        'PlayStyle+: Rapid (5)',
        'PlayStyle+: Technical (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
