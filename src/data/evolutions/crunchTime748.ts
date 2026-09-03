import { EvolutionDefinition } from '../../types/player';

export const crunchTime748: EvolutionDefinition = {
  id: '748',
  name: 'Crunch Time',
  futbinLink: 'https://www.futbin.com/26/evolutions/748/crunch-time',
  version: 'FC 26',
  description: 'Become built for the moments that can decide a match with Bruiser+ and a defensive boost.',
  descriptionZh: "【准入】非 GK，OVR ≤91，PS+ ≤2。【收益】防守面板 +2（顶 92）；PlayStyle+ 1 个（Bruiser）。【其他】2 级 · Objective Group Reward — Unbreakable。",
  cost: 'Objective Group Reward — Unbreakable',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 2,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 91 },
  // The whole payload is +2 DEF and the PlayStyle: no sub-stat moves at all.
  faceBoosts: {
    def: { boost: 2, limit: 92 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: ['Bruiser'],
    silver: []
  },
  // Level 1 grants Bruiser as a plain PlayStyle and level 2 upgrades it to the +; the chain only
  // reads the end state, so it is listed once, as the gold it finishes as.
  playStylesLimit: {
    gold: 2,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'PlayStyle: Bruiser (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending +2 (92)',
        'PlayStyle+: Bruiser (2)'
      ]
    }
  ],
  maxRepeatable: 1
};
