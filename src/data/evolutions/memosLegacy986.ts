import { EvolutionDefinition } from '../../types/player';

// Goalkeeper evolution. FUTBIN shows GK face names; they map onto the outfield face keys as
// Diving=pac, Handling=sho, Kicking=pas, Reflexes=dri, Speed=def, Positioning=phy.
export const memosLegacy986: EvolutionDefinition = {
  id: '986',
  name: "Memo's Legacy",
  futbinLink: 'https://www.futbin.com/26/evolutions/986/memos-legacy',
  version: 'FC 26',
  description: "Found in the Memo's Memories Objective.",
  cost: 'Objective Reward',
  requirements: {
    maxOvr: 91,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 3,
    notRarity: 'World Tour Silver Stars',
    positions: ['GK']
  },
  ovrBoost: { boost: 18, limit: 92 },
  faceBoosts: {
    pac: { boost: 15, limit: 92 },
    sho: { boost: 15, limit: 92 },
    pas: { boost: 20, limit: 92 },
    dri: { boost: 15, limit: 92 },
    phy: { boost: 15, limit: 94 }
  },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 90 },
    sprintSpeed: { boost: 30, limit: 90 },
    reactions: { boost: 15, limit: 94 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Rush Out', 'Far Reach'],
    silver: ['Footwork']
  },
  playStylesLimit: {
    gold: 3,
    silver: 8
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +18 (92)', 'Diving +15 (92)', 'Handling +15 (92)',
        'Kicking +20 (92)', 'Reflexes +15 (92)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Reactions +15 (94)', 'Weak Foot +4 (5)',
        'PlayStyle+: Rush Out (3)', 'PlayStyle+: Far Reach (3)',
        'Role: Goalkeeper++'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Positioning +15 (94)', 'Acceleration +30 (90)', 'Sprint Speed +30 (90)',
        'PlayStyle: Footwork (8)', 'Role: Ball-Playing Keeper++'
      ]
    }
  ],
  maxRepeatable: 1
};
