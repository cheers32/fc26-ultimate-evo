import { EvolutionDefinition } from '../../types/player';

/**
 * A striker's evo that spends almost nothing on being a striker.
 *
 * Shooting and pace are the two faces it lifts outright, and everything under them is left to
 * prorating — but the nine sub-stats it names are passing and on-the-ball ones: crossing, both
 * passes, curve, free kicks, ball control, dribbling, balance, composure. So it is a forward built
 * to arrive with the ball rather than to finish more, which is worth knowing before spending
 * 100,000 on it.
 *
 * Repeatable three times, which is unusual at that price, and it grants no skill moves and touches
 * neither agility nor reactions.
 *
 * Read off the game's own Evolutions tab, per-level split and challenges included. The id is
 * provisional and outside FUTBIN's range on purpose — see flipTheSwitch9001 for why.
 */
export const elMatador9006: EvolutionDefinition = {
  id: '9006',
  name: 'El Matador',
  nameZh: '斗牛士',
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  expiresAt: '2026-09-15',
  description: 'Break between central defenders with razor sharp movement, catch incoming passes on the volley, and tuck your finish low into the corner.',
  descriptionZh: '用锋利的跑位从中卫之间插上，把传中直接凌空接下，再把球稳稳送进死角。｜适合：ST 专用，准入 OVR ≤98 几乎不设限，可重复 3 次；速度和射门两个面板各 +30，但它点名加的九项其实是传球和球感——是把中锋改造成"带球到位"而不是"射得更准"，10 万金币前想清楚。',
  cost: '250 FC Points / 100,000 Coins',
  requirements: {
    maxOvr: 98,
    positions: ['ST']
  },
  ovrBoost: { boost: 10, limit: 99 },
  faceBoosts: {
    pac: { boost: 30, limit: 99 },
    sho: { boost: 30, limit: 99 }
  },
  subStatBoosts: {
    crossing: { boost: 30, limit: 98 },
    freekick: { boost: 30, limit: 99 },
    shortPass: { boost: 30, limit: 98 },
    longPass: { boost: 30, limit: 98 },
    curve: { boost: 30, limit: 98 },
    balance: { boost: 30, limit: 98 },
    ballControl: { boost: 30, limit: 98 },
    dribbling: { boost: 30, limit: 98 },
    composure: { boost: 30, limit: 98 }
  },
  weakFootBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10', 'Pace +30', 'Crossing +30 (98)', 'FK Acc. +30',
        'Short Pass +30 (98)', 'Long Pass +30 (98)', 'Weak Foot +4 (5)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Shooting +30', 'Curve +30 (98)', 'Balance +30 (98)', 'Ball Control +30 (98)',
        'Dribbling +30 (98)', 'Composure +30 (98)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    }
  ],
  maxRepeatable: 3
};
