import { EvolutionDefinition } from '../../types/player';

export const passingFocus1251: EvolutionDefinition = {
  id: '1251',
  name: 'Passing Focus',
  futbinLink: 'https://www.futbin.com/26/evolutions/1251/passing-focus',
  version: 'FC 26',
  description:
    'Unlock defenses and master dead balls in this EVO, boosting passing, crossing, vision, and curve with a perfected weak foot to deliver game-changing assists.',
  descriptionZh: "【准入】非 GK，OVR ≤96。【收益】OVR +7（顶 97）；传球线 6 项（最高 +50）；弱脚 +4。【其他】2 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 7, limit: 97 },
  // Every boost is +50, so the limit is the whole story: what the card ends on, not what it gains.
  subStatBoosts: {
    crossing: { boost: 50, limit: 97 },
    curve: { boost: 50, limit: 95 },
    longPass: { boost: 50, limit: 98 },
    shortPass: { boost: 50, limit: 98 },
    freekick: { boost: 50, limit: 96 },
    vision: { boost: 50, limit: 98 }
  },
  weakFootBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['OVR +7 (97)', 'Curve +50 (95)', 'Short Passing +50 (98)', 'Weak Foot +4']
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +50 (97)',
        'Long Passing +50 (98)',
        'Free Kick +50 (96)',
        'Vision +50 (98)'
      ]
    }
  ],
  trainingTime: '1 Week',
  maxRepeatable: 1
};
