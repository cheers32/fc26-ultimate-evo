import { EvolutionDefinition } from '../../types/player';

/**
 * A flat +12 on every face stat, one level, no PlayStyles and no rarity change — the plainest evo
 * in the app. Which makes where it lands entirely a matter of caps: +12 is enormous on the faces a
 * card is short on and nothing at all on the ones already past the ceiling.
 */
export const the12thMan1260: EvolutionDefinition = {
  id: '1260',
  name: 'The 12th Man',
  futbinLink: 'https://www.futbin.com/26/evolutions/1260/the-12th-man',
  version: 'FC 26',
  description: 'Celebrate 12 years of FUTTIES with this Evolution. Unlocked by the FUTTIES #12 objective group, in Objectives → Campaign.',
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 97,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 12, limit: 98 },
  faceBoosts: {
    pac: { boost: 12, limit: 96 },
    sho: { boost: 12, limit: 98 },
    pas: { boost: 12, limit: 97 },
    dri: { boost: 12, limit: 97 },
    def: { boost: 12, limit: 95 },
    phy: { boost: 12, limit: 96 }
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
        'OVR +12 (98)', 'Pace +12 (96)', 'Shooting +12 (98)', 'Passing +12 (97)',
        'Dribbling +12 (97)', 'Defending +12 (95)', 'Physical +12 (96)'
      ]
    }
  ],
  maxRepeatable: 1
};
