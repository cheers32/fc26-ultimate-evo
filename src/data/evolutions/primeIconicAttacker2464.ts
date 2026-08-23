import { EvolutionDefinition } from '../../types/player';

/**
 * The +45 OVR and +40 pace are what the 200 tokens buy: built to drag a mid-rated forward all the
 * way to 98, not to finish one already there. Strength and aggression cap at 92 while everything
 * attacking caps at 96-98, so a card arriving physical keeps it and a card without one is not
 * handed one.
 *
 * Not on FUTBIN at the time of writing, so the id and link are fut.gg's.
 */
export const primeIconicAttacker2464: EvolutionDefinition = {
  id: '2464',
  name: 'Prime Iconic Attacker',
  futbinLink: 'https://www.fut.gg/evolutions/2464-prime-iconic-attacker/',
  version: 'FC 26',
  description: 'Found in the token store.',
  cost: 'Tokens — 200',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['ST', 'RW', 'LW']
  },
  ovrBoost: { boost: 45, limit: 98 },
  faceBoosts: {
    pac: { boost: 40, limit: 98 },
    pas: { boost: 20, limit: 95 }
  },
  subStatBoosts: {
    positioning: { boost: 40, limit: 99 },
    finishing: { boost: 40, limit: 98 },
    shotPower: { boost: 30, limit: 97 },
    longShots: { boost: 30, limit: 96 },
    volleys: { boost: 30, limit: 96 },
    penalties: { boost: 25, limit: 96 },
    agility: { boost: 40, limit: 96 },
    balance: { boost: 30, limit: 96 },
    reactions: { boost: 35, limit: 99 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 98 },
    composure: { boost: 40, limit: 96 },
    headingAcc: { boost: 30, limit: 99 },
    jumping: { boost: 40, limit: 95 },
    stamina: { boost: 35, limit: 95 },
    strength: { boost: 25, limit: 92 },
    aggression: { boost: 20, limit: 92 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  maxRepeatable: 1
};
