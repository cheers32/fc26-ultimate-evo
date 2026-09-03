import { EvolutionDefinition } from '../../types/player';

export const setPieceFC1158: EvolutionDefinition = {
  id: '1158',
  name: 'Set Piece FC',
  futbinLink: 'https://www.futbin.com/26/evolutions/1158/set-piece-fc',
  version: 'FC 26',
  description: 'Turn every deadball into a goal threat and deliver unbelievable quality that will have your fans singing "Set Piece again Ole, Ole!".',
  descriptionZh: "【准入】非 GK，OVR ≤96，PS+ ≤3。【收益】OVR +1（顶 97）；速度面板 +3（顶 95）；盘带面板 +3（顶 97）；射门线 2 项（最高 +80）、传球线 3 项（最高 +85）；PlayStyle+ 2 个（Finesse Shot+、Low Driven Shot+）。【其他】2 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 1, limit: 97 },
  faceBoosts: {
    pac: { boost: 3, limit: 95 },
    dri: { boost: 3, limit: 97 }
  },
  subStatBoosts: {
    crossing: { boost: 80, limit: 99 },
    curve: { boost: 85, limit: 99 },
    penalties: { boost: 80, limit: 99 },
    freekick: { boost: 85, limit: 99 },
    shotPower: { boost: 80, limit: 99 }
  },
  playStylesAdded: {
    gold: ['Finesse Shot+', 'Low Driven Shot+'],
    silver: []
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (97)', 'Pace Face +3 (95)', 'Dribbling Face +3 (97)',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +80 (99)', 'Curve +85 (99)', 'Penalties +80 (99)', 'FK Acc. +85 (99)', 'Shot Power +80 (99)'
      ]
    }
  ],
  maxRepeatable: 1
};
