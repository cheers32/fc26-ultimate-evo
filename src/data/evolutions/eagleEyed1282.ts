import { EvolutionDefinition } from '../../types/player';

/**
 * One level, no challenge, three faces. Small enough that where it lands is entirely a matter of
 * caps — +4 shooting on a card already at 96 buys two points — so it is a finisher for a card in
 * the mid 90s rather than anything you build around.
 *
 * Carried the fut.gg id 2461 until FUTBIN indexed it. Every upgrade line agreed across the two;
 * the one thing only FUTBIN prints is the GK exclusion, which is the second time fut.gg has left
 * that particular requirement out — Leyenda de Moncada was the first.
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
  descriptionZh: "【准入】非 GK，OVR ≤97。【收益】OVR +1（顶 98）；速度面板 +3（顶 97）；射门面板 +4（顶 98）；身体面板 +3（顶 98）。【其他】1 级 · Objective Reward — Wind it Back。",
  cost: 'Objective Reward — Wind it Back',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
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
