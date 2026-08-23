import { EvolutionDefinition } from '../../types/player';

/**
 * Sixty-seven on every face, two levels, and caps that stop at 96 on five of them. So it is not the
 * blunt instrument the number suggests: on a card already past 96 it does nothing at all, and what
 * it is really for is a card with one hole — Touré's 50 shooting becoming 96 is the whole evo.
 */
export const order671276: EvolutionDefinition = {
  id: '1276',
  name: 'Order 67',
  futbinLink: 'https://www.futbin.com/26/evolutions/1276/order-67',
  version: 'FC 26',
  description: 'Found in the token store.',
  cost: 'Tokens — 100',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 67, limit: 98 },
  faceBoosts: {
    pac: { boost: 67, limit: 96 },
    sho: { boost: 67, limit: 96 },
    pas: { boost: 67, limit: 96 },
    dri: { boost: 67, limit: 98 },
    def: { boost: 67, limit: 96 },
    phy: { boost: 67, limit: 96 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    { name: 'Level 1', upgrades: ['Pace +67 (96)', 'Shooting +67 (96)', 'Passing +67 (96)'] },
    { name: 'Level 2', upgrades: ['OVR +67 (98)', 'Dribbling +67 (98)', 'Defending +67 (96)', 'Physical +67 (96)', 'Weak Foot +4', 'Skill Moves +4'] }
  ],
  maxRepeatable: 1
};
