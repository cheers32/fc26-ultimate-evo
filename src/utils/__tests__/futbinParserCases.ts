import { parseFutbinText } from '../futbinParser';

/**
 * What Ctrl+A / Ctrl+C on a FUTBIN player page actually hands the importer, and what the parser is
 * expected to make of it. Two cards: one whose name carries an accent and whose version is a promo,
 * one plain gold with a single position.
 *
 * These are here because the page's shape is the parser's only contract and it moves without
 * notice. It moved once already: the labels the fields used to sit behind ("Nation", "Height") are
 * printed in caps and unlabelled now, and the name/OVR pattern went from matching the card widget
 * to matching a row of the Best Ratings table — which is how Mbappé imported as "Imported Player"
 * at OVR 80 with everything else blank.
 *
 * Run with: npx tsx src/utils/__tests__/futbinParserCases.ts
 */

const MBAPPE = `Home
EA FC 26
Players
Kylian Mbappé UCL Road to the Finals
MBAPPÉ - UCL Road to the Finals EA FC 26 Prices and Rating
Summary
Stats
Market
Evolution
557
556
160
159
Comments
(1545)
93
ST
++
LM
LW
R
5
4
88.8
Mbappé
99
PAC
93
SHO
86
PAS
95
DRI
42
DEF
80
PHY
Trend:
8.3% (-19K)
210,000
212,000
217,000
219,000
221,000
PRICE UPDATED: 1 MINS AGO
PRICE RANGE:
12,750 - 240,000
France
LALIGA EA SPORTS
Real Madrid
UCL Road to the Finals
SKILLS
5
WEAK FOOT
4
HEIGHT
182cm | 6'0"
FOOT
Right
AGE
27 years old
SQUAD
UCLRTTF
Rapid
Low Driven Shot
Finesse Shot
Power Shot
Gamechanger
Tiki Taka
Technical
First Touch
Quick Step
ST
Target Forward
+
ST
Advanced Forward
++
ST
Poacher
++
ST
False 9
++
LM
Winger
+
LM
Wide Playmaker
+
LM
Inside Forward
++
LW
Winger
+
LW
Wide Playmaker
+
LW
Inside Forward
++
Player Stats
Evolution Builder
98
97
96
96
96
92
92
92
91
91
UCL RTTF
Win or draw 1st Quarter Finals game
+1 PS
Details
Pace
99
Acceleration
99
Sprint Speed
99
Shooting
93
Att. Position
94
Finishing
95
Shot Power
94
Long Shots
90
Volleys
90
Penalties
85
Passing
86
Vision
87
Crossing
82
FK Acc.
73
Short Pass
91
Long Pass
80
Curve
84
Dribbling
95
Agility
96
Balance
85
Reactions
94
Ball Control
96
Dribbling
95
Composure
91
Defending
42
Interceptions
43
Heading Acc.
88
Def. Aware
31
Stand Tackle
39
Slide Tackle
37
Physical
80
Jumping
93
Stamina
90
Strength
80
Aggression
65
TOTAL CHEM. STYLE ADDED:
0
Base Stats
495
0
600
IGS
2366
0
2900
AcceleRATE & Chemistry
EXPLOSIVE
Top 3 community voted
Marksman
34%
Finisher
18%
Sniper
12%
Chemistry
Controlled
Architect
Sniper
Explosive
Anchor
Artist
Backbone
Basic
Catalyst
Deadeye
Engine
Finisher
Gladiator
Guardian
Hawk
Hunter
Maestro
Marksman
Powerhouse
Sentinel
Shadow
FUTBIN Rating
Best Ratings
RPP Map
88.8
ST Advanced Forward++
Rank #146
BEST CHEM.
93
ST
++
LM
LW
R
5
4
88.8
Mbappé
99
PAC
93
SHO
86
PAS
95
DRI
42
DEF
80
PHY
Player Bio - Kylian Mbappé

Kylian Mbappé is a professional footballer from France. He is a 182cm | 6'0" tall, right-footed striker (ST) who plays for Real Madrid in LALIGA EA SPORTS.

Comments
(1545)
Reviews
Kylian Mbappé
`;

