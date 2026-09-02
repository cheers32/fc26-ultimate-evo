import { EvolutionDefinition } from '../../types/player';

/**
 * One level, no challenge at all, and it asks for nothing but an OVR under 98 — the cheapest thing
 * in the pool to run, since running it costs a click.
 *
 * What it gives is small and spread thin: +5 on three faces, which on a card in the mid 90s is a
 * point or two apiece after the caps bite. The two star ratings are the real payload — five-star
 * weak foot and five-star skills for free is worth more than the numbers on most cards.
 *
 * The id is provisional. FUTBIN has not listed this evo, so the number is the next one after Pace
 * & Grace rather than FUTBIN's own, and `futbinLink` points at the index instead of a page that
 * does not exist. Both want correcting once it appears there.
 */
export const flipTheSwitch1292: EvolutionDefinition = {
  id: '1292',
  name: 'Flip the Switch',
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  description: 'Turn defensive stops straight into positive momentum. Refine your player’s ability to shut down attacks, keep the ball under heavy pressure, and dictate the tempo from deep.',
  cost: 'Free',
  requirements: {
    maxOvr: 97
  },
  ovrBoost: { boost: 2, limit: 98 },
  faceBoosts: {
    pas: { boost: 5, limit: 98 },
    dri: { boost: 5, limit: 98 },
    def: { boost: 5, limit: 97 }
  },
  subStatBoosts: {},
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (98)', 'Passing +5 (98)', 'Dribbling +5 (98)', 'Defending +5 (97)',
        'Weak Foot +4 (5)', 'Skill Moves +4 (5)', 'No challenges required'
      ]
    }
  ],
  maxRepeatable: 1
};
