import { EvolutionDefinition } from '../../types/player';

export const youthfulValor1132: EvolutionDefinition = {
  id: '1132',
  name: 'Youthful Valor',
  futbinLink: 'https://www.futbin.com/26/evolutions/1132/youthful-valor',
  version: 'FC 26',
  description: "Turn young ambition into a fearless wall by strengthening your player's defensive and physical stats.",
  descriptionZh: "【准入】CM/CDM 专用，OVR ≤93，PS+ ≤3。【收益】OVR +2（顶 95）；防守面板 +7（顶 96）；身体面板 +7（顶 96）；PlayStyle+ 1 个（Anticipate）；PlayStyle 3 个（Anticipate、Intercept、Bruiser）；加位置 CM/CDM。【其他】2 级 · 可重复 2 次 · Free。",
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    maxTotalPositions: 5,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CM', 'CDM']
  },
  ovrBoost: { boost: 2, limit: 95 },
  faceBoosts: {
    def: { boost: 7, limit: 96 },
    phy: { boost: 7, limit: 96 }
  },
  subStatBoosts: {},
  positionsAdded: ['CM', 'CDM'],
  playStylesAdded: {
    gold: ['Anticipate'],
    silver: ['Anticipate', 'Intercept', 'Bruiser']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (95)', 'DEF +7 (96)', 'Position: CM', 'PlayStyle+: Anticipate (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'PHY +7 (96)', 'Position: CDM',
        'PlayStyle: Anticipate (8)', 'PlayStyle: Intercept (8)', 'PlayStyle: Bruiser (8)'
      ]
    }
  ],
  maxRepeatable: 2
};
