import { EvolutionDefinition } from '../../types/player';

/**
 * The heaviest evo in the pool for a CAM: +20 OVR, whole face stats moved rather than sub-stats,
 * and both star ratings at once. It is also the only one here that raises Shooting and Dribbling as
 * faces — every other line is a sub-stat — which is why a card can come out of it with 99 DRI
 * without a single dribbling sub-stat having been named.
 *
 * Level 3 is where the cost is. Stamina, Strength and Aggression all at +30 to 96 will carry a card
 * over the stamina bar, and take the agility-over-strength lead with it on anything meant to stay
 * Explosive — so on a small playmaker the first two levels are the evo and the third is a decision.
 */
export const unboundTen1284: EvolutionDefinition = {
  id: '1284',
  name: 'Unbound Ten',
  futbinLink: 'https://www.futbin.com/26/evolutions/1284/unbound-ten',
  version: 'FC 26',
  description:
    'Unlock complete creative freedom for your attacking midfielder to shatter defensive blocks, ' +
    'score from anywhere, and orchestrate every attack.',
  descriptionZh: "【准入】CAM 专用，OVR ≤98。【收益】OVR +20（顶 99）；射门面板 +30（顶 98）；盘带面板 +30（顶 99）；速度线 2 项（最高 +30）、传球线 6 项（最高 +30）、身体线 3 项（最高 +30）；弱脚 +4；花式 +4。【其他】3 级 · 250 FC Points / 75,000 Coins。",
  cost: '250 FC Points / 75,000 Coins',
  requirements: {
    maxOvr: 98,
    positions: ['CAM']
  },
  ovrBoost: { boost: 20, limit: 99 },
  // Shooting and Dribbling are raised as face stats, not as the sub-stats that share their names.
  // Both sources agree on the reading — FUT.GG prints them as "SHO" and "DRI" while naming every
  // other line in full — and the cards bear it out: 90 SHO to exactly 98, 94 DRI to 99.
  faceBoosts: {
    sho: { boost: 30, limit: 98 },
    dri: { boost: 30, limit: 99 }
  },
  // Crossing, FK Accuracy, Short Passing, Long Passing and Curve are printed without a cap of their
  // own, so only the 99 ceiling holds them.
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    vision: { boost: 30, limit: 98 },
    crossing: { boost: 30, limit: 99 },
    freekick: { boost: 30, limit: 99 },
    shortPass: { boost: 30, limit: 99 },
    longPass: { boost: 30, limit: 99 },
    curve: { boost: 30, limit: 99 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 30, limit: 96 },
    aggression: { boost: 30, limit: 96 }
  },
  skillMovesBoost: 4,
  weakFootBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20',
        'Dribbling +30',
        'Acceleration +30 (97)',
        'Sprint Speed +30 (97)',
        'Vision +30 (98)',
        'Crossing +30',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Shooting +30 (98)',
        'Skills +4',
        'FK Accuracy +30',
        'Short Passing +30',
        'Long Passing +30',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Weak Foot +4',
        'Curve +30',
        'Stamina +30 (96)',
        'Strength +30 (96)',
        'Aggression +30 (96)',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    }
  ],
  trainingTime: '2 Weeks',
  maxRepeatable: 1
};
