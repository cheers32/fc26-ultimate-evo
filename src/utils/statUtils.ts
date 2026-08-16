export interface ChipInfo {
  text: string;
  className: string;
}

/**
 * How much each sub-stat counts toward the face value above it.
 *
 * Kept here rather than read off each card's own `w`, because a card carries a copy of these
 * numbers and imported ones are stored with whatever the table said the day they were imported —
 * so a correction here would never reach them. The card's `w` is still written for compatibility
 * and is now ignored.
 *
 * Checked against every card in the app: with these, the face value computed from the sub-stats
 * matches the one FUTBIN prints on all 43. Dribbling used to carry agility 0.09 / reactions 0.03 /
 * ball control 0.33, which got four of them wrong by a point — van Dijk's evolved card read 87
 * dribbling where the game says 86.
 */
export const FACE_WEIGHTS: Record<string, Record<string, number>> = {
  pac: { acceleration: 0.45, sprintSpeed: 0.55 },
  sho: { positioning: 0.05, finishing: 0.45, shotPower: 0.20, longShots: 0.20, volleys: 0.05, penalties: 0.05 },
  pas: { vision: 0.20, crossing: 0.20, freekick: 0.05, shortPass: 0.35, longPass: 0.15, curve: 0.05 },
  dri: { agility: 0.10, balance: 0.05, reactions: 0.05, ballControl: 0.30, dribbling: 0.45, composure: 0.05 },
  def: { interceptions: 0.20, headingAcc: 0.10, defAwareness: 0.30, standTackle: 0.30, slideTackle: 0.10 },
  phy: { jumping: 0.05, stamina: 0.25, strength: 0.50, aggression: 0.20 }
};

/**
 * The weight to use for one sub-stat, falling back to whatever the card itself carries for anything
 * the table doesn't name.
 */
export const faceWeight = (faceKey: string, subKey: string, fallback = 0): number =>
  FACE_WEIGHTS[faceKey]?.[subKey] ?? fallback;

export const getStatColorClass = (val: number) => {
  if (val >= 95) return 'text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)] font-black';
  if (val >= 90) return 'text-fcGreen font-bold';
  if (val >= 80) return 'text-lime-400 font-semibold';
  if (val >= 70) return 'text-yellow-500 font-semibold';
  return 'text-red-500 opacity-90';
};

export function calculateChip(
  base: number,
  allowedBoost: number,
  limit: number,
  actualBoost: number,
  isOvr: boolean = false
): ChipInfo | null {
  if (allowedBoost <= 0) return null;

  const hitLimit = base + allowedBoost >= limit; // Capped out, lost some stats OR hit exactly
  const utilRate = actualBoost / allowedBoost;

  let className = "";

  if (hitLimit) {
    if (utilRate >= 0.8) {
      className = isOvr
        ? "text-green-800 bg-green-200 border border-green-600 shadow-[0_0_4px_rgba(74,222,128,0.5)]"
        : "text-green-400 bg-green-900/40 border border-green-600/50";
    } else if (utilRate >= 0.4) {
      className = isOvr
        ? "text-yellow-800 bg-yellow-200 border border-yellow-600 shadow-[0_0_4px_rgba(234,179,8,0.5)]"
        : "text-yellow-400 bg-yellow-900/40 border border-yellow-600/50";
    } else {
      className = isOvr
        ? "text-red-900 bg-red-200 border border-red-600 shadow-[0_0_4px_rgba(248,113,113,0.5)]"
        : "text-red-400 bg-red-900/40 border border-red-600/50";
    }
  } else {
    className = isOvr
      ? "text-green-800 bg-green-200/80"
      : "text-green-400 bg-green-900/20";
  }

  return {
    text: `+${actualBoost}/${allowedBoost}/${limit}`,
    className
  };
}

/**
 * FC 26 only shows three of these — a card reads simply "Explosive", "Controlled" or "Lengthy" —
 * but the seven-way split the game used last year is what the thresholds actually compute, and it
 * says far more about a card: "Controlled Lengthy" and "Lengthy" both display as Lengthy while
 * feeling nothing alike. The finer names are kept for that reason.
 */
export type AccelerateType =
  | 'Explosive'
  | 'Mostly Explosive'
  | 'Controlled Explosive'
  | 'Controlled'
  | 'Controlled Lengthy'
  | 'Mostly Lengthy'
  | 'Lengthy';

export const ACCELERATE_TYPES: AccelerateType[] = [
  'Explosive',
  'Mostly Explosive',
  'Controlled Explosive',
  'Controlled',
  'Controlled Lengthy',
  'Mostly Lengthy',
  'Lengthy'
];

/**
 * Abbreviations for the places an archetype has to sit inside a chip next to the stats — the full
 * "Mostly Explosive" is wider than the whole card it would be printed on. Anywhere these are used
 * the full name belongs in the title.
 */
