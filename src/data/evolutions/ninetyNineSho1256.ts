import { EvolutionDefinition } from '../../types/player';

/**
 * Every shooting sub straight to 99 and nothing else — the boosts are printed as +99 because the
 * cap is the only number that matters. The +4 OVR is the sting: on a 96-max evo it pushes the card
 * out of range of most of the evos you would want to run after it, so this belongs at the end of a
 * chain rather than the start.
 */
export const ninetyNineSho1256: EvolutionDefinition = {
  id: '1256',
  name: '99 SHO',
  futbinLink: 'https://www.futbin.com/26/evolutions/1256/99-sho',
  version: 'FC 26',
  description: 'Give 99 Shooting to any eligible player. Sold in a Store pack.',
  cost: 'Store Pack',
  requirements: {
    maxOvr: 96,
    positions: ['LW', 'ST', 'RW']
  },
  ovrBoost: { boost: 4, limit: 98 },
  subStatBoosts: {
    finishing: { boost: 99, limit: 99 },
    shotPower: { boost: 99, limit: 99 },
    longShots: { boost: 99, limit: 99 },
    penalties: { boost: 99, limit: 99 },
    positioning: { boost: 99, limit: 99 },
    volleys: { boost: 99, limit: 99 }
  },
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +4 (98)', 'Finishing +99', 'Shot Power +99']
    },
    {
      name: 'Level 2',
      upgrades: ['Long Shots +99', 'Penalties +99', 'Att. Position +99', 'Volleys +99']
    }
  ],
  maxRepeatable: 1
};
