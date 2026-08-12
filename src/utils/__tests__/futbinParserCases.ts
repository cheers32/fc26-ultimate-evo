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
