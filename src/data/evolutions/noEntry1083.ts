import { EvolutionDefinition } from '../../types/player';

export const noEntry1083: EvolutionDefinition = {
  id: '1083',
  name: 'No Entry',
  futbinLink: 'https://www.futbin.com/26/evolutions/1083/no-entry',
  version: 'FC 26',
  description: "Shut down the attackers and win every battle with dominant tackling and relentless physicality. Found in the Turkey/Sweden Objective.",
  descriptionZh: "【准入】CB 专用，OVR ≤92，PS+ ≤3。【收益】OVR +1（顶 93）；防守线 5 项（最高 +10）、身体线 4 项（最高 +10）；PlayStyle+ 3 个（Intercept、Anticipate、Jockey）；PlayStyle 4 个（Bruiser、Block、Aerial Fortress、Slide Tackle）。【其他】3 级 · Objective Reward。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 92,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['CB']
  },
  ovrBoost: { boost: 1, limit: 93 },
  subStatBoosts: {
    aggression: { boost: 10, limit: 95 },
    headingAcc: { boost: 10, limit: 94 },
    interceptions: { boost: 10, limit: 96 },
    jumping: { boost: 10, limit: 94 },
    defAwareness: { boost: 10, limit: 96 },
    slideTackle: { boost: 10, limit: 95 },
    standTackle: { boost: 10, limit: 95 },
    stamina: { boost: 10, limit: 92 },
    strength: { boost: 10, limit: 95 }
  },
  playStylesAdded: {
    gold: ['Intercept', 'Anticipate', 'Jockey'],
    silver: ['Bruiser', 'Block', 'Aerial Fortress', 'Slide Tackle']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (93)', 'Heading Acc. +10 (94)', 'Interceptions +10 (96)', 'Def. Aware +10 (96)',
        'PlayStyle+: Intercept (3)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Jumping +10 (94)', 'Slide Tackle +10 (95)', 'Stand Tackle +10 (95)',
        'PlayStyle+: Anticipate (3)', 'PlayStyle+: Jockey (3)',
        'PlayStyle: Bruiser (8)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Aggression +10 (95)', 'Stamina +10 (92)', 'Strength +10 (95)',
        'PlayStyle: Block (8)', 'PlayStyle: Aerial Fortress (8)', 'PlayStyle: Slide Tackle (8)'
      ]
    }
  ],
  maxRepeatable: 1
};
