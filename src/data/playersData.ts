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
      roles: {
        cdm: ['Holding++', 'Centre Half++', 'Deep-Lying Playmaker++', 'Wide Half++', 'Box Crasher++'],
        cm: ['Box-to-Box++', 'Holding++', 'Deep-Lying Playmaker++', 'Playmaker++', 'Half Winger++']
      }
    },
    ovr: { base: 91, boost: 30, limit: 97 },
    playStyles: {
      limits: { gold: 4, silver: 99 },
      base: {
        gold: ['Intercept+'],
        silver: ['Power Shot', 'Incisive Pass', 'Long Ball Pass', 'Tiki Taka', 'Press Proven', 'Relentless', 'Bruiser', 'Aerial Fortress']
      },
      ev: { gold: [], silver: [] }
    },
    stats: {
      pac: {
        label: 'Pace', baseFace: 82, evFace: 92,
        subs: {
          acceleration: { label: 'Acceleration', base: 82, boost: 30, limit: 92, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: 82, boost: 30, limit: 92, w: 0.55 }
        }
      },
      sho: {
        label: 'Shooting', baseFace: 81, evFace: 90,
        subs: {
          positioning: { label: 'Att. Position', base: 77, boost: 25, limit: 90, w: 0.05 },
          finishing: { label: 'Finishing', base: 75, boost: 25, limit: 90, w: 0.45 },
          shotPower: { label: 'Shot Power', base: 93, boost: 25, limit: 90, w: 0.20 },
          longShots: { label: 'Long Shots', base: 90, boost: 25, limit: 90, w: 0.20 },
          volleys: { label: 'Volleys', base: 72, boost: 25, limit: 90, w: 0.05 },
          penalties: { label: 'Penalties', base: 63, boost: 25, limit: 90, w: 0.05 }
        }
      },
      pas: {
        label: 'Passing', baseFace: 91, evFace: 97,
        subs: {
          vision: { label: 'Vision', base: 90, boost: 30, limit: 97, w: 0.20 },
          crossing: { label: 'Crossing', base: 82, boost: 25, limit: 95, w: 0.20 },
          freekick: { label: 'FK Acc.', base: 71, boost: 25, limit: 96, w: 0.05 },
          shortPass: { label: 'Short Pass', base: 96, boost: 30, limit: 98, w: 0.35 },
          longPass: { label: 'Long Pass', base: 96, boost: 30, limit: 98, w: 0.15 },
          curve: { label: 'Curve', base: 91, boost: 25, limit: 95, w: 0.05 }
        }
      },
      dri: {
        label: 'Dribbling', baseFace: 87, evFace: 97,
        subs: {
          agility: { label: 'Agility', base: 80, boost: 25, limit: 95, w: 0.09 },
          balance: { label: 'Balance', base: 80, boost: 30, limit: 96, w: 0.05 },
          reactions: { label: 'Reactions', base: 94, boost: 25, limit: 96, w: 0.03 },
          ballControl: { label: 'Ball Control', base: 91, boost: 30, limit: 97, w: 0.33 },
          dribbling: { label: 'Dribbling', base: 85, boost: 30, limit: 97, w: 0.45 },
          composure: { label: 'Composure', base: 94, boost: 30, limit: 98, w: 0.05 }
        }
      },
      def: {
        label: 'Defending', baseFace: 87, evFace: 96,
        subs: {
          interceptions: { label: 'Interceptions', base: 85, boost: 30, limit: 97, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: 82, boost: 25, limit: 92, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: 89, boost: 30, limit: 97, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: 88, boost: 30, limit: 96, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: 83, boost: 25, limit: 93, w: 0.10 }
        }
      },
      phy: {
        label: 'Physical', baseFace: 86, evFace: 95,
        subs: {
          jumping: { label: 'Jumping', base: 84, boost: 25, limit: 95, w: 0.05 },
          stamina: { label: 'Stamina', base: 92, boost: 25, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: 84, boost: 30, limit: 95, w: 0.50 },
          aggression: { label: 'Aggression', base: 86, boost: 30, limit: 95, w: 0.20 }
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
        gold: [],
        silver: ['Low Driven Pass', 'Power Shot', 'Precision Pass', 'Acrobatic', 'Gamechanger', 'Aerial Fortress', 'Trickster']
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
  'petit-87': {
    id: 'petit-87',
    futbinLink: 'https://www.futbin.com/26/player/149/emmanuel-petit',
    avatarUrl: '/images/petit.png',
    bio: {
      name: 'Emmanuel Petit',
      club: 'Icons',
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
        silver: ['Precision Pass', 'Low Driven Pass', 'Incisive Pass', 'Intercept', 'Anticipate', 'First Touch', 'Bruiser']
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
  'maldini-89': {
    id: 'maldini-89',
    futbinLink: 'https://www.futbin.com/26/player/24556/maldini',
    avatarUrl: '/images/maldini.png',
    bio: {
      name: 'Paolo Maldini',
      club: 'Icons',
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
        silver: ['Precision Pass', 'Long Ball Pass', 'Anticipate', 'Slide Tackle', 'Aerial Fortress', 'Quick Step', 'Bruiser']
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
  }
};
