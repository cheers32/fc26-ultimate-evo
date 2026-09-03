import { EvolutionDefinition } from '../../types/player';

/**
 * A PlayStyle evo and nothing else — no OVR, no stats, six passing PlayStyles and one of them as a
 * PlayStyle+. Which makes where it sits in a chain the whole question: its six take gold and silver
 * slots that are then gone, so it is worth a lot on a card that wants passing PlayStyles and worth
 * less than nothing on one that was going to pick its own.
 */
export const passingTechnician736: EvolutionDefinition = {
  id: '736',
  name: 'Passing Technician',
  futbinLink: 'https://www.futbin.com/26/evolutions/736/passing-technician',
  version: 'FC 26',
  description: 'Master the art of the Pass and distribute the ball in a variety of ways. Unlocked by the Passing Mastermind objective group.',
  descriptionZh: "【准入】OVR ≤91，PS+ ≤2。【收益】PlayStyle+ 1 个（Pinged Pass）；PlayStyle 5 个（Tiki Taka、Incisive Pass、Inventive、Gamechanger、Long Ball Pass）。【其他】2 级 · Objective Group Reward。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 2,
    notRarity: 'World Tour Silver Stars'
  },
  // Nothing here moves the card's numbers: no OVR upgrade is listed at either level.
  ovrBoost: { boost: 0, limit: 99 },
  subStatBoosts: {},
  playStylesAdded: {
    // Pinged Pass arrives plain at level 1 and is upgraded at level 2, so a finished evo leaves it
    // gold. Listing it once, as gold, is the card you end up with.
    gold: ['Pinged Pass'],
    silver: ['Tiki Taka', 'Incisive Pass', 'Inventive', 'Gamechanger', 'Long Ball Pass']
  },
  playStylesLimit: {
    gold: 2,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['PlayStyle: Pinged Pass (8)']
    },
    {
      name: 'Level 2',
      upgrades: [
        'PlayStyle+: Pinged Pass (2)', 'PlayStyle: Tiki Taka (8)', 'PlayStyle: Incisive Pass (8)',
        'PlayStyle: Inventive (8)', 'PlayStyle: Gamechanger (8)', 'PlayStyle: Long Ball Pass (8)'
      ]
    }
  ],
  // FUTBIN marks it repeatable but names no count. Held at one, which is also the only useful
  // number: a second run hands over PlayStyles the card already has.
  maxRepeatable: 1
};
