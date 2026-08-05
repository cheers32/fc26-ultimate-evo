import { PlayerData } from '../types/player';

export function parseFutbinText(text: string, avatarUrl: string): PlayerData | null {
  try {
    const data: any = {};

    // 1. Extract Name and OVR
    // Format: 
    // Chiellini
    // 92
    // CB
    const nameOvrMatch = text.match(/([A-Za-z\s.-]+)\n(\d{2})\n(?:CB|RB|LB|CDM|CM|CAM|RM|LM|RW|LW|ST|CF|GK)\n/);
    if (nameOvrMatch) {
      data.name = nameOvrMatch[1].trim();
      data.baseOvr = parseInt(nameOvrMatch[2], 10);
    } else {
      data.name = "Imported Player";
      data.baseOvr = 80;
    }

    // 2. Extract Stats
    const stats: any = {};
    
    const pacMatch = text.match(/Pace\n(\d+)\nAcceleration\n(\d+)\nSprint Speed\n(\d+)/);
    if (pacMatch) {
      stats.pac = {
        label: 'Pace', baseFace: parseInt(pacMatch[1]), evFace: parseInt(pacMatch[1]),
        subs: {
          acceleration: { label: 'Acceleration', base: parseInt(pacMatch[2]), boost: 30, limit: 99, w: 0.45 },
          sprintSpeed: { label: 'Sprint Speed', base: parseInt(pacMatch[3]), boost: 30, limit: 99, w: 0.55 }
        }
      };
    }

    const shoMatch = text.match(/Shooting\n(\d+)\nAtt\. Position\n(\d+)\nFinishing\n(\d+)\nShot Power\n(\d+)\nLong Shots\n(\d+)\nVolleys\n(\d+)\nPenalties\n(\d+)/);
    if (shoMatch) {
      stats.sho = {
        label: 'Shooting', baseFace: parseInt(shoMatch[1]), evFace: parseInt(shoMatch[1]),
        subs: {
          positioning: { label: 'Att. Position', base: parseInt(shoMatch[2]), boost: 25, limit: 99, w: 0.05 },
          finishing: { label: 'Finishing', base: parseInt(shoMatch[3]), boost: 25, limit: 99, w: 0.45 },
          shotPower: { label: 'Shot Power', base: parseInt(shoMatch[4]), boost: 25, limit: 99, w: 0.20 },
          longShots: { label: 'Long Shots', base: parseInt(shoMatch[5]), boost: 25, limit: 99, w: 0.20 },
          volleys: { label: 'Volleys', base: parseInt(shoMatch[6]), boost: 25, limit: 99, w: 0.05 },
          penalties: { label: 'Penalties', base: parseInt(shoMatch[7]), boost: 25, limit: 99, w: 0.05 }
        }
      };
    }

    const pasMatch = text.match(/Passing\n(\d+)\nVision\n(\d+)\nCrossing\n(\d+)\nFK Acc\.\n(\d+)\nShort Pass\n(\d+)\nLong Pass\n(\d+)\nCurve\n(\d+)/);
    if (pasMatch) {
      stats.pas = {
        label: 'Passing', baseFace: parseInt(pasMatch[1]), evFace: parseInt(pasMatch[1]),
        subs: {
          vision: { label: 'Vision', base: parseInt(pasMatch[2]), boost: 30, limit: 99, w: 0.20 },
          crossing: { label: 'Crossing', base: parseInt(pasMatch[3]), boost: 25, limit: 99, w: 0.20 },
          freekick: { label: 'FK Acc.', base: parseInt(pasMatch[4]), boost: 25, limit: 99, w: 0.05 },
          shortPass: { label: 'Short Pass', base: parseInt(pasMatch[5]), boost: 30, limit: 99, w: 0.35 },
          longPass: { label: 'Long Pass', base: parseInt(pasMatch[6]), boost: 30, limit: 99, w: 0.15 },
          curve: { label: 'Curve', base: parseInt(pasMatch[7]), boost: 25, limit: 99, w: 0.05 }
        }
      };
    }

    const driMatch = text.match(/Dribbling\n(\d+)\nAgility\n(\d+)\nBalance\n(\d+)\nReactions\n(\d+)\nBall Control\n(\d+)\n(?:Dribbling|Drib\.)\n(\d+)\nComposure\n(\d+)/);
    if (driMatch) {
      stats.dri = {
        label: 'Dribbling', baseFace: parseInt(driMatch[1]), evFace: parseInt(driMatch[1]),
        subs: {
          agility: { label: 'Agility', base: parseInt(driMatch[2]), boost: 25, limit: 99, w: 0.09 },
          balance: { label: 'Balance', base: parseInt(driMatch[3]), boost: 30, limit: 99, w: 0.05 },
          reactions: { label: 'Reactions', base: parseInt(driMatch[4]), boost: 25, limit: 99, w: 0.03 },
          ballControl: { label: 'Ball Control', base: parseInt(driMatch[5]), boost: 30, limit: 99, w: 0.33 },
          dribbling: { label: 'Dribbling', base: parseInt(driMatch[6]), boost: 30, limit: 99, w: 0.45 },
          composure: { label: 'Composure', base: parseInt(driMatch[7]), boost: 30, limit: 99, w: 0.05 }
        }
      };
    }

    const defMatch = text.match(/Defending\n(\d+)\nInterceptions\n(\d+)\nHeading Acc\.\n(\d+)\nDef\. Aware\n(\d+)\nStand Tackle\n(\d+)\nSlide Tackle\n(\d+)/);
    if (defMatch) {
      stats.def = {
        label: 'Defending', baseFace: parseInt(defMatch[1]), evFace: parseInt(defMatch[1]),
        subs: {
          interceptions: { label: 'Interceptions', base: parseInt(defMatch[2]), boost: 30, limit: 99, w: 0.20 },
          headingAcc: { label: 'Heading Acc.', base: parseInt(defMatch[3]), boost: 25, limit: 99, w: 0.10 },
          defAwareness: { label: 'Def. Aware', base: parseInt(defMatch[4]), boost: 30, limit: 99, w: 0.30 },
          standTackle: { label: 'Stand Tackle', base: parseInt(defMatch[5]), boost: 30, limit: 99, w: 0.30 },
          slideTackle: { label: 'Slide Tackle', base: parseInt(defMatch[6]), boost: 25, limit: 99, w: 0.10 }
        }
      };
    }

    const phyMatch = text.match(/Physical\n(\d+)\nJumping\n(\d+)\nStamina\n(\d+)\nStrength\n(\d+)\nAggression\n(\d+)/);
    if (phyMatch) {
      stats.phy = {
        label: 'Physical', baseFace: parseInt(phyMatch[1]), evFace: parseInt(phyMatch[1]),
        subs: {
          jumping: { label: 'Jumping', base: parseInt(phyMatch[2]), boost: 30, limit: 99, w: 0.05 },
          stamina: { label: 'Stamina', base: parseInt(phyMatch[3]), boost: 30, limit: 99, w: 0.25 },
          strength: { label: 'Strength', base: parseInt(phyMatch[4]), boost: 30, limit: 99, w: 0.50 },
          aggression: { label: 'Aggression', base: parseInt(phyMatch[5]), boost: 30, limit: 99, w: 0.20 }
        }
      };
    }

    // 3. Extract Roles
    const roles: Record<string, string[]> = {};
    const roleRegex = /([A-Z]{2,3})\n([\w\s-]+)\n(\+{0,2})/g;
    let match;
    while ((match = roleRegex.exec(text)) !== null) {
      const pos = match[1].toLowerCase();
      const roleName = match[2].trim();
      const plus = match[3];
      
      if (!roles[pos]) roles[pos] = [];
      const formattedRole = plus ? `${roleName}${plus}` : roleName;
      if (!roles[pos].includes(formattedRole)) {
        roles[pos].push(formattedRole);
      }
    }
    
    // De-duplicate if needed
    for (const p in roles) {
      roles[p] = Array.from(new Set(roles[p]));
    }

    // 4. Extract PlayStyles
    // The list of PlayStyles appears usually between "Squad" and the first role, or around there.
    // It's a list of words on newlines. We can use a predefined list of valid playstyles to find them.
    const validPlayStyles = [
      "Finesse Shot", "Power Shot", "Low Driven Shot", "Chip Shot", "Dead Ball",
      "Pinged Pass", "Incisive Pass", "Long Ball Pass", "Tiki Taka", "Whipped Pass",
      "Inventive", "First Touch", "Trickster", "Technical", "Quick Step",
      "Rapid", "Footwork", "Gamechanger", "Intercept", "Anticipate",
      "Slide Tackle", "Jockey", "Block", "Bruiser", "Enforcer",
      "Press Proven", "Relentless", "Acrobatic", "Aerial Fortress",
      "Precision Header", "Far Reach", "Long Throw",
      "Rush Out", "Cross Claimer", "Deflector", "Far Throw"
    ];

    const foundPlaystyles: string[] = [];
    for (const ps of validPlayStyles) {
      if (text.includes(ps)) {
        foundPlaystyles.push(ps);
      }
    }

    // Fallback logic: first 3 are gold, rest silver.
    const gold = foundPlaystyles.slice(0, 3).map(ps => ps + '+');
    const silver = foundPlaystyles.slice(3);

    // Create unique ID
    const playerId = `custom-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`;

    // Construct PlayerData
    const newPlayer: PlayerData = {
      id: playerId,
      futbinLink: '',
      avatarUrl: avatarUrl || '/images/default-avatar.png',
      bio: {
        name: data.name,
        club: 'Unknown Club',
        nation: 'Unknown Nation',
        league: 'Unknown League',
        title: 'Custom Import',
        primaryPositions: Object.keys(roles).map(p => p.toUpperCase()).join(', ') || 'CB',
        height: `Unknown`,
        footAge: 'Unknown',
        weakFoot: 3,
        skillMoves: 3,
        rarity: 'Custom',
        roles: roles
      },
      ovr: { base: data.baseOvr, boost: 30, limit: 99 },
      playStyles: {
        limits: { gold: 4, silver: 8 },
        base: {
          gold,
          silver
        },
        ev: { gold: [], silver: [] }
      },
      stats
    };

    // Ensure all 6 face stats exist
    const requiredFaces = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
    for (const f of requiredFaces) {
      if (!newPlayer.stats[f]) {
        // Provide dummy data to prevent crashes
        newPlayer.stats[f] = {
          label: f.toUpperCase(),
          baseFace: 50,
          evFace: 50,
          subs: {}
        };
      }
    }

    return newPlayer;
  } catch (err) {
    console.error("Error parsing futbin text:", err);
    return null;
  }
}
