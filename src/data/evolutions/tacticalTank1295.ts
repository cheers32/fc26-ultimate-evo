import { EvolutionDefinition } from '../../types/player';

/**
 * The whole defensive block at +20, with three shooting stats along for the ride, and no position
 * requirement at all — the only gate is OVR 97, which on a free evo makes it one of the widest
 * doors in the pool.
 *
 * Read off the EA Web App rather than FUTBIN. The Web App prints one cumulative Upgrades list for
 * all three carousel cards (Level 1, Level 2, Final Upgrade), so the split between the two levels
 * is not published on that screen and is not invented here — `levels` carries the total, named as
 * such. Five of the eleven stats are printed with a cap of 98; the rest are uncapped and only the
 * 99 ceiling holds them, which the `display: none` on their max-value cells says outright.
 */
export const tacticalTank1295: EvolutionDefinition = {
  id: '1295',
  name: 'Tactical Tank',
  nameZh: "战术坦克",
  futbinLink: 'https://www.futbin.com/26/evolutions/1295/tactical-tank',
  version: 'FC 26',
  expiresAt: '2026-09-24',
  description:
    'Overpower opposition attacks with raw strength, shield possession under tight pressure, and ' +
    'punish retreating defenses with unstoppable power shots.',
  descriptionZh:
    "用纯粹的力量压制对手的进攻，在紧逼下护住球权，再用无法阻挡的重炮惩罚回收的防线。｜适合：无位置限制，防守五项全 +20，体能三项 +20，外加射门线三项。中卫和后腰收益最大。",
  cost: 'Free',
  requirements: {
    maxOvr: 97
  },
  ovrBoost: { boost: 5, limit: 99 },
  subStatBoosts: {
    // Defending, all five of it.
    interceptions: { boost: 20, limit: 99 },
    headingAcc: { boost: 20, limit: 99 },
    defAwareness: { boost: 20, limit: 98 },
    standTackle: { boost: 20, limit: 99 },
    slideTackle: { boost: 20, limit: 99 },
    // Physical, everything but Aggression.
    jumping: { boost: 20, limit: 98 },
    stamina: { boost: 20, limit: 98 },
    strength: { boost: 20, limit: 99 },
    // Shooting — the "power shots" half of the blurb.
    finishing: { boost: 20, limit: 98 },
    longShots: { boost: 20, limit: 99 },
    volleys: { boost: 20, limit: 98 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: []
  },
  levels: [
    {
      // Two levels in game; the Web App prints only the total, so that is what is recorded.
      name: 'Levels 1–2 (total)',
      upgrades: [
        'OVR +5', 'Skill Moves +4',
        'Jumping +20 (98)', 'Stamina +20 (98)', 'Strength +20',
        'Interceptions +20', 'Heading Acc. +20', 'Def. Aware +20 (98)',
        'Stand Tackle +20', 'Slide Tackle +20',
        'Finishing +20 (98)', 'Long Shots +20', 'Volleys +20 (98)'
      ]
    }
  ],
  maxRepeatable: 2
};
