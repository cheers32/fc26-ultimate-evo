import { EvolutionDefinition } from '../../types/player';

/**
 * A flat +1/+2 on every face with every cap at 98, which makes it the cheapest way to finish a card
 * that is already nearly there — and near-useless on one that is not, since two levels of +1 do
 * nothing for a face sitting in the 80s.
 *
 * Not on FUTBIN yet, so the id and the link are fut.gg's. fut.gg prints only the two requirements
 * below; if a position restriction exists it is not published there.
 */
export const instantMagnet2446: EvolutionDefinition = {
  id: '2446',
  name: 'Instant Magnet',
  futbinLink: 'https://www.fut.gg/evolutions/2446-instant-magnet/',
  version: 'FC 26',
  description: 'Unlocked by completing the FUTTIES EVO Fun! objective.',
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 97,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 1, limit: 98 },
  faceBoosts: {
    pac: { boost: 1, limit: 98 },
    sho: { boost: 1, limit: 98 },
    pas: { boost: 2, limit: 98 },
    dri: { boost: 2, limit: 98 },
    def: { boost: 1, limit: 98 },
    phy: { boost: 1, limit: 98 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (98)', 'Pace +1 (98)', 'Shooting +1 (98)', 'Passing +2 (98)', 'Dribbling +2 (98)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending +1 (98)', 'Physical +1 (98)', 'Skill Moves +4 (5)', 'Weak Foot +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
