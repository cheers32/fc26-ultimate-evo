import { EvolutionDefinition } from '../../types/player';

/**
 * Enormous, and only in one direction: +25 on six dribbling subs and both pace subs, +20 on the
 * shooting and passing faces, and not a point of defending or physical anywhere. The entry gate is
 * OVR 96 with nothing said about PlayStyles, so it will take a nearly finished card — but the caps
 * are what decide it, and they sit at 96–98. On an end-game attacker most of the +25s land on stats
 * already past them; on a card in the 80s this is one of the largest single upgrades in the library.
 *
 * Pace and dribbling are given as sub-stats, shooting and passing as faces, which is how FUTBIN
 * prints them and matters here: the face boosts spread across their own subs, the sub boosts do not.
 *
 * FUTBIN prints no cap on Dribbling, on the summary or on level 2.
 */
export const inThatOrder1283: EvolutionDefinition = {
  id: '1283',
  name: 'In That Order',
  futbinLink: 'https://www.futbin.com/26/evolutions/1283/in-that-order',
  version: 'FC 26',
  description:
    'Prioritise pure attacking power and elevate your forward to unstoppable heights. Deliver massive offensive boosts to turn your attacker into a match winning force that dominates the final third.',
  descriptionZh: "【准入】非 GK，OVR ≤96。【收益】OVR +15（顶 98）；射门面板 +20（顶 97）；传球面板 +20（顶 97）；速度线 2 项（最高 +25）、盘带线 6 项（最高 +25）；弱脚 +4；花式 +4。【其他】2 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 15, limit: 98 },
  faceBoosts: {
    sho: { boost: 20, limit: 97 },
    pas: { boost: 20, limit: 97 }
  },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 97 },
    sprintSpeed: { boost: 25, limit: 97 },
    agility: { boost: 25, limit: 97 },
    balance: { boost: 25, limit: 98 },
    reactions: { boost: 25, limit: 97 },
    ballControl: { boost: 25, limit: 98 },
    dribbling: { boost: 25, limit: 99 },
    composure: { boost: 25, limit: 96 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (98)',
        'Shooting +20 (97)',
        'Acceleration +25 (97)',
        'Sprint Speed +25 (97)',
        'Agility +25 (97)',
        'Balance +25 (98)',
        'Weak Foot +4'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Passing +20 (97)',
        'Ball control +25 (98)',
        'Dribbling +25',
        'Reactions +25 (97)',
        'Composure +25 (96)',
        'Skills +4'
      ]
    }
  ],
  maxRepeatable: 1
};
