import { EvolutionDefinition } from '../../types/player';

export const everythingAtOnce1220: EvolutionDefinition = {
  id: '1220',
  name: 'Everything at Once',
  futbinLink: 'https://www.futbin.com/26/evolutions/1220/everything-at-once',
  version: 'FC 26',
  description:
    'Upgrade everything, master both feet and unlock every trick in the book. Why improve one thing when you can become a five-star menace everywhere, all at once?',
  descriptionZh: "【准入】非 GK，OVR ≤96，PS+ ≤4。【收益】OVR +2（顶 97）；速度面板 +3（顶 95）；射门面板 +2（顶 92）；传球面板 +2（顶 95）；盘带面板 +3（顶 96）；防守面板 +2（顶 94）；身体面板 +4（顶 97）；弱脚 +4；花式 +4；稀有度改为 Futties。【其他】2 级 · 可重复 4 次 · 100 FUTTIES Tokens / 25,000 Coins。",
  cost: '100 FUTTIES Tokens / 25,000 Coins',
  requirements: {
    maxOvr: 96,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 2, limit: 97 },
  // Futbin lists this one purely as face-stat upgrades — no sub-stat lines at all — so the boosts
  // go in faceBoosts and subStatBoosts stays empty.
  faceBoosts: {
    pac: { boost: 3, limit: 95 },
    sho: { boost: 2, limit: 92 },
    pas: { boost: 2, limit: 95 },
    dri: { boost: 3, limit: 96 },
    def: { boost: 2, limit: 94 },
    phy: { boost: 4, limit: 97 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  // Futbin prints no rarity line in this evo's upgrade list, but its own preview cards change
  // design at Level 2 — base and Level 1 keep the player's own card, Level 2 is 16_futties, the
  // same card Wind-Up Merchant ends on. Not merely cosmetic: that rarity is what opens the free
  // PlayStyle picker. It is 'Futties', not the similarly named 'Futties Evo' that Blueprint I
  // grants, which does not.
  rarityChange: 'Futties',
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (97)', 'Pace +3 (95)', 'Shooting +2 (92)', 'Passing +2 (95)', 'Weak Foot +4'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +3 (96)', 'Defending +2 (94)', 'Physical +4 (97)', 'Skills +4',
        'Rarity: Futties'
      ]
    }
  ],
  maxRepeatable: 4
};
