import { EvolutionDefinition } from '../../types/player';

/**
 * Twelve sub-stats over three levels, free, no position requirement, and again only +5 OVR — so like
 * Magnetic Marksman it buys a lot of stats without costing the card its eligibility for anything
 * else.
 *
 * The spread is the unusual part: the whole defensive block at +30 (heading, awareness, both
 * tackles, interceptions) sitting next to shot power +30 and attacking position. It is not a
 * defender's evo and not a forward's; it is the one to run on a midfielder who is asked to do both.
 *
 * Nothing here touches pace, and the only physical stat is absent entirely, so a card's AcceleRATE
 * comes out of it unchanged.
 *
 * Read off the game's own Rewards tab. The id is provisional and outside FUTBIN's range on purpose
 * — see flipTheSwitch9001 for why.
 */
export const groundedGuardian9004: EvolutionDefinition = {
  id: '9004',
  name: 'Grounded Guardian',
  nameZh: "沉稳守护者",
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  expiresAt: '2026-10-16',
  description: 'Shield possession with authority across every inch of the pitch, using crisp tackles and smooth turns to outsmart incoming pressure.',
  descriptionZh: "在球场每一寸用权威护住球权，用干净的抢断和流畅的转身化解迎面而来的压迫。｜适合：不挑位置、免费、3 级；防守四项各 +30 紧挨着射门力量 +30，是攻守两头一起补的组合，最适合需要两头跑的中场。OVR 只 +5 不占空间，也完全不碰速度和身体，加速类型不受影响。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 98
  },
  ovrBoost: { boost: 5, limit: 99 },
  subStatBoosts: {
    positioning: { boost: 20, limit: 99 },
    shotPower: { boost: 30, limit: 99 },
    longShots: { boost: 20, limit: 99 },
    balance: { boost: 20, limit: 99 },
    reactions: { boost: 30, limit: 99 },
    ballControl: { boost: 20, limit: 98 },
    dribbling: { boost: 20, limit: 98 },
    interceptions: { boost: 30, limit: 99 },
    headingAcc: { boost: 30, limit: 99 },
    defAwareness: { boost: 30, limit: 99 },
    standTackle: { boost: 30, limit: 99 },
    slideTackle: { boost: 30, limit: 99 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5', 'Att. Position +20', 'Shot Power +30', 'Long Shots +20', 'Balance +20',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Reactions +30', 'Ball Control +20 (98)', 'Dribbling +20 (98)', 'Interceptions +30',
        'Weak Foot +4 (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Heading Acc. +30', 'Def. Aware +30', 'Stand Tackle +30', 'Slide Tackle +30',
        'Skill Moves +4 (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
