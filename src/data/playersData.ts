import { PlayerData } from '../types/player';

export const playersDatabase: Record<string, PlayerData> = {
  'rodri-91': {
    id: 'rodri-91',
    futbinLink: 'https://www.futbin.com/26/player/20701/rodrigo-hernandez-cascante',
    avatarUrl: '/images/rodri.png',
    bio: {
      name: 'Rodri',
      club: 'Manchester City',
      nation: 'Spain',
      league: 'Premier League',
      title: 'Elite Midfielder',
      primaryPositions: 'CDM, CM',
      height: `190cm | 6'3"`,
      footAge: 'Right | 30 yrs',
      weakFoot: 4,
      skillMoves: 3,
      rarity: 'Thunderstruck',
      bodyType: 'Tall & Normal',
      roles: {
        cdm: ['Holding++', 'Centre Half++', 'Deep-Lying Playmaker++', 'Wide Half++', 'Box Crasher++'],
        cm: ['Box-to-Box++', 'Holding++', 'Deep-Lying Playmaker++', 'Playmaker++', 'Half Winger++']
      }
    },
    ovr: { base: 91, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Intercept+'],
        silver: ['Power Shot', 'Incisive Pass', 'Long Ball Pass', 'Tiki Taka', 'Press Proven', 'Relentless', 'Bruiser', 'Aerial Fortress']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 82, evFace: 82,
        subs: {
          acceleration: { label: 'Acceleration', base: 82, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 82, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 81, evFace: 81,
        subs: {
          positioning: { label: 'Att. Position', base: 77, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 75, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 93, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 90, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 72, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 63, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 91, evFace: 91,
        subs: {
          vision: { label: 'Vision', base: 90, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 82, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 71, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 96, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 96, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 91, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 87, evFace: 87,
        subs: {
          agility: { label: 'Agility', base: 80, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 80, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 94, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 91, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 85, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 94, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 87, evFace: 87,
        subs: {
          interceptions: { label: 'Interceptions', base: 85, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 82, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 89, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 88, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 83, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 86, evFace: 86,
        subs: {
          jumping: { label: 'Jumping', base: 84, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 92, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 84, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 86, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'ronaldo-19978': {
    id: 'ronaldo-19978',
    futbinLink: 'https://www.futbin.com/26/player/19978/cristiano-ronaldo-dos-santos-aveiro',
    avatarUrl: '/images/ronaldo.png',
    bio: {
      name: 'Cristiano Ronaldo',
      club: 'Al Nassr',
      nation: 'Portugal',
      league: 'ROSHN Saudi League',
      title: 'Striker',
      primaryPositions: 'ST',
      height: `187cm | 6'2"`,
      footAge: 'Right | 41 yrs',
      weakFoot: 4,
      skillMoves: 5,
      rarity: 'Cornerstones',
      roles: {
        st: ['Advanced Forward+', 'Target Forward+', 'Poacher++']
      }
    },
    ovr: { base: 88, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Low Driven Shot'],
        silver: ['Power Shot', 'Precision Header', 'Acrobatic', 'Gamechanger', 'Aerial Fortress', 'Trickster']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 82, evFace: 82,
        subs: {
          acceleration: { label: 'Acceleration', base: 80, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 83, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 91, evFace: 91,
        subs: {
          positioning: { label: 'Att. Position', base: 92, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 91, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 94, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 87, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 87, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 94, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 79, evFace: 79,
        subs: {
          vision: { label: 'Vision', base: 79, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 81, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 84, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 79, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 73, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 82, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 83, evFace: 83,
        subs: {
          agility: { label: 'Agility', base: 78, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 74, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 85, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 87, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 80, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 94, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 37, evFace: 37,
        subs: {
          interceptions: { label: 'Interceptions', base: 32, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 93, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 26, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 35, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 26, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 80, evFace: 80,
        subs: {
          jumping: { label: 'Jumping', base: 97, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 81, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 84, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 65, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'pogba-23940': {
    id: 'pogba-23940',
    futbinLink: 'https://www.futbin.com/26/player/23940/paul-pogba',
    avatarUrl: '/images/pogba.png',
    bio: {
      name: 'Paul Pogba',
      club: 'AS Monaco',
      nation: 'France',
      league: 'Ligue 1 McDonald\'s',
      title: 'Midfielder',
      primaryPositions: 'CM, CDM, CAM',
      height: `191cm | 6'3"`,
      footAge: 'Right | 33 yrs',
      weakFoot: 5,
      skillMoves: 5,
      rarity: 'FUT Birthday',
      roles: {
        cm: ['Box-to-Box+', 'Holding+', 'Deep-Lying Playmaker++', 'Playmaker++'],
        cdm: ['Holding+', 'Deep-Lying Playmaker++', 'Box Crasher++'],
        cam: ['Shadow Striker+', 'Playmaker++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: [],
        silver: []
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 88, evFace: 88,
        subs: {
          acceleration: { label: 'Acceleration', base: 87, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 89, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 90, evFace: 90,
        subs: {
          positioning: { label: 'Att. Position', base: 87, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 86, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 97, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 93, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 94, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 91, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 92, evFace: 92,
        subs: {
          vision: { label: 'Vision', base: 94, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 85, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 90, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 93, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 96, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 93, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 92, evFace: 92,
        subs: {
          agility: { label: 'Agility', base: 89, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 88, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 87, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 92, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 93, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 91, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 85, evFace: 85,
        subs: {
          interceptions: { label: 'Interceptions', base: 84, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 91, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 83, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 85, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 83, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 91, evFace: 91,
        subs: {
          jumping: { label: 'Jumping', base: 88, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 89, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 94, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 89, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'pogba-79': {
    id: 'pogba-79',
    futbinLink: 'https://www.futbin.com/26/player/17721/paul-pogba',
    avatarUrl: '/images/pogba.png',
    bio: {
      name: 'Paul Pogba',
      club: 'AS Monaco',
      nation: 'France',
      league: 'Ligue 1 McDonald\'s',
      title: 'Gold Rare',
      primaryPositions: 'CM, CDM, CAM',
      height: `191cm | 6'3"`,
      footAge: 'Right | 33 yrs',
      weakFoot: 4,
      skillMoves: 5,
      rarity: 'Gold Rare',
      roles: {
        cm: ['Box-to-Box+', 'Playmaker+'],
        cdm: ['Deep-Lying Playmaker+']
      }
    },
    ovr: { base: 79, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: [],
        silver: ['Dead Ball', 'Long Ball Pass', 'Inventive', 'Technical']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 64, evFace: 64,
        subs: {
          acceleration: { label: 'Acceleration', base: 60, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 68, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 76, evFace: 76,
        subs: {
          positioning: { label: 'Att. Position', base: 73, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 68, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 88, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 81, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 81, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 77, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 81, evFace: 81,
        subs: {
          vision: { label: 'Vision', base: 83, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 72, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 79, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 84, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 86, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 84, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 83, evFace: 83,
        subs: {
          agility: { label: 'Agility', base: 68, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 65, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 71, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 86, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 87, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 82, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 60, evFace: 60,
        subs: {
          interceptions: { label: 'Interceptions', base: 60, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 73, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 52, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 63, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 61, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 78, evFace: 78,
        subs: {
          jumping: { label: 'Jumping', base: 82, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 56, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 88, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 77, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'petit-87': {
    id: 'petit-87',
    futbinLink: 'https://www.futbin.com/26/player/18793/petit',
    avatarUrl: '/images/petit.png',
    bio: {
      name: 'Emmanuel Petit',
      club: 'EA FC ICONS',
      nation: 'France',
      league: 'Icons',
      title: 'Icon',
      primaryPositions: 'CDM, LB, CM',
      height: `185cm | 6'1"`,
      footAge: 'Left | 22-09-1970',
      weakFoot: 3,
      skillMoves: 3,
      rarity: 'Base Icon',
      roles: {
        cdm: ['Wide Half+', 'Holding++'],
        lb: ['Wingback+'],
        cm: ['Box-to-Box++']
      }
    },
    ovr: { base: 87, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Relentless+'],
        silver: ['Power Shot', 'Incisive Pass', 'Intercept', 'Anticipate', 'Slide Tackle', 'Press Proven']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 77, evFace: 77,
        subs: {
          acceleration: { label: 'Acceleration', base: 75, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 78, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 77, evFace: 77,
        subs: {
          positioning: { label: 'Att. Position', base: 79, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 69, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 88, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 88, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 74, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 62, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 79, evFace: 79,
        subs: {
          vision: { label: 'Vision', base: 75, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 71, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 69, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 88, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 82, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 71, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 76, evFace: 76,
        subs: {
          agility: { label: 'Agility', base: 77, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 71, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 82, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 84, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 70, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 85, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 85, evFace: 85,
        subs: {
          interceptions: { label: 'Interceptions', base: 87, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 77, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 82, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 88, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 84, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 87, evFace: 87,
        subs: {
          jumping: { label: 'Jumping', base: 76, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 90, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 86, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 88, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'rabiot-92': {
    id: 'rabiot-92',
    futbinLink: 'https://www.futbin.com/26/player/24633/adrien-rabiot',
    avatarUrl: '/images/rabiot.png',
    bio: {
      name: 'Adrien Rabiot',
      club: 'Milano FC',
      nation: 'France',
      league: 'Serie A TIM',
      title: 'TOTS',
      primaryPositions: 'CM, CDM, CAM',
      height: `191cm | 6'3"`,
      footAge: 'Left | 31 yrs',
      bodyType: 'Tall & Lean',
      weakFoot: 5,
      skillMoves: 4,
      rarity: 'Team of the Season',
      roles: {
        cm: ['Box-to-Box++', 'Holding++', 'Deep-Lying Playmaker++', 'Playmaker++', 'Half Winger++'],
        cdm: ['Centre Half+', 'Wide Half+', 'Box Crasher+', 'Holding++', 'Deep-Lying Playmaker++'],
        cam: ['Classic 10+', 'Playmaker++', 'Shadow Striker++', 'Half Winger++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Press Proven+', 'Pinged Pass+', 'Tiki Taka+'],
        silver: ['Precision Header', 'Low Driven Shot', 'Incisive Pass', 'Intercept', 'Anticipate', 'First Touch', 'Bruiser']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 90, evFace: 90,
        subs: {
          acceleration: { label: 'Acceleration', base: 86, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 93, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 88, evFace: 88,
        subs: {
          positioning: { label: 'Att. Position', base: 98, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 88, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 92, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 86, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 85, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 77, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 90, evFace: 90,
        subs: {
          vision: { label: 'Vision', base: 93, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 88, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 70, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 94, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 90, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 84, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 92, evFace: 92,
        subs: {
          agility: { label: 'Agility', base: 86, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 87, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 95, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 94, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 91, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 96, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 88, evFace: 88,
        subs: {
          interceptions: { label: 'Interceptions', base: 88, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 95, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 84, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 90, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 84, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 93, evFace: 93,
        subs: {
          jumping: { label: 'Jumping', base: 98, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 98, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 92, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 87, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'rabiot-86': {
    id: 'rabiot-86',
    futbinLink: 'https://www.futbin.com/26/player/21786/adrien-rabiot',
    avatarUrl: '/images/rabiot-86.png',
    bio: {
      name: 'Adrien Rabiot',
      club: 'Milano FC',
      nation: 'France',
      league: 'Serie A TIM',
      title: 'TOTW',
      primaryPositions: 'CM, CAM',
      height: `191cm | 6'3"`,
      footAge: 'Left | 31 yrs',
      bodyType: 'Tall & Lean',
      weakFoot: 3,
      skillMoves: 3,
      rarity: 'Team of the Week',
      roles: {
        cm: ['Box-to-Box++'],
        cam: ['Playmaker+', 'Shadow Striker+', 'Half Winger++']
      }
    },
    ovr: { base: 86, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Press Proven+'],
        silver: ['Precision Header', 'Low Driven Shot', 'Tiki Taka', 'First Touch', 'Relentless']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 84, evFace: 84,
        subs: {
          acceleration: { label: 'Acceleration', base: 78, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 89, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 84, evFace: 84,
        subs: {
          positioning: { label: 'Att. Position', base: 92, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 83, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 87, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 83, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 80, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 75, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 84, evFace: 84,
        subs: {
          vision: { label: 'Vision', base: 87, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 81, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 62, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 88, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 83, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 76, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 85, evFace: 85,
        subs: {
          agility: { label: 'Agility', base: 75, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 75, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 88, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 88, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 85, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 89, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 81, evFace: 81,
        subs: {
          interceptions: { label: 'Interceptions', base: 82, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 87, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 76, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 83, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 78, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 87, evFace: 87,
        subs: {
          jumping: { label: 'Jumping', base: 93, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 96, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 85, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 81, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'maldini-89': {
    id: 'maldini-89',
    futbinLink: 'https://www.futbin.com/26/player/24556/maldini',
    avatarUrl: '/images/maldini.png',
    bio: {
      name: 'Paolo Maldini',
      club: 'EA FC ICONS',
      nation: 'Italy',
      league: 'Icons',
      title: 'Icon',
      primaryPositions: 'CB, LB',
      height: `186cm | 6'1"`,
      footAge: 'Right | 26-06-1968',
      weakFoot: 4,
      skillMoves: 2,
      rarity: 'Trophy Titans Icon',
      roles: {
        cb: ['Wide Back+', 'Defender++', 'Stopper++', 'Ball-Playing Defender++'],
        lb: ['Falseback+', 'Wingback+', 'Fullback++']
      }
    },
    ovr: { base: 89, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Intercept+', 'Jockey+'],
        silver: ['Precision Header', 'Long Ball Pass', 'Anticipate', 'Slide Tackle', 'Aerial Fortress', 'Quick Step', 'Bruiser']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 88, evFace: 88,
        subs: {
          acceleration: { label: 'Acceleration', base: 87, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 88, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 52, evFace: 52,
        subs: {
          positioning: { label: 'Att. Position', base: 37, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 53, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 68, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 38, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 61, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 50, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 72, evFace: 72,
        subs: {
          vision: { label: 'Vision', base: 66, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 73, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 29, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 84, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 76, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 39, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 77, evFace: 77,
        subs: {
          agility: { label: 'Agility', base: 75, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 78, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 90, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 80, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 72, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 90, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 92, evFace: 92,
        subs: {
          interceptions: { label: 'Interceptions', base: 92, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 90, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 91, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 93, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 92, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 83, evFace: 83,
        subs: {
          jumping: { label: 'Jumping', base: 84, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 81, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 85, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 79, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'pedri-92': {
    id: 'pedri-92',
    futbinLink: 'https://www.futbin.com/26/player/23941/pedro-gonzalez-lopez',
    avatarUrl: '/images/pedri.png',
    bio: {
      name: 'Pedri',
      club: 'FC Barcelona',
      nation: 'Spain',
      league: 'LALIGA EA SPORTS',
      title: 'FUT Birthday',
      primaryPositions: 'CM, CDM, CAM',
      height: `174cm | 5'9"`,
      footAge: 'Right | 23 yrs',
      bodyType: 'Avg & Lean',
      weakFoot: 5,
      skillMoves: 5,
      rarity: 'FUT Birthday',
      roles: {
        cm: ['Holding+', 'Deep-Lying Playmaker++', 'Playmaker++'],
        cdm: ['Holding+', 'Box Crasher+', 'Deep-Lying Playmaker++'],
        cam: ['Shadow Striker+', 'Playmaker++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: [],
        silver: []
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 88, evFace: 88,
        subs: {
          acceleration: { label: 'Acceleration', base: 89, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 88, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 90, evFace: 90,
        subs: {
          positioning: { label: 'Att. Position', base: 95, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 95, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 84, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 94, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 72, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 70, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 91, evFace: 91,
        subs: {
          vision: { label: 'Vision', base: 96, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 82, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 69, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 96, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 94, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 84, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 93, evFace: 93,
        subs: {
          agility: { label: 'Agility', base: 91, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 94, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 89, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 93, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 93, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 92, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 85, evFace: 85,
        subs: {
          interceptions: { label: 'Interceptions', base: 94, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 54, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 81, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 91, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 88, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 85, evFace: 85,
        subs: {
          jumping: { label: 'Jumping', base: 81, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 94, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 82, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 81, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'griezmann-87': {
    id: 'griezmann-87',
    futbinLink: 'https://www.futbin.com/26/player/20343/antoine-griezmann',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p50526413.png?fm=png&ixlib=java-2.1.0&verzion=2&w=485&s=e54fed2900b718240a97e816626f9b60',
    bio: {
      name: 'Antoine Griezmann',
      club: 'Atlético de Madrid',
      nation: 'France',
      league: 'LALIGA EA SPORTS',
      title: 'Ultimate Scream',
      primaryPositions: 'CAM, LM, ST',
      height: `176cm | 5'9"`,
      footAge: 'Left | 35 yrs',
      weakFoot: 3,
      skillMoves: 4,
      rarity: 'Ultimate Scream',
      roles: {
        cam: ['Playmaker++', 'Shadow Striker++', 'Half Winger++', 'Classic 10++'],
        lm: ['Winger++', 'Wide Midfielder++', 'Wide Playmaker++', 'Inside Forward++'],
        st: ['Advanced Forward++', 'Poacher++', 'False 9++', 'Target Forward++']
      }
    },
    ovr: { base: 87, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Finesse Shot+'],
        silver: ['Chip Shot', 'Low Driven Shot', 'Gamechanger', 'Incisive Pass', 'Long Ball Pass', 'Inventive', 'Technical']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 80, evFace: 80,
        subs: {
          acceleration: { label: 'Acceleration', base: 81, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 80, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 88, evFace: 88,
        subs: {
          positioning: { label: 'Att. Position', base: 89, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 88, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 87, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 88, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 88, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 81, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 87, evFace: 87,
        subs: {
          vision: { label: 'Vision', base: 88, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 84, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 87, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 88, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 85, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 91, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 90, evFace: 90,
        subs: {
          agility: { label: 'Agility', base: 90, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 87, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 89, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 92, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 88, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 90, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 61, evFace: 61,
        subs: {
          interceptions: { label: 'Interceptions', base: 61, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 82, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 47, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 65, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 66, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 76, evFace: 76,
        subs: {
          jumping: { label: 'Jumping', base: 87, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 80, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 73, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 77, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'dunga-89': {
    id: 'dunga-89',
    futbinLink: 'https://www.futbin.com/26/player/22811/bledorn-verri',
    avatarUrl: '/images/dunga.png',
    bio: {
      name: 'Dunga',
      club: 'EA FC ICONS',
      nation: 'Brazil',
      league: 'Icons',
      title: 'Icon',
      primaryPositions: 'CDM, CM',
      height: `176cm | 5'9"`,
      footAge: 'Right | 31-10-1963',
      weakFoot: 4,
      skillMoves: 3,
      rarity: 'Knockout Royalty Icon',
      roles: {
        cdm: ['Centre Half+', 'Box Crasher+', 'Holding++', 'Deep-Lying Playmaker++'],
        cm: ['Playmaker+', 'Holding++', 'Deep-Lying Playmaker++']
      }
    },
    ovr: { base: 89, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Intercept+', 'Anticipate+'],
        silver: ['Pinged Pass', 'Long Ball Pass', 'Tiki Taka', 'Jockey', 'Slide Tackle', 'Press Proven']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 86, evFace: 86,
        subs: {
          acceleration: { label: 'Acceleration', base: 86, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 86, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 80, evFace: 80,
        subs: {
          positioning: { label: 'Att. Position', base: 75, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 71, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 95, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 88, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 86, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 77, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 85, evFace: 85,
        subs: {
          vision: { label: 'Vision', base: 85, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 80, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 87, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 87, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 88, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 85, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 83, evFace: 83,
        subs: {
          agility: { label: 'Agility', base: 85, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 90, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 84, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 83, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 82, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 89, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 89, evFace: 89,
        subs: {
          interceptions: { label: 'Interceptions', base: 89, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 75, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 91, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 90, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 91, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 87, evFace: 87,
        subs: {
          jumping: { label: 'Jumping', base: 80, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 91, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 85, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 90, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'mbappe-92': {
    id: 'mbappe-92',
    futbinLink: 'https://www.futbin.com/26/player/20515/kylian-mbappe',
    avatarUrl: '/images/mbappe.png',
    bio: {
      name: 'Kylian Mbappé',
      club: 'Real Madrid',
      nation: 'France',
      league: 'LALIGA EA SPORTS',
      title: 'Festival of Football Captains',
      primaryPositions: 'ST, LM, LW',
      height: `182cm | 6'0"`,
      footAge: 'Right | 27 yrs',
      weakFoot: 4,
      skillMoves: 5,
      rarity: 'Festival of Football Captains',
      roles: {
        st: ['False 9+', 'Advanced Forward++'],
        lm: ['Inside Forward+'],
        lw: ['Inside Forward++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Finesse Shot+'],
        silver: ['Power Shot', 'Acrobatic', 'Low Driven Shot', 'Gamechanger', 'Rapid', 'Quick Step']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 98, evFace: 98,
        subs: {
          acceleration: { label: 'Acceleration', base: 98, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 98, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 92, evFace: 92,
        subs: {
          positioning: { label: 'Att. Position', base: 93, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 94, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 93, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 88, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 89, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 84, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 84, evFace: 84,
        subs: {
          vision: { label: 'Vision', base: 86, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 81, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 72, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 90, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 77, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 83, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 93, evFace: 93,
        subs: {
          agility: { label: 'Agility', base: 94, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 83, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 92, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 94, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 93, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 89, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 40, evFace: 40,
        subs: {
          interceptions: { label: 'Interceptions', base: 41, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 82, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 29, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 37, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 35, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 78, evFace: 78,
        subs: {
          jumping: { label: 'Jumping', base: 92, boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 85, boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 79, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 63, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'cafu-91': {
    id: 'cafu-91',
    futbinLink: 'https://www.futbin.com/26/player/18714/cafu',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/5003.png?fm=png&ixlib=java-2.1.0&verzion=3&w=324&s=060c8c246fe58cc3e8dbabbfa510af4e',
    bio: {
      name: 'Cafu',
      club: 'EA FC ICONS',
      nation: 'Brazil',
      league: 'Icons',
      title: 'Icon',
      primaryPositions: 'RB',
      height: `176cm | 5'9"`,
      footAge: 'Right | 56 yrs',
      weakFoot: 3,
      skillMoves: 4,
      rarity: 'Icon',
      roles: {
        rb: ['Attacking Wingback+', 'Wingback++']
      }
    },
    ovr: { base: 91, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Relentless+'],
        silver: ['Gamechanger', 'Inventive', 'Jockey']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 90, evFace: 90,
        subs: {
          acceleration: { label: 'Acceleration', base: 91, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 90, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 56, evFace: 56,
        subs: {
          positioning: { label: 'Att. Position', base: 71, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 44, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 65, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 64, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 60, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 71, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 83, evFace: 83,
        subs: {
          vision: { label: 'Vision', base: 82, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 91, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 61, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 87, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 71, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 75, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 85, evFace: 85,
        subs: {
          agility: { label: 'Agility', base: 75, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 79, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 89, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 87, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 86, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 87, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 88, evFace: 88,
        subs: {
          interceptions: { label: 'Interceptions', base: 90, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 78, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 88, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 90, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 84, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 83, evFace: 83,
        subs: {
          jumping: { label: 'Jumping', base: 80, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 92, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 83, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 74, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'socrates-89': {
    id: 'socrates-89',
    futbinLink: 'https://www.futbin.com/26/player/18755/vieira-de-oliveira',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/190046.png?fm=png&ixlib=java-2.1.0&verzion=3&w=324&s=cffdf269c2923be9d00283017cc920d8',
    bio: {
      name: 'Sócrates',
      club: 'EA FC ICONS',
      nation: 'Brazil',
      league: 'Icons',
      title: 'Icon',
      primaryPositions: 'CAM',
      height: `192cm | 6'4"`,
      footAge: 'Right | 72 yrs',
      weakFoot: 5,
      skillMoves: 4,
      rarity: 'Icon',
      roles: {
        cam: ['Playmaker++']
      }
    },
    ovr: { base: 89, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Incisive Pass+'],
        silver: ['Low Driven Shot', 'Long Ball Pass', 'Inventive', 'Technical']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 82, evFace: 82,
        subs: {
          acceleration: { label: 'Acceleration', base: 83, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 81, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 88, evFace: 88,
        subs: {
          positioning: { label: 'Att. Position', base: 85, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 85, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 90, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 91, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 89, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 87, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 89, evFace: 89,
        subs: {
          vision: { label: 'Vision', base: 92, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 87, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 87, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 88, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 89, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 87, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 88, evFace: 88,
        subs: {
          agility: { label: 'Agility', base: 82, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 58, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 84, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 93, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 90, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 95, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 43, evFace: 43,
        subs: {
          interceptions: { label: 'Interceptions', base: 32, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 86, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 28, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 51, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 46, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 82, evFace: 82,
        subs: {
          jumping: { label: 'Jumping', base: 68, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 90, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 82, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 75, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'gordon-87': {
    id: 'gordon-87',
    futbinLink: 'https://www.futbin.com/26/player/24112/anthony-gordon',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p84129044.png?fm=png&ixlib=java-2.1.0&verzion=1&w=485&s=2a80116509ec5d9ac77e7773c8b4b1d7',
    bio: {
      name: 'Gordon',
      club: 'Newcastle Utd',
      nation: 'England',
      league: 'Premier League',
      title: 'Team of the Week',
      primaryPositions: 'ST, LM, RW, LW',
      height: `183cm | 6'0"`,
      footAge: 'Right | 25 yrs',
      weakFoot: 4,
      skillMoves: 4,
      rarity: 'Team of the Week',
      bodyType: 'Avg & Lean',
      roles: {
        st: ['False 9+', 'Target Forward+', 'Advanced Forward++', 'Poacher++'],
        lm: ['Wide Midfielder+', 'Inside Forward+', 'Winger++'],
        rw: ['Winger+', 'Wide Playmaker+', 'Inside Forward++'],
        lw: ['Winger+', 'Wide Playmaker+', 'Inside Forward++']
      }
    },
    ovr: { base: 87, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Low Driven Shot+'],
        silver: ['Whipped Pass', 'Technical', 'Rapid', 'First Touch', 'Quick Step']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 94, evFace: 94,
        subs: {
          acceleration: { label: 'Acceleration', base: 92, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 95, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 85, evFace: 85,
        subs: {
          positioning: { label: 'Att. Position', base: 88, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 87, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 84, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 82, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 80, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 75, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 83, evFace: 83,
        subs: {
          vision: { label: 'Vision', base: 86, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 86, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 79, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 84, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 70, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 87, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 88, evFace: 88,
        subs: {
          agility: { label: 'Agility', base: 82, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 80, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 88, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 88, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 90, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 86, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 54, evFace: 54,
        subs: {
          interceptions: { label: 'Interceptions', base: 43, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 64, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 53, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 61, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 52, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 75, evFace: 75,
        subs: {
          jumping: { label: 'Jumping', base: 79, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 90, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 65, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 79, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'gullit-95': {
    id: 'gullit-95',
    futbinLink: 'https://www.futbin.com/26/player/24440/gullit',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p84100180.png?fm=png&ixlib=java-2.1.0&verzion=2&w=485&s=80449a22f21fbef0b1bb90c8c7ebd40f',
    bio: {
      name: 'Gullit',
      club: 'EA FC ICONS',
      nation: 'Netherlands',
      league: 'Icons',
      title: 'Trophy Titans Icon',
      primaryPositions: 'CAM, CM, ST',
      height: `191cm | 6'3"`,
      footAge: 'Right | 63 yrs',
      weakFoot: 5,
      skillMoves: 4,
      rarity: 'Trophy Titans Icon',
      roles: {
        cam: ['Half Winger+', 'Playmaker++', 'Shadow Striker++', 'Classic 10++'],
        cm: ['Deep-Lying Playmaker+', 'Half Winger+', 'Box-to-Box++', 'Playmaker++'],
        st: ['Target Forward+', 'Advanced Forward++']
      }
    },
    ovr: { base: 95, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Low Driven Shot+', 'Press Proven+', 'Pinged Pass+'],
        silver: ['Finesse Shot', 'Power Shot', 'Incisive Pass', 'Inventive', 'Technical', 'Rapid', 'Enforcer']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 92, evFace: 92,
        subs: {
          acceleration: { label: 'Acceleration', base: 91, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 93, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 95, evFace: 95,
        subs: {
          positioning: { label: 'Att. Position', base: 95, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 96, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 96, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 94, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 91, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 90, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 95, evFace: 95,
        subs: {
          vision: { label: 'Vision', base: 94, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 92, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 94, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 96, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 96, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 94, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 92, evFace: 92,
        subs: {
          agility: { label: 'Agility', base: 91, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 93, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 96, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 93, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 91, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 92, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 89, evFace: 89,
        subs: {
          interceptions: { label: 'Interceptions', base: 85, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 96, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 90, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 90, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 86, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 94, evFace: 94,
        subs: {
          jumping: { label: 'Jumping', base: 94, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 96, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 94, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 91, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'theo-95': {
    id: 'theo-95',
    futbinLink: 'https://www.futbin.com/26/player/26070/theo-hernandez',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p84118736.png?fm=png&ixlib=java-2.1.0&verzion=1&w=485&s=98b302ae0cf9b9508a568d3465797cb7',
    bio: {
      name: 'Hernández',
      club: 'Al Hilal',
      nation: 'France',
      league: 'ROSHN Saudi League',
      title: 'Glory Hunters',
      primaryPositions: 'LB, LM',
      height: `184cm | 6'0"`,
      footAge: 'Left | 28 yrs',
      weakFoot: 4,
      skillMoves: 4,
      rarity: 'Glory Hunters',
      roles: {
        lb: ['Fullback++', 'Falseback++', 'Wingback++', 'Attacking Wingback++', 'Inverted Wingback++'],
        lm: ['Winger++', 'Wide Midfielder++', 'Wide Playmaker++', 'Inside Forward++']
      }
    },
    ovr: { base: 95, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: [],
        silver: []
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 96, evFace: 96,
        subs: {
          acceleration: { label: 'Acceleration', base: 96, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 96, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 90, evFace: 90,
        subs: {
          positioning: { label: 'Att. Position', base: 95, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 84, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 98, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 91, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 95, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 90, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 90, evFace: 90,
        subs: {
          vision: { label: 'Vision', base: 87, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 96, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 85, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 93, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 83, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 91, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 94, evFace: 94,
        subs: {
          agility: { label: 'Agility', base: 94, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 92, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 94, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 95, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 94, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 92, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 93, evFace: 93,
        subs: {
          interceptions: { label: 'Interceptions', base: 91, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 90, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 90, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 98, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 90, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 93, evFace: 93,
        subs: {
          jumping: { label: 'Jumping', base: 97, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 96, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 92, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 92, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'chiellini-92': {
    id: 'chiellini-92',
    futbinLink: 'https://www.futbin.com/26/player/25950/giorgio-chiellini',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p84025036.png?fm=png&ixlib=java-2.1.0&verzion=1&w=485&s=94fce9dda1fa40015ea8b0f97bbde801',
    bio: {
      name: 'Chiellini',
      club: 'EA FC ICONS',
      nation: 'Italy',
      league: 'Icons',
      title: 'Greats of the Game Icon',
      primaryPositions: 'CB',
      height: `187cm | 6'2"`,
      footAge: 'Left | 41 yrs',
      weakFoot: 4,
      skillMoves: 3,
      rarity: 'Greats of the Game Icon',
      roles: {
        cb: ['Defender++', 'Stopper++', 'Ball-Playing Defender++', 'Wide Back++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Intercept+', 'Bruiser+', 'Block+'],
        silver: ['Incisive Pass', 'Long Ball Pass', 'Jockey', 'Anticipate', 'Slide Tackle', 'Aerial Fortress', 'Quick Step', 'Long Throw']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 88, evFace: 88,
        subs: {
          acceleration: { label: 'Acceleration', base: 88, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 88, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 62, evFace: 62,
        subs: {
          positioning: { label: 'Att. Position', base: 57, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 57, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 83, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 58, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 56, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 59, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 76, evFace: 76,
        subs: {
          vision: { label: 'Vision', base: 70, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 75, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 67, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 81, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 80, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 70, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 81, evFace: 81,
        subs: {
          agility: { label: 'Agility', base: 80, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 80, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 88, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 80, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 80, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 88, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 96, evFace: 96,
        subs: {
          interceptions: { label: 'Interceptions', base: 95, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 94, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 97, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 96, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 94, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 95, evFace: 95,
        subs: {
          jumping: { label: 'Jumping', base: 93, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 94, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 95, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 96, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'enzo-93': {
    id: 'enzo-93',
    futbinLink: 'https://www.futbin.com/26/player/24751/enzo-fernandez',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p67355954.png?fm=png&ixlib=java-2.1.0&verzion=1&w=485&s=6c62f3960b8a330695786517a3735d00',
    bio: {
      name: 'Fernández',
      club: 'Chelsea',
      nation: 'Argentina',
      league: 'Premier League',
      title: 'Team of the Season',
      primaryPositions: 'CM, CDM, CAM',
      height: `178cm | 5'10"`,
      footAge: 'Right | 25 yrs',
      weakFoot: 5,
      skillMoves: 4,
      rarity: 'Team of the Season',
      bodyType: 'Avg & Normal',
      roles: {
        cm: ['Box-to-Box++', 'Holding++', 'Deep-Lying Playmaker++', 'Playmaker++', 'Half Winger++'],
        cdm: ['Centre Half+', 'Wide Half+', 'Box Crasher+', 'Holding++', 'Deep-Lying Playmaker++'],
        cam: ['Classic 10+', 'Playmaker++', 'Shadow Striker++', 'Half Winger++']
      }
    },
    ovr: { base: 93, boost: 30, limit: 99 },
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: {
        gold: ['Technical+', 'Incisive Pass+', 'Pinged Pass+'],
        silver: ['Finesse Shot', 'Long Ball Pass', 'Tiki Taka', 'Intercept', 'First Touch', 'Press Proven', 'Relentless']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 90, evFace: 90,
        subs: {
          acceleration: { label: 'Acceleration', base: 90, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 90, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 88, evFace: 88,
        subs: {
          positioning: { label: 'Att. Position', base: 89, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 86, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 94, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 86, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 87, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 83, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 95, evFace: 95,
        subs: {
          vision: { label: 'Vision', base: 96, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 90, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 86, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 97, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 97, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 94, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 94, evFace: 94,
        subs: {
          agility: { label: 'Agility', base: 94, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 94, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 97, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 95, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 93, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 93, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 85, evFace: 85,
        subs: {
          interceptions: { label: 'Interceptions', base: 86, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 83, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 84, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 87, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 84, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 87, evFace: 87,
        subs: {
          jumping: { label: 'Jumping', base: 84, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 96, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 80, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 94, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  },
  'yamal-92': {
    id: 'yamal-92',
    futbinLink: 'https://www.futbin.com/26/player/23805/lamine-yamal-nasraoui-ebana',
    avatarUrl: 'https://cdn3.futbin.com/content/fifa26/img/players/p117718155.png?fm=png&ixlib=java-2.1.0&verzion=2&w=485&s=c8b25d0593cc1441ac640d4127962c9e',
    bio: {
      name: 'Lamine Yamal',
      club: 'FC Barcelona',
      nation: 'Spain',
      league: 'LALIGA EA SPORTS',
      title: 'FUT Birthday',
      primaryPositions: 'RW, RM, CAM',
      height: `180cm | 5'11"`,
      footAge: 'Left | 19 yrs',
      weakFoot: 5,
      skillMoves: 5,
      rarity: 'FUT Birthday',
      bodyType: 'Avg & Lean',
      roles: {
        rw: ['Wide Playmaker+', 'Winger++', 'Inside Forward++'],
        rm: ['Wide Playmaker+', 'Winger++', 'Inside Forward++'],
        cam: ['Playmaker+', 'Shadow Striker++']
      }
    },
    ovr: { base: 92, boost: 30, limit: 99 },
    // Ships with no PlayStyles at all, which is the card rather than missing data: FUT Birthday is
    // one of the rarities that lets the player assign them, so every slot is empty on purpose.
    playStyles: {
      limits: { gold: 4, silver: 8 },
      base: { gold: [], silver: [] },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 90, evFace: 90,
        subs: {
          acceleration: { label: 'Acceleration', base: 92, boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 89, boost: 30, limit: 99, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 88, evFace: 88,
        subs: {
          positioning: { label: 'Att. Position', base: 93, boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: 90, boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 88, boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: 87, boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: 75, boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: 75, boost: 25, limit: 99, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 91, evFace: 91,
        subs: {
          vision: { label: 'Vision', base: 93, boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: 94, boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 70, boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 92, boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: 90, boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: 92, boost: 25, limit: 99, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 94, evFace: 94,
        subs: {
          agility: { label: 'Agility', base: 96, boost: 25, limit: 99, w: 0.10 },
          balance: { label: 'Balance', base: 90, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 93, boost: 25, limit: 99, w: 0.05 },
          ballControl: { label: 'Ball Control', base: 93, boost: 30, limit: 99, w: 0.30 },
          dribbling: { label: 'Dribbling', base: 95, boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: 90, boost: 30, limit: 99, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 27, evFace: 27,
        subs: {
          interceptions: { label: 'Interceptions', base: 22, boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 41, boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 27, boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 24, boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 33, boost: 25, limit: 99, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 70, evFace: 70,
        subs: {
          jumping: { label: 'Jumping', base: 76, boost: 25, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: 92, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 61, boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: 61, boost: 30, limit: 99, w: 0.20 }
        }
      }
    }
  }
};
