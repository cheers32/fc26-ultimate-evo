import { EvolutionDefinition } from '../../types/player';

export const pocketInspector1252: EvolutionDefinition = {
  id: '1252',
  name: 'Pocket Inspector',
  futbinLink: 'https://www.futbin.com/26/evolutions/1252/pocket-inspector',
  version: 'FC 26',
  description: "The ultimate defensive upgrade. Keep your opponent's star attacker secure and locked away in your CB's back pocket until the final whistle. Found in the Pre Season Token Store.",
  descriptionZh: "【准入】CB 专用，OVR ≤97，PS+ ≤4。【收益】OVR +6（顶 98）；防守线 5 项（最高 +20）、身体线 4 项（最高 +20）；弱脚 +4；PlayStyle+ 2 个（Bruiser、Anticipate）；PlayStyle 3 个（Quick Step、Pinged Pass、Slide Tackle）。【其他】3 级 · Tokens — 100 Pre Season Tokens。",
  cost: 'Tokens — 100 Pre Season Tokens',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CB']
  },
  ovrBoost: { boost: 6, limit: 98 },
  subStatBoosts: {
    aggression: { boost: 20, limit: 98 },
    headingAcc: { boost: 20, limit: 98 },
    interceptions: { boost: 20, limit: 98 },
    jumping: { boost: 20, limit: 98 },
    defAwareness: { boost: 20, limit: 98 },
    slideTackle: { boost: 20, limit: 98 },
    standTackle: { boost: 20, limit: 98 },
    stamina: { boost: 20, limit: 98 },
    strength: { boost: 20, limit: 98 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Bruiser', 'Anticipate'],
    silver: ['Quick Step', 'Pinged Pass', 'Slide Tackle']
  },
  playStylesLimit: { gold: 4, silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +6 (98)',
        'Heading Acc. +20 (98)',
        'Slide Tackle +20 (98)',
        'Stand Tackle +20 (98)',
        'Weak Foot +4',
        'PlayStyle: Quick Step (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Aggression +20 (98)',
        'Interceptions +20 (98)',
        'Def. Aware +20 (98)',
        'PlayStyle+: Bruiser (4)',
        'PlayStyle+: Anticipate (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Jumping +20 (98)',
        'Stamina +20 (98)',
        'Strength +20 (98)',
        'PlayStyle: Pinged Pass (7)',
        'PlayStyle: Slide Tackle (7)'
      ]
    }
  ],
  trainingTime: '1 Month',
  maxRepeatable: 1
};
