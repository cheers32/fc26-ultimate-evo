import { EvolutionDefinition } from '../../types/player';

/**
 * A full-back evo that spends almost everything on the two stats a full-back is judged by —
 * acceleration and sprint speed, +20 each to 98 across two levels — and hands out small change
 * everywhere else. Note the odd caps: heading 90 and jumping 92, well below the rest, so it will
 * not make an aerial defender out of one that is not already.
 *
 * The dribbling block was recorded wrong the first time and a 97 Maldini caught it: agility was
 * down as +8 to 95 where it is +14 to 94, and balance, ball control and dribbling each had a cap
 * a point low. The card came out 90/94/95/96 against the game's 94/95/96/97, which is a whole
 * point of face dribbling.
 */
export const guardianOfTheWing1280: EvolutionDefinition = {
  id: '1280',
  name: 'Guardian of the Wing',
  futbinLink: 'https://www.futbin.com/26/evolutions/1280/guardian-of-the-wing',
  version: 'FC 26',
  description: 'You protected the wing, now become its guardian. Upgrade your wide defender to lock down the flank, win every duel and make sure nothing gets past on your side.',
  descriptionZh: "【准入】LB/RB 专用，OVR ≤97。【收益】OVR +9（顶 98）；传球面板 +10（顶 95）；速度线 2 项（最高 +20）、盘带线 6 项（最高 +15）、防守线 5 项（最高 +12）、身体线 4 项（最高 +8）；弱脚 +4；花式 +3。【其他】4 级 · 100 FC Points / 25,000 Coins。",
  cost: '100 FC Points / 25,000 Coins',
  requirements: {
    maxOvr: 97,
    positions: ['LB', 'RB']
  },
  ovrBoost: { boost: 9, limit: 98 },
  faceBoosts: {
    pas: { boost: 10, limit: 95 }
  },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 98 },
    sprintSpeed: { boost: 20, limit: 98 },
    agility: { boost: 14, limit: 94 },
    balance: { boost: 14, limit: 95 },
    reactions: { boost: 14, limit: 94 },
    ballControl: { boost: 14, limit: 96 },
    dribbling: { boost: 14, limit: 97 },
    composure: { boost: 15, limit: 98 },
    interceptions: { boost: 12, limit: 96 },
    defAwareness: { boost: 12, limit: 97 },
    standTackle: { boost: 12, limit: 99 },
    slideTackle: { boost: 12, limit: 98 },
    headingAcc: { boost: 12, limit: 90 },
    jumping: { boost: 8, limit: 92 },
    stamina: { boost: 8, limit: 98 },
    strength: { boost: 8, limit: 96 },
    aggression: { boost: 8, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 3,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +9 (98)', 'Passing +10 (95)', 'Acceleration +10 (98)', 'Sprint Speed +10 (98)',
        'Agility +14 (94)', 'Balance +14 (95)', 'Reactions +14 (94)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Interceptions +12 (96)', 'Heading Acc. +12 (90)', 'Def. Aware +12 (97)',
        'Stand Tackle +12', 'Slide Tackle +12 (98)', 'Jumping +8 (92)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Acceleration +10 (98)', 'Sprint Speed +10 (98)', 'Stamina +8 (98)',
        'Strength +8 (96)', 'Aggression +8 (95)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +14 (96)', 'Dribbling +14 (97)', 'Composure +15 (98)',
        'Skill Moves +3 (5)', 'Weak Foot +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
