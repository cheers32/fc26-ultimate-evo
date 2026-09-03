import { EvolutionDefinition } from '../../types/player';

export const creativeLicense1253: EvolutionDefinition = {
  id: '1253',
  name: 'Creative License',
  futbinLink: 'https://www.futbin.com/26/evolutions/1253/creative-license',
  version: 'FC 26',
  description: "The greatest playmakers make every touch count. Evolve your player and develop the vision and creativity that turns every opportunity into gold. Found in the Pre Season Token Store.",
  descriptionZh: "【准入】CAM 专用，OVR ≤97，PS+ ≤4。【收益】OVR +4（顶 98）；速度线 2 项（最高 +10）、传球线 6 项（最高 +20）；花式 +4；PlayStyle+ 3 个（Quick Step、Incisive Pass、Pinged Pass）；PlayStyle 3 个（Tiki Taka、Rapid、Inventive）。【其他】3 级 · Tokens — 100 Pre Season Tokens。",
  cost: 'Tokens — 100 Pre Season Tokens',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CAM']
  },
  ovrBoost: { boost: 4, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 10, limit: 98 },
    sprintSpeed: { boost: 10, limit: 98 },
    crossing: { boost: 20, limit: 98 },
    curve: { boost: 20, limit: 98 },
    longPass: { boost: 20, limit: 98 },
    shortPass: { boost: 20, limit: 98 },
    freekick: { boost: 20, limit: 98 },
    vision: { boost: 20, limit: 98 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Quick Step', 'Incisive Pass', 'Pinged Pass'],
    silver: ['Tiki Taka', 'Rapid', 'Inventive']
  },
  playStylesLimit: { gold: 4, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +4 (98)',
        'Acceleration +10 (98)',
        'Sprint Speed +10 (98)',
        'Vision +20 (98)',
        'Skills +4',
        'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +20 (98)',
        'Short Passing +20 (98)',
        'Free Kick +20 (98)',
        'PlayStyle+: Incisive Pass (4)',
        'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +20 (98)',
        'Long Passing +20 (98)',
        'PlayStyle+: Pinged Pass (4)',
        'PlayStyle: Rapid (7)',
        'PlayStyle: Inventive (7)'
      ]
    }
  ],
  trainingTime: '1 Month',
  maxRepeatable: 1
};
