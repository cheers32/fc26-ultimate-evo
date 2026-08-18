/**
 * How much each face stat matters at each position. Its own module because both the path search
 * (evoEngine) and the player's fit profile (fitScore) rank against it — leaving it in evoEngine
 * made the two import each other in a cycle.
 */
/**
 * A striker holds the ball up, and the physical axis was priced as though he did not.
 *
 * ST carried phy 0.10 against pac 0.25, which made every physical PlayStyle worth a fraction of a
 * pace one — Press Proven scored a third of Rapid on a card whose owner reports the two as about
 * equally important, and says why: strength is what lets a forward keep the ball under contact.
 * Raised to 0.20, paid for out of passing and dribbling, which a lone striker uses less than either
 * of the two axes above it. Shooting stays the largest by a distance, as it should.
 */
export const POSITION_WEIGHTS: Record<string, Record<string, number>> = {
  'ST': { pac: 0.25, sho: 0.35, pas: 0.06, dri: 0.16, def: 0.00, phy: 0.20 },
  'CF': { pac: 0.25, sho: 0.35, pas: 0.10, dri: 0.20, def: 0.00, phy: 0.10 },
  'LW': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'RW': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'LM': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'RM': { pac: 0.35, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.00, phy: 0.05 },
  'CAM':{ pac: 0.10, sho: 0.20, pas: 0.35, dri: 0.30, def: 0.00, phy: 0.05 },
  'CM': { pac: 0.10, sho: 0.15, pas: 0.30, dri: 0.25, def: 0.10, phy: 0.10 },
  'CDM':{ pac: 0.10, sho: 0.00, pas: 0.20, dri: 0.10, def: 0.40, phy: 0.20 },
  'CB': { pac: 0.15, sho: 0.00, pas: 0.10, dri: 0.05, def: 0.45, phy: 0.25 },
  'LB': { pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'RB': { pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'LWB':{ pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
  'RWB':{ pac: 0.30, sho: 0.00, pas: 0.15, dri: 0.15, def: 0.25, phy: 0.15 },
};
