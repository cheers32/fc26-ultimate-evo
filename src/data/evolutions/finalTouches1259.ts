import { EvolutionDefinition } from '../../types/player';

/**
 * Free and repeatable four times, which is what makes it interesting: none of its four runs moves
 * a card far, but the shooting stats it touches are the ones a finisher is judged on, and it hands
 * out three PlayStyle+ along the way.
 */
export const finalTouches1259: EvolutionDefinition = {
  id: '1259',
  name: 'Final Touches',
  futbinLink: 'https://www.futbin.com/26/evolutions/1259/final-touches',
  version: 'FC 26',
  description: 'No fuss, no flashy tricks. Just the clinical upgrades and final touches needed to turn a great player into an elite finisher.',
  descriptionZh: "没有花架子，只有把好球员变成精英终结者所需的临门一脚。｜适合：非门将，射门线为主的小加成。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 2, limit: 97 },
  subStatBoosts: {
    // FUTBIN prints a cap only on Long Shots and Att. Position; the rest are listed bare.
    positioning: { boost: 5, limit: 97 },
    finishing: { boost: 5, limit: 99 },
    shotPower: { boost: 5, limit: 99 },
    longShots: { boost: 5, limit: 97 },
    freekick: { boost: 5, limit: 99 },
    curve: { boost: 5, limit: 99 },
    reactions: { boost: 5, limit: 99 },
    composure: { boost: 5, limit: 99 }
  },
  skillMovesBoost: 2,
  playStylesAdded: {
    gold: ['Finesse Shot', 'Power Shot', 'Gamechanger'],
    silver: ['Low Driven Shot', 'Dead Ball']
  },
  playStylesLimit: {
    gold: 4,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2 (97)', 'Finishing +5', 'Long Shots +5 (97)', 'Free Kick +5',
        'PlayStyle+: Finesse Shot (4)', 'PlayStyle: Low Driven Shot (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Att. Position +5 (97)', 'Shot Power +5', 'Skill Moves +2',
        'PlayStyle+: Power Shot (4)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Curve +5', 'Reactions +5', 'Composure +5',
        'PlayStyle+: Gamechanger (4)', 'PlayStyle: Dead Ball (7)'
      ]
    }
  ],
  maxRepeatable: 4
};
