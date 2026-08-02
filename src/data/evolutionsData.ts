import { EvolutionDefinition, EvolutionPath } from '../types/player';

export const availableEvolutions: Record<string, EvolutionDefinition> = {
  '1076': {
    id: '1076',
    name: 'Total Glory',
    futbinLink: 'https://www.futbin.com/26/evolutions/1076/total-glory',
    version: 'FC 26',
    description: 'Elevate every aspect of your player to reach peak performance for total glory.',
    cost: 'Free / Objective',
    requirements: {
      maxOvr: 94,
      notRarity: 'World Tour Silver Stars',
      excludedPositions: ['GK']
    },
    ovrBoost: {
      boost: 1,
      limit: 94
    },
    faceBoosts: {
      pac: { boost: 1, limit: 95 },
      sho: { boost: 1, limit: 96 },
      pas: { boost: 2, limit: 96 },
      dri: { boost: 2, limit: 96 },
      def: { boost: 1, limit: 96 },
      phy: { boost: 1, limit: 95 }
    },
    subStatBoosts: {
      acceleration: { boost: 1, limit: 95 },
      sprintSpeed: { boost: 1, limit: 95 },
      positioning: { boost: 1, limit: 96 },
      finishing: { boost: 1, limit: 96 },
      shotPower: { boost: 2, limit: 98 },
      longShots: { boost: 2, limit: 98 },
      volleys: { boost: 1, limit: 96 },
      vision: { boost: 2, limit: 96 },
      shortPass: { boost: 2, limit: 98 },
      longPass: { boost: 2, limit: 98 },
      curve: { boost: 2, limit: 96 },
      agility: { boost: 2, limit: 96 },
      balance: { boost: 2, limit: 96 },
      ballControl: { boost: 2, limit: 97 },
      dribbling: { boost: 2, limit: 97 },
      composure: { boost: 2, limit: 98 },
      interceptions: { boost: 1, limit: 96 },
      defAwareness: { boost: 1, limit: 96 },
      standTackle: { boost: 1, limit: 96 },
      stamina: { boost: 1, limit: 95 },
      strength: { boost: 1, limit: 95 }
    },
    playStylesAdded: {
      gold: [],
      silver: ['Relentless', 'Bruiser']
    },
    weakFootBoost: 1,
    rarityChange: 'Glory Hunters',
    levels: [
      {
        name: 'Level 1',
        upgrades: [
          'Pace +1',
          'Passing +1',
          'Physical +1',
          'PlayStyle: Relentless'
        ]
      },
      {
        name: 'Level 2',
        upgrades: [
          'Shooting +1',
          'Passing +1',
          'Dribbling +1',
          'Defending +1',
          'PlayStyle: Bruiser'
        ]
      },
      {
        name: 'Level 3',
        upgrades: [
          'Dribbling +1',
          'Weak Foot +1 (5)'
        ]
      }
    ]
  },
  '1111': {
    id: '1111',
    name: 'Unstoppable Force',
    futbinLink: 'https://www.futbin.com/26/evolutions/1111/unstoppable-force',
    version: 'FC 26',
    description: 'Boost your attacking player into an unstoppable force.',
    cost: 'Season 9 Pass / Premium',
    requirements: {
      maxOvr: 94,
      maxPlayStyles: 10,
      notRarity: 'World Tour Silver Stars',
      excludedPositions: ['CB']
    },
    ovrBoost: { boost: 3, limit: 97 },
    faceBoosts: {
      pac: { boost: 5, limit: 97 },
      sho: { boost: 3, limit: 97 },
      pas: { boost: 3, limit: 98 },
      dri: { boost: 5, limit: 98 },
      def: { boost: 0, limit: 99 },
      phy: { boost: 3, limit: 97 }
    },
    subStatBoosts: {
      acceleration: { boost: 5, limit: 96 },
      sprintSpeed: { boost: 5, limit: 97 },
      positioning: { boost: 3, limit: 97 },
      finishing: { boost: 3, limit: 97 },
      shotPower: { boost: 3, limit: 96 },
      shortPass: { boost: 3, limit: 98 },
      longPass: { boost: 3, limit: 97 },
      agility: { boost: 5, limit: 96 },
      balance: { boost: 5, limit: 98 },
      ballControl: { boost: 5, limit: 98 },
      dribbling: { boost: 5, limit: 97 },
      reactions: { boost: 5, limit: 97 },
      composure: { boost: 5, limit: 97 },
      stamina: { boost: 3, limit: 97 }
    },
    playStylesAdded: {
      gold: [],
      silver: ['Rapid', 'Pinged Pass']
    },
    levels: [
      {
        name: 'Level 1',
        upgrades: ['Pace +1', 'PlayStyle: Rapid']
      },
      {
        name: 'Level 2',
        upgrades: ['Dribbling +1', 'PlayStyle: Incisive Pass']
      },
      {
        name: 'Level 3',
        upgrades: ['Shooting +1', 'PlayStyle: Finesse Shot']
      },
      {
        name: 'Level 4',
        upgrades: ['Passing +1', 'PlayStyle: Low Driven Shot']
      },
      {
        name: 'Level 5',
        upgrades: ['Physical +1', 'PlayStyle: Pinged Pass']
      }
    ]
  },
  '1154': {
    id: '1154',
    name: 'Flow State',
    futbinLink: 'https://www.futbin.com/26/evolutions/1154/flow-state',
    version: 'FC 26',
    description: 'Incremental boosts to stay eligible for future evolution chains.',
    cost: '20,000 Coins or 150 FC Points',
    requirements: {
      maxOvr: 95,
      maxPlayStyles: 10,
      notRarity: 'World Tour Silver Superstar',
      excludedPositions: ['GK']
    },
    ovrBoost: { boost: 1, limit: 99 },
    faceBoosts: {
      pac: { boost: 0, limit: 99 },
      sho: { boost: 0, limit: 99 },
      pas: { boost: 5, limit: 99 },
      dri: { boost: 5, limit: 99 },
      def: { boost: 0, limit: 99 },
      phy: { boost: 0, limit: 99 }
    },
    subStatBoosts: {
      vision: { boost: 5, limit: 99 },
      crossing: { boost: 5, limit: 99 },
      fkAcc: { boost: 5, limit: 99 },
      shortPass: { boost: 5, limit: 99 },
      longPass: { boost: 5, limit: 99 },
      curve: { boost: 5, limit: 99 },
      agility: { boost: 5, limit: 99 },
      balance: { boost: 5, limit: 99 },
      reactions: { boost: 5, limit: 99 },
      ballControl: { boost: 5, limit: 99 },
      dribbling: { boost: 5, limit: 99 },
      composure: { boost: 5, limit: 99 }
    },
    playStylesAdded: {
      gold: [],
      silver: ['Incisive Pass', 'Technical', 'Tiki Taka']
    },
    rarityChange: 'Glory Hunters',
    levels: [
      {
        name: 'Level 1',
        upgrades: ['OVR +1', 'Passing +5', 'Dribbling +5', 'PlayStyles: Incisive Pass, Technical, Tiki Taka']
      }
    ]
  },
  '1110': {
    id: '1110',
    name: 'Immovable Object',
    futbinLink: 'https://www.futbin.com/26/evolutions/1110/immovable-object',
    version: 'FC 26',
    description: 'Improve a players defensive and physical presence.',
    cost: 'Season 9 Pass',
    requirements: {
      maxOvr: 93,
      maxPlayStyles: 10,
      notRarity: 'World Tour Silver Stars'
    },
    ovrBoost: { boost: 3, limit: 99 },
    faceBoosts: {
      pac: { boost: 5, limit: 99 },
      sho: { boost: 0, limit: 99 },
      pas: { boost: 5, limit: 99 },
      dri: { boost: 5, limit: 99 },
      def: { boost: 6, limit: 99 },
      phy: { boost: 3, limit: 99 }
    },
    subStatBoosts: {
      acceleration: { boost: 5, limit: 99 },
      sprintSpeed: { boost: 5, limit: 99 },
      headingAccuracy: { boost: 6, limit: 99 },
      defAwareness: { boost: 6, limit: 99 },
      standTackle: { boost: 6, limit: 99 },
      slideTackle: { boost: 6, limit: 99 },
      interceptions: { boost: 6, limit: 99 },
      shortPass: { boost: 5, limit: 99 },
      longPass: { boost: 5, limit: 99 },
      agility: { boost: 5, limit: 99 },
      balance: { boost: 5, limit: 99 },
      reactions: { boost: 5, limit: 99 },
      composure: { boost: 5, limit: 99 },
      strength: { boost: 3, limit: 99 },
      aggression: { boost: 3, limit: 99 },
      jumping: { boost: 3, limit: 99 },
      stamina: { boost: 3, limit: 99 }
    },
    playStylesAdded: {
      gold: [],
      silver: ['Intercept', 'Bruiser', 'Anticipate', 'Aerial', 'Long Ball Pass']
    },
    levels: [
      {
        name: 'Level 1',
        upgrades: ['Pace +5', 'Defending +6']
      },
      {
        name: 'Level 2',
        upgrades: ['Passing +5', 'Physical +3', 'PlayStyle: Intercept']
      },
      {
        name: 'Level 3',
        upgrades: ['Dribbling +5', 'PlayStyles: Bruiser, Anticipate']
      },
      {
        name: 'Level 4',
        upgrades: ['Defending +6', 'PlayStyles: Aerial, Long Ball Pass']
      }
    ]
  },
  '2356': {
    id: '2356',
    name: 'Elite Midfielder',
    futbinLink: 'https://www.futbin.com/26/evolutions/1159/elite-midfielder',
    version: 'FC 26',
    description: 'Transform your CDM into an elite dominant force with massive boosts across 5 levels.',
    cost: 'Free / Objective',
    requirements: {
      maxOvr: 96,
      maxPlayStyles: 10,
      maxPlayStylesPlus: 4,
      positions: ['CDM'],
      excludedPositions: ['CB']
    },
    ovrBoost: { boost: 30, limit: 97 },
    faceBoosts: {
      pac: { boost: 30, limit: 92 },
      sho: { boost: 25, limit: 90 },
      pas: { boost: 30, limit: 98 },
      dri: { boost: 30, limit: 97 },
      def: { boost: 30, limit: 97 },
      phy: { boost: 30, limit: 95 }
    },
    subStatBoosts: {
      acceleration: { boost: 30, limit: 92 },
      sprintSpeed: { boost: 30, limit: 92 },
      positioning: { boost: 25, limit: 99 },
      finishing: { boost: 25, limit: 99 },
      shotPower: { boost: 25, limit: 99 },
      longShots: { boost: 25, limit: 99 },
      volleys: { boost: 25, limit: 99 },
      vision: { boost: 30, limit: 97 },
      crossing: { boost: 25, limit: 95 },
      freekick: { boost: 25, limit: 96 },
      shortPass: { boost: 30, limit: 98 },
      longPass: { boost: 30, limit: 98 },
      curve: { boost: 25, limit: 95 },
      agility: { boost: 25, limit: 95 },
      balance: { boost: 30, limit: 96 },
      reactions: { boost: 25, limit: 96 },
      ballControl: { boost: 30, limit: 97 },
      dribbling: { boost: 30, limit: 97 },
      composure: { boost: 30, limit: 98 },
      interceptions: { boost: 30, limit: 97 },
      headingAcc: { boost: 25, limit: 92 },
      defAwareness: { boost: 30, limit: 97 },
      standTackle: { boost: 30, limit: 96 },
      slideTackle: { boost: 25, limit: 93 },
      strength: { boost: 30, limit: 95 }
    },
    playStylesAdded: {
      gold: ['Intercept+', 'Pinged Pass+', 'Tiki Taka+', 'Anticipate+'],
      silver: ['Incisive Pass', 'Technical', 'Quick Step', 'Bruiser']
    },
    weakFootBoost: 4,
    skillMovesBoost: 3,
    levels: [
      {
        name: 'Level 1',
        upgrades: [
          'Standing Tackle +30 (96)', 'Reactions +25 (96)', 'Def. Awareness +30 (97)', 'Pace +30 (92)', 'OVR +10 (97)',
          'PlayStyle+: Intercept (4)', 'PlayStyle+: Pinged Pass (4)'
        ]
      },
      {
        name: 'Level 2',
        upgrades: [
          'Short Pass +30 (98)', 'FK Acc. +25 (96)', 'Composure +30 (98)', 'Physicality +30 (95)', 'Crossing +25 (95)', 'OVR +10 (97)',
          'PlayStyle+: Tiki Taka (4)'
        ]
      },
      {
        name: 'Level 3',
        upgrades: [
          'Slide Tackle +25 (93)', 'Shooting +25 (90)', 'Balance +30 (96)', 'Heading Acc. +25 (92)', 'Agility +25 (95)', 'OVR +10 (97)',
          'Skill Moves +3 (4)', 'Weak Foot +4 (5)',
          'PlayStyle+: Anticipate (4)'
        ]
      },
      {
        name: 'Level 4',
        upgrades: [
          'Interceptions +30 (97)', 'Long Pass +30 (98)',
          'PlayStyle: Incisive Pass (7)', 'PlayStyle: Technical (7)'
        ]
      },
      {
        name: 'Level 5',
        upgrades: [
          'Dribbling +30 (97)', 'Vision +30 (97)', 'Curve +25 (95)', 'Ball Control +30 (97)',
          'PlayStyle: Quick Step (7)', 'PlayStyle: Bruiser (7)'
        ]
      }
    ]
  }
};

export const defaultEvolutionPaths: EvolutionPath[] = [
  {
    id: 'path-double-glory-elite',
    name: 'Total Glory ➜ Elite Midfielder (2-EVO Chain)',
    description: 'Recommended 2-step optimal chain. Maximizes non-capped stats before scaling to 97 OVR.',
    isRecommended: true,
    chainIds: ['1076', '2356']
  },
  {
    id: 'path-single-elite',
    name: 'Elite Midfielder Only (1-EVO)',
    description: 'Single-step evolution going directly to 97 OVR.',
    isRecommended: false,
    chainIds: ['2356']
  },
  {
    id: 'path-single-glory',
    name: 'Total Glory Only (1-EVO)',
    description: 'Single-step evolution to 93 OVR.',
    isRecommended: false,
    chainIds: ['1076']
  }
];
