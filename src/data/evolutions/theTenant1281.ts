import { EvolutionDefinition } from '../../types/player';

/**
 * Pace, shooting, passing and dribbling — and not one defensive or physical stat, on an evo open to
 * every outfield position. So it reads as a forward's evo that anyone may run, and on a defender it
 * buys the 25 points of pace and nothing else that position is scored on.
 *
 * The 96 entry cap and the 96-98 sub caps put it squarely at cards in the low 90s. FUTBIN prints no
 * PlayStyle grants and no PlayStyle+ requirement, which is worth as much as the stats now: it
 * leaves every gold slot free for you to choose.
 */
export const theTenant1281: EvolutionDefinition = {
  id: '1281',
  name: 'The Tenant',
  futbinLink: 'https://www.futbin.com/26/evolutions/1281/the-tenant',
  version: 'FC 26',
  description: "Set up camp in front of goal. Boost your player's offensive arsenal to constantly exploit spaces, force mistakes, and keep the defense pinned back. Found in the store.",
  descriptionZh: "【准入】非 GK，OVR ≤96。【收益】OVR +10（顶 98）；速度线 2 项（最高 +25）、射门线 5 项（最高 +20）、传球线 5 项（最高 +20）、盘带线 5 项（最高 +20）；花式 +4。【其他】3 级 · Free。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 10, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 25, limit: 97 },
    sprintSpeed: { boost: 25, limit: 97 },
    agility: { boost: 20, limit: 97 },
    balance: { boost: 20, limit: 98 },
    ballControl: { boost: 20, limit: 96 },
    dribbling: { boost: 20, limit: 98 },
    composure: { boost: 20, limit: 96 },
    vision: { boost: 20, limit: 97 },
    crossing: { boost: 20, limit: 95 },
    shortPass: { boost: 20, limit: 98 },
    longPass: { boost: 20, limit: 98 },
    // FUTBIN prints Curve bare, so only the 99 ceiling holds it.
    curve: { boost: 20, limit: 99 },
    positioning: { boost: 20, limit: 96 },
    finishing: { boost: 20, limit: 97 },
    shotPower: { boost: 20, limit: 97 },
    longShots: { boost: 20, limit: 97 },
    volleys: { boost: 20, limit: 97 }
  },
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10 (98)', 'Acceleration +25 (97)', 'Sprint Speed +25 (97)', 'Finishing +20 (97)',
        'Att. Position +20 (96)', 'Shot Power +20 (97)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +20 (95)', 'Long Passing +20 (98)', 'Short Passing +20 (98)', 'Vision +20 (97)',
        'Long Shots +20 (97)', 'Volleys +20 (97)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +20 (97)', 'Balance +20 (98)', 'Ball control +20 (96)', 'Curve +20',
        'Dribbling +20 (98)', 'Composure +20 (96)', 'Skills +4 (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
