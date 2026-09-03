import { EvolutionDefinition } from '../../types/player';

export const twoWayTitan1240: EvolutionDefinition = {
  id: '1240',
  name: 'Two-Way Titan',
  futbinLink: 'https://www.futbin.com/26/evolutions/1240/two-way-titan',
  version: 'FC 26',
  description:
    'Dominate both halves. Upgrade your player into an unstoppable powerhouse who rules the defence and seamlessly transitions into the attack.',
  descriptionZh: "统治上下半场。把球员升级成既能统治防守、又能无缝转入进攻的全能怪物。｜适合：非门将，六围全 +3~6，可重复 5 次，B2B 中场最对味。",
  cost: 'Season 10 — Level 1 Reward',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 5, limit: 98 },
  faceBoosts: {
    pac: { boost: 5, limit: 96 },
    sho: { boost: 3, limit: 94 },
    pas: { boost: 5, limit: 97 },
    dri: { boost: 5, limit: 96 },
    def: { boost: 6, limit: 98 },
    phy: { boost: 6, limit: 98 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  // Grants no PlayStyles at all, which is what makes it safe to take on a card whose golds are
  // already spoken for.
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5 (98)',
        'Pace +5 (96)',
        'Shooting +3 (94)',
        'Passing +5 (97)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +5 (96)',
        'Defending +6 (98)',
        'Physical +6 (98)',
        'Weak Foot +4',
        'Skills +4'
      ]
    }
  ],
  maxRepeatable: 5
};
