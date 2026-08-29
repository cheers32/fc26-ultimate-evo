import { EvolutionDefinition } from '../../types/player';

/**
 * Twelve sub-stats at +30 for 100 tokens and no position requirement, which makes this one of the
 * broadest evos in the pool: on any card already near the caps it is close to free shooting and
 * passing. What it does not touch is as important as what it does — nothing physical, nothing
 * defensive, and no agility or balance — so it raises what a card does with the ball without moving
 * the acceleration-against-strength lead that decides its AcceleRATE.
 */
export const primeMotion1287: EvolutionDefinition = {
  id: '1287',
  name: 'Prime Motion',
  futbinLink: 'https://www.futbin.com/26/evolutions/1287/prime-motion',
  version: 'FC 26',
  description:
    'Found in the Pre Season Token Store. Transform your player into an unstoppable motion threat ' +
    'who weaves through tight spaces, drives forward on the half turn, and creates instant ' +
    'openings in the final third.',
  cost: 'Tokens — 100 Pre Season Tokens',
  requirements: {
    maxOvr: 98,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 10, limit: 99 },
  // Positioning, Shot Power, Long Shots, Volleys, Penalties and Long Passing are printed without a
  // cap of their own, so only the 99 ceiling holds them. Finishing caps at 96 rather than at the 98
  // the other stats share — FUT.GG prints 98 for it, and FUTBIN's own page does not.
  subStatBoosts: {
    acceleration: { boost: 30, limit: 98 },
    sprintSpeed: { boost: 30, limit: 98 },
    // +31, not +30. The one stat here that is not a round number, and FUT.GG rounds it off.
    positioning: { boost: 31, limit: 99 },
    finishing: { boost: 30, limit: 96 },
    shotPower: { boost: 30, limit: 99 },
    longShots: { boost: 30, limit: 99 },
    volleys: { boost: 30, limit: 99 },
    penalties: { boost: 30, limit: 99 },
    vision: { boost: 30, limit: 98 },
    crossing: { boost: 30, limit: 98 },
    shortPass: { boost: 30, limit: 98 },
    longPass: { boost: 30, limit: 99 }
  },
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10',
        'Acceleration +30 (98)',
        'Sprint Speed +30 (98)',
        'Att. Position +31',
        'Finishing +30 (96)',
        'Shot Power +30',
        'Long Shots +30',
        'Challenge: play 1 match with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Volleys +30',
        'Penalties +30',
        'Vision +30 (98)',
        'Crossing +30 (98)',
        'Short Passing +30 (98)',
        'Long Passing +30',
        'Challenge: play 1 match with the active EVO player'
      ]
    }
  ],
  trainingTime: '1 Month',
  maxRepeatable: 1
};
