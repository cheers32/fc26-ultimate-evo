import { EvolutionDefinition } from '../../types/player';

/**
 * A centre-back evo whose two biggest numbers are Long Shots and Shot Power at +30 — which is to
 * say most of its budget goes on the half of a defender's card nobody plays. What it actually buys
 * is the defensive block at 98 and ball control and passing in the high 90s: a ball-playing centre
 * half, not a stopper.
 *
 * Not on FUTBIN at the time of writing, so the id and link are fut.gg's.
 */
export const keepBetterCompany2463: EvolutionDefinition = {
  id: '2463',
  name: 'Keep Better Company',
  futbinLink: 'https://www.fut.gg/evolutions/2463-keep-better-company/',
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
    aggression: { boost: 15, limit: 97 },
    stamina: { boost: 10, limit: 96 },
    reactions: { boost: 15, limit: 99 },
    ballControl: { boost: 15, limit: 97 },
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
