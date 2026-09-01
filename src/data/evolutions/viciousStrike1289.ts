import { EvolutionDefinition } from '../../types/player';

/**
 * Free, and the only free evo in the pool that touches nothing physical or defensive at all — twelve
 * sub-stats spread across shooting, passing and the ball, and not a point of strength among them.
 *
 * That absence is the whole reason to care about it. Every other cheap upgrade here pays for its
 * stats with strength or aggression, which on a card being built for Explosive is spending the
 * agility-over-strength lead the archetype is read from. This one leaves the lead exactly where it
 * was, so it is close to free on a winger or a forward and does not have to be argued about.
 */
export const viciousStrike1289: EvolutionDefinition = {
  id: '1289',
  name: 'Vicious Strike',
  futbinLink: 'https://www.futbin.com/26/evolutions/1289/vicious-strike',
  version: 'FC 26',
  description:
    'No mercy in the box. Unleash devastating power in front of goal and punish the opposition ' +
    'with clinical finishes every time they leave you space.',
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 5, limit: 99 },
  // Acceleration, Shot Power, Crossing, Long Passing and Balance are printed without a cap of their
  // own, so only the 99 ceiling holds them. The asymmetry on pace is real rather than a misreading —
  // acceleration is uncapped while sprint speed stops at 98 — and both sources print it that way.
  subStatBoosts: {
    acceleration: { boost: 20, limit: 99 },
    sprintSpeed: { boost: 20, limit: 98 },
    finishing: { boost: 20, limit: 98 },
    shotPower: { boost: 20, limit: 99 },
    longShots: { boost: 20, limit: 97 },
    dribbling: { boost: 20, limit: 98 },
    vision: { boost: 20, limit: 98 },
    crossing: { boost: 20, limit: 99 },
    shortPass: { boost: 20, limit: 98 },
    longPass: { boost: 20, limit: 99 },
    balance: { boost: 20, limit: 99 },
    reactions: { boost: 20, limit: 97 }
  },
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5',
        'Acceleration +20',
        'Sprint Speed +20 (98)',
        'Finishing +20 (98)',
        'Shot Power +20',
        'Long Shots +20 (97)',
        'Dribbling +20 (98)',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Vision +20 (98)',
        'Crossing +20',
        'Short Passing +20 (98)',
        'Long Passing +20',
        'Balance +20',
        'Reactions +20 (97)',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
