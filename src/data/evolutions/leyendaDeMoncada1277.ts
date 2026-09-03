import { EvolutionDefinition } from '../../types/player';

/**
 * Free, and the requirement that actually bites is the position count: five or fewer, because it
 * hands out a sixth. Everything it touches is the attacking half of a card — nothing defensive,
 * nothing on strength — with caps at 97-98, so it is worth most to a creator still in the low 90s
 * on dribbling and passing and worth little to one already there.
 *
 * fut.gg does not print the GK exclusion; FUTBIN does, so it is here.
 */
export const leyendaDeMoncada1277: EvolutionDefinition = {
  id: '1277',
  name: 'Leyenda de Moncada',
  futbinLink: 'https://www.futbin.com/26/evolutions/1277/leyenda-de-moncada',
  version: 'FC 26',
  description: 'Transform into a true playmaker who controls the tempo and delivers in decisive moments. Crafted for flawless control, pure class, and footballing perfection.',
  descriptionZh: "变成真正的组织者，掌控节奏并在决定性时刻交出答案。为完美的控制、纯粹的格调和足球意义上的完美而打造。｜适合：非门将，前场线为主。",
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    maxTotalPositions: 5,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 10, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 12, limit: 95 },
    sprintSpeed: { boost: 12, limit: 95 },
    agility: { boost: 15, limit: 98 },
    balance: { boost: 15, limit: 98 },
    reactions: { boost: 12, limit: 97 },
    ballControl: { boost: 15, limit: 98 },
    dribbling: { boost: 15, limit: 98 },
    composure: { boost: 12, limit: 97 },
    vision: { boost: 12, limit: 96 },
    crossing: { boost: 12, limit: 95 },
    freekick: { boost: 10, limit: 95 },
    shortPass: { boost: 15, limit: 98 },
    curve: { boost: 15, limit: 98 },
    positioning: { boost: 15, limit: 97 },
    finishing: { boost: 15, limit: 98 },
    shotPower: { boost: 12, limit: 97 },
    longShots: { boost: 12, limit: 98 },
    volleys: { boost: 15, limit: 98 },
    penalties: { boost: 12, limit: 96 },
    headingAcc: { boost: 10, limit: 94 },
    stamina: { boost: 15, limit: 96 }
  },
  positionsAdded: ['ST'],
  playStylesAdded: { gold: [], silver: [] },
  maxRepeatable: 1
};
