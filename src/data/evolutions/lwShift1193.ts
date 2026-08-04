import { EvolutionDefinition } from '../../types/player';

export const lwShift1193: EvolutionDefinition = {
  id: '1193',
  name: 'LW Shift',
  futbinLink: 'https://www.futbin.com/26/evolutions/1193/lw-shift',
  version: 'FC 26',
  description: 'Apply the LW Position to any player.',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxTotalPositions: 5
  },
  ovrBoost: { boost: 0, limit: 96 },
  subStatBoosts: {},
  positionsAdded: ['LW'],
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Position: LW',
        'Role: Winger++', 'Role: Wide Playmaker++', 'Role: Inside Forward++'
      ]
    }
  ],
  maxRepeatable: 1
};
