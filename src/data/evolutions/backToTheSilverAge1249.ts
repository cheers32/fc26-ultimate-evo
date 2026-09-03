import { EvolutionDefinition } from '../../types/player';

/**
 * A 74-max entry gate, which is the whole shape of it: this is for a silver striker, and it lifts
 * one all the way to 90 with four PlayStyle+ and five-star weak foot and skills. Nothing in an
 * end-game club can run it — the gate is below every card worth owning — so it is a card you go
 * and buy for the purpose rather than one you already have.
 *
 * The OVR ceiling of 90 is the catch: it is a finished silver, not a competitor for the 97s, and
 * every sub-stat cap sits in the 90s to match.
 */
export const backToTheSilverAge1249: EvolutionDefinition = {
  id: '1249',
  name: 'Back to the Silver Age',
  futbinLink: 'https://www.futbin.com/26/evolutions/1249/back-to-the-silver-age',
  version: 'FC 26',
  description: 'Return to the days when one towering silver striker terrorised defences.',
  descriptionZh: "【准入】ST 专用，OVR ≤74，PS+ ≤4。【收益】OVR +40（顶 90）；速度线 2 项（最高 +70）、射门线 6 项（最高 +70）、传球线 3 项（最高 +50）、盘带线 6 项（最高 +50）、防守线 1 项（最高 +50）、身体线 3 项（最高 +50）；弱脚 +4；花式 +4；PlayStyle+ 4 个（Finesse Shot、Low Driven Shot、Rapid、First Touch）；PlayStyle 3 个（Pinged Pass、Tiki Taka、Technical）。【其他】5 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 74,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['ST']
  },
  ovrBoost: { boost: 40, limit: 90 },
  subStatBoosts: {
    acceleration: { boost: 70, limit: 96 },
    sprintSpeed: { boost: 70, limit: 94 },
    agility: { boost: 50, limit: 92 },
    balance: { boost: 50, limit: 94 },
    reactions: { boost: 50, limit: 93 },
    ballControl: { boost: 50, limit: 92 },
    dribbling: { boost: 50, limit: 97 },
    composure: { boost: 50, limit: 95 },
    positioning: { boost: 70, limit: 94 },
    finishing: { boost: 70, limit: 95 },
    shotPower: { boost: 70, limit: 96 },
    longShots: { boost: 70, limit: 95 },
    volleys: { boost: 70, limit: 96 },
    penalties: { boost: 70, limit: 95 },
    vision: { boost: 50, limit: 93 },
    shortPass: { boost: 50, limit: 98 },
    longPass: { boost: 50, limit: 92 },
    headingAcc: { boost: 50, limit: 96 },
    jumping: { boost: 50, limit: 94 },
    stamina: { boost: 50, limit: 96 },
    strength: { boost: 40, limit: 90 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Low Driven Shot', 'Rapid', 'First Touch'],
    silver: ['Pinged Pass', 'Tiki Taka', 'Technical']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +40 (90)', 'Acceleration +70 (96)', 'Sprint Speed +70 (94)', 'Agility +50 (92)',
        'Balance +50 (94)', 'Skill Moves +4 (5)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +70 (95)', 'Heading Acc. +50 (96)', 'Att. Position +70 (94)',
        'Shot Power +70 (96)', 'PlayStyle+: Low Driven Shot (4)', 'PlayStyle: Pinged Pass (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Long Passing +50 (92)', 'Long Shots +70 (95)', 'Penalties +70 (95)',
        'Short Passing +50 (98)', 'Volleys +70 (96)', 'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Jumping +50 (94)', 'Stamina +50 (96)', 'Strength +40 (90)', 'Composure +50 (95)',
        'PlayStyle+: Rapid (4)', 'PlayStyle: Tiki Taka (7)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball control +50 (92)', 'Dribbling +50 (97)', 'Reactions +50 (93)', 'Vision +50 (93)',
        'PlayStyle+: First Touch (4)', 'PlayStyle: Technical (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