export const ACCELERATE_SHORT: Record<AccelerateType, string> = {
  'Explosive': 'EXPL',
  'Mostly Explosive': 'M.EXPL',
  'Controlled Explosive': 'C.EXPL',
  'Controlled': 'CTRL',
  'Controlled Lengthy': 'C.LEN',
  'Mostly Lengthy': 'M.LEN',
  'Lengthy': 'LEN'
};

/** The three the card itself prints, which is what the seven-way split collapses to in game. */
export type AccelerateFamily = 'Explosive' | 'Controlled' | 'Lengthy';

export const ACCELERATE_FAMILY: Record<AccelerateType, AccelerateFamily> = {
  'Explosive': 'Explosive',
  'Mostly Explosive': 'Explosive',
  'Controlled Explosive': 'Explosive',
  'Controlled': 'Controlled',
  'Controlled Lengthy': 'Lengthy',
  'Mostly Lengthy': 'Lengthy',
  'Lengthy': 'Lengthy'
};

export const ACCELERATE_FAMILIES: AccelerateFamily[] = ['Explosive', 'Controlled', 'Lengthy'];

/**
 * The archetype FC 26 actually prints, which is *not* the seven-way split collapsed.
 *
 * Measured against FUTBIN rather than derived. Their page renders the same grouping at all three
 * chemistry levels, and a style's boost scales with the level, so one card gives a ladder of leads
 * either side of the cut. Ronaldinho (180cm, agility 89 / strength 81) pins the Explosive one:
 *
 *   Engine   +1 → lead  9 → Controlled      (chem 1)
 *   Finisher +2 → lead 10 → Explosive       (chem 1)
 *   Engine   +2 → lead 10 → Explosive       (chem 2)
 *
 * A cut of 9 would make Engine explosive at chem 1 and a cut of 11 would make Finisher controlled
 * there, so it is exactly 10. Ronaldo under Counter Culture (187cm) pins the other the same way:
 * Backbone at a strength lead of 3 is Controlled and 4 is Lengthy.
 *
 * The height gates are measured the same way, off FUTBIN's own player list — its rows carry both
 * the height and the archetype, so a few hundred cards settle it at a glance. Lengthy first appears
 * at 185cm and Explosive last appears at 182cm:
 *
 *   182cm  8 Controlled,  0 Lengthy      176-182cm  Explosive throughout
 *   183cm 16 Controlled,  0 Lengthy      183cm      0 Explosive
 *   184cm  7 Controlled,  0 Lengthy      184cm      0 Explosive
 *   185cm  3 Controlled,  8 Lengthy
 *
 * Confirmed card by card at the line: Marquinhos and Cubarsí at 183cm read Controlled on a
 * strength lead of 7, and Aparecido da Silva at 185cm reads Lengthy on the same lead of 7. Height
 * is doing the work, not the lead. Note 185 is not one of the seven-way rule's gates either — that
 * one opens Lengthy at 181, which is what had Zambrotta at 181cm reading Lengthy here and
 * Controlled in game.
 *
 * The two sides do not meet in the middle — leaning Lengthy is cheap and leaning Explosive is dear
 * — and the seven-way rule enters "Controlled Explosive" at a lead of 4, so it calls cards
 * Explosive that the game calls Controlled. Hence a separate function: the systems genuinely
 * disagree, and the app shows both.
 */
export function calculateAccelerateFamily(
  acc: number,
  agi: number,
  str: number,
  heightCm?: number
): AccelerateFamily {
  const h = heightCm ?? 180;
  if (agi - str >= 10 && agi >= 65 && acc >= 70 && h <= 182) return 'Explosive';
  if (str - agi >= 4 && str >= 65 && acc >= 40 && h >= 185) return 'Lengthy';
  return 'Controlled';
}

/** The finer tiers that each printed archetype is made of, in the order they lean. */
export const ACCELERATE_TIERS_BY_FAMILY: Record<AccelerateFamily, AccelerateType[]> = {
  Explosive: ['Explosive', 'Mostly Explosive', 'Controlled Explosive'],
  Controlled: ['Controlled'],
  Lengthy: ['Controlled Lengthy', 'Mostly Lengthy', 'Lengthy']
};

/**
 * How far a tier leans, said on its own — for showing the two systems together without repeating
 * the family beside itself. "Mostly Explosive" reads as Explosive · Mostly, and plain "Explosive"
 * as Explosive · Full. `Controlled` is the whole of its family and has nothing to add.
 */
export function accelerateLean(type: AccelerateType): string | null {
  const family = ACCELERATE_FAMILY[type];
  if (family === 'Controlled') return null;
  if (type === family) return 'Full';
  return type.startsWith('Mostly') ? 'Mostly' : 'Controlled';
}

