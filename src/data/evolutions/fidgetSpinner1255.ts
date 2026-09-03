import { EvolutionDefinition } from '../../types/player';

export const fidgetSpinner1255: EvolutionDefinition = {
  id: '1255',
  name: 'Fidget Spinner',
  futbinLink: 'https://www.futbin.com/26/evolutions/1255/fidget-spinner',
  version: 'FC 26',
  description:
    'Defenders never know what’s coming next. Evolve your player to be unpredictable with the ball and lethal in front of goal.',
  descriptionZh: "后卫永远猜不到下一步。让你的球员在球上不可预测、门前致命。｜适合：非门将，射门传球盘带线，边锋前腰。",
  cost: '200 FC Points / 75,000 Coins',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  ovrBoost: { boost: 10, limit: 98 },
  // Reactions, Shot Power, Vision and Composure are printed without a cap of their own, so only
  // the 99 ceiling holds them.
  subStatBoosts: {
    longShots: { boost: 20, limit: 97 },
    shotPower: { boost: 20, limit: 99 },
    volleys: { boost: 20, limit: 97 },
    crossing: { boost: 20, limit: 97 },
    longPass: { boost: 20, limit: 97 },
    freekick: { boost: 20, limit: 98 },
    vision: { boost: 20, limit: 99 },
    agility: { boost: 20, limit: 98 },
    balance: { boost: 20, limit: 98 },
    curve: { boost: 20, limit: 98 },
    reactions: { boost: 20, limit: 99 },
    ballControl: { boost: 20, limit: 98 },
    dribbling: { boost: 20, limit: 98 },
    composure: { boost: 20, limit: 99 }
  },
  skillMovesBoost: 4,
  playStylesAdded: {
    gold: [],
    silver: ['Trickster', 'Technical', 'First Touch', 'Gamechanger', 'Inventive']
  },
  playStylesLimit: { silver: 7 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +10 (98)',
        'Long Shots +20 (97)',
        'Shot Power +20',
        'Volleys +20 (97)',
        'Skills +4',
        'PlayStyle: Trickster (7)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Crossing +20 (97)',
        'Long Passing +20 (97)',
        'Free Kick +20 (98)',
        'Vision +20',
        'PlayStyle: Technical (7)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +20 (98)',
        'Balance +20 (98)',
        'Curve +20 (98)',
        'Reactions +20',
        'PlayStyle: First Touch (7)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Ball Control +20 (98)',
        'Dribbling +20 (98)',
        'Composure +20',
        'PlayStyle: Gamechanger (7)',
        'PlayStyle: Inventive (7)'
      ]
    }
  ],
  trainingTime: '1 Week',
  maxRepeatable: 1
};
