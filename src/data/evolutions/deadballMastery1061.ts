import { EvolutionDefinition } from '../../types/player';

// NOTE: Futbin gates this evolution to a single named card ("Player Groups: Diego
// Forlan"), a requirement type our schema has no field for and does not enforce here.
// Futbin also shows no OVR cap and no sub-stat limits (just flat "+50" amounts), unlike
// every other evolution on the site, since it only ever applies to that one exact card.
// maxOvr is set to 99 (no real constraint) and sub-stat limits to 99 (the engine's own
// hard cap) as the least-assuming stand-in for values Futbin doesn't publish.
export const deadballMastery1061: EvolutionDefinition = {
  id: '1061',
  name: 'Deadball Mastery',
  futbinLink: 'https://www.futbin.com/26/evolutions/1061/deadball-mastery',
  version: 'FC 26',
  description: 'Only applicable to Diego Forlan',
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 99,
    maxPlayStylesPlus: 3
  },
  ovrBoost: { boost: 0, limit: 99 },
  subStatBoosts: {
    crossing: { boost: 50, limit: 99 },
    curve: { boost: 50, limit: 99 },
    penalties: { boost: 50, limit: 99 },
    freekick: { boost: 50, limit: 99 },
    shotPower: { boost: 50, limit: 99 }
  },
  playStylesAdded: {
    gold: ['Dead Ball'],
    silver: []
  },
  playStylesLimit: {
    gold: 3
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Crossing +50', 'Curve +50', 'Penalties +50', 'FK Acc. +50', 'Shot Power +50',
        'PlayStyle+: Dead Ball (3)'
      ]
    }
  ],
  maxRepeatable: 1,
  // Ships off, because the one requirement that matters here is the one the schema cannot express.
  // With no player gate and no OVR cap it is eligible for every card in the library, and a step that
  // costs nothing and grants a gold PlayStyle turns up in recommendations for people who will never
  // be able to run it. Whoever actually holds Forlan can switch it back on.
  defaultDisabled: true
};