/**
 * The colours a starred build can wear.
 *
 * Two of these were a toggle — saved, then marked out in red — but a star is really the only
 * grouping a card's builds have, and telling five shortlists apart by name means reading five
 * names. So the tier is a colour and nothing more: the app treats every tier alike, and what each
 * one means is the player's own business. Clicking cycles through them and then off.
 */
export const STAR_TIERS: { name: string; dot: string; fill: string; button: string }[] = [
  { name: 'Gold', dot: 'bg-yellow-500 text-black hover:bg-yellow-400', fill: 'fill-black', button: 'bg-yellow-500 text-black border-yellow-400 hover:bg-yellow-400' },
  { name: 'Red', dot: 'bg-red-600 text-white hover:bg-red-500', fill: 'fill-white', button: 'bg-red-600 text-white border-red-500 hover:bg-red-500' },
  { name: 'Blue', dot: 'bg-sky-500 text-white hover:bg-sky-400', fill: 'fill-white', button: 'bg-sky-500 text-white border-sky-400 hover:bg-sky-400' },
  { name: 'Green', dot: 'bg-emerald-500 text-black hover:bg-emerald-400', fill: 'fill-black', button: 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400' },
  { name: 'Purple', dot: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500', fill: 'fill-white', button: 'bg-fuchsia-600 text-white border-fuchsia-500 hover:bg-fuchsia-500' }
];

export const STAR_TIER_COUNT = STAR_TIERS.length;

/** Pulls the centimetres out of a bio height string like `190cm | 6'3"`. */
export function parseHeightCm(height?: string): number | undefined {
  const cm = height?.match(/(\d{2,3})\s*cm/i);
  return cm ? Number(cm[1]) : undefined;
}

/**
 * AcceleRATE archetype. Height is part of the real rule — a tall card cannot be Explosive however
 * agile it is — and the split matters because the two ends want different PlayStyles (Rapid
 * belongs on a Lengthy card, Quick Step on an Explosive one).
 *
 * The tiers are ordered by how far the card leans, and the gap of 4 between agility and strength
 * is where the leaning starts. Leaving those two tiers out was wrong on real cards: Pogba at
 * agility 95 / strength 99 / 191cm and Vieira on the same split both read Lengthy in game, and
 * this returned Controlled for them because it asked for a gap of 12 before it would lean at all.
 *
 * Height is optional so a caller without a bio still gets a sane answer, but callers that have
 * one should pass it: without height every card collapses towards Controlled.
 */
export function calculateAccelerateType(
  acc: number,
  agi: number,
  str: number,
  heightCm?: number
): AccelerateType {
  const h = heightCm ?? 180;
  const agiLead = agi - str;
  const strLead = str - agi;

  if (agiLead >= 20 && agi >= 80 && acc >= 80 && h <= 175) return 'Explosive';
  if (agiLead >= 12 && agi >= 70 && acc >= 80 && h <= 182) return 'Mostly Explosive';
  if (agiLead >= 4 && agi >= 65 && acc >= 70 && h <= 182) return 'Controlled Explosive';
  if (strLead >= 20 && str >= 80 && acc >= 55 && h >= 188) return 'Lengthy';
  if (strLead >= 12 && str >= 70 && acc >= 55 && h >= 183) return 'Mostly Lengthy';
  if (strLead >= 4 && str >= 65 && acc >= 40 && h >= 181) return 'Controlled Lengthy';
  return 'Controlled';
}

/**
 * The short "what this evo asks for and gives" line shown on evo cards:
 *
 *   92/3 (+3 94)   max OVR to enter / max PS+ to enter, then the OVR boost and the OVR it caps at
 *   96/∞           an evo that grants no OVR — the cap would be noise, so it's left off
 */
export function formatEvoTerms(evo: import('../types/player').EvolutionDefinition): string {
  const maxOvr = evo.requirements.maxOvr || 99;
  const { minOvr } = evo.requirements;
  // A continuation evo wants an exact OVR (95-95) or a window — printing only the ceiling would
  // hide half of what it asks for.
  const ovr = minOvr === undefined ? `${maxOvr}` : minOvr === maxOvr ? `=${maxOvr}` : `${minOvr}-${maxOvr}`;
  const entry = `${ovr}/${evo.requirements.maxPlayStylesPlus ?? '∞'}`;
  return evo.ovrBoost.boost > 0 ? `${entry} (+${evo.ovrBoost.boost} ${evo.ovrBoost.limit})` : entry;
}

/**
 * The excluded positions worth printing on a card. Over half the outfield evos exclude GK, so
 * that one says nothing about the evo and only crowds out the badges that do — every other
 * exclusion stays. Shared so each card that lists requirements makes the same call.
 */
export function displayExcludedPositions(evo: import('../types/player').EvolutionDefinition): string[] {
  return (evo.requirements.excludedPositions || []).filter(pos => pos !== 'GK');
}
