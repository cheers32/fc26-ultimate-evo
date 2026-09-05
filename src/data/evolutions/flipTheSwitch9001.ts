import { EvolutionDefinition } from '../../types/player';

/**
 * One level, no challenge at all, and it asks for nothing but an OVR under 98 — the cheapest thing
 * in the pool to run, since running it costs a click.
 *
 * What it gives is small and spread thin: +5 on three faces, which on a card in the mid 90s is a
 * point or two apiece after the caps bite. The two star ratings are the real payload — five-star
 * weak foot and five-star skills for free is worth more than the numbers on most cards.
 *
 * The id is provisional and deliberately outside FUTBIN's range. It was 1292 first, chosen as the
 * next number after Pace & Grace, and FUTBIN then handed 1292 to Symphony in Motion — so guessing
 * inside a live numbering scheme collides. 9001 cannot. `futbinLink` points at the index rather
 * than a page that does not exist; both want correcting once FUTBIN lists the evo.
 */
export const flipTheSwitch9001: EvolutionDefinition = {
  id: '9001',
  name: 'Flip the Switch',
  nameZh: "扭转开关",
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  description: 'Turn defensive stops straight into positive momentum. Refine your player’s ability to shut down attacks, keep the ball under heavy pressure, and dictate the tempo from deep.',
  descriptionZh: "把防守拦截直接转化为向前的势头。磨炼球员掐断进攻、在重压下护球、并从后场掌控节奏的能力。｜适合：任何位置，无挑战一键完成，真正的价值是白送的五星弱脚和五星花式。",
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
