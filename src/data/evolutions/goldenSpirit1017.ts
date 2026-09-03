import { EvolutionDefinition } from '../../types/player';

/**
 * The game calls this Golden Sprint; FUTBIN files it as Golden Spirit, which is where the name here
 * came from and why it read as a missing evo when the two were matched by name. Everything else
 * lines up level for level against the game's own Rewards tab, so they are one evo, not two, and
 * `futbinLink` keeps FUTBIN's spelling because that is the page it points at.
 *
 * Reactions was recorded as +35 in game and +25 here, which is the only number that was wrong.
 *
 * Its caps are what date it — 90 to 95 across the board against the 97s and 98s the current evos
 * hand out — so it is a way to make a low-90s card usable rather than anything for an end-game one,
 * which the OVR ceiling of 91 says too. The exclusion is worth reading twice: not CB *or* CM, which
 * rules out the spine and leaves the flanks and the front line.
 */
export const goldenSpirit1017: EvolutionDefinition = {
  id: '1017',
  name: 'Golden Sprint',
  futbinLink: 'https://www.futbin.com/26/evolutions/1017/golden-spirit',
  version: 'FC 26',
  description: 'Blazing acceleration meets ruthless directness. Built to stretch back lines, win foot races, and turn half-chances into goals. Found in the Saudi Arabia Objective.',
  descriptionZh: "【准入】非 CB/CM，OVR ≤91，PS+ ≤3。【收益】OVR +30（顶 93）；速度线 2 项（最高 +30）、射门线 6 项（最高 +25）、传球线 6 项（最高 +25）、盘带线 6 项（最高 +35）；PlayStyle+ 2 个（Rapid、Quick Step）；PlayStyle 3 个（Low Driven Shot、Pinged Pass、Finesse Shot）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['CB', 'CM']
  },
  ovrBoost: { boost: 30, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 95 },
    agility: { boost: 35, limit: 92 },
    balance: { boost: 35, limit: 92 },
    ballControl: { boost: 35, limit: 93 },
    crossing: { boost: 25, limit: 94 },
    curve: { boost: 25, limit: 93 },
    dribbling: { boost: 35, limit: 95 },
    finishing: { boost: 25, limit: 94 },
    longPass: { boost: 25, limit: 92 },
    longShots: { boost: 25, limit: 90 },
    penalties: { boost: 25, limit: 93 },
    positioning: { boost: 25, limit: 94 },
    reactions: { boost: 35, limit: 92 },
    shortPass: { boost: 25, limit: 93 },
    freekick: { boost: 25, limit: 92 },
    shotPower: { boost: 25, limit: 90 },
    sprintSpeed: { boost: 30, limit: 94 },
    vision: { boost: 25, limit: 92 },
    volleys: { boost: 25, limit: 92 },
    composure: { boost: 35, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Rapid', 'Quick Step'],
    silver: ['Low Driven Shot', 'Pinged Pass', 'Finesse Shot']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (93)', 'Acceleration +30 (95)', 'Long Shots +25 (90)', 'Penalties +25 (93)', 'Vision +25 (92)', 'Volleys +25 (92)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Finishing +25 (94)', 'Att. Position +25 (94)', 'Shot Power +25 (90)', 'Sprint Speed +30 (94)',
        'PlayStyle+: Rapid (3)', 'PlayStyle: Low Driven Shot (8)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Ball Control +35 (93)', 'Crossing +25 (94)', 'Dribbling +35 (95)', 'Short Pass +25 (93)', 'FK Acc. +25 (92)', 'Composure +35 (95)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Agility +35 (92)', 'Curve +25 (93)', 'Long Pass +25 (92)',
        'PlayStyle: Pinged Pass (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +35 (92)', 'Reactions +35 (92)',
        'PlayStyle+: Quick Step (3)', 'PlayStyle: Finesse Shot (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
