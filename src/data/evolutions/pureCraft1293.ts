import { EvolutionDefinition } from '../../types/player';

/**
 * A CAM-only rebuild, free, three levels of one match each — and the largest free upgrade in the
 * pool by some distance: +20 OVR to 98, and every shooting and passing sub raised to 96-98.
 *
 * Note what it does not touch. Physical is absent entirely, and the dribbling and defending arrive
 * as face boosts rather than subs, so what the card ends up with on the ball depends on where its
 * six dribbling stats already sit — prorating spends a +30 face very differently on a 78 than on a
 * 92. Pace is a face boost too, capped at 96.
 *
 * The id is provisional. FUTBIN has not listed this evo, so the number follows Flip the Switch
 * rather than FUTBIN's own, and `futbinLink` points at the index instead of a page that does not
 * exist. Both want correcting once it appears there.
 */
export const pureCraft1293: EvolutionDefinition = {
  id: '1293',
  name: 'Pure Craft',
  futbinLink: 'https://www.futbin.com/26/evolutions',
  version: 'FC 26',
  description: 'Operate on pure footballing instinct. A comprehensive upgrade to your playmaker’s skill, precision, and sharpness to control the game where it matters most.',
  descriptionZh: "凭纯粹的足球直觉踢球。对你的组织核心的技术、精准和敏锐做一次全面升级，让他在最要紧的地方掌控比赛。｜适合：CAM 专用，免费里最强的一个，+20 OVR 顶 98，但完全不加身体。",
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    positions: ['CAM']
  },
  ovrBoost: { boost: 20, limit: 98 },
  faceBoosts: {
    pac: { boost: 25, limit: 96 },
    dri: { boost: 30, limit: 98 },
    def: { boost: 20, limit: 96 }
  },
  subStatBoosts: {
    positioning: { boost: 25, limit: 97 },
    finishing: { boost: 25, limit: 97 },
    shotPower: { boost: 25, limit: 96 },
    longShots: { boost: 25, limit: 97 },
    volleys: { boost: 25, limit: 96 },
    vision: { boost: 25, limit: 97 },
    crossing: { boost: 25, limit: 97 },
    freekick: { boost: 25, limit: 98 },
    shortPass: { boost: 25, limit: 98 },
    longPass: { boost: 25, limit: 98 },
    curve: { boost: 25, limit: 98 }
  },
  weakFootBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20 (98)', 'Pace +25 (96)', 'Shot Power +25 (96)', 'Vision +25 (97)',
        'Short Pass +25 (98)', 'Weak Foot +4 (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Dribbling +30 (98)', 'Att. Position +25 (97)', 'Long Shots +25 (97)',
        'Crossing +25 (97)', 'Long Pass +25 (98)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Defending +20 (96)', 'Finishing +25 (97)', 'Volleys +25 (96)',
        'FK Acc. +25 (98)', 'Curve +25 (98)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
