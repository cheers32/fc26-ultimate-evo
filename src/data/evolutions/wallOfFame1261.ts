import { EvolutionDefinition } from '../../types/player';

/**
 * The keeper evo that finally goes past Bail Out: one higher OVR ceiling, one higher PlayStyle+
 * slot, and the first to touch a keeper's pace — 90/90 on a card that usually reads 50 there is
 * what decides whether a sweeper keeper reaches the ball outside the box at all.
 */
export const wallOfFame1261: EvolutionDefinition = {
  id: '1261',
  name: 'Wall of Fame',
  futbinLink: 'https://www.futbin.com/26/evolutions/1261/wall-of-fame',
  version: 'FC 26',
  description: 'Give your goalkeeper elite end game upgrades and maximum 99 Reflexes to pull off impossible point blank saves when the match is on the line.',
  descriptionZh: "给你的门将精英级的终局升级和满级 99 反应，在比赛悬于一线时做出不可能的近距离扑救。｜适合：门将专用，+30 OVR。",
  cost: 'Free',
  requirements: {
    maxOvr: 96,
    maxPlayStyles: 10,
    maxPlayStylesPlus: 4,
    positions: ['GK']
  },
  ovrBoost: { boost: 30, limit: 98 },
  subStatBoosts: {
    diving: { boost: 30, limit: 97 },
    handling: { boost: 30, limit: 96 },
    kicking: { boost: 30, limit: 95 },
    // FUTBIN prints Reflexes bare on the summary and on level 2; the description calls it "maximum
    // 99 Reflexes", and De Gea's 91 goes to 99 there, so the cap is the stat ceiling itself.
    reflexes: { boost: 30, limit: 99 },
    gkPositioning: { boost: 30, limit: 97 },
    reactions: { boost: 30, limit: 97 },
    acceleration: { boost: 30, limit: 90 },
    sprintSpeed: { boost: 30, limit: 90 }
  },
  weakFootBoost: 4,
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['Far Reach', 'Rush Out', 'Pinged Pass'],
    silver: ['Far Throw', 'Footwork', 'Cross Claimer']
  },
  playStylesLimit: {
    gold: 5,
    silver: 7
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +30 (98)', 'Kicking +30 (95)', 'Reactions +30 (97)', 'Weak Foot +4 (5)',
        'PlayStyle+: Far Reach (5)', 'PlayStyle: Far Throw (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Diving +30 (97)', 'Reflexes +30 (99)', 'Skill Moves +4 (5)',
        'PlayStyle+: Rush Out (5)', 'PlayStyle: Footwork (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Handling +30 (96)', 'GK Positioning +30 (97)', 'Acceleration +30 (90)',
        'Sprint Speed +30 (90)', 'PlayStyle+: Pinged Pass (5)', 'PlayStyle: Cross Claimer (7)'
      ]
    }
  ],
  maxRepeatable: 1
};
