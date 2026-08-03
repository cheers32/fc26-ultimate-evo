import { EvolutionDefinition } from '../../types/player';

export const futtiesCountdown1151: EvolutionDefinition = {
  id: '1151',
  name: 'FUTTIES Countdown',
  futbinLink: 'https://www.futbin.com/26/evolutions/1151/futties-countdown',
  version: 'FC 26',
  description: 'Get ready for FUTTIES with an all-round boost to a qualifying player.',
  cost: '500 FUTTIES Tokens / 100,000 Coins',
  trainingTime: '3 Days',
  requirements: {
    maxOvr: 94,
    notRarity: 'World Tour Silver Stars',
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 96 },
  faceBoosts: {
    pac: { boost: 5, limit: 95 },
    sho: { boost: 4, limit: 96 },
    pas: { boost: 4, limit: 96 },
    dri: { boost: 4, limit: 96 },
    def: { boost: 4, limit: 96 },
    phy: { boost: 4, limit: 96 }
  },
  subStatBoosts: {},
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3 (96)', 'Pace Face +5 (95)', 'Shooting Face +4 (96)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Passing Face +4 (96)', 'Dribbling Face +4 (96)', 'Defending Face +4 (96)', 'Physical Face +4 (96)'
      ]
    }
  ],
  maxRepeatable: 1
};
