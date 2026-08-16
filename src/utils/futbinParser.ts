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

    // 1. Extract Name, OVR, positions, foot, skills and weak foot.
    //
    // These all come off the card widget, which prints as
    //
    //   93 / ST / ++ / LM / LW / R / 5 / 4 / 88.8 / Mbappé / 99 / PAC / …
    //
    // one line each: rating, positions with their role markers, foot, skill moves, weak foot, the
    // FUTBIN rating, the short name, then the first face stat. Anchoring on the PAC that closes it
    // is what makes this safe to find — a bare two-digit line followed by a position also describes
    // half a dozen other blocks on the page (the "Best Ratings" table, the votes footer), and
    // reading the line above the rating as the name is what used to make every accented player an
    // "Imported Player" at OVR 80: the old pattern spelt the name [A-Za-z\s.-]+, so Mbappé and
    // Fernández could not match it, and the fallback was a made-up card.
    const POSITIONS = 'GK|CB|RB|LB|RWB|LWB|CDM|CM|CAM|RM|LM|RW|LW|CF|ST';
    const cardMatch = text.match(new RegExp(
      `\\n(\\d{2})\\n` +                                    // OVR
      `((?:(?:${POSITIONS})\\n(?:\\+{1,2}\\n)?)+)` +        // positions, each with an optional +/++
      `(?:([RL])\\n(\\d)\\n(\\d)\\n)?` +                    // foot, skill moves, weak foot
      `(?:[\\d.]+\\n)?` +                                   // FUTBIN's own rating
      `([^\\n]+)\\n\\d{1,3}\\nPAC\\n`                       // short name, then the first face stat
    ));

    // The bio heading carries the full name where the card widget only has the surname.
    const bioNameMatch = text.match(/\nPlayer Bio - ([^\n]+)\n/);
    data.name = (bioNameMatch?.[1] || cardMatch?.[6] || 'Imported Player').trim();

    // The bio spells the rating out in prose — "his UCL Road to the Finals card is rated 93" — and
    // prose survives a layout change that moves the card widget's line breaks around. Which does
    // happen: the same page copied from a different browser glued labels to their values, and the
    // widget stopped matching, so a real card imported at the made-up 80 again.
    const ratedMatch = text.match(/card is rated (\d{2,3})/i);
    data.baseOvr = cardMatch
      ? parseInt(cardMatch[1], 10)
      : ratedMatch
      ? parseInt(ratedMatch[1], 10)
      : 80;
    data.cardPositions = cardMatch
      ? [...cardMatch[2].matchAll(new RegExp(`(${POSITIONS})`, 'g'))].map(m => m[1])
      : [];
    data.foot = cardMatch?.[3] === 'L' ? 'Left' : cardMatch?.[3] === 'R' ? 'Right' : '';

    // 1.5 Extract Club, Nation, League, Height, Skills, Weak Foot, Age and the card's version.
    //
    // The labelled ones are printed in caps ("SKILLS", "HEIGHT"); the match is case-insensitive so
    // an older copy in title case still reads.
    const labelled = (label: string) => {
      const match = text.match(new RegExp(`\\n${label}\\n([^\\n]+)`, 'i'));
      return match ? match[1].trim() : '';
    };

    // Club, nation and league are unlabelled where the card is, but the footer names them in that
    // order. The bio sentence below it is the fallback, and reads them out in prose.
    const fromMatch = text.match(/\nView other Players from:\n([^\n]+)\n([^\n]+)\n([^\n]+)\n/);
    const bioSentence = text.match(/ from ([^.]+?)\. .*? who plays for (.+?) in (.+?)\./);
    // Copied from some browsers the label comes along stuck to the front of its value, which is
    // how a card ended up playing for "ClubReal Madrid".
    const unlabel = (value?: string) => value?.replace(/^(Club|Nation|League)(?=\S)/, '').trim();
    data.club = unlabel(fromMatch?.[1]) || labelled('Club') || bioSentence?.[2] || 'Unknown Club';
    data.nation = unlabel(fromMatch?.[2]) || labelled('Nation') || bioSentence?.[1] || 'Unknown Nation';
    data.league = unlabel(fromMatch?.[3]) || labelled('League') || bioSentence?.[3] || 'Unknown League';

    const skills = labelled('SKILLS');
    const weakFoot = labelled('WEAK FOOT');
    data.skills = skills ? parseInt(skills, 10) : cardMatch?.[4] ? parseInt(cardMatch[4], 10) : 3;
    data.wf = weakFoot ? parseInt(weakFoot, 10) : cardMatch?.[5] ? parseInt(cardMatch[5], 10) : 3;
    data.height = labelled('HEIGHT') || 'Unknown Height';

    const age = labelled('AGE').match(/\d+/)?.[0];
    const foot = labelled('FOOT') || data.foot;
    data.footAge = [foot, age && `${age} yrs`].filter(Boolean).join(' | ') || 'Unknown';

    // The card's version — "UCL Road to the Finals", "Team of the Week". It is the rarity as far as
    // an evo is concerned: several of them require one or rule one out, and every imported card
    // used to call itself "Custom", which matches nothing and is ruled out by nothing.
    const versionMatch = text.match(/\n[^\n]+ - (.+?) EA FC 26 Prices and Rating\n/)
      || text.match(/\nFC 26 (.+?) - [^\n]+\n/);
    data.rarity = versionMatch?.[1]?.trim() || 'Custom';


    // 2. Extract Stats
    //
    // Read label by label rather than as one fixed run of lines per block, because the page puts
    // things between them. A chemistry style selected on the FUTBIN page prints its boost on its
    // own line and raises the value beside it —
    //
    //   Pace / +3 / 93        instead of        Pace / 90
    //
    // which used to break exactly the blocks that style touched and no others: Messi copied with
    // Engine on imported with pace, passing and dribbling at the placeholder 50 while shooting,
    // defending and physical came through fine. The boost is subtracted back off, so the card that
    // lands is the base card either way — this app applies chemistry itself.
    const stats: any = {};

    const statsRegion = (() => {
      const start = text.search(/\nPace\n/);
      if (start < 0) return text;
      const end = text.search(/\nTOTAL CHEM\. STYLE ADDED/i);
      return text.slice(start, end > start ? end : undefined);
    })();

    /** `Label / [+N] / value`, case-insensitive, with the style's boost taken back off. */
    const readStat = (labels: string[], from = 0): { base: number; end: number } | null => {
      const alternatives = labels.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      // The closing newline is optional so the last row of the last panel still reads — the region
      // ends right after Aggression's value.
      const re = new RegExp(`\\n(?:${alternatives})\\n(?:([+-]\\d+)\\n)?(\\d{1,3})(?:\\n|$)`, 'i');
      const slice = statsRegion.slice(from);
      const m = slice.match(re);
      if (!m || m.index === undefined) return null;
      // Stops on the newline that closed this row rather than after it: that same newline opens the
      // next row, and consuming it leaves the following label without the `\n` its pattern needs.
      const consumed = m[0].endsWith('\n') ? m[0].length - 1 : m[0].length;
      return {
        base: parseInt(m[2], 10) - (m[1] ? parseInt(m[1], 10) : 0),
        end: from + m.index + consumed
      };
    };

    /** One of the six panels: its face value, then its sub-stats, all read inside the panel. */
    const readBlock = (
      faceLabels: string[],
      subs: [string, string[], number, number, number][],
      nextFaceLabels: string[] | null
    ) => {
      const face = readStat(faceLabels);
      if (!face) return null;
      const limit = nextFaceLabels ? readStat(nextFaceLabels, face.end) : null;
      const stop = limit ? limit.end : statsRegion.length;

      const out: any = {};
      let cursor = face.end;
      for (const [key, labels, boost, cap, w] of subs) {
        const sub = readStat(labels, cursor);
        // Never read past the next panel: Dribbling is both a panel and one of its own rows, and
        // wandering into the next block is how a missing row silently borrows another's number.
        if (!sub || sub.end > stop) return null;
        out[key] = { label: labels[0], base: sub.base, boost, limit: cap, w };
        cursor = sub.end;
      }
      return { face: face.base, subs: out };
    };

    const PACE = ['Pace'];
    const SHOOTING = ['Shooting'];
    const PASSING = ['Passing'];
    const DRIBBLING = ['Dribbling'];
    const DEFENDING = ['Defending'];
    const PHYSICAL = ['Physical'];

    const pac = readBlock(PACE, [
      ['acceleration', ['Acceleration'], 30, 99, 0.45],
      ['sprintSpeed', ['Sprint Speed'], 30, 99, 0.55]
    ], SHOOTING);
    if (pac) stats.pac = { label: 'Pace', baseFace: pac.face, evFace: pac.face, subs: pac.subs };

    const sho = readBlock(SHOOTING, [
      ['positioning', ['Att. Position', 'Attacking Position', 'Positioning'], 25, 99, 0.05],
      ['finishing', ['Finishing'], 25, 99, 0.45],
      ['shotPower', ['Shot Power'], 25, 99, 0.20],
      ['longShots', ['Long Shots'], 25, 99, 0.20],
      ['volleys', ['Volleys'], 25, 99, 0.05],
      ['penalties', ['Penalties'], 25, 99, 0.05]
    ], PASSING);
    if (sho) stats.sho = { label: 'Shooting', baseFace: sho.face, evFace: sho.face, subs: sho.subs };

    const pas = readBlock(PASSING, [
      ['vision', ['Vision'], 30, 99, 0.20],
      ['crossing', ['Crossing'], 25, 99, 0.20],
      ['freekick', ['FK Acc.', 'Free Kick Acc.', 'Free Kick Accuracy'], 25, 99, 0.05],
      ['shortPass', ['Short Pass', 'Short Passing'], 30, 99, 0.35],
      ['longPass', ['Long Pass', 'Long Passing'], 30, 99, 0.15],
      ['curve', ['Curve'], 25, 99, 0.05]
    ], DRIBBLING);
    if (pas) stats.pas = { label: 'Passing', baseFace: pas.face, evFace: pas.face, subs: pas.subs };

    const dri = readBlock(DRIBBLING, [
      ['agility', ['Agility'], 25, 99, 0.09],
      ['balance', ['Balance'], 30, 99, 0.05],
      ['reactions', ['Reactions'], 25, 99, 0.03],
      ['ballControl', ['Ball Control'], 30, 99, 0.33],
      ['dribbling', ['Dribbling', 'Drib.'], 30, 99, 0.45],
      ['composure', ['Composure'], 30, 99, 0.05]
    ], DEFENDING);
    if (dri) stats.dri = { label: 'Dribbling', baseFace: dri.face, evFace: dri.face, subs: dri.subs };

    const def = readBlock(DEFENDING, [
      ['interceptions', ['Interceptions'], 30, 99, 0.20],
      ['headingAcc', ['Heading Acc.', 'Heading Accuracy'], 25, 99, 0.10],
      ['defAwareness', ['Def. Aware', 'Def. Awareness', 'Defensive Awareness'], 30, 99, 0.30],
      ['standTackle', ['Stand Tackle', 'Standing Tackle'], 30, 99, 0.30],
      ['slideTackle', ['Slide Tackle', 'Sliding Tackle'], 25, 99, 0.10]
    ], PHYSICAL);
    if (def) stats.def = { label: 'Defending', baseFace: def.face, evFace: def.face, subs: def.subs };

    const phy = readBlock(PHYSICAL, [
      ['jumping', ['Jumping'], 30, 99, 0.05],
      ['stamina', ['Stamina'], 30, 99, 0.25],
      ['strength', ['Strength'], 30, 99, 0.50],
      ['aggression', ['Aggression'], 30, 99, 0.20]
    ], null);
    if (phy) stats.phy = { label: 'Physical', baseFace: phy.face, evFace: phy.face, subs: phy.subs };

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
    const statsStart = text.search(/\nPace\n/);
    const statsEnd = statsStart < 0 ? -1 : statsStart + statsRegion.length;
    const insideStatBlock = (index: number) =>
      statsStart >= 0 && index >= statsStart && index < statsEnd;

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
        title: data.rarity,
        // The roles section is the better source — it lists every position the card can play — but
        // the card widget names them too, and falling back to it beats the flat 'CB' that a card
        // whose roles didn't parse used to import as.
        primaryPositions:
          Object.keys(roles).map(p => p.toUpperCase()).join(', ')
          || data.cardPositions.join(', ')
          || 'CB',
        height: data.height,
        footAge: data.footAge,
        weakFoot: data.wf,
        skillMoves: data.skills,
        rarity: data.rarity,
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
