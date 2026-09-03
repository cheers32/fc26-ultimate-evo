import { EvolutionDefinition } from '../../types/player';

export const primeProspect1134: EvolutionDefinition = {
  id: '1134',
  name: 'Prime Prospect',
  futbinLink: 'https://www.futbin.com/26/evolutions/1134/prime-prospect',
  version: 'FC 26',
  description: "Catch the football world's attention with dominant performances and rise from a raw prospect to a recognised talent.",
  descriptionZh: "【准入】非 GK，OVR ≤93，PS+ ≤3。【收益】OVR +2（顶 95）；速度线 2 项（最高 +8）、射门线 6 项（最高 +5）、盘带线 6 项（最高 +10）；PlayStyle+ 2 个（Rapid、Finesse Shot）；PlayStyle 4 个（Rapid、Finesse Shot、Low Driven Shot、Incisive Pass）。【其他】4 级 · 可重复 2 次 · Free。",
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 2, limit: 95 },
  subStatBoosts: {
    acceleration: { boost: 8, limit: 94 },
    sprintSpeed: { boost: 8, limit: 94 },
    agility: { boost: 10, limit: 96 },
    balance: { boost: 10, limit: 95 },
    ballControl: { boost: 10, limit: 96 },
    dribbling: { boost: 10, limit: 96 },
    reactions: { boost: 10, limit: 94 },
    composure: { boost: 10, limit: 94 },
    finishing: { boost: 5, limit: 94 },
    longShots: { boost: 5, limit: 95 },
    penalties: { boost: 5, limit: 94 },
    positioning: { boost: 5, limit: 95 },
    shotPower: { boost: 5, limit: 96 },
    volleys: { boost: 5, limit: 94 }
  },
  playStylesAdded: {
    gold: ['Rapid', 'Finesse Shot'],
    silver: ['Rapid', 'Finesse Shot', 'Low Driven Shot', 'Incisive Pass']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (95)', 'Agility +10 (96)', 'Dribbling +10 (96)',
        'Sprint Speed +8 (94)', 'PlayStyle+: Rapid (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +8 (94)', 'Balance +10 (95)', 'Long Shots +5 (95)',
        'Att. Position +5 (95)', 'PlayStyle+: Finesse Shot (3)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Finishing +5 (94)', 'Reactions +10 (94)', 'Shot Power +5 (96)',
        'Composure +10 (94)', 'PlayStyle: Rapid (8)', 'PlayStyle: Finesse Shot (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +10 (96)', 'Penalties +5 (94)', 'Volleys +5 (94)',
        'PlayStyle: Low Driven Shot (8)', 'PlayStyle: Incisive Pass (8)'
      ]
    }
  ],
  maxRepeatable: 2
};
