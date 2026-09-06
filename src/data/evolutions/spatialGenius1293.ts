import { EvolutionDefinition } from '../../types/player';

/**
 * Free, repeatable twice, no position requirement at all — only an OVR under 98. That combination
 * makes it the widest net currently on the shelf.
 *
 * Every one of its ten sub-stats is a shooting, passing or on-the-ball number: it adds nothing to
 * pace, nothing to defending, nothing physical, and not a point of agility. So it changes what a
 * card does with the ball and leaves how it moves exactly as it was — which also means it cannot
 * disturb an AcceleRATE archetype, since that is read off acceleration, agility and strength.
 *
 * The OVR is only +5, so unlike most of this batch it does not spend the card's headroom: a card can
 * take this and still be under the entry cap of nearly everything else.
 *
 * Read off the game's own Evolutions tab, per-level split and challenges included.
 */
export const spatialGenius1293: EvolutionDefinition = {
  id: '1293',
  name: 'Spatial Genius',
  nameZh: "空间天才",
  futbinLink: 'https://www.futbin.com/26/evolutions/1293/spatial-genius',
  version: 'FC 26',
  expiresAt: '2026-09-15',
  description: 'Unlock stubborn defences with razor sharp passing, drift past defenders with effortless close control, and execute clinical finishes from tight angles.',
  descriptionZh: "用锋利的传球撕开顽固的防线，用轻松的贴身控球晃过后卫，从刁钻角度打进冷静的一球。｜适合：不挑位置、免费、可重复 2 次，OVR 只 +5 所以不占后续 evo 的准入空间；只加射门传球和球感十项，完全不碰速度、防守和身体，也就不会破坏加速类型。",
  cost: 'Free',
  requirements: {
    maxOvr: 97
  },
  ovrBoost: { boost: 5, limit: 99 },
  subStatBoosts: {
    finishing: { boost: 20, limit: 99 },
    shotPower: { boost: 20, limit: 98 },
    longShots: { boost: 20, limit: 99 },
    vision: { boost: 20, limit: 98 },
    freekick: { boost: 20, limit: 99 },
    shortPass: { boost: 20, limit: 99 },
    longPass: { boost: 20, limit: 98 },
    balance: { boost: 20, limit: 99 },
    ballControl: { boost: 20, limit: 98 },
    composure: { boost: 20, limit: 98 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: { gold: [], silver: [] },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +5', 'Finishing +20', 'Shot Power +20 (98)', 'Long Shots +20',
        'Vision +20 (98)', 'FK Acc. +20', 'Weak Foot +4 (5)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Short Pass +20', 'Long Pass +20 (98)', 'Balance +20', 'Ball Control +20 (98)',
        'Composure +20 (98)', 'Skill Moves +4 (5)',
        'Challenge: play 1 match in Squad Battles on min Semi-Pro (or Rush/Rivals/Champions/Live Events)'
      ]
    }
  ],
  maxRepeatable: 2
};
