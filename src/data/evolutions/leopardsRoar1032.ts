import { EvolutionDefinition } from '../../types/player';

export const leopardsRoar1032: EvolutionDefinition = {
  id: '1032',
  name: "Leopard's Roar",
  futbinLink: 'https://www.futbin.com/26/evolutions/1032/leopards-roar',
  version: 'FC 26',
  description: 'Transform a defender into a fearless game-changer. Rock solid in defense, yet dangerous when charging forward.',
  descriptionZh: "【准入】CB 专用，非 ST，OVR ≤91，PS+ ≤3。【收益】OVR +30（顶 93）；速度线 2 项（最高 +25）、射门线 6 项（最高 +50）、传球线 4 项（最高 +20）、盘带线 6 项（最高 +20）、防守线 1 项（最高 +40）、身体线 4 项（最高 +30）；弱脚 +4；PlayStyle+ 2 个（Quick Step、Intercept）；PlayStyle 3 个（Precision Header、Aerial Fortress、Low Driven Shot）。【其他】5 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CB'],
    excludedPositions: ['ST']
  },
  ovrBoost: { boost: 30, limit: 93 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 92 },
    aggression: { boost: 25, limit: 93 },
    agility: { boost: 15, limit: 92 },
    balance: { boost: 15, limit: 92 },
    ballControl: { boost: 15, limit: 92 },
    curve: { boost: 20, limit: 92 },
    dribbling: { boost: 15, limit: 92 },
    finishing: { boost: 50, limit: 94 },
    headingAcc: { boost: 40, limit: 96 },
    jumping: { boost: 30, limit: 96 },
    longPass: { boost: 20, limit: 94 },
    longShots: { boost: 50, limit: 95 },
    penalties: { boost: 50, limit: 92 },
    // Futbin shows "Positioning +50" with no cap for this card (unlike every other stat here);
    // 99 (the engine's own sub-stat ceiling) is used as the least-assuming stand-in.
    positioning: { boost: 50, limit: 99 },
    reactions: { boost: 20, limit: 96 },
    shortPass: { boost: 20, limit: 94 },
    shotPower: { boost: 50, limit: 95 },
    sprintSpeed: { boost: 25, limit: 92 },
    stamina: { boost: 25, limit: 92 },
    strength: { boost: 30, limit: 94 },
    vision: { boost: 20, limit: 94 },
    volleys: { boost: 50, limit: 92 },
    composure: { boost: 20, limit: 96 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Quick Step', 'Intercept'],
    silver: ['Precision Header', 'Aerial Fortress', 'Low Driven Shot']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (93)', 'Jumping +30 (96)', 'Att. Position +50', 'Reactions +20 (96)', 'Short Pass +20 (94)',
        'PlayStyle+: Quick Step (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +25 (92)', 'Ball Control +15 (92)', 'Finishing +50 (94)', 'Long Pass +20 (94)', 'Stamina +25 (92)',
        'PlayStyle+: Intercept (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +20 (92)', 'Dribbling +15 (92)', 'Shot Power +50 (95)', 'Sprint Speed +25 (92)', 'Strength +30 (94)',
        'PlayStyle: Precision Header (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +25 (93)', 'Agility +15 (92)', 'Heading Acc. +40 (96)', 'Long Shots +50 (95)', 'Penalties +50 (92)',
        'PlayStyle: Aerial Fortress (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Balance +15 (92)', 'Vision +20 (94)', 'Volleys +50 (92)', 'Composure +20 (96)', 'Weak Foot +4 (5)',
        'PlayStyle: Low Driven Shot (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
