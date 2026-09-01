import { EvolutionDefinition } from '../../types/player';

/**
 * Three levels, a match each, and it takes any CDM up to 98 — which is nearly every card in the
 * game — straight to 99.
 *
 * Almost everything it gives is capped at 97 or 98; only OVR, Defending and Short Pass are printed
 * bare, so the 99 ceiling is the only thing holding those. That is where its value sits: on a card
 * whose hole is defending. It touches no dribbling sub at all, so a card that is short on the ball
 * comes out of it short on the ball.
 *
 * Being a +20 to 99 makes it the end of any chain rather than a step in one — nothing else accepts
 * a 99, so whatever else you meant to run has to happen first.
 */
export const theMasterLock1290: EvolutionDefinition = {
  id: '1290',
  name: 'The Master Lock',
  futbinLink: 'https://www.futbin.com/26/evolutions/1290/the-master-lock',
  version: 'FC 26',
  description: 'Trap advancing attackers, reclaim possession in crucial moments, and dictate match flow right from your deep pivot.',
  cost: '250 FC Points / 75,000 Coins',
  requirements: {
    maxOvr: 98,
    positions: ['CDM']
  },
  ovrBoost: { boost: 20, limit: 99 },
  faceBoosts: {
    def: { boost: 30, limit: 99 },
    phy: { boost: 30, limit: 98 }
  },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 97 },
    sprintSpeed: { boost: 30, limit: 97 },
    finishing: { boost: 30, limit: 98 },
    shotPower: { boost: 30, limit: 98 },
    longShots: { boost: 30, limit: 98 },
    volleys: { boost: 30, limit: 98 },
    vision: { boost: 30, limit: 98 },
    crossing: { boost: 30, limit: 98 },
    freekick: { boost: 30, limit: 98 },
    shortPass: { boost: 30, limit: 99 },
    longPass: { boost: 30, limit: 98 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (99)', 'Defending +30 (99)', 'Acceleration +30 (97)', 'Sprint Speed +30 (97)',
        'Finishing +30 (98)', 'Shot Power +30 (98)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Long Shots +30 (98)', 'Volleys +30 (98)', 'Vision +30 (98)', 'Crossing +30 (98)',
        'Weak Foot +4 (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Physical +30 (98)', 'FK Acc. +30 (98)', 'Short Pass +30 (99)', 'Long Pass +30 (98)',
        'Skill Moves +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
