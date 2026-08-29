import { EvolutionDefinition } from '../../types/player';

export const touchlineRoyalty1288: EvolutionDefinition = {
  id: '1288',
  name: 'Touchline Royalty',
  futbinLink: 'https://www.futbin.com/26/evolutions/1288/touchline-royalty',
  version: 'FC 26',
  description:
    'Found in the Pre Season Token Store. Turns a wide midfielder into a touchline threat who ' +
    'stretches the defence and delivers the final ball.',
  cost: 'Tokens — 200 Pre Season Tokens',
  // RM only, and the OVR cap comes from FUTBIN's requirements table. FUT.GG lists the position
  // requirement without an OVR one, which would let a 99 through — the stricter of two sources is
  // the safe reading for a requirement, since being wrong the other way recommends a chain the
  // game then refuses.
  requirements: {
    maxOvr: 98,
    positions: ['RM']
  },
  ovrBoost: { boost: 10, limit: 99 },
  // Everything here is printed as a face-stat upgrade rather than as sub-stats. Shooting is the one
  // with no cap of its own, so only the 99 ceiling holds it.
  faceBoosts: {
    pac: { boost: 15, limit: 97 },
    sho: { boost: 15, limit: 99 },
    pas: { boost: 15, limit: 96 },
    dri: { boost: 15, limit: 98 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  // FUTBIN prints Skills +2 and FUT.GG prints +4. Both cap at 5★ so no card in the app can tell
  // them apart; the higher figure is recorded because it is the one that would matter if a card
  // ever arrived below 3★.
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10',
        'Pace +15 (97)',
        'Shooting +15',
        'Passing +15 (96)',
        'Dribbling +15 (98)',
        'Weak Foot +4',
        'Skills +2'
      ]
    }
  ],
  trainingTime: '1 Month',
  // Repeatable on FUTBIN with no count printed. Left at 1 rather than guessed at: the number caps
  // how often a chain may reuse it, and inventing a larger one would have the search build chains
  // around repeats that may not exist.
  maxRepeatable: 1
};
