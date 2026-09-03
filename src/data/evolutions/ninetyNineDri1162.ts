import { EvolutionDefinition } from '../../types/player';

/**
 * Dribbling straight to 99, five-star skills, and nothing else — an FC 27 pre-order token.
 *
 * The +98 is an instruction to fill the face rather than a boost, so it is worth exactly what the
 * card is short of 99 in DRI: it belongs last in a chain, after anything else that touches the same
 * face. What sets it apart from the four "Max" evos is that it costs no OVR — those charge +2 — so
 * it never pushes a card out of range of an evo that comes after it. No OVR ceiling either; GK is
 * the only thing it turns away.
 */
export const ninetyNineDri1162: EvolutionDefinition = {
  id: '1162',
  name: '99 Dribbling',
  futbinLink: 'https://www.futbin.com/26/evolutions/1162/99-dribbling',
  version: 'FC 26',
  description: 'Give any player a 99 Dribbling boost. Unlocked with an FC 27 pre-order token.',
  descriptionZh: "【准入】非 GK，OVR ≤99。【收益】盘带面板 +98（顶 99）；花式 +4。【其他】1 级 · FC 27 Pre Order Token。",
  cost: 'FC 27 Pre Order Token',
  requirements: {
    maxOvr: 99,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 0, limit: 99 },
  faceBoosts: {
    dri: { boost: 98, limit: 99 }
  },
  subStatBoosts: {},
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    { name: 'Level 1', upgrades: ['Dribbling +98 (99)', 'Skill Moves +4 (5)'] }
  ],
  maxRepeatable: 1
};
