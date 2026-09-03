import { EvolutionDefinition } from '../../types/player';

// GK-only evolution. Its stat boosts (Diving/Handling/Kicking/Reflexes/GK Positioning)
// have no equivalent in this app's outfield-player stat schema (pac/sho/pas/dri/def/phy),
// so subStatBoosts is intentionally left empty until GK stats are supported.
export const noWayThrough1156: EvolutionDefinition = {
  id: '1156',
  name: 'No Way Through',
  futbinLink: 'https://www.futbin.com/26/evolutions/1156/no-way-through',
  version: 'FC 26',
  description: "Build a brick wall between the posts. With feline reflexes and spectacular dives, deny every opponent a chance. Found in the FUTTIES Token Store.",
  descriptionZh: "在门柱之间筑起一堵砖墙。用猫科动物般的反应和精彩的飞身扑救，让每个对手都没有机会。来自 FUTTIES 代币商店。｜适合：门将专用，+20 OVR 并送 4 个 PlayStyle+。",
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['GK']
  },
  ovrBoost: { boost: 20, limit: 97 },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Far Reach+', 'Footwork+', 'Rush Out+', 'Pinged Pass+'],
    silver: ['Cross Claimer', 'Deflector', 'Far Throw', 'Long Ball Pass']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10 (97)', 'Handling +20 (95)', 'Kicking +20 (95)', 'Reactions +30 (95)', 'Weak Foot +4 (5)',
        'PlayStyle+: Far Reach (4)', 'PlayStyle+: Footwork (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'OVR +10 (97)', 'Diving +20 (98)', 'Reflexes +25 (97)', 'Acceleration +30 (90)', 'Sprint Speed +30 (90)',
        'PlayStyle+: Rush Out (4)', 'PlayStyle+: Pinged Pass (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Positioning +25 (96)', 'Skill Moves +4 (5)',
        'PlayStyle: Cross Claimer (7)', 'PlayStyle: Deflector (7)', 'PlayStyle: Far Throw (7)', 'PlayStyle: Long Ball Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
