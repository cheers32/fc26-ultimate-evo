import { EvolutionDefinition } from '../../types/player';

/**
 * Free, two levels, and the only thing it asks is that the card is not a keeper and not already 99.
 *
 * Pace is the face — printed '+20 | 98' — and everything else is a sub-stat, which is why the
 * preview cards move the way they do: Espí's 91 PAC goes straight to the 98 cap at level 1, while
 * SHO only reaches 93 there because Finishing and Shot Power are two of its six sub-stats.
 *
 * Level 1 carries the OVR, the pace and the shooting; level 2 is passing, balance and the weak
 * foot. A card that wants the pace and nothing else can stop at one — the OVR comes with it.
 */
export const theLastSpark1296: EvolutionDefinition = {
  id: '1296',
  name: 'The Last Spark',
  nameZh: "最后的火花",
  futbinLink: 'https://www.futbin.com/26/evolutions/1296/the-last-spark',
  version: 'FC 26',
  expiresAt: '2026-09-25',
  description:
    'Provide the definitive flash of brilliance with an extra gear of speed, thread incisive ' +
    'passes through tight windows, and deliver precise strikes under pressure.',
  descriptionZh:
    "用额外一档的速度送出决定性的灵光一闪，在狭小空间里传出穿透球，并在压力下完成精准射门。｜适合：非门将均可，速度面板 +20 顶 98，射门传球各两项 +20。边路和前锋收益最大。",
  cost: 'Free',
  requirements: {
    maxOvr: 98,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 3, limit: 99 },
  faceBoosts: {
    pac: { boost: 20, limit: 98 }
  },
  // None of these print a cap of their own, so only the 99 ceiling holds them.
  subStatBoosts: {
    finishing: { boost: 20, limit: 99 },
    shotPower: { boost: 20, limit: 99 },
    volleys: { boost: 20, limit: 99 },
    shortPass: { boost: 20, limit: 99 },
    curve: { boost: 20, limit: 99 },
    balance: { boost: 20, limit: 99 }
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
        'OVR +3', 'PAC +20 (98)', 'Finishing +20', 'Shot Power +20', 'Skill Moves +4',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Balance +20', 'Curve +20', 'Short Pass +20', 'Volleys +20', 'Weak Foot +4',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    }
  ],
  maxRepeatable: 1
};
