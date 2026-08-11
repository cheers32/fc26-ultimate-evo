import { PlayerData } from '../types/player';

/**
 * @param goldPlayStyleCount How many of the PlayStyles found are PlayStyle+. Futbin's copied text
 *   lists them all together with no marker for which are which, only the convention that the
 *   plus ones come first — so the count has to come from somewhere. Omit it to fall back to
 *   guessing from OVR, which is what this did before the importer asked.
 */
export function parseFutbinText(
  text: string,
  avatarUrl: string = '',
  futbinUrl: string = '',
  goldPlayStyleCount?: number
): PlayerData | null {
  try {
    const data: any = {};

    // 1. Extract Name and OVR
    // Format could have multiple lines before the OVR
    const nameOvrMatch = text.match(/([A-Za-z\s.-]+)\n(\d{2})\n(?:CB|RB|LB|CDM|CM|CAM|RM|LM|RW|LW|ST|CF|GK|RWB|LWB)\n/);
    if (nameOvrMatch) {
      const nameParts = nameOvrMatch[1].trim().split('\n');
      data.name = nameParts[nameParts.length - 1].trim();
      data.baseOvr = parseInt(nameOvrMatch[2], 10);
    } else {
      data.name = "Imported Player";
      data.baseOvr = 80;
    }

    // 1.5 Extract Nation, Club, League, Skills, Weak Foot
    const extractNextLine = (label: string) => {
      const match = text.match(new RegExp(`\\n${label}\\n([^\\n]+)`));
      return match ? match[1].trim() : `Unknown ${label}`;
    };

    data.nation = extractNextLine('Nation');
    data.club = extractNextLine('Club');
    data.league = extractNextLine('League');
    
    const skillsMatch = text.match(/\nSkills\n(\d)/);
    data.skills = skillsMatch ? parseInt(skillsMatch[1], 10) : 3;
    
    const wfMatch = text.match(/\nWeak Foot\n(\d)/);
    data.wf = wfMatch ? parseInt(wfMatch[1], 10) : 3;
    
    const heightMatch = text.match(/\nHeight\n([^\n]+)/);
    data.height = heightMatch ? heightMatch[1].trim() : 'Unknown Height';


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
    const validPositions = new Set(["CB", "RB", "LB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "ST", "CF", "GK", "RWB", "LWB"]);
    
    // Match: Valid Position -> Newline -> Role Name (no newlines) -> Optional Newline + Pluses
    const roleRegex = /\n([A-Z]{2,3})\n([^\n]+)(?:\n(\+{1,2}))?/g;
    let match;
    while ((match = roleRegex.exec(text)) !== null) {
      const posUpper = match[1].trim();
      if (!validPositions.has(posUpper)) continue;
      
      const pos = posUpper.toLowerCase();
      const roleName = match[2].trim();
      
      // Filter out garbage matches (e.g. alternate positions listed right after the main position)
      if (validPositions.has(roleName) || ["+", "++", "R", "L", "RWB", "LWB"].includes(roleName) || roleName.length <= 2) {
        continue;
      }
      
      const plus = match[3] ? match[3].trim() : "";
      
      if (!roles[pos]) roles[pos] = [];
      const formattedRole = plus ? `${roleName}${plus}` : roleName;
      if (!roles[pos].includes(formattedRole)) {
        roles[pos].push(formattedRole);
      }
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

    const gold: string[] = [];
    const silver: string[] = [];
    
    // In FC26 copied text, playstyles appear simply as the names, one per line.
    // They are usually ordered with PlayStyle+ first.
    const foundPlaystyles: { name: string, index: number }[] = [];

    /**
     * Some sub-stat labels are also PlayStyle names — "Slide Tackle" is both a Defending sub-stat
     * and a PlayStyle — so a name found inside one of the six stat blocks is a row label, not a
     * PlayStyle the card carries. That mattered: nearly every evo caps how many PlayStyles a card
     * may have, so one phantom silver could make a card read as ineligible.
     */
    const statSpans: [number, number][] = [];
    [pacMatch, shoMatch, pasMatch, driMatch, defMatch, phyMatch].forEach(m => {
      if (m && m.index !== undefined) statSpans.push([m.index, m.index + m[0].length]);
    });
    const insideStatBlock = (index: number) =>
      statSpans.some(([start, end]) => index >= start && index < end);

    for (const ps of validPlayStyles) {
      // Match the playstyle on its own line, tolerating some spaces. Scanned rather than matched
      // once, so a name that appears as a stat label first is not mistaken for the card's own.
      const psRegex = new RegExp(`\\n\\s*${ps}\\s*\\n`, 'gi');
      let match: RegExpExecArray | null;
      while ((match = psRegex.exec(text)) !== null) {
        if (insideStatBlock(match.index)) continue;
        foundPlaystyles.push({ name: ps, index: match.index });
        break;
      }
    }
    
    // Sort by appearance in the text
    foundPlaystyles.sort((a, b) => a.index - b.index);
    
    // How many PlayStyle+ the player has. Told to us where possible; the OVR guess below is only
    // a fallback, and it is wrong often enough to matter — the count decides how many evos a card
    // is eligible for, since most of them cap PlayStyles+.
    let goldCount: number;
    if (goldPlayStyleCount !== undefined && Number.isFinite(goldPlayStyleCount)) {
      goldCount = Math.max(0, Math.min(8, Math.floor(goldPlayStyleCount)));
    } else if (data.baseOvr >= 90) {
      goldCount = 3;
    } else if (data.baseOvr >= 80) {
      goldCount = 2;
    } else {
      goldCount = 1;
    }

    foundPlaystyles.forEach((ps, idx) => {
      if (idx < goldCount) {
        gold.push(ps.name + '+');
      } else {
        silver.push(ps.name);
      }
    });

    // Create unique ID
    const playerId = `custom-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`;

    // Construct PlayerData
    const newPlayer: PlayerData = {
      id: playerId,
      futbinLink: futbinUrl,
      avatarUrl: avatarUrl || '/images/default-avatar.png',
      bio: {
        name: data.name,
        club: data.club,
        nation: data.nation,
        league: data.league,
        title: 'Custom Import',
        primaryPositions: Object.keys(roles).map(p => p.toUpperCase()).join(', ') || 'CB',
        height: data.height,
        footAge: 'Unknown',
        weakFoot: data.wf,
        skillMoves: data.skills,
        rarity: 'Custom',
        roles: roles
      },
      ovr: { base: data.baseOvr, boost: 30, limit: 99 },
      playStyles: {
        // A card that was told it has more PlayStyles than the usual ceiling still has them, so
        // the limit follows rather than leaving the card in breach of its own cap. The plain side
        // was a flat 8 while only the PlayStyle+ side followed the card, which left Yamal — ten
        // plain PlayStyles off the card — permanently over a limit of eight.
        limits: { gold: Math.max(4, gold.length), silver: Math.max(8, silver.length) },
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
