import { EvolutionDefinition } from '../../types/player';

/**
 * Four levels, five PlayStyle+ and a +60 on everything it touches — which on an end-game card
 * means every one of those lines lands on its cap. The gate is the point: ST only, and no more
 * than five PlayStyle+ already on the card, so it is spent on a striker that has slots left.
 *
 * Pace and Shooting are faces (level 3 and level 4); everything else is a sub-stat. Vini's preview
 * shows it — his 97 PAC moves 2 at level 3 while SHO jumps 9 at level 4, because Shooting is one
 * number and the sub-stats under it are not what the evo names.
 *
 * The PlayStyle+ are the real prize and they are spread one per level, two at level 3: Low Driven
 * Shot, Finesse Shot, Rapid, Technical, Quick Step. A card that only wants those has to run the
 * whole thing.
 */
export const monsterStriker1297: EvolutionDefinition = {
  id: '1297',
  name: 'Monster Striker',
  nameZh: "怪物中锋",
  futbinLink: 'https://www.futbin.com/26/evolutions/1297/monster-striker',
  version: 'FC 26',
  // Seven days, off the game's own countdown. FUTBIN's "2 Weeks" is how long the evo runs.
  expiresAt: '2026-09-18',
  description:
    'Build a striker defenders will fear. Add the power, presence and finishing to turn your ' +
    'forward into a true monster in and around the box.',
  descriptionZh:
    "打造一个让后卫害怕的中锋。补上力量、存在感和终结能力，把你的前锋变成禁区内外真正的怪物。｜适合：ST 专用（非中卫），速度射门两个面板 +60，另给 5 个金技能。",
  cost: 'Free',
  requirements: {
    maxOvr: 98,
    maxPlayStylesPlus: 5,
    positions: ['ST'],
    excludedPositions: ['CB']
  },
  ovrBoost: { boost: 60, limit: 99 },
  faceBoosts: {
    pac: { boost: 60, limit: 99 },
    sho: { boost: 60, limit: 99 }
  },
  subStatBoosts: {
    // Level 1
    agility: { boost: 60, limit: 99 },
    crossing: { boost: 60, limit: 96 },
    jumping: { boost: 60, limit: 95 },
    vision: { boost: 60, limit: 98 },
    // Level 2
    balance: { boost: 60, limit: 99 },
    ballControl: { boost: 60, limit: 96 },
    shortPass: { boost: 60, limit: 99 },
    freekick: { boost: 60, limit: 98 },
    stamina: { boost: 80, limit: 99 },
    // Level 3
    aggression: { boost: 60, limit: 97 },
    dribbling: { boost: 60, limit: 97 },
    longPass: { boost: 60, limit: 97 },
    // Level 4
    curve: { boost: 60, limit: 96 },
    reactions: { boost: 60, limit: 97 },
    strength: { boost: 60, limit: 97 },
    composure: { boost: 60, limit: 98 }
  },
  playStylesAdded: {
    gold: ['Low Driven Shot', 'Finesse Shot', 'Rapid', 'Technical', 'Quick Step'],
    silver: []
  },
  playStylesLimit: {
    gold: 5
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +60', 'Agility +60', 'Crossing +60 (96)', 'Jumping +60 (95)', 'Vision +60 (98)',
        'PlayStyle+: Low Driven Shot (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Balance +60', 'Ball Control +60 (96)', 'Short Pass +60', 'Free Kick +60 (98)',
        'Stamina +80', 'PlayStyle+: Finesse Shot (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'PAC +60', 'Aggression +60 (97)', 'Dribbling +60 (97)', 'Long Pass +60 (97)',
        'PlayStyle+: Rapid (5)', 'PlayStyle+: Technical (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'SHO +60', 'Curve +60 (96)', 'Reactions +60 (97)', 'Strength +60 (97)',
        'Composure +60 (98)', 'PlayStyle+: Quick Step (5)',
        'Challenge: play 1 match in any mode with the active EVO player'
      ]
    }
  ],
  maxRepeatable: 1
};
