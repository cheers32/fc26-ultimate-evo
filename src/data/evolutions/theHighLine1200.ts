import { EvolutionDefinition } from '../../types/player';

export const theHighLine1200: EvolutionDefinition = {
  id: '1200',
  name: 'The High Line',
  futbinLink: 'https://www.futbin.com/26/evolutions/1200/the-high-line',
  version: 'FC 26',
  description: "Compress the pitch. Boost your defender's defending to choke out the opponent's space, then use elite passing to build right out from the back.",
  descriptionZh: "压缩球场。提升后卫的防守来扼杀对手的空间，再用精英级传球从后场组织。｜适合：CB 专用，防守 +6、传球 +4 面板。",
  cost: '150 Tokens / 30,000 Coins',
  requirements: {
    maxOvr: 96,
    positions: ['CB']
  },
  ovrBoost: { boost: 0, limit: 96 },
  faceBoosts: {
    pas: { boost: 4, limit: 93 },
    def: { boost: 6, limit: 97 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: ['PAS +4 (93)', 'DEF +6 (97)']
    }
  ],
  maxRepeatable: 3
};