const VAN_DIJK = `Home
EA FC 26
Players
Virgil van Dijk Gold Rare
VAN DIJK - Gold Rare EA FC 26 Prices and Rating
Summary
Stats
Market
Evolution
976
975
334
333
Comments
(1336)
90
CB
++
R
2
3
77.9
van Dijk
73
PAC
60
SHO
72
PAS
72
DRI
90
DEF
87
PHY
0
0
0
0
0
PRICE UPDATED: 1 MINS AGO
PRICE RANGE:
750 - 10,000
Netherlands
Premier League
Liverpool
Gold Rare
SKILLS
2
WEAK FOOT
3
HEIGHT
193cm | 6'4'
FOOT
Right
AGE
35 years old
Intercept
Precision Header
Pinged Pass
Jockey
Anticipate
Aerial Fortress
Bruiser
CB
Defender
+
CB
Ball-Playing Defender
++
Player Stats
Evolution Builder
99
97
95
95
92
91
90
Pace
73
Acceleration
66
Sprint Speed
78
Shooting
60
Att. Position
47
Finishing
52
Shot Power
81
Long Shots
64
Volleys
45
Penalties
62
Passing
72
Vision
70
Crossing
53
FK Acc.
70
Short Pass
80
Long Pass
83
Curve
60
Dribbling
72
Agility
54
Balance
50
Reactions
90
Ball Control
77
Dribbling
70
Composure
90
Defending
90
Interceptions
91
Heading Acc.
88
Def. Aware
91
Stand Tackle
91
Slide Tackle
87
Physical
87
Jumping
89
Stamina
75
Strength
93
Aggression
85
TOTAL CHEM. STYLE ADDED:
0
Base Stats
454
0
600
IGS
2132
0
2900
AcceleRATE & Chemistry
LENGTHY
FUTBIN Rating
Best Ratings
RPP Map
77.9
CB Defender+
Rank #433
BEST CHEM.
90
CB
++
R
2
3
77.9
van Dijk
73
PAC
60
SHO
72
PAS
72
DRI
90
DEF
87
PHY
Player Bio - Virgil van Dijk

Virgil van Dijk is a professional footballer from Netherlands. He is a 193cm | 6'4' tall, right-footed defender (CB) who plays for Liverpool in Premier League. He was born on 08-07-1991 and he is now 35 years old.

FC 26 Gold Rare - Virgil van Dijk

Comments
(1336)
Reviews
Virgil van Dijk
Votes
90
CB
++
van Dijk
View other Players from:
Liverpool
Netherlands
Premier League
`;

type Expected = {
  name: string;
  ovr: number;
  positions: string;
  rarity: string;
  club: string;
  nation: string;
  league: string;
  height: string;
  footAge: string;
  skillMoves: number;
  weakFoot: number;
  faces: Record<string, number>;
  /** FUTBIN prints these two itself, so they check the stat blocks against the page's own totals. */
  baseStats: number;
  igs: number;
  playStyles: string[];
};

function check(label: string, text: string, goldCount: number, want: Expected) {
  const p = parseFutbinText(text, '', '', goldCount);
  const bad: string[] = [];
  if (!p) {
    console.log(`FAIL  ${label}   parser returned null`);
    return;
  }

  const got: Record<string, unknown> = {
    name: p.bio.name,
    ovr: p.ovr.base,
    positions: p.bio.primaryPositions,
    rarity: p.bio.rarity,
    club: p.bio.club,
    nation: p.bio.nation,
    league: p.bio.league,
    height: p.bio.height,
    footAge: p.bio.footAge,
    skillMoves: p.bio.skillMoves,
    weakFoot: p.bio.weakFoot
  };
  Object.entries(got).forEach(([key, value]) => {
    const expected = want[key as keyof Expected];
    if (value !== expected) bad.push(`${key}: ours=${JSON.stringify(value)} truth=${JSON.stringify(expected)}`);
  });

  let base = 0;
  let igs = 0;
  Object.entries(p.stats).forEach(([faceKey, face]) => {
    base += face.baseFace;
    igs += Object.values(face.subs).reduce((sum, sub) => sum + sub.base, 0);
    if (want.faces[faceKey] !== face.baseFace) {
      bad.push(`face ${faceKey}: ours=${face.baseFace} truth=${want.faces[faceKey]}`);
    }
  });
  if (base !== want.baseStats) bad.push(`BaseStats: ours=${base} truth=${want.baseStats}`);
  if (igs !== want.igs) bad.push(`IGS: ours=${igs} truth=${want.igs}`);

  const ps = [...p.playStyles.base.gold, ...p.playStyles.base.silver].join(', ');
  if (ps !== want.playStyles.join(', ')) bad.push(`PlayStyles: ours=[${ps}] truth=[${want.playStyles.join(', ')}]`);

  console.log(`${bad.length === 0 ? 'PASS' : 'FAIL'}  ${label}`);
  bad.forEach(b => console.log('        ' + b));
}

