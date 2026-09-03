import { EvolutionDefinition } from '../../types/player';

export const speedDemon1185: EvolutionDefinition = {
  id: '1185',
  name: 'Speed Demon',
  futbinLink: 'https://www.futbin.com/26/evolutions/1185/speed-demon',
  version: 'FC 26',
  description: 'Become an absolute speed demon on the pitch.',
  descriptionZh: "【准入】OVR ≤96，PS+ ≤4。【收益】OVR +1（顶 99）；速度线 2 项（最高 +10）、盘带线 2 项（最高 +10）、身体线 1 项（最高 +10）；弱脚 +4；花式 +4；PlayStyle+ 2 个（Quick Step、Rapid）；PlayStyle 2 个（Quick Step、Rapid）。【其他】2 级 · 100 FUTTIES Tokens。",
  cost: '100 FUTTIES Tokens',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 1, limit: 99 },
  subStatBoosts: {
    acceleration: { boost: 10, limit: 96 },
    sprintSpeed: { boost: 10, limit: 96 },
    agility: { boost: 10, limit: 97 },
    balance: { boost: 10, limit: 96 },
    stamina: { boost: 10, limit: 96 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Quick Step', 'Rapid'],
    silver: ['Quick Step', 'Rapid']
  },
  playStylesLimit: {
    gold: 4
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1', 'Acceleration +10 (96)', 'Stamina +10 (96)', 'Weak Foot +4 (5)',
        'PlayStyle+: Quick Step (4)', 'PlayStyle+: Rapid (4)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +10 (97)', 'Balance +10 (96)', 'Sprint Speed +10 (96)',
        'Skill Moves +4 (5)', 'PlayStyle: Quick Step', 'PlayStyle: Rapid'
      ]
    }
  ],
  maxRepeatable: 1
};
