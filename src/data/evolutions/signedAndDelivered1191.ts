import { EvolutionDefinition } from '../../types/player';

export const signedAndDelivered1191: EvolutionDefinition = {
  id: '1191',
  name: 'Signed and Delivered',
  futbinLink: 'https://www.futbin.com/26/evolutions/1191/signed-and-delivered',
  version: 'FC 26',
  description: "No more misplaced passes. Upgrade your midfielder's passing to drop 50-yard balls onto your striker's feet with pinpoint precision.",
  descriptionZh: "【准入】非 GK，OVR ≤96。【收益】速度面板 +1（顶 95）；射门面板 +1（顶 94）；传球面板 +4（顶 97）；弱脚 +4；PlayStyle 5 个（Incisive Pass、Inventive、Tiki Taka、Pinged Pass、Long Ball Pass）。【其他】2 级 · 250 FUTTIES Tokens / 50,000 Coins。",
  cost: '250 FUTTIES Tokens / 50,000 Coins',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 96 },
  faceBoosts: {
    pac: { boost: 1, limit: 95 },
    sho: { boost: 1, limit: 94 },
    pas: { boost: 4, limit: 97 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: ['Incisive Pass', 'Inventive', 'Tiki Taka', 'Pinged Pass', 'Long Ball Pass']
  },
  playStylesLimit: {
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'Pace Face +1 (95)', 'Weak Foot +4 (5)',
        'PlayStyle: Incisive Pass (7)', 'PlayStyle: Inventive (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Shooting Face +1 (94)', 'Passing Face +4 (97)',
        'PlayStyle: Tiki Taka (7)', 'PlayStyle: Pinged Pass (7)', 'PlayStyle: Long Ball Pass (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
