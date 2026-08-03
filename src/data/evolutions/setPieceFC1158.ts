import { EvolutionDefinition } from '../../types/player';

export const setPieceFC1158: EvolutionDefinition = {
  id: '1158',
  name: 'Set Piece FC',
  futbinLink: 'https://www.futbin.com/26/evolutions/1158/set-piece-fc',
  version: 'FC 26',
  description: 'Turn every deadball into a goal threat and deliver unbelievable quality that will have your fans singing "Set Piece again Ole, Ole!".',
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