check('Mbappé 93 UCL RTTF', MBAPPE, 1, {
  name: 'Kylian Mbappé',
  ovr: 93,
  positions: 'ST, LM, LW',
  rarity: 'UCL Road to the Finals',
  club: 'Real Madrid',
  nation: 'France',
  league: 'LALIGA EA SPORTS',
  height: `182cm | 6'0"`,
  footAge: 'Right | 27 yrs',
  skillMoves: 5,
  weakFoot: 4,
  faces: { pac: 99, sho: 93, pas: 86, dri: 95, def: 42, phy: 80 },
  baseStats: 495,
  igs: 2366,
  playStyles: [
    'Rapid+', 'Low Driven Shot', 'Finesse Shot', 'Power Shot', 'Gamechanger',
    'Tiki Taka', 'Technical', 'First Touch', 'Quick Step'
  ]
});

check('van Dijk 90 Gold Rare', VAN_DIJK, 1, {
  name: 'Virgil van Dijk',
  ovr: 90,
  positions: 'CB',
  rarity: 'Gold Rare',
  club: 'Liverpool',
  nation: 'Netherlands',
  league: 'Premier League',
  height: `193cm | 6'4'`,
  footAge: 'Right | 35 yrs',
  skillMoves: 2,
  weakFoot: 3,
  faces: { pac: 73, sho: 60, pas: 72, dri: 72, def: 90, phy: 87 },
  baseStats: 454,
  igs: 2132,
  playStyles: [
    'Intercept+', 'Precision Header', 'Pinged Pass', 'Jockey', 'Anticipate',
    'Aerial Fortress', 'Bruiser'
  ]
});

/**
 * The same page copied from a different browser: the footer's labels come glued to their values,
 * and the card widget's lines are joined, so nothing anchors the rating. This is the shape that
 * imported Mbappé at OVR 80 a second time, after the first fix — the stat blocks and the bio read
 * fine, which is why everything but the rating and the club looked right.
 */
const GLUED = `Home
EA FC 26
Players
Kylian Mbappé UCL Road to the Finals
MBAPPÉ - UCL Road to the Finals EA FC 26 Prices and Rating
93 ST ++ LM LW R 5 4 88.8 Mbappé 99 PAC 93 SHO 86 PAS 95 DRI 42 DEF 80 PHY
SKILLS
5
WEAK FOOT
4
HEIGHT
182cm | 6'0"
FOOT
Right
AGE
27 years old
Rapid
ST
Advanced Forward
++
LM
Inside Forward
++
LW
Inside Forward
++
Pace
99
Acceleration
99
Sprint Speed
99
Shooting
93
Att. Position
94
Finishing
95
Shot Power
94
Long Shots
90
Volleys
90
Penalties
85
Passing
86
Vision
87
Crossing
82
FK Acc.
73
Short Pass
91
Long Pass
80
Curve
84
Dribbling
95
Agility
96
Balance
85
Reactions
94
Ball Control
96
Dribbling
95
Composure
91
Defending
42
Interceptions
43
Heading Acc.
88
Def. Aware
31
Stand Tackle
39
Slide Tackle
37
Physical
80
Jumping
93
Stamina
90
Strength
80
Aggression
65
Player Bio - Kylian Mbappé

Kylian Mbappé is a professional footballer from France. He is a 182cm | 6'0" tall, right-footed striker (ST) who plays for Real Madrid in LALIGA EA SPORTS. He was born on 20-12-1998 and he is now 27 years old.

Kylian Mbappé's UCL Road to the Finals card is rated 93. He has a 4-star weak foot and 5-star skill moves.

View other Players from:
ClubReal Madrid
NationFrance
LeagueLALIGA EA SPORTS
`;

check('Mbappé 93, labels glued by the copy', GLUED, 1, {
  name: 'Kylian Mbappé',
  ovr: 93,
  positions: 'ST, LM, LW',
  rarity: 'UCL Road to the Finals',
  club: 'Real Madrid',
  nation: 'France',
  league: 'LALIGA EA SPORTS',
  height: `182cm | 6'0"`,
  footAge: 'Right | 27 yrs',
  skillMoves: 5,
  weakFoot: 4,
  faces: { pac: 99, sho: 93, pas: 86, dri: 95, def: 42, phy: 80 },
  baseStats: 495,
  igs: 2366,
  playStyles: ['Rapid+']
});

/**
 * The same page with a chemistry style selected on it, which is how Messi imported as pace 50 /
 * passing 50 / dribbling 50 while shooting, defending and physical came through: FUTBIN prints the
 * style's boost on its own line and raises the value beside it, so exactly the panels that style
 * touches stop matching a fixed run of lines. Engine here (+3 pace, +6 passing, +3/+6 dribbling).
 *
 * The expectation is the base card — the boost is taken back off, since the app applies chemistry
 * itself and would otherwise count it twice.
 *
 * Three of these come back a point low on purpose, and the IGS with them: vision, curve and
 * dribbling were boosted past 99, the page printed the capped 99, and how far past it went is not
 * recoverable from the text. That is the reason the importer tells you to clear the style and copy
 * again rather than quietly accepting the numbers.
 */
