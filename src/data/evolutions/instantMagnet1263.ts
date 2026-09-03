import { EvolutionDefinition } from '../../types/player';

/**
 * Two levels of +1/+2 on every face with every cap at 98, plus five-star skills and a fifth
 * PlayStyle+ slot arriving with First Touch in it. So it finishes a card already sitting on 96s and
 * does nothing at all for one that is not — +1 twice does not move a face in the 80s.
 *
 * Read off FUTBIN rather than fut.gg. fut.gg renders the granted PlayStyle as an icon with no text,
 * so the First Touch+ and the fifth gold slot were missing when this was first added from there.
 * The two sources disagree on Weak Foot — fut.gg lists +4, FUTBIN's upgrade table has no Weak Foot
 * row while listing one for other evos — so FUTBIN is followed and none is modelled.
 */
export const instantMagnet1263: EvolutionDefinition = {
  id: '1263',
  name: 'Instant Magnet',
  futbinLink: 'https://www.futbin.com/26/evolutions/1263/instant-magnet',
  version: 'FC 26',
  description: 'Unlocked by completing the FUTTIES EVO Fun! objective, in Objectives → Campaign.',
  descriptionZh: "完成 Objectives → Campaign 中的 FUTTIES EVO Fun! 目标解锁。｜适合：任何位置，六围各 +1~2 的收尾补丁。",
  cost: 'Free / Objective',
  requirements: {
    maxOvr: 97,
    maxPlayStylesPlus: 4
  },
  ovrBoost: { boost: 1, limit: 98 },
  faceBoosts: {
    pac: { boost: 1, limit: 98 },
    sho: { boost: 1, limit: 98 },
    pas: { boost: 2, limit: 98 },
    dri: { boost: 2, limit: 98 },
    def: { boost: 1, limit: 98 },
    phy: { boost: 1, limit: 98 }
  },
  subStatBoosts: {},
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: ['First Touch'],
    silver: []
  },
  playStylesLimit: {
    gold: 5
  },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +1 (98)', 'Pace +1 (98)', 'Shooting +1 (98)', 'Passing +2 (98)', 'Dribbling +2 (98)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Defending +1 (98)', 'Physical +1 (98)', 'Skill Moves +4 (5)',
        'PlayStyle+: First Touch (5)'
      ]
    }
  ],
  maxRepeatable: 1
};
