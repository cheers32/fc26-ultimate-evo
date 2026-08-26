import { EvolutionDefinition } from '../../types/player';

/**
 * One level, no challenge, three faces. Small enough that where it lands is entirely a matter of
 * caps — +4 shooting on a card already at 96 buys two points — so it is a finisher for a card in
 * the mid 90s rather than anything you build around.
 *
 * Carried the fut.gg id 2461 until FUTBIN indexed it; the numbers below are still the ones read
 * off fut.gg, whose images were checked directly for granted PlayStyles (there are none) because
 * fut.gg renders them as pictures with no text — the mistake that lost Instant Magnet's First
 * Touch+. They have not been re-read against FUTBIN.
 *
 * fut.gg prints the OVR upgrade without a cap. It does not matter which the cap is: entry is
 * capped at 97 and the boost is +1, so 98 is the ceiling either way, and 98 is what its worked
 * example lands on.
 */
export const eagleEyed1282: EvolutionDefinition = {
  id: '1282',
  name: 'Eagle Eyed',
  futbinLink: 'https://www.futbin.com/26/evolutions/1282/eagle-eyed',
  version: 'FC 26',
  description: 'Unlocked by completing the Wind it Back task in the Ultimate Rewind Completionist objective.',
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 97
  },
  ovrBoost: { boost: 1, limit: 98 },
  faceBoosts: {
    pac: { boost: 3, limit: 97 },
    sho: { boost: 4, limit: 98 },
    phy: { boost: 3, limit: 98 }
  },
  subStatBoosts: {},
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +1', 'Pace +3 (97)', 'Shooting +4 (98)', 'Physical +3 (98)']
    }
  ],
  maxRepeatable: 1
};
