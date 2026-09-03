import { EvolutionDefinition } from '../../types/player';

export const thePivotPoint1245: EvolutionDefinition = {
  id: '1245',
  name: 'The Pivot Point',
  futbinLink: 'https://www.futbin.com/26/evolutions/1245/the-pivot-point',
  version: 'FC 26',
  description:
    'The ultimate link. Turn your player into a midfield mastermind who shuts down opposition attacks and dictates the tempo going forward.',
  descriptionZh: "终极的纽带。把球员变成既能掐断对手进攻、又能掌控进攻节奏的中场大师。｜适合：非门将，五条线全加且可重复 8 次，是全库重复次数最多的。",
  cost: 'Free',
  requirements: {
    maxOvr: 97,
    maxPlayStyles: 10,
    excludedPositions: ['GK']
  },
  // FUTBIN prints Overall bare, like the other uncapped upgrades here — and repeatable eight times
  // is what makes the difference matter: at 98 the repeats stop one short of the ceiling.
  ovrBoost: { boost: 2, limit: 99 },
  // Small boosts spread over most of the card. Where FUTBIN prints no cap the stat is only held
  // by the 99 ceiling, which is what 99 means here.
  subStatBoosts: {
    acceleration: { boost: 3, limit: 96 },
    sprintSpeed: { boost: 3, limit: 96 },
    agility: { boost: 2, limit: 97 },
    balance: { boost: 2, limit: 98 },
    ballControl: { boost: 2, limit: 97 },
    dribbling: { boost: 2, limit: 97 },
    reactions: { boost: 2, limit: 99 },
    composure: { boost: 2, limit: 98 },
    crossing: { boost: 3, limit: 97 },
    curve: { boost: 3, limit: 97 },
    freekick: { boost: 3, limit: 96 },
    longPass: { boost: 3, limit: 99 },
    shortPass: { boost: 3, limit: 99 },
    vision: { boost: 3, limit: 97 },
    headingAcc: { boost: 6, limit: 98 },
    interceptions: { boost: 6, limit: 99 },
    defAwareness: { boost: 6, limit: 99 },
    standTackle: { boost: 6, limit: 99 },
    slideTackle: { boost: 6, limit: 98 },
    aggression: { boost: 5, limit: 99 },
    jumping: { boost: 5, limit: 98 },
    stamina: { boost: 5, limit: 98 },
    strength: { boost: 5, limit: 99 }
  },
  playStylesAdded: {
    gold: [],
    silver: ['Intercept', 'Pinged Pass', 'Bruiser', 'Incisive Pass', 'Anticipate']
  },
  playStylesLimit: { silver: 8 },
  levels: [
    {
      name: 'Level 1',
      upgrades: [
        'OVR +2',
        'Crossing +3 (97)',
        'Jumping +5 (98)',
        'Long Passing +3',
        'Short Passing +3',
        'PlayStyle: Intercept (8)'
      ]
    },
    {
      name: 'Level 2',
      upgrades: [
        'Acceleration +3 (96)',
        'Curve +3 (97)',
        'Interceptions +6',
        'Reactions +2',
        'Stamina +5 (98)',
        'PlayStyle: Pinged Pass (8)'
      ]
    },
    {
      name: 'Level 3',
      upgrades: [
        'Agility +2 (97)',
        'Heading Acc. +6 (98)',
        'Strength +5',
        'Vision +3 (97)',
        'Composure +2 (98)',
        'PlayStyle: Bruiser (8)'
      ]
    },
    {
      name: 'Level 4',
      upgrades: [
        'Aggression +5',
        'Balance +2 (98)',
        'Def. Aware +6',
        'Sprint Speed +3 (96)',
        'Stand Tackle +6',
        'PlayStyle: Incisive Pass (8)'
      ]
    },
    {
      name: 'Level 5',
      upgrades: [
        'Ball control +2 (97)',
        'Dribbling +2 (97)',
        'Free Kick +3 (96)',
        'Slide Tackle +6 (98)',
        'PlayStyle: Anticipate (8)'
      ]
    }
  ],
  maxRepeatable: 8
};