const STYLED = `Home
EA FC 26
Players
Lionel Messi Time Warp
MESSI - Time Warp EA FC 26 Prices and Rating
90
ST
++
RM
CAM
RW
L
4
4
83.7
Messi
90
PAC
90
SHO
89
PAS
94
DRI
37
DEF
70
PHY
SKILLS
4
WEAK FOOT
4
HEIGHT
169cm | 5'7"
FOOT
Left
AGE
39 years old
Finesse Shot
Pace
+3
93
Acceleration
+3
94
Sprint Speed
+3
93
Shooting
90
Att. Position
91
Finishing
90
Shot Power
90
Long Shots
92
Volleys
94
Penalties
81
Passing
+6
95
Vision
+9
99
Crossing
+6
90
FK Acc.
97
Short Pass
+3
93
Long Pass
+6
95
Curve
+6
99
Dribbling
+3
97
Agility
+3
93
Balance
+6
99
Reactions
91
Ball Control
97
Dribbling
+6
99
Composure
97
Defending
37
Interceptions
45
Heading Acc.
67
Def. Aware
22
Stand Tackle
39
Slide Tackle
27
Physical
70
Jumping
77
Stamina
80
Strength
73
Aggression
50
TOTAL CHEM. STYLE ADDED:
24
Base Stats
470
0
600
IGS
2306
Player Bio - Lionel Messi

Lionel Messi is a professional footballer from Argentina. He is a 169cm | 5'7" tall, left-footed striker (ST) who plays for Inter Miami CF in Major League Soccer. He was born on 24-06-1987 and he is now 39 years old.

Lionel Messi's Time Warp card is rated 90.

View other Players from:
Inter Miami CF
Argentina
Major League Soccer
`;

check('Messi 90, chemistry style applied on the page', STYLED, 1, {
  name: 'Lionel Messi',
  ovr: 90,
  positions: 'ST, RM, CAM, RW',
  rarity: 'Time Warp',
  club: 'Inter Miami CF',
  nation: 'Argentina',
  league: 'Major League Soccer',
  height: `169cm | 5'7"`,
  footAge: 'Left | 39 yrs',
  skillMoves: 4,
  weakFoot: 4,
  faces: { pac: 90, sho: 90, pas: 89, dri: 94, def: 37, phy: 70 },
  baseStats: 470,
  igs: 2303,
  playStyles: ['Finesse Shot+']
});

/**
 * Only the top of the page, which is what a mouse-drag selection gives: the card, the labelled bio
 * strip and the stats, and none of the prose below them. Pacho imported from a copy like this as
 * "Imported Player", OVR 80, rarity Custom — the name, the rating and the version were all being
 * read from the bottom of the page, and the card widget was matched as one fixed run of lines.
 */
const PARTIAL = `Home
EA FC 26
Players
Willian Pacho Festival of Football: Phenoms
PACHO - Festival of Football: Phenoms EA FC 26 Prices and Rating
Summary
Stats
Market
Evolution

96
CB
++
L
4
5
94.2
Pacho
93
PAC
46
SHO
85
PAS
83
DRI
96
DEF
94
PHY
PRICE RANGE:
15,000 - 200,000
SKILLS
4
WEAK FOOT
5
HEIGHT
188cm | 6'2"
FOOT
Left
AGE
24 years old
Anticipate
Pace
93
Acceleration
92
Sprint Speed
94
Shooting
46
Att. Position
40
Finishing
36
Shot Power
72
Long Shots
40
Volleys
30
Penalties
45
Passing
85
Vision
82
Crossing
70
FK Acc.
55
Short Pass
93
Long Pass
88
Curve
70
Dribbling
83
Agility
80
Balance
78
Reactions
92
Ball Control
88
Dribbling
80
Composure
92
Defending
96
Interceptions
95
Heading Acc.
93
Def. Aware
97
Stand Tackle
96
Slide Tackle
94
Physical
94
Jumping
92
Stamina
90
Strength
96
Aggression
88
`;

check('Pacho 96, only the top of the page copied', PARTIAL, 1, {
  name: 'Willian Pacho',
  ovr: 96,
  positions: 'CB',
  rarity: 'Festival of Football: Phenoms',
  club: 'Unknown Club',
  nation: 'Unknown Nation',
  league: 'Unknown League',
  height: `188cm | 6'2"`,
  footAge: 'Left | 24 yrs',
  skillMoves: 4,
  weakFoot: 5,
  faces: { pac: 93, sho: 46, pas: 85, dri: 83, def: 96, phy: 94 },
  baseStats: 497,
  igs: 2258,
  playStyles: ['Anticipate+']
});
