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
          agility: { label: 'Agility', base: 80, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 80, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 94, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 91, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 78, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 74, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 85, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 87, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 89, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 88, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 87, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 92, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 68, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 65, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 71, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 86, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 77, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 71, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 82, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 84, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 86, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 87, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 95, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 94, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 75, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 75, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 88, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 88, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 75, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 78, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 90, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 80, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 91, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 94, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 89, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 93, boost: 30, limit: 99, w: 0.33 },
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
    avatarUrl: '/images/griezmann.png',
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
          agility: { label: 'Agility', base: 90, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 87, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 89, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 92, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 85, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 90, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 84, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 83, boost: 30, limit: 99, w: 0.33 },
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
          agility: { label: 'Agility', base: 94, boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: 83, boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: 92, boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 94, boost: 30, limit: 99, w: 0.33 },
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
  }
};
