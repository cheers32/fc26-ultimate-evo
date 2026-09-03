import { EvolutionDefinition } from '../../types/player';

/**
 * Free, repeatable twice, and it asks for nothing but an OVR under 98 — no position, no PlayStyle
 * ceiling. That makes it the widest net in the pool, and the two levels split cleanly: the first is
 * the card's paperwork (OVR, both feet, skills, a token +5 of pace), the second is the whole point,
 * +10 across every dribbling sub at once.
 *
 * Only balance, ball control and dribbling carry a cap, all at 98; agility, reactions and composure
 * are printed bare, so the 99 ceiling is the only thing holding them. On a card already high on the
 * ball the second level is worth little, and on one in the low 80s there it is worth a face.
 *
 * Read off the game's own Evolutions screen rather than a database — the per-level split comes from
 * the card carousel on the evo's detail page, which is the only place it is written down.
 */
export const paceAndGrace1291: EvolutionDefinition = {
  id: '1291',
  name: 'Pace & Grace',
  futbinLink: 'https://www.futbin.com/26/evolutions/1291/pace--grace',
  version: 'FC 26',
  description: 'Inject lethal velocity and effortless elegance, boosting raw speed and close control to glide past defenders.',
  descriptionZh: "注入致命的速度与轻松的优雅，提升原始速度和贴身控球，让你滑过后卫。｜适合：任何位置，门槛最低（只看 OVR），可重复 2 次，第二级给整个盘带块 +10。",
  cost: 'Free',
  requirements: {
    maxOvr: 97
  },
  ovrBoost: { boost: 3, limit: 99 },
  subStatBoosts: {
    acceleration: { boost: 5, limit: 99 },
    sprintSpeed: { boost: 5, limit: 99 },
    agility: { boost: 10, limit: 99 },
    balance: { boost: 10, limit: 98 },
    reactions: { boost: 10, limit: 99 },
    ballControl: { boost: 10, limit: 98 },
    dribbling: { boost: 10, limit: 98 },
    composure: { boost: 10, limit: 99 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +3', 'Acceleration +5', 'Sprint Speed +5', 'Weak Foot +4 (5)', 'Skill Moves +4 (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Agility +10', 'Balance +10 (98)', 'Reactions +10', 'Ball Control +10 (98)',
        'Dribbling +10 (98)', 'Composure +10'
      ]
    }
  ],
  maxRepeatable: 2
};
