import { EvolutionDefinition } from '../../types/player';

/**
 * A ball-playing centre half, not a stopper: the defensive block lands on 98 but so do the passing
 * stats, and its two biggest single numbers are Long Shots and Shot Power at +30 — half its budget
 * on the part of a defender's card nobody uses.
 *
 * FUTBIN prints both a Pace face boost (+15, cap 96) and an Acceleration sub boost (+15, cap 97).
 * The model can only carry one of those — a sub boost makes it ignore the face — so the face is
 * used, since that is what moves both pace stats and matches the 96 its worked example lands on.
 * The acceleration-specific 97 cap is the detail lost.
 */
export const keepBetterKompany1278: EvolutionDefinition = {
  id: '1278',
  name: 'Keep Better Kompany',
  futbinLink: 'https://www.futbin.com/26/evolutions/1278/keep-better-kompany',
  version: 'FC 26',
  description: 'Found in the token store.',
  cost: 'Tokens — 100',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CB']
  },
  ovrBoost: { boost: 10, limit: 98 },
  faceBoosts: {
    pac: { boost: 15, limit: 96 }
  },
  subStatBoosts: {
    interceptions: { boost: 20, limit: 98 },
    defAwareness: { boost: 20, limit: 98 },
    standTackle: { boost: 15, limit: 99 },
    slideTackle: { boost: 15, limit: 98 },
    headingAcc: { boost: 15, limit: 97 },
    strength: { boost: 15, limit: 97 },
    stamina: { boost: 10, limit: 96 },
    reactions: { boost: 15, limit: 99 },
    ballControl: { boost: 15, limit: 94 },
    composure: { boost: 15, limit: 98 },
    shortPass: { boost: 15, limit: 98 },
    longPass: { boost: 15, limit: 98 },
    longShots: { boost: 30, limit: 97 },
    shotPower: { boost: 30, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  maxRepeatable: 1
};
