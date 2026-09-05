import { EvolutionDefinition } from '../../types/player';

/**
 * Free, no position requirement, and only +5 OVR — which is the point rather than a shortcoming.
 * It moves ten sub-stats without spending the card's headroom, so it can sit anywhere in a chain
 * instead of having to go last.
 *
 * Six of those ten are printed bare and run to 99: strength, reactions, ball control, finishing and
 * long shots at +30 each. That is a striker's spread with a physical half attached — and note it is
 * strength and jumping rather than pace, so on a card being read as Explosive this pushes the wrong
 * way, since AcceleRATE weighs agility against strength.
 *
 * Read off the game's own Rewards tab, per-level split and challenges included. The id is
 * provisional and outside FUTBIN's range on purpose — see flipTheSwitch9001 for why.
 */
export const magneticMarksman9003: EvolutionDefinition = {
  id: '9003',
  name: 'Magnetic Marksman',
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  description: 'Glue the ball to your feet in tight spaces, bully past defenders using raw strength, and find the back of the net with an effortless, lethal finish.',
  descriptionZh: "在狭小空间里把球粘在脚下，用纯粹的力量顶开后卫，然后轻描淡写地把球送进网窝。｜适合：不挑位置、免费，射术/远射/力量/反应/球控各 +30 且不封顶；OVR 只 +5 所以不占后续 evo 的准入空间，支点中锋最对味 —— 但它加的是力量不是速度，会把加速类型往 Lengthy 推。",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 98
  },
  ovrBoost: { boost: 5, limit: 99 },
  subStatBoosts: {
    finishing: { boost: 30, limit: 99 },
    shotPower: { boost: 20, limit: 98 },
    longShots: { boost: 30, limit: 99 },
    penalties: { boost: 20, limit: 98 },
    reactions: { boost: 30, limit: 99 },
    ballControl: { boost: 30, limit: 99 },
    dribbling: { boost: 20, limit: 98 },
    composure: { boost: 20, limit: 98 },
    jumping: { boost: 20, limit: 98 },
    strength: { boost: 30, limit: 99 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5', 'Finishing +30', 'Shot Power +20 (98)', 'Long Shots +30', 'Penalties +20 (98)',
        'Reactions +30', 'Weak Foot +4 (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Ball Control +30', 'Dribbling +20 (98)', 'Composure +20 (98)', 'Jumping +20 (98)',
        'Strength +30', 'Skill Moves +4 (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
