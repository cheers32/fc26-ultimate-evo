import { EvolutionDefinition } from '../../types/player';

/**
 * The +45 OVR and +40 pace are what the 200 tokens buy: built to drag a mid-rated forward all the
 * way to 98, not to finish one already there. Strength and aggression cap at 92 while the
 * attacking stats cap at 96-98, so a card arriving physical keeps it and one without is not handed
 * any.
 */
export const primeIconicAttacker1279: EvolutionDefinition = {
  id: '1279',
  name: 'Prime Iconic Attacker',
  nameZh: "巅峰传奇攻击手",
  futbinLink: 'https://www.futbin.com/26/evolutions/1279/prime-iconic-attacker',
  version: 'FC 26',
  expiresAt: '2026-10-02',
  description: "True greatness never settles. Elevate your legendary forward past their limits and into their ultimate form. Found in the token store.",
  descriptionZh: "真正的伟大从不满足。把你的传奇前锋推过极限，进入终极形态。来自代币商店。｜适合：ST/LW/RW，+45 OVR 加速度面板 +40，Icon 前锋的顶级改造。",
  cost: 'Tokens — 200',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['ST', 'LW', 'RW']
  },
  ovrBoost: { boost: 45, limit: 98 },
  faceBoosts: {
    // 98, not 96: the level card prints the cap, and Torres 97 comes out on 99 / 97.
    pac: { boost: 40, limit: 98 },
    pas: { boost: 20, limit: 95 }
  },
  subStatBoosts: {
    positioning: { boost: 40, limit: 99 },
    finishing: { boost: 40, limit: 98 },
    shotPower: { boost: 30, limit: 97 },
    longShots: { boost: 30, limit: 96 },
    volleys: { boost: 30, limit: 96 },
    penalties: { boost: 25, limit: 96 },
    agility: { boost: 40, limit: 98 },
    balance: { boost: 30, limit: 96 },
    reactions: { boost: 35, limit: 99 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 40, limit: 98 },
    composure: { boost: 40, limit: 96 },
    headingAcc: { boost: 30, limit: 99 },
    jumping: { boost: 40, limit: 95 },
    stamina: { boost: 35, limit: 95 },
    strength: { boost: 25, limit: 92 },
    aggression: { boost: 20, limit: 92 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +45 (98)', 'PAC +40 (98)', 'Ball Control +30 (97)', 'Jumping +40 (95)',
        'Att. Position +40'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +40 (98)', 'Dribbling +40 (98)', 'Finishing +40 (98)', 'Stamina +35 (95)',
        'Volleys +30 (96)', 'Skills +4'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +30 (96)', 'Penalties +25 (96)', 'Shot Power +30 (97)', 'Strength +25 (92)',
        'Composure +40 (96)', 'Weak Foot +4'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'PAS +20 (95)', 'Aggression +20 (92)', 'Heading Acc. +30', 'Long Shots +30 (96)',
        'Reactions +35'
      ]
    }
  ],
  maxRepeatable: 1
};
