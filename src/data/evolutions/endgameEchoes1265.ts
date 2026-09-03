import { EvolutionDefinition } from '../../types/player';

/**
 * Repeatable twice, which is unusual for something this large, and the only one of this batch that
 * leaves Defending uncapped — FUTBIN prints it bare, so the 99 ceiling is the only thing holding
 * it. Restricted to CDM and CM, and the sub-stat spread says why: it is a passing and ball-control
 * evo with the physical block attached, not a destroyer's.
 */
export const endgameEchoes1265: EvolutionDefinition = {
  id: '1265',
  name: 'Endgame Echoes',
  futbinLink: 'https://www.futbin.com/26/evolutions/1265/endgame-echoes',
  version: 'FC 26',
  description: 'Found in the store.',
  descriptionZh: "来自商店。｜适合：CDM/CM 专用，+30 OVR 加三个面板 +30，可重复 2 次，中场的大改造。",
  cost: '250 FC Points / 100,000 Coins',
  requirements: {
    maxOvr: 97,
    positions: ['CDM', 'CM']
  },
  ovrBoost: { boost: 30, limit: 98 },
  faceBoosts: {
    pac: { boost: 30, limit: 96 },
    sho: { boost: 30, limit: 96 },
    def: { boost: 30, limit: 99 }
  },
  subStatBoosts: {
    agility: { boost: 35, limit: 97 },
    balance: { boost: 35, limit: 98 },
    reactions: { boost: 35, limit: 98 },
    ballControl: { boost: 35, limit: 96 },
    dribbling: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 97 },
    vision: { boost: 35, limit: 99 },
    shortPass: { boost: 35, limit: 97 },
    longPass: { boost: 35, limit: 99 },
    crossing: { boost: 30, limit: 98 },
    curve: { boost: 35, limit: 97 },
    freekick: { boost: 30, limit: 98 },
    jumping: { boost: 30, limit: 96 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 30, limit: 96 },
    aggression: { boost: 30, limit: 96 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  maxRepeatable: 2
};
