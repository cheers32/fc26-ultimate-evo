import { EvolutionDefinition } from '../../types/player';

export const sunnyInnit1211: EvolutionDefinition = {
  id: '1211',
  name: 'Sunny Innit',
  futbinLink: 'https://www.futbin.com/26/evolutions/1211/sunny-innit',
  version: 'FC 26',
  description: "Y'alright Neymar, sunny innit?",
  descriptionZh: "【准入】LW/RW 专用，OVR ≤96，PS+ ≤4。【收益】OVR +25（顶 98）；速度线 2 项（最高 +25）、射门线 6 项（最高 +25）、传球线 5 项（最高 +25）、盘带线 6 项（最高 +25）；弱脚 +4；花式 +4；PlayStyle+ 4 个（Finesse Shot、Technical、Low Driven Shot、Quick Step）；PlayStyle 3 个（Incisive Pass、Trickster、Rapid）。【其他】5 级 · 200 FUTTIES Tokens。",
  cost: '200 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['LW', 'RW']
  },
  ovrBoost: { boost: 25, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 97 },
    sprintSpeed: { boost: 25, limit: 94 },
    agility: { boost: 25, limit: 97 },
    balance: { boost: 25, limit: 95 },
    ballControl: { boost: 25, limit: 98 },
    dribbling: { boost: 25, limit: 98 },
    reactions: { boost: 25, limit: 96 },
    composure: { boost: 25, limit: 99 },
    curve: { boost: 25, limit: 98 },
    longPass: { boost: 25, limit: 95 },
    shortPass: { boost: 25, limit: 96 },
    freekick: { boost: 25, limit: 96 },
    vision: { boost: 25, limit: 97 },
    finishing: { boost: 25, limit: 97 },
    longShots: { boost: 25, limit: 94 },
    penalties: { boost: 25, limit: 95 },
    positioning: { boost: 25, limit: 98 },
    shotPower: { boost: 25, limit: 96 },
    volleys: { boost: 25, limit: 94 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Technical', 'Low Driven Shot', 'Quick Step'],
    silver: ['Incisive Pass', 'Trickster', 'Rapid']
  },
  playStylesLimit: {
    gold: 4,
    silver: 5
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +25 (98)', 'Acceleration +25 (97)', 'Curve +25 (98)',
        'Sprint Speed +25 (94)', 'Vision +25 (97)', 'PlayStyle+: Finesse Shot (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +25 (97)', 'Finishing +25 (97)', 'Long Shots +25 (94)',
        'Att. Position +25 (98)', 'Shot Power +25 (96)', 'PlayStyle+: Technical (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Balance +25 (95)', 'Penalties +25 (95)', 'Reactions +25 (96)',
        'Short Pass +25 (96)', 'FK Acc. +25 (96)', 'PlayStyle+: Low Driven Shot (4)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +25 (98)', 'Dribbling +25 (98)', 'Long Pass +25 (95)',
        'Volleys +25 (94)', 'Composure +25 (99)', 'PlayStyle+: Quick Step (4)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Weak Foot +4', 'Skill Moves +4',
        'PlayStyle: Incisive Pass (5)', 'PlayStyle: Trickster (5)', 'PlayStyle: Rapid (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
