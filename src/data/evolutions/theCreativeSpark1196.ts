import { EvolutionDefinition } from '../../types/player';

export const theCreativeSpark1196: EvolutionDefinition = {
  id: '1196',
  name: 'The Creative Spark',
  futbinLink: 'https://www.futbin.com/26/evolutions/1196/the-creative-spark',
  version: 'FC 26',
  description: 'Found in SBCs.',
  descriptionZh: "【准入】非 ST，OVR ≤96，PS+ ≤4。【收益】OVR +4（顶 97）；速度面板 +4（顶 94）；防守面板 +3（顶 93）；身体面板 +3（顶 94）；射门线 4 项（最高 +6）、传球线 6 项（最高 +7）、盘带线 6 项（最高 +7）；弱脚 +4；花式 +3；PlayStyle 4 个（Pinged Pass、Incisive Pass、Tiki Taka、Long Ball Pass）。【其他】5 级 · SBC Set Reward。",
  cost: 'SBC Set Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['ST']
  },
  ovrBoost: { boost: 4, limit: 97 },
  faceBoosts: {
    pac: { boost: 4, limit: 94 },
    def: { boost: 3, limit: 93 },
    phy: { boost: 3, limit: 94 }
  },
  subStatBoosts: {
    agility: { boost: 4, limit: 96 },
    balance: { boost: 4, limit: 95 },
    ballControl: { boost: 5, limit: 97 },
    dribbling: { boost: 5, limit: 97 },
    reactions: { boost: 7, limit: 96 },
    composure: { boost: 7, limit: 96 },
    crossing: { boost: 4, limit: 94 },
    curve: { boost: 4, limit: 94 },
    longPass: { boost: 7, limit: 98 },
    shortPass: { boost: 7, limit: 98 },
    freekick: { boost: 4, limit: 95 },
    vision: { boost: 7, limit: 97 },
    finishing: { boost: 4, limit: 94 },
    longShots: { boost: 6, limit: 97 },
    positioning: { boost: 4, limit: 97 },
    shotPower: { boost: 6, limit: 97 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  playStylesAdded: {
    gold: [],
    silver: ['Pinged Pass', 'Incisive Pass', 'Tiki Taka', 'Long Ball Pass']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (97)', 'Finishing +4 (94)', 'Long Shots +6 (97)', 'Att. Position +4 (97)',
        'Shot Power +6 (97)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'OVR +1 (97)', 'PAC +4 (94)', 'DEF +3 (93)', 'Skill Moves +3 (4)',
        'PlayStyle: Incisive Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'OVR +1 (97)', 'Long Pass +7 (98)', 'Short Pass +7 (98)', 'FK Acc. +4 (95)',
        'Vision +7 (97)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'OVR +1 (97)', 'Agility +4 (96)', 'Balance +4 (95)', 'Crossing +4 (94)',
        'Curve +4 (94)', 'Reactions +7 (96)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'PHY +3 (94)', 'Ball Control +5 (97)', 'Dribbling +5 (97)', 'Composure +7 (96)',
        'Weak Foot +4 (5)', 'PlayStyle: Long Ball Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
