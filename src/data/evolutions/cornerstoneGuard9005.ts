import { EvolutionDefinition } from '../../types/player';

/**
 * The only entry condition is the position: LB or RB, and no OVR ceiling at all. The game prints no
 * cap, so nothing is too good for it — which on a shelf where almost every evo stops at 96 or 97
 * makes this the one an end-game fullback can still take.
 *
 * What it gives is modest by comparison, +10 OVR and +20 across the board, and it grants no weak
 * foot or skill moves. The value is in who can run it rather than in the size of it.
 *
 * Read off the game's own Rewards tab. The id is provisional and outside FUTBIN's range on purpose
 * — see flipTheSwitch9001 for why.
 */
export const cornerstoneGuard9005: EvolutionDefinition = {
  id: '9005',
  name: 'Cornerstone Guard',
  nameZh: "基石卫士",
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  description: 'Lock down dangerous attackers, hold your line with total discipline, and provide a steady option to recycle possession under pressure.',
  descriptionZh: "锁死危险的攻击手，用绝对的纪律守住防线，并在压力下提供稳定的出球点。｜适合：LB/RB 专用，免费。最特别的是它不设 OVR 上限 —— 在几乎所有 evo 都卡 96/97 的情况下，这是终局边后卫还能吃到的少数之一。代价是加成不大（+10 OVR、全线 +20），也不送弱脚花式。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 99,
    positions: ['LB', 'RB']
  },
  ovrBoost: { boost: 10, limit: 99 },
  faceBoosts: {
    pas: { boost: 20, limit: 98 },
    def: { boost: 20, limit: 99 }
  },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 99 },
    sprintSpeed: { boost: 20, limit: 99 },
    balance: { boost: 20, limit: 98 },
    ballControl: { boost: 20, limit: 98 },
    dribbling: { boost: 20, limit: 98 },
    positioning: { boost: 20, limit: 99 },
    shotPower: { boost: 20, limit: 99 },
    stamina: { boost: 20, limit: 99 },
    strength: { boost: 20, limit: 98 }
  },
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10', 'Passing +20 (98)', 'Acceleration +20', 'Sprint Speed +20',
        'Balance +20 (98)', 'Ball Control +20 (98)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending +20', 'Att. Position +20', 'Shot Power +20', 'Dribbling +20 (98)',
        'Stamina +20', 'Strength +20 (98)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
