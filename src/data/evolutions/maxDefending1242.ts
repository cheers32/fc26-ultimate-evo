import { EvolutionDefinition } from '../../types/player';

/**
 * One of the four "Max" evos — defending straight to 99 and nothing else.
 *
 * FUTBIN prints the boost as +98 with no cap, which is the point: it is not a boost so much as an
 * instruction to fill the face. That makes it worth exactly what the card is short of 99 there, so
 * it belongs on a card with a real hole rather than one already in the high 90s — and it belongs
 * last in a chain, since it will be worth less after anything else has raised the same face.
 */
export const maxDefending1242: EvolutionDefinition = {
  id: '1242',
  name: 'Max Defending',
  futbinLink: 'https://www.futbin.com/26/evolutions/1242/max-defending',
  version: 'FC 26',
  description: 'Boost your player to 99 Defending. Season 10 level 10 reward.',
  cost: 'Season 10 — Level 10 Reward',
  requirements: {
    maxOvr: 98,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 2, limit: 99 },
  faceBoosts: {
    def: { boost: 98, limit: 99 }
  },
  subStatBoosts: {},
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    { name: 'Level 1', upgrades: ['OVR +2', 'Defending +98'] }
  ],
  maxRepeatable: 1
};
