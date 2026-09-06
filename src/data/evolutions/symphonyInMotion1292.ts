import { EvolutionDefinition } from '../../types/player';

/**
 * A left-wing rebuild: +20 OVR to 99 and +30 on three whole faces, for 75,000 coins across two
 * levels of one match each.
 *
 * The entry cap of 98 is the loosest in the pool — almost nothing is too good for it — but the
 * upgrade caps are not, and that is the tension worth reading. Shooting stops at 98, physical at 96,
 * ball control and dribbling at 97, so a card already past those gets nothing there and is paying
 * 75,000 for the OVR.
 *
 * Note what it leaves alone: agility is the one dribbling sub it does not touch, and defending is
 * absent entirely. Passing and acceleration are printed bare, so only the 99 ceiling holds them.
 *
 * Read off the game's own Evolutions tab, per-level split and challenges included.
 */
export const symphonyInMotion1292: EvolutionDefinition = {
  id: '1292',
  name: 'Symphony in Motion',
  nameZh: "运动交响曲",
  futbinLink: 'https://www.futbin.com/26/evolutions/1292/symphony-in-motion',
  version: 'FC 26',
  expiresAt: '2026-09-14',
  description: 'Conduct every wide attack with pure artistry and unstoppable speed, gliding past fullbacks to deliver the ultimate masterpiece.',
  descriptionZh: "以纯粹的艺术性和无可阻挡的速度指挥每一次边路进攻，滑过边后卫，交出终极杰作。｜适合：LW/LM 专用，准入 OVR ≤98 几乎不设限，+20 OVR 顶 99 加三个面板各 +30，是边锋的大改造；但敏捷是唯一不碰的球感项，防守完全不加。",
  cost: '250 FC Points / 75,000 Coins',
  requirements: {
    maxOvr: 98,
    positions: ['LW', 'LM']
  },
  ovrBoost: { boost: 20, limit: 99 },
  faceBoosts: {
    sho: { boost: 30, limit: 98 },
    pas: { boost: 30, limit: 99 },
    phy: { boost: 30, limit: 96 }
  },
  subStatBoosts: {
    acceleration: { boost: 30, limit: 99 },
    sprintSpeed: { boost: 30, limit: 99 },
    balance: { boost: 30, limit: 98 },
    reactions: { boost: 30, limit: 97 },
    ballControl: { boost: 30, limit: 97 },
    dribbling: { boost: 30, limit: 97 },
    composure: { boost: 30, limit: 98 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +20', 'Shooting +30 (98)', 'Passing +30', 'Acceleration +30',
        'Balance +30 (98)', 'Reactions +30 (97)', 'Weak Foot +4 (5)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Physical +30 (96)', 'Sprint Speed +30', 'Ball Control +30 (97)', 'Dribbling +30 (97)',
        'Composure +30 (98)', 'Skill Moves +4 (5)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    }
  ],
  maxRepeatable: 1
};
