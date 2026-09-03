import { EvolutionDefinition } from '../../types/player';

export const culturedCommander1177: EvolutionDefinition = {
  id: '1177',
  name: 'Cultured Commander',
  futbinLink: 'https://www.futbin.com/26/evolutions/1177/cultured-commander',
  version: 'FC 26',
  description: 'The most complete defenders do things others simply cannot. Evolve your CB and unlock the technical quality and commanding presence that makes them one of a kind.',
  descriptionZh: "【准入】CB 专用，OVR ≤95，PS+ ≤4。【收益】OVR +3（顶 96）；传球面板 +2（顶 93）；盘带面板 +2（顶 93）；防守面板 +7（顶 96）；身体面板 +5（顶 96）；弱脚 +3；花式 +3；PlayStyle+ 3 个（Intercept+、Jockey+、Block+）；PlayStyle 3 个（Quick Step、Aerial Fortress、Anticipate）。【其他】2 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 95,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CB']
  },
  ovrBoost: { boost: 3, limit: 96 },
  faceBoosts: {
    pas: { boost: 2, limit: 93 },
    dri: { boost: 2, limit: 93 },
    def: { boost: 7, limit: 96 },
    phy: { boost: 5, limit: 96 }
  },
  subStatBoosts: {},
  weakFootBoost: 3,
  skillMovesBoost: 3,
  playStylesAdded: {
    gold: ['Intercept+', 'Jockey+', 'Block+'],
    silver: ['Quick Step', 'Aerial Fortress', 'Anticipate']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (96)', 'Passing Face +2 (93)', 'Dribbling Face +2 (93)', 'Weak Foot +3 (5)',
        'PlayStyle+: Intercept (4)', 'PlayStyle+: Jockey (4)', 'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending Face +7 (96)', 'Physical Face +5 (96)', 'Skill Moves +3 (5)',
        'PlayStyle+: Block (4)', 'PlayStyle: Aerial Fortress (7)', 'PlayStyle: Anticipate (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
