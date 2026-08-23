import { EvolutionDefinition } from '../../types/player';

/**
 * A full-back evo that spends almost everything on the two stats a full-back is judged by —
 * acceleration and sprint speed, +20 each to 98 — and hands out small change everywhere else. Note
 * the odd caps: heading 90 and jumping 92, well below the rest, so it will not make an aerial
 * defender out of one that is not already.
 */
export const guardianOfTheWing1280: EvolutionDefinition = {
  id: '1280',
  name: 'Guardian of the Wing',
  futbinLink: 'https://www.futbin.com/26/evolutions/1280/guardian-of-the-wing',
  version: 'FC 26',
  description: 'Found in the store.',
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    positions: ['LB', 'RB']
  },
  ovrBoost: { boost: 9, limit: 98 },
  faceBoosts: {
    pas: { boost: 10, limit: 95 }
  },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 98 },
    sprintSpeed: { boost: 20, limit: 98 },
    agility: { boost: 8, limit: 95 },
    balance: { boost: 14, limit: 94 },
    reactions: { boost: 14, limit: 94 },
    ballControl: { boost: 14, limit: 95 },
    dribbling: { boost: 14, limit: 96 },
    composure: { boost: 15, limit: 98 },
    interceptions: { boost: 12, limit: 96 },
    defAwareness: { boost: 12, limit: 97 },
    standTackle: { boost: 12, limit: 99 },
    slideTackle: { boost: 12, limit: 98 },
    headingAcc: { boost: 14, limit: 90 },
    jumping: { boost: 8, limit: 92 },
    stamina: { boost: 8, limit: 98 },
    strength: { boost: 8, limit: 96 },
    aggression: { boost: 8, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  playStylesAdded: { gold: [], silver: [] },
  maxRepeatable: 1
};
