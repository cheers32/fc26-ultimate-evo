import { EvolutionDefinition } from '../../types/player';

/**
 * Free, twice, and it asks for nothing but an OVR under 97 — which makes it the cheapest way in the
 * pool to move a card, and the easiest to overrate. Eleven sub-stats at +20 with a +5 OVR is a lot
 * of total for nothing, but the spread is half defensive and half passing, so on any card built for
 * one thing it is buying a good deal of the other.
 *
 * Strength and Aggression are the part to watch on a card meant to stay Explosive.
 */
export const anchorAndAlley1285: EvolutionDefinition = {
  id: '1285',
  name: 'Anchor & Alley',
  futbinLink: 'https://www.futbin.com/26/evolutions/1285/anchor--alley',
  version: 'FC 26',
  description:
    'Provide total structural stability with crunching tackles, unyielding physical presence, and ' +
    'the vision to spring your team forward.',
  descriptionZh: "【准入】非 GK，OVR ≤97。【收益】OVR +5（顶 99）；传球线 4 项（最高 +20）、防守线 4 项（最高 +20）、身体线 3 项（最高 +20）。【其他】2 级 · 可重复 2 次 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 5, limit: 99 },
  // Vision, Stand Tackle, Slide Tackle, Def. Aware and Aggression are printed without a cap of
  // their own, so only the 99 ceiling holds them.
  subStatBoosts: {
    vision: { boost: 20, limit: 99 },
    crossing: { boost: 20, limit: 97 },
    shortPass: { boost: 20, limit: 98 },
    standTackle: { boost: 20, limit: 99 },
    slideTackle: { boost: 20, limit: 99 },
    longPass: { boost: 20, limit: 98 },
    interceptions: { boost: 20, limit: 98 },
    defAwareness: { boost: 20, limit: 99 },
    jumping: { boost: 20, limit: 98 },
    strength: { boost: 20, limit: 98 },
    aggression: { boost: 20, limit: 99 }
  },
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5',
        'Crossing +20 (97)',
        'Short Passing +20 (98)',
        'Slide Tackle +20',
        'Stand Tackle +20',
        'Vision +20',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +20',
        'Interceptions +20 (98)',
        'Jumping +20 (98)',
        'Long Passing +20 (98)',
        'Def. Aware +20',
        'Strength +20 (98)',
        'Challenge: play 1 match on min Semi-Pro with the active EVO player'
      ]
    }
  ],
  trainingTime: '2 Weeks',
  // Printed with a count for once: FUTBIN shows this one as repeatable twice.
  maxRepeatable: 2
};
