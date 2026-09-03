import { EvolutionDefinition } from '../../types/player';

/**
 * Futbin lists this one by its EA upgrade *groups* ("Passing/Kicking +20 (98)", "Defending/Speed
 * +5 (94)", "Physical/Positioning +10 (95)") rather than by face stat or sub-stat, and those group
 * names do not map onto anything this app models.
 *
 * The mapping below is read off Futbin's own preview card (Ronaldo 97 ST): PAS 85 -> 98, DEF
 * 47 -> 52, PHY 87 -> 95, with PAC/SHO/DRI unchanged. That is exactly what you get from treating
 * the groups as face boosts — Passing/Kicking on PAS, Physical/Positioning on PHY, Defending/Speed
 * on DEF *and* PAC (PAC 97 is already past that group's cap of 94, which is why it does not move).
 * The one part that card cannot confirm is the "Positioning" half of the third group; it is
 * carried as the sub-stat of that name, where it will only matter on a card whose Att. Position
 * is under 95.
 */
export const passingTheTest1218: EvolutionDefinition = {
  id: '1218',
  name: 'Passing the Test',
  futbinLink: 'https://www.futbin.com/26/evolutions/1218/passing-the-test',
  version: 'FC 26',
  description: 'Elegant on the ball, relentless of it.',
  descriptionZh: "【准入】OVR ≤98，PS+ ≤4。【收益】OVR +7（顶 98）；传球面板 +20（顶 98）；防守面板 +5（顶 94）；速度面板 +5（顶 94）；身体面板 +10（顶 95）；射门线 1 项（最高 +10）；弱脚 +4；花式 +4。【其他】1 级 · Objective Group Reward。",
  cost: 'Objective Group Reward',
  requirements: {
    maxOvr: 98,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 7, limit: 98 },
  faceBoosts: {
    pas: { boost: 20, limit: 98 },
    def: { boost: 5, limit: 94 },
    pac: { boost: 5, limit: 94 },
    phy: { boost: 10, limit: 95 }
  },
  subStatBoosts: {
    positioning: { boost: 10, limit: 95 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +7 (98)', 'Passing/Kicking +20 (98)', 'Defending/Speed +5 (94)',
        'Physical/Positioning +10 (95)', 'Weak Foot +4', 'Skills +4'
      ]
    }
  ],
  maxRepeatable: 1
};
