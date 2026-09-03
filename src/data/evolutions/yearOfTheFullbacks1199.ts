import { EvolutionDefinition } from '../../types/player';

export const yearOfTheFullbacks1199: EvolutionDefinition = {
  id: '1199',
  name: 'Year of the Fullbacks',
  futbinLink: 'https://www.futbin.com/26/evolutions/1199/year-of-the-fullbacks',
  version: 'FC 26',
  description: 'Turn back time to 2021! Slide your favourite fullback into the CB role with boosted defence and physical stats to stop any attacker in their tracks.',
  descriptionZh: "【准入】LB/RB 专用，OVR ≤95，PS+ ≤4。【收益】OVR +8（顶 97）；盘带线 2 项（最高 +20）、防守线 5 项（最高 +20）、身体线 4 项（最高 +20）；弱脚 +4；PlayStyle+ 3 个（Intercept、Anticipate、Aerial Fortress）；PlayStyle 3 个（Pinged Pass、Block、Bruiser）；加位置 CB。【其他】4 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LB', 'RB']
  },
  ovrBoost: { boost: 8, limit: 97 },
  subStatBoosts: {
    aggression: { boost: 20, limit: 97 },
    headingAcc: { boost: 20, limit: 96 },
    interceptions: { boost: 20, limit: 96 },
    jumping: { boost: 20, limit: 97 },
    defAwareness: { boost: 20, limit: 96 },
    reactions: { boost: 20, limit: 96 },
    slideTackle: { boost: 20, limit: 97 },
    standTackle: { boost: 20, limit: 97 },
    stamina: { boost: 20, limit: 97 },
    strength: { boost: 20, limit: 97 },
    composure: { boost: 20, limit: 96 }
  },
  weakFootBoost: 4,
  positionsAdded: ['CB'],
  playStylesAdded: {
    gold: ['Intercept', 'Anticipate', 'Aerial Fortress'],
    silver: ['Pinged Pass', 'Block', 'Bruiser']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +8 (97)', 'Aggression +20 (97)', 'Jumping +20 (97)',
        'Reactions +20 (96)', 'Strength +20 (97)', 'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Slide Tackle +20 (97)', 'Stamina +20 (97)', 'Composure +20 (96)',
        'Position: CB', 'PlayStyle+: Intercept (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Heading Acc. +20 (96)', 'Interceptions +20 (96)', 'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Def. Aware +20 (96)', 'Stand Tackle +20 (97)', 'PlayStyle+: Aerial Fortress (4)',
        'PlayStyle: Block (7)', 'PlayStyle: Bruiser (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
