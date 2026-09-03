import { EvolutionDefinition } from '../../types/player';

/**
 * A centre-back evo that goes past four PlayStyle+ and, unusually for the type, spends two of the
 * five on pace: Quick Step and Rapid on top of 95/95. Everything defensive lands on 96-98, so where
 * this ends up is decided almost entirely by what the card brings above those caps — and by whether
 * 95 pace is enough to keep the archetype it had, since 20 points of acceleration against 30 of
 * strength moves a card the wrong way on the AcceleRATE lead.
 */
export const theVanguard1262: EvolutionDefinition = {
  id: '1262',
  name: 'The Vanguard',
  futbinLink: 'https://www.futbin.com/26/evolutions/1262/the-vanguard',
  version: 'FC 26',
  description: 'Put your backline in total control. Transform your centre-back into an elite leader with physical and defensive upgrades to read the play early and cut out danger before it starts.',
  descriptionZh: "让后防线完全掌控局面。把你的中卫变成精英领袖，用身体和防守升级提前读出球路，在危险发生前就掐掉。｜适合：CB 专用，+15 OVR。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['CB']
  },
  ovrBoost: { boost: 15, limit: 98 },
  subStatBoosts: {
    acceleration: { boost: 20, limit: 95 },
    sprintSpeed: { boost: 20, limit: 95 },
    headingAcc: { boost: 30, limit: 98 },
    interceptions: { boost: 30, limit: 98 },
    defAwareness: { boost: 30, limit: 98 },
    standTackle: { boost: 30, limit: 98 },
    slideTackle: { boost: 30, limit: 98 },
    jumping: { boost: 30, limit: 96 },
    stamina: { boost: 30, limit: 96 },
    strength: { boost: 30, limit: 96 },
    aggression: { boost: 30, limit: 96 }
  },
  weakFootBoost: 4,
  playStylesAdded: {
    gold: ['Quick Step', 'Rapid', 'Jockey'],
    silver: ['Bruiser', 'Anticipate', 'Slide Tackle']
  },
  playStylesLimit: {
    gold: 5,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +15 (98)', 'Acceleration +20 (95)', 'Sprint Speed +20 (95)', 'Weak Foot +4 (5)',
        'PlayStyle+: Quick Step (5)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Heading Acc. +30 (98)', 'Interceptions +30 (98)', 'Def. Aware +30 (98)',
        'PlayStyle+: Rapid (5)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Jumping +30 (96)', 'Slide Tackle +30 (98)', 'Stand Tackle +30 (98)',
        'PlayStyle+: Jockey (5)', 'PlayStyle: Bruiser (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +30 (96)', 'Stamina +30 (96)', 'Strength +30 (96)',
        'PlayStyle: Anticipate (7)', 'PlayStyle: Slide Tackle (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
