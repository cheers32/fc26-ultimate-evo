import { EvolutionDefinition } from '../../types/player';

/**
 * One level, three faces, and a fifth PlayStyle+ slot with Incisive Pass already in it. The blurb
 * promises pace and FUTBIN prints none, so none is modelled — a +10 on a face a card is already
 * near the cap on buys nothing, which makes this worth its 50k only on a card sitting in the low
 * 90s on shooting, passing or dribbling and short of a fifth gold slot.
 *
 * Note it changes no rarity: a card that could not pick its own PlayStyles still cannot, and the
 * fifth slot arrives with Incisive Pass in it rather than empty.
 */
export const futtiesFinale1264: EvolutionDefinition = {
  id: '1264',
  name: 'FUTTIES Finale',
  futbinLink: 'https://www.futbin.com/26/evolutions/1264/futties-finale',
  version: 'FC 26',
  description: 'Unleash pure attacking power. Elevate your forward with elite upgrades to shooting, passing and dribbling for the final whistle of the summer.',
  descriptionZh: "【准入】非 GK，OVR ≤97，PS+ ≤4。【收益】OVR +5（顶 98）；射门面板 +10（顶 96）；传球面板 +10（顶 98）；盘带面板 +10（顶 98）；弱脚 +4；花式 +4；PlayStyle+ 1 个（Incisive Pass）。【其他】1 级 · 150 FC Points / 50,000 Coins。",
  cost: '150 FC Points / 50,000 Coins',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 5, limit: 98 },
  faceBoosts: {
    sho: { boost: 10, limit: 96 },
    pas: { boost: 10, limit: 98 },
    dri: { boost: 10, limit: 98 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Incisive Pass'],
    silver: []
  },
  playStylesLimit: {
    gold: 5
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5 (98)', 'Shooting +10 (96)', 'Passing +10 (98)', 'Dribbling +10 (98)',
        'Weak Foot +4 (5)', 'Skill Moves +4 (5)', 'PlayStyle+: Incisive Pass (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
