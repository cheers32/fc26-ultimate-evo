import { EvolutionDefinition } from '../../types/player';

/**
 * One level, no challenge, three faces. Small enough that where it lands is entirely a matter of
 * caps — +4 shooting on a card already at 96 buys two points — so it is a finisher for a card in
 * the mid 90s rather than anything you build around.
 *
 * fut.gg only; FUTBIN has not indexed it, so the id and link are fut.gg's. fut.gg renders granted
 * PlayStyles as images with no text — the mistake that lost Instant Magnet's First Touch+ — so the
 * page's images were checked directly here: there are none, and the level detail lists none.
 *
 * fut.gg prints the OVR upgrade without a cap. It does not matter which the cap is: entry is
 * capped at 97 and the boost is +1, so 98 is the ceiling either way, and 98 is what its worked
 * example lands on.
 */
export const eagleEyed2461: EvolutionDefinition = {
  id: '2461',
  name: 'Eagle Eyed',
  futbinLink: 'https://www.fut.gg/evolutions/2461-eagle-eyed/',
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
