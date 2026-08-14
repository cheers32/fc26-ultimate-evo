import { ChemStylesData } from '../types/player';

/**
 * Chemistry style boosts, keyed by the sub-stat they apply to.
 *
 * The keys have to be the ones the cards actually use — a name with no sub-stat behind it is not an
 * error anywhere, it is simply a boost that never lands. `fkAccuracy` was one of those, and FK Acc.
 * went unmoved under Architect and Maestro for as long as it was there; the card's key is
 * `freekick`.
 */
export const chemStyles: ChemStylesData = {
  Sniper: { positioning: 9, finishing: 3, shotPower: 3, longShots: 6, volleys: 3, penalties: 3, stamina: 6, strength: 9, aggression: 3 },
  Finisher: { positioning: 6, finishing: 9, shotPower: 3, volleys: 3, penalties: 3, agility: 6, balance: 3, reactions: 3, dribbling: 9 },
  Deadeye: { positioning: 6, finishing: 3, shotPower: 9, longShots: 3, penalties: 3, vision: 3, shortPass: 9, longPass: 3, curve: 6 },
  Marksman: { finishing: 6, shotPower: 3, longShots: 6, penalties: 3, reactions: 6, ballControl: 6, dribbling: 3, composure: 3, jumping: 3, strength: 6 },
  Hawk: { acceleration: 3, sprintSpeed: 3, positioning: 3, finishing: 3, shotPower: 6, longShots: 6, penalties: 3, jumping: 6, strength: 3, aggression: 6 },
  Artist: { vision: 3, crossing: 6, shortPass: 3, longPass: 6, curve: 9, agility: 9, reactions: 6, dribbling: 3, composure: 3 },
  Architect: { vision: 6, freekick: 3, shortPass: 9, longPass: 3, curve: 6, stamina: 6, strength: 9, aggression: 3 },
  Powerhouse: { vision: 9, shortPass: 6, longPass: 6, curve: 3, interceptions: 6, defAwareness: 3, standTackle: 9, slideTackle: 3 },
  Maestro: { positioning: 3, shotPower: 6, longShots: 6, vision: 3, freekick: 3, shortPass: 3, longPass: 6, reactions: 3, ballControl: 6, dribbling: 6, composure: 3 },
  Engine: { acceleration: 3, sprintSpeed: 3, vision: 3, crossing: 6, shortPass: 3, longPass: 3, curve: 6, agility: 3, balance: 6, dribbling: 6 },
  Sentinel: { interceptions: 6, headingAcc: 6, defAwareness: 9, standTackle: 3, slideTackle: 3, jumping: 9, strength: 3, aggression: 6 },
  Guardian: { agility: 6, reactions: 3, ballControl: 3, dribbling: 6, composure: 3, interceptions: 3, defAwareness: 6, standTackle: 9, slideTackle: 6 },
  Gladiator: { positioning: 3, shotPower: 6, longShots: 3, balance: 3, reactions: 6, ballControl: 3, dribbling: 3, interceptions: 3, headingAcc: 3, defAwareness: 3, standTackle: 3, slideTackle: 6 },
  Backbone: { vision: 3, shortPass: 3, longPass: 6, interceptions: 6, defAwareness: 3, standTackle: 6, slideTackle: 3, stamina: 6, strength: 3, aggression: 6 },
  Anchor: { acceleration: 3, sprintSpeed: 3, interceptions: 3, headingAcc: 3, defAwareness: 3, standTackle: 6, slideTackle: 6, jumping: 6, strength: 6, aggression: 3 },
  Hunter: { acceleration: 6, sprintSpeed: 6, positioning: 3, finishing: 3, shotPower: 3, volleys: 9, penalties: 6 },
  Catalyst: { acceleration: 6, sprintSpeed: 6, vision: 9, crossing: 6, shortPass: 3, longPass: 6, curve: 3 },
  Shadow: { acceleration: 6, sprintSpeed: 6, interceptions: 3, headingAcc: 6, defAwareness: 3, standTackle: 3, slideTackle: 9 },
  Basic: { sprintSpeed: 3, positioning: 3, shotPower: 3, penalties: 3, vision: 3, shortPass: 3, longPass: 3, curve: 3, agility: 3, ballControl: 3, dribbling: 3, composure: 3, defAwareness: 3, standTackle: 3, slideTackle: 3, strength: 3 }
};
