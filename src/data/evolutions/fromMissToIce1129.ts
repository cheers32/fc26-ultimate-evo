import { EvolutionDefinition } from '../../types/player';

export const fromMissToIce1129: EvolutionDefinition = {
  id: '1129',
  name: 'From Miss to Ice',
  futbinLink: 'https://www.futbin.com/26/evolutions/1129/from-miss-to-ice',
  version: 'FC 26',
  description: 'From shaky spot-kick moments to ice-cold finishes, this EVO boosts penalties and composure for a taker who steps up calmer the next time.',
  cost: 'Free',
  defaultDisabled: true,
  requirements: {
    maxOvr: 93,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 95 },
  subStatBoosts: {
    ballControl: { boost: 10, limit: 92 },
    composure: { boost: 25, limit: 95 },
    vision: { boost: 10, limit: 92 },
    finishing: { boost: 10, limit: 94 },
    // FUTBIN lists no cap for Penalties on this one.
    penalties: { boost: 45, limit: 99 },
    shotPower: { boost: 10, limit: 94 }
  },
  weakFootBoost: 2,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (95)', 'Finishing +10 (94)', 'Penalties +45', 'Shot Power +10 (94)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +10 (92)', 'Vision +10 (92)', 'Composure +25 (95)', 'Weak Foot +2'
      ]
    }
  ],
  maxRepeatable: 1
};
