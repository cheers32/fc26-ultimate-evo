import { EvolutionDefinition, EvolutionPath, PlayStylesData, PlayerBio, StatsData } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';
import { chemStyles } from '../data/chemStyles';
import { STYLE_OPTIONS, optimistic, withStyle, withStyleStats } from './chem';
import {
  ChainSearchInput,
  FREE_PLAYSTYLE_RARITIES,
  FullChainResult,
  buildPlayStyleNodeId,
  canPickPlayStyles,
  forEachChain,
  isPlayStyleNodeId,
  parsePlayStyleNodeId,
  simulateEvoChain,
  validateRequirement
} from './evoEngine';
import { bestFreePicks, controlModeFor } from './fitScore';
import { PsPlan, psPlanFor } from './psPlan';
import {
  BARE_FLOORS,
  BuildTemplate,
  FIELDABLE_FLOORS,
  PASS_MARK,
  floorsOf,
  suggestTemplates,
  templatesAvailable
} from '../data/buildTemplates';
import { AccelerateFamily, calculateAccelerateFamily, parseHeightCm } from './statUtils';

/**
 * Analyze V2 — builds toward a finished card, not toward a bigger number.
 *
 * The original ranking maximises a total: raw IGS, or face stats weighted by position. Two things
 * go wrong with a total, and both cost an evening of checking by hand.
 *
 * A total hides a hole. It will put a build with 78 agility at the top of a winger's list, because
 * the other nine sub-stats carried the average, and the only way to find out is to open every
 * result and read it.
 *
 * Worse, a total treats every point as a gain, and some points are a loss. Strength on a 180cm
 * playmaker is the clearest case: AcceleRATE turns on agility minus strength, so past a certain
 * point every point of strength is destroying the Explosive burst that is the reason to use the
 * card at all — while still adding to PHY, to IGS, and so to the build's rank. That is how a
 * shortlist ends up full of cards nobody would field.
 *
 * So V2 does not hand back a ranked pile. It builds toward **templates** — an Explosive CAM, a
 * Lengthy CDM — where the archetype is a requirement rather than a footnote. Everything under
 * "Explosive CAM" is Explosive, so a strength-heavy chain is not ranked lower, it is not there.
 * Inside a template the ranking is the weak link: a build is charged for however far the worst
 * sub-stat that position runs on falls short, measured against what this card can actually reach,
 * so the top of each list has no hole in it and no bar it was never able to clear.
 *
 * Three further rules come from how the game is played rather than from the numbers, and they are
 * the ones a total can never express:
 *
 * Controlled is not a destination. Explosive and Lengthy are what you build toward; Controlled is
 * where a card lands when it misses both. So a template is defined by one of the two, and a
 * Controlled build only ever appears under a template that allows it, labelled as the fallback.
 *
 * Floors, not gradients. A build under a template's floor on a stat the plan runs on is not a worse
 * version of that plan, it is a different card — the 78-agility winger that a weighted mean will
 * happily rank first because nine other sub-stats covered for it. Those builds are cut, and if
 * nothing clears the floors the list says so rather than quietly promoting the best of a bad set.
 *
 * PlayStyles used to be absent, and that turned out to be a hole rather than a simplification. A
 * chain can arrive with every stat right and its four gold slots spent on PlayStyles the position
 * has no use for, and nothing in a stat score can see it. They are in now — as their own term, not
 * folded into the stat score, and with the one move that fixes a bad set made for you: several
 * rarities let the player assign PlayStyles themselves, so a chain that converts the card's rarity
 * comes back with the picks already in it. See ./psPlan.
 */

/**
 * The end-game zero. At this stage of the game 90 is not a good number, it is the pass mark: a card
 * is measured by what it has *above* 90, and anything below is a fail rather than a low score.
 */
const ENDGAME_TARGET = PASS_MARK;

/**
 * What a point of shortfall costs, in the same unit as a point of gain. Symmetric on purpose —
 * one point under the bar is worth exactly as much as one point over it is, and the floors do the
 * rest of the work by cutting a failing build out of the clean list entirely.
 */
const SHORTFALL_COST = 1;

/** What a point of a stat the plan is hurt by costs, once it is past end-game. */
const AVOID_COST = 0.25;

/** Kept per template during the search — wide, so the choosing is done on a real set. */
const SEARCH_KEEP = 30;

/** Shown per template. Small on purpose — a template is a decision, not a catalogue. */
const OUT_PER_TEMPLATE = 4;

/** Two builds within this on every stat the plan runs on are the same build. Only one is shown. */
const SAME_BUILD = 2;

/**
 * ...and within this on everything else as well.
 *
 * Closeness on the axes a plan maximises is not closeness. Across the library, builds that sit
 * within two points of each other on every stat their plan runs on are a median of forty IGS apart
 * — a whole evo's worth of card, in stats the plan does not weigh but the player still gets. One of
 * those was being thinned away as a duplicate of the other.
 */
const SAME_IGS = 12;

/**
 * PlayStyles do not vote.
 *
 * They were briefly worth three points of the stat score, and that was the wrong call: the ranking
 * is asked to answer a question about numbers, and which PlayStyles are worth having is a matter of
 * taste the person holding the card is better at than the model. So the order is the stat model's
 * alone, and the PlayStyle score is a reading printed beside it — a reference, not a vote.
 *
 * What they still do is the one job the model is better at: noticing that the gold slots have been
 * spent on nothing and that a rarity conversion would hand them back. That is advice about which
 * evo to run, not a change to how builds are ordered, so it stays.
 */
const PS_WORTH = 0;

/**
 * What a position an evo hands the card is worth to its row, and how many are counted.
 *
 * Positions were the one thing a chain could buy that the ranking could not see at all. A step that
 * adds LM and RM changes where the card can be fielded for the rest of its life, and no later evo
 * gives it back — but it scores nothing on the plan, so the audit read it as a step doing nothing
 * and dropped it. Tiny Tim on a striker is exactly that: six IGS of stats, two positions, deleted.
 *
 * Deliberately small. This is not a claim that a second position is worth a third of a point of the
 * plan; it is enough to clear `TRIM_EPS`, so a step that buys one survives the audit and reaches the
 * row where you can see it. Ordering between builds that differ on real stats is untouched.
 *
 * Counted to three because the fourth position on a card is not doing the job the first one did.
 */
const POSITION_WORTH = 0.4;
const POSITIONS_COUNTED = 3;

/**
 * What a point of a stat is worth to a plan, counted from the pass mark rather than from zero.
 *
 * This is the difference between an end-game ranking and a spreadsheet. Scored from zero, 97 and 98
 * are within one percent of each other and the ranking barely notices; scored from 90 they are 7
 * and 8, and the second card is an eighth better at the thing it is for. Nothing is credited below
 * the pass mark, so a build cannot make up a failing stat by piling points onto a passing one.
 */
const valueOf = (v: number) => Math.max(0, v - ENDGAME_TARGET);

/** Everything the card has, added up — what a plan's own axes cannot see. */
const igsOf = (subs: Record<string, number>) => Object.values(subs).reduce((a, b) => a + b, 0);

const subValues = (stats: StatsData): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const face of Object.values(stats)) {
    for (const [key, sub] of Object.entries(face.subs)) out[key] = sub.base;
  }
  return out;
};

const prettySub = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
    .replace('Def Awareness', 'Def. Aware').replace('Heading Acc', 'Heading').trim();

/**
 * Which chemistry styles leave the card on each archetype. The style is a free choice at the point
 * of use, so "can be made Explosive" is the question a template asks — and naming the styles that
 * do it is the difference between a claim and an instruction.
 */
function archetypesByChem(
  subs: Record<string, number>,
  heightCm: number | undefined,
  styles: [string | null, Record<string, number>][]
): Map<AccelerateFamily, string[]> {
  const out = new Map<AccelerateFamily, string[]>();
  const acc = subs.acceleration ?? 50;
  const agi = subs.agility ?? 50;
  const str = subs.strength ?? 50;

  for (const [name, boosts] of styles) {
    const cap = (base: number, key: string) => Math.min(99, base + (boosts[key] || 0));
    const fam = calculateAccelerateFamily(
      cap(acc, 'acceleration'), cap(agi, 'agility'), cap(str, 'strength'), heightCm
    );
    const list = out.get(fam) || [];
    list.push(name ?? 'bare');
    out.set(fam, list);
  }
  return out;
}

/** What a chain costs, in the terms that matter when one pool has to dress a whole team. */
function costOf(chainIds: string[]): string {
  let paid = 0;
  const kinds = new Set<string>();
  for (const id of chainIds) {
    const cost = (availableEvolutions[id] as EvolutionDefinition | undefined)?.cost || '';
    if (!cost || /free/i.test(cost)) continue;
    paid += 1;
    if (/token/i.test(cost)) kinds.add('tokens');
    else if (/point|coin/i.test(cost)) kinds.add('paid');
    else kinds.add('objective');
  }
  return `${chainIds.length} evos${paid > 0 ? ` · ${paid} ${[...kinds].join('+')}` : ' · all free'}`;
}

interface Scored {
  score: number;
  /** Floors the build is under, worst first. Empty means every stat the plan needs passes. */
  under: { key: string; value: number; floor: number }[];
  /** The most this build gives up against what some chain in the pool actually reached. */
  left: { key: string; value: number; reach: number } | null;
}

interface Candidate {
  chainIds: string[];
  ovr: number;
  igs: number;
  subs: Record<string, number>;
  /** The archetypes this build can be made to read, and by which styles. */
  byChem: Map<AccelerateFamily, string[]>;
  bare: AccelerateFamily;
  positions: string[];
}

/** A build under a template, with the archetype it would actually be played on. */
interface Entry {
  cand: Candidate;
  arch: AccelerateFamily;
  /** True when the card could not reach the template's archetype and landed on Controlled. */
  fallback: boolean;
}

const canonical = (ids: string[]) => [...ids].sort().join(',');

/**
 * What your thumbs do to a search, and deliberately no more than this.
 *
 * A build you turned down is not shown again for that card, and one you liked is always shown and
 * marked. Both are memory rather than model: they change which rows appear, never what a stat is
 * worth, so nothing about the ranking becomes harder to explain because of a click. Turning votes
 * into weights is a separate, slower job that has to be argued for and checked against the bench —
 * see scripts/feedbackReport.ts.
 */
export interface V2Feedback {
  /** Canonical chain keys this card's owner turned down. */
  down?: string[];
  /** Canonical chain keys they liked — always listed, never thinned away. */
  up?: string[];
}

/**
 * Why a search came back with nothing, in the only terms that say what to do next.
 *
 * "No build clears the bar" leaves you to work out which bar by hand, on a card whose numbers you
 * would have to add up yourself — and the answer is usually one stat that nothing in the pool can
 * move. So every fieldable floor is tracked as the search runs: the highest any chain got it to,
 * read the same way the floor is judged. A stat that never cleared in any chain is not a build that
 * needs finding, it is an evo that needs adding to the pool.
 */
export interface V2Diagnosis {
  /** How many legal chains were looked at. Zero means the filters cut everything before scoring. */
  visited: number;
  /** Every fieldable floor, with the best any chain reached. */
  floors: { key: string; floor: number; best: number }[];
}

export function analyzeEvolutionsV2(
  input: ChainSearchInput & {
    feedback?: V2Feedback;
    /** Called once at the end, whatever the result — see V2Diagnosis. */
    report?: (d: V2Diagnosis) => void;
  }
): EvolutionPath[] {
  const { baseBio, baseOvr, baseStats, basePlayStyles, poolIds } = input;
  const height = parseHeightCm(baseBio.height);

  /**
   * How many steps at the head of every chain are yours rather than the search's.
   *
   * A search started from a point on an existing build is a continuation of that build, so those
   * steps are not candidates for anything the audit does — they cannot be dropped as unnecessary,
   * and they cannot be reordered with what comes after. The evos are already spent.
   */
  const locked = (input.prefixChainIds ?? []).length;

  /**
   * Evos you said every build has to contain.
   *
   * The search only ever visits chains that have them, so this exists for one reason: the audit
   * must not take them out again. "This step earns the plan nothing" is a fair thing to notice and
   * the wrong thing to act on when the step is there because you asked for it — the answer to
   * "which build should I make, given I am running this evo" is not a build without it.
   */
  const required = new Set(input.filters?.requiredEvos ?? []);

  /**
   * Whether a build may be judged wearing a chemistry style it does not have yet.
   *
   * Off unless asked for. A style is a real choice and usually the right assumption — 96 and 99 are
   * the same number once a +3 is on — but it is still an assumption, and while it is on, every
   * floor a row clears and every archetype it reads is contingent on a style being applied. Off,
   * the card is read as it is.
   */
  const assumeChem = input.filters?.assumeChemStyle === true;

  const psWeight = PS_WORTH;
  /** The readings a build is allowed: every style, or only the card as it stands. */
  const styleOptions: [string | null, Record<string, number>][] =
    assumeChem ? STYLE_OPTIONS : [[null, {}]];
  /** The best case for a stat, which is the bare value when nothing may be assumed. */
  const bestCase = (subs: Record<string, number>, avoid?: string[]) =>
    assumeChem ? optimistic(subs, avoid) : subs;

  const positions = baseBio.primaryPositions.split(',').map(p => p.trim()).filter(Boolean);
  const rankPositions = (positions.length > 0 ? positions : ['ST']).map(p => p.toUpperCase());
  const basePositions = new Set(rankPositions);

  /** The best each sub-stat ever reached — the bar the weak link is measured against. */
  const achievable: Record<string, number> = {};

  /** Shortlists keyed `templateId|tier`; see `tierOf`. */
  const shortlists = new Map<string, Entry[]>();

  const downVoted = new Set(input.feedback?.down || []);
  const upVoted = new Set(input.feedback?.up || []);
  /** Liked builds, held aside so the shortlisting cannot quietly drop one you asked to keep. */
  const liked = new Map<string, Entry>();

  /**
   * Which pile a build belongs in. Clearing the floors outranks reaching the archetype: a plan the
   * card can actually carry out on Controlled is a more useful thing to be told than a plan it
   * technically reads Explosive for while sitting 10 under on agility.
   */
  const tierOf = (clean: boolean, fallback: boolean) => `${clean ? 'a' : 'b'}${fallback ? '2' : '1'}`;
  const TIERS = ['a1', 'a2', 'b1', 'b2'];

  /** What a template makes of a finished card: what it is worth, and what it is short of. */
  const scoreForTemplate = (
    subs: Record<string, number>,
    t: BuildTemplate,
    reach: (key: string) => number
  ): Scored => {
    // A plan's own floor outranks the general end-game bar where it is higher, and neither is worth
    // charging for beyond what this card could ever reach.
    const floors = floorsOf(t);
    const targetFor = (key: string) => Math.min(Math.max(ENDGAME_TARGET, floors[key] ?? 0), reach(key));
    let raw = 0;
    let total = 0;
    for (const [key, w] of Object.entries(t.maximise)) {
      raw += valueOf(subs[key] ?? 0) * w;
      total += w;
    }
    if (total > 0) raw /= total;

    // Stats the plan is hurt by. Charged rather than ignored, because a total cannot tell the
    // difference between a point that helps and a point that spends the archetype.
    for (const key of t.avoid || []) {
      const over = Math.max(0, (subs[key] ?? 0) - ENDGAME_TARGET);
      raw -= over * AVOID_COST;
    }

    const under = Object.entries(floors)
      .map(([key, floor]) => ({ key, floor, value: subs[key] ?? 0 }))
      .filter(x => x.value < x.floor)
      .sort((a, b) => (b.floor - b.value) - (a.floor - a.value));

    // Two different questions, and conflating them is how a shortlist reads as fine when it is not.
    // First: does every stat the plan needs pass? That is what the build is charged for. Measured
    // over the floors rather than over `must`, so a gate the plan never thought to list — stamina
    // on a centre-back — still costs a build that misses it.
    const gated = Object.keys(floors);
    let worst = 0;
    for (const key of gated) {
      worst = Math.max(worst, targetFor(key) - (subs[key] ?? 0));
    }

    // Second: of the stats that pass, which one is this build giving up the most of — measured not
    // against 90 but against what some chain in this pool actually reached. At end game the choice
    // is between 97 and 99, and a build should have to say which one it settled for.
    //
    // Only over what the plan is actually for. A gate the plan does not otherwise care about is
    // pass or fail, not a regret: a card clearing stamina at 94 has given up nothing, and reporting
    // it as a shortfall on every row is how the one genuinely useful line — the composure it
    // settled for at 96 when the pool reaches 99 — gets crowded out.
    const cares = new Set([...t.must, ...Object.keys(t.maximise)]);
    let left: Scored['left'] = null;
    for (const key of gated) {
      if (!cares.has(key)) continue;
      const v = subs[key] ?? 0;
      const gap = reach(key) - v;
      if (gap > 0 && (!left || gap > left.reach - left.value)) left = { key, value: v, reach: reach(key) };
    }

    return { score: raw - worst * SHORTFALL_COST, under, left };
  };

  const offer = (key: string, entry: Entry, score: (c: Candidate) => number) => {
    const list = shortlists.get(key) || [];
    const ck = canonical(entry.cand.chainIds);
    const at = list.findIndex(e => canonical(e.cand.chainIds) === ck);
    if (at >= 0) {
      // The same evos in a different order are one build here, and only the better order is kept.
      // Where the plan cannot tell them apart, the tie goes to the card that gives up less of
      // everything else: Zambrotta's Year of the Fullbacks → Still Got It → The High Line and the
      // same three with the last two swapped both come out at 87.8 as a full-back, because a
      // full-back plan does not weigh passing — but the first ends 4 higher on short pass, long
      // pass and curve for the same OVR. A coin flip between those is a build thrown away.
      const mine = score(entry.cand);
      const theirs = score(list[at].cand);
      if (mine < theirs || (mine === theirs && entry.cand.igs <= list[at].cand.igs)) return;
      list.splice(at, 1);
    }
    if (list.length >= SEARCH_KEEP && score(entry.cand) <= score(list[list.length - 1].cand)) {
      shortlists.set(key, list);
      return;
    }
    let i = list.length;
    while (i > 0 && score(list[i - 1].cand) < score(entry.cand)) i--;
    list.splice(i, 0, entry);
    if (list.length > SEARCH_KEEP) list.length = SEARCH_KEEP;
    shortlists.set(key, list);
  };

  // Only the plans this card could actually be: the right positions, and an archetype its frame
  // allows. A CB has no business on the winger list, and a 180cm card has none on a Lengthy one.
  // Controlled is still not a destination — but an empty list is not an answer either. Every plan
  // will take a Controlled build, ranked below anything that reached the archetype and labelled as
  // what it is; it is only ever *shown* when nothing reached the archetype, unless the plan says
  // Controlled is a real card for it, in which case the two mix. This is what a 176cm full-back
  // needs: every plan its frame allows is Explosive, so a pool that cannot make it Explosive used
  // to return nothing at all while the same pool obviously builds it a card.
  const canFallBack = (_t: BuildTemplate) => true;

  // Three states, and the difference between two of them matters. No choice at all means "you pick"
  // — the one or two plans this card already is, so a search returns an answer rather than a
  // catalogue. An empty choice is the user having cleared it on purpose, which means every plan the
  // card's positions and frame allow. A list is a list.
  const wanted = input.filters?.templateIds;
  const pick =
    wanted === undefined
      ? suggestTemplates(rankPositions, subValues(baseStats), baseBio.roles, height)
      : wanted.length > 0
        ? wanted
        : null;
  const templates = templatesAvailable(rankPositions, height).filter(t => !pick || pick.includes(t.id));

  /**
   * The best any chain got each fieldable stat to, read the way its floor is judged: pace off the
   * bare card, the rest as the card would be fielded.
   */
  const reached: Record<string, number> = {};
  for (const key of Object.keys(FIELDABLE_FLOORS)) reached[key] = 0;
  let visited = 0;

  // Pass one: fill the shortlists. A build is admitted to a template only if it can be made to read
  // that template's archetype — or Controlled, where the template says that is a real card too.
  forEachChain(input, (chainIds, state) => {
    const subs = subValues(state.stats);
    // What the pool reaches is measured with a style on, because that is how the card gets played:
    // 96 and 99 are the same number once a +3 style is on it, and a bar set at the bare 99 charges
    // every build for a gap that does not exist on the pitch.
    for (const [k, v] of Object.entries(bestCase(subs))) if (v > (achievable[k] ?? 0)) achievable[k] = v;

    visited += 1;
    const fielded = bestCase(subs);
    for (const key of Object.keys(FIELDABLE_FLOORS)) {
      const v = key in BARE_FLOORS ? (subs[key] ?? 0) : (fielded[key] ?? 0);
      if (v > reached[key]) reached[key] = v;
    }

    // A build you have already turned down for this card does not come back.
    const ck = canonical(chainIds);
    if (downVoted.has(ck)) return;

    const byChem = archetypesByChem(subs, height, styleOptions);
    const cand: Candidate = {
      chainIds: [...chainIds],
      ovr: state.ovr,
      igs: Object.values(subs).reduce((a, b) => a + b, 0),
      subs,
      byChem,
      bare: calculateAccelerateFamily(subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, height),
      positions: state.bio.primaryPositions.split(',').map(p => p.trim().toUpperCase()).filter(Boolean)
    };


    for (const t of templates) {
      let arch: AccelerateFamily | null = null;
      let fallback = false;
      if (byChem.has(t.archetype)) arch = t.archetype;
      else if (canFallBack(t) && byChem.has('Controlled')) {
        arch = 'Controlled';
        fallback = true;
      }
      if (!arch) continue; // the requirement, not a preference

      // Scored at its best case here, not at its bare value: the shortlist decides what survives to
      // be weighed properly, and a build that a style would carry over a floor must not be binned
      // before anything has looked at which style. The exact choice is made in pass two.
      const provisional = scoreForTemplate(bestCase(subs, t.avoid), t, () => ENDGAME_TARGET);
      const tier = tierOf(provisional.under.length === 0, fallback);
      const entry: Entry = { cand, arch, fallback };
      if (upVoted.has(ck) && !liked.has(`${t.id}|${ck}`)) liked.set(`${t.id}|${ck}`, entry);
      offer(`${t.id}|${tier}`, entry, () => provisional.score);
    }
  });

  // Pass two: re-score against what this card turned out to be able to reach. Charging a build for
  // missing 90 agility when nothing in the pool takes it past 84 is noise — the weak link should
  // mean "left on the table", not "below a line the card was never going to clear".
  const reach = (key: string) => achievable[key] ?? ENDGAME_TARGET;

  /**
   * How many of the remaining pool evos the finished card is still eligible for. Evos cap the cards
   * they accept, so a build that ends 4 OVR lower with one more upgrade still open is often the
   * better card — and that is invisible in any score of the stats alone.
   */
  const headroomOf = (chainIds: string[], full: ReturnType<typeof simulateEvoChain>) => {
    const used = new Set(chainIds);
    let open = 0;
    for (const id of poolIds) {
      if (used.has(id)) continue;
      const evo = availableEvolutions[id];
      if (!evo) continue;
      if (validateRequirement(evo, full.finalOvr, full.finalStats, full.finalPlayStyles, full.finalBio).eligible) {
        open += 1;
      }
    }
    return open;
  };

  /**
   * The style this plan would be played with, and the card as it reads under it.
   *
   * The archetype was always judged with a style on — "can be made Explosive" is what a template
   * asks. The stats were judged bare, and the two together are a contradiction: the same style that
   * earns the card its archetype is not allowed to have raised the stamina it is failed on. So the
   * style is chosen once, here, and everything after this — floors, ranking, weak link, the numbers
   * printed on the row — reads the card as it would actually be fielded.
   *
   * Only styles that still read the plan's archetype are eligible, so a style can never buy points
   * by spending the burst the plan is built on.
   */
  const playedAs = (subsIn: Record<string, number>, t: BuildTemplate, arch: AccelerateFamily) => {
    const cand = { subs: subsIn } as Candidate;
    // Pace is judged on the card as it is, whatever style is being assumed on top — a card that
    // needs Shadow to reach 93 is slow the moment the style is anything else.
    const bareShort = Object.entries(BARE_FLOORS)
      .filter(([key, floor]) => (subsIn[key] ?? 0) < floor)
      .map(([key, floor]) => ({ key, floor, value: subsIn[key] ?? 0 }));
    let best: { style: string | null; subs: Record<string, number>; s: Scored } | null = null;
    for (const [style, boosts] of styleOptions) {
      const subs = style === null ? cand.subs : withStyle(cand.subs, boosts);
      const fam = calculateAccelerateFamily(
        subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, height
      );
      if (fam !== arch) continue;
      const scored = scoreForTemplate(subs, t, reach);
      // Merged in rather than recomputed, so a style cannot carry the card over a floor that is
      // meant to be read without it.
      const s: Scored = bareShort.length === 0 ? scored : {
        ...scored,
        under: [...bareShort.filter(b => !scored.under.some(u => u.key === b.key)), ...scored.under]
      };
      // Clearing the plan's floors beats scoring well under them, the same way it does between
      // builds: a style that carries the card over a gate is the style it would be played with,
      // even where another one reads better on the stats the plan is trying to maximise.
      // Floors first, then the plan's score, then the card: two styles the plan scores identically
      // are not the same style, and one of them can be worth another 48 points of stats the plan
      // never looks at. Left as a first-past-the-post tie, which style you were told to put on
      // depended on the order of the table.
      const better =
        !best ||
        ((s.under.length === 0) !== (best.s.under.length === 0)
          ? s.under.length === 0
          : s.score !== best.s.score
            ? s.score > best.s.score
            : igsOf(subs) > igsOf(best.subs));
      if (better) best = { style, subs, s };
    }
    // Every entry reached its archetype on some style — that is how it was admitted — but a card
    // whose stats moved under it is better shown bare than dropped. The bare floors still apply.
    if (best) return best;
    const fallback = scoreForTemplate(cand.subs, t, reach);
    return {
      style: null,
      subs: cand.subs,
      s: {
        ...fallback,
        under: [...bareShort.filter(b => !fallback.under.some(u => u.key === b.key)), ...fallback.under]
      }
    };
  };

  /**
   * Where a plan is actually played, so its PlayStyles can be judged at all.
   *
   * A PlayStyle is worth what the position makes of it — Rapid on a winger and Rapid on a
   * centre-back are not the same PlayStyle — so the plan has to name a position. The card's own
   * list wins where it overlaps the plan's, because a plan that lists CAM and LW judged at LW for a
   * card that is a CAM would be answering about a card that does not exist.
   */
  const positionFor = (t: BuildTemplate, cardPositions: string[]) =>
    t.positions.find(p => cardPositions.includes(p)) || t.positions[0];

  /**
   * The finished card for a chain. Memoised on the chain *in order*, because order is exactly what
   * the swap check varies and two orders are not the same card.
   */
  const simCache = new Map<string, ReturnType<typeof simulateEvoChain> | null>();
  const simOfChain = (chainIds: string[]) => {
    const key = chainIds.join(',');
    if (simCache.has(key)) return simCache.get(key)!;
    const sim = simulateEvoChain(chainIds, baseBio, baseOvr, baseStats, basePlayStyles);
    const kept = sim.isValidChain ? sim : null;
    simCache.set(key, kept);
    return kept;
  };

  /** What this chain's PlayStyles come to under the plan, picks included. */
  const psCache = new Map<string, PsPlan>();
  const psOfChain = (
    chainIds: string[],
    sim: NonNullable<ReturnType<typeof simOfChain>>,
    t: BuildTemplate,
    style: string | null
  ): PsPlan => {
    const cardPositions = sim.finalBio.primaryPositions
      .split(',').map(p => p.trim().toUpperCase()).filter(Boolean);
    const position = positionFor(t, cardPositions);
    const key = `${chainIds.join(',')}|${position}|${style ?? ''}`;
    const hit = psCache.get(key);
    if (hit) return hit;
    // Read under the same style the rest of the row is read under: PlayStyle values are gated on
    // sub-stats, so judging them bare beside styled floors is the same contradiction that used to
    // fail a build on a stamina its own style would have carried.
    const fielded = style ? withStyleStats(sim.finalStats, chemStyles[style] || {}) : sim.finalStats;
    const plan = psPlanFor(fielded, sim.finalPlayStyles, sim.finalBio, position);
    psCache.set(key, plan);
    return plan;
  };

  /** Positions the chain hands the card that it did not start with — see `POSITION_WORTH`. */
  const positionsGained = (sim: FullChainResult | null) => {
    if (!sim) return 0;
    const got = sim.finalBio.primaryPositions
      .split(',').map((p: string) => p.trim().toUpperCase()).filter(Boolean);
    return got.filter((p: string) => !basePositions.has(p)).length;
  };

  /** The scores in one currency, which is the only place they are ever added together. */
  const totalOf = (statScore: number, ps: PsPlan, sim?: FullChainResult | null) =>
    statScore
    + (psWeight * ps.score) / 100
    + POSITION_WORTH * Math.min(positionsGained(sim ?? null), POSITIONS_COUNTED);

  /**
   * Where in the chain to make the picks.
   *
   * Slots are first-come, first-served: a PlayStyle an evo hands out takes a gold slot and does not
   * give it back. So picking the moment the picker unlocks is a different card from picking at the
   * end — it is how you stop the next three evos spending your four gold slots on Bruiser. It can
   * also cost you, which is why this is a search and not a rule: a PlayStyle a later evo would have
   * handed over for free is now locked out, and a few evos refuse cards carrying too many
   * PlayStyles, which makes the whole chain illegal.
   *
   * Every legal moment is tried, including not picking early at all, and the best finished card
   * wins. Only run on rows that are about to be shown — inside the audit the picks stay at the end,
   * where they are a floor on what the PlayStyles are worth rather than the last word.
   */
  const placePicks = (ids: string[], t: BuildTemplate, style: string | null) => {
    const evaluate = (chain: string[]) => {
      const sim = simOfChain(chain);
      if (!sim) return null;
      const ps = psOfChain(chain, sim, t, style);
      return { chain: ps.node ? [...chain, ps.node] : chain, ps };
    };

    let best = evaluate(ids);
    const done = simOfChain(ids);
    if (!best || !done) return null;

    // The picks are chosen against the *finished* card's stats even when they are made early: a
    // PlayStyle is gated on stats the rest of the chain is about to deliver, and you know that when
    // you pick. Which slots are free, on the other hand, is a fact about the moment.
    const fielded = style ? withStyleStats(done.finalStats, chemStyles[style] || {}) : done.finalStats;

    for (let i = 1; i < ids.length; i++) {
      const sim = simOfChain(ids.slice(0, i));
      if (!sim || !canPickPlayStyles(sim.finalBio.rarity)) continue;
      const position = positionFor(
        t,
        sim.finalBio.primaryPositions.split(',').map(p => p.trim().toUpperCase()).filter(Boolean)
      );
      const picks = bestFreePicks({
        stats: fielded,
        playStyles: sim.finalPlayStyles,
        bio: { ...sim.finalBio, primaryPositions: position },
        mode: controlModeFor(sim.finalBio)
      });
      if (picks.gold.length + picks.silver.length === 0) continue;

      const placed = evaluate([
        ...ids.slice(0, i),
        buildPlayStyleNodeId(picks),
        ...ids.slice(i)
      ]);
      if (placed && placed.ps.score > best.ps.score) best = placed;
    }
    // Every pick the chain now carries, wherever it was made, so the row can name them; and what
    // the card's PlayStyles came to with none of them, which is what the picks are worth.
    const picked = best.chain.filter(isPlayStyleNodeId).flatMap(id => {
      const { gold, silver } = parsePlayStyleNodeId(id);
      return [...gold.map(n => `${n}+`), ...silver];
    });
    return { ...best, picked, without: psOfChain(ids, done, t, style).before };
  };

  interface Row {
    e: Entry;
    s: Scored;
    /** The style the row is scored and printed under; null is bare. */
    style: string | null;
    /** The card under that style — what the row's numbers are. */
    subs: Record<string, number>;
    /** What its PlayStyles come to, and the picks that get them there. */
    ps: PsPlan;
  }


  /**
   * What a chain is checked for before it is offered.
   *
   * A shortlist is a set of instructions to spend evos on, and an evo is a card you do not get back.
   * Two things a ranking never notices on its own:
   *
   * A step that earns nothing. Chains are grown one evo at a time, so a step taken early for stats a
   * later one caps out anyway stays in the chain, and the score cannot tell — it only sees the end.
   * Every step is pulled out in turn and the chain re-scored without it; anything the plan does not
   * miss is dropped and named, so what is left is the shortest chain that reaches the same card.
   *
   * A step left on the table. "11 more evos still open" says a lot less than "one of them is worth
   * another +3.4", which is the difference between a finished card and one you stopped building
   * because the search ran out of depth.
   */
  const TRIM_EPS = 0.3;
  const MORE_EPS = 0.5;

  /**
   * How much card a step may quietly be adding before "the plan would not miss it" stops being a
   * reason to drop it.
   *
   * The trim exists because an evo is a card you do not get back, and a step taken for stats a later
   * one caps out anyway is one you should not spend. But it was reading "the plan does not miss it"
   * as "it does nothing", and those are different: across the library, steps the plan would not miss
   * were still worth a median of 24 IGS to the card, and as much as 426. Below this a step really is
   * doing nothing; above it, the step stays and the row says what it is and is not buying, because
   * whether that trade is worth an evo token is not a question the plan can answer.
   *
   * Size is not the whole test either — see `touchesWhatMatters`. Eight points spread over volleys
   * and aggression is nothing; eight points of acceleration is a different card.
   */
  const TRIM_IGS = 8;

  const subsOfChain = (chainIds: string[]) => {
    const sim = simOfChain(chainIds);
    if (!sim) return null;
    return { sim, subs: subValues(sim.finalStats) };
  };

  /**
   * Score a chain the way its row is scored: same plan, same archetype, best style for it — and its
   * PlayStyles alongside, because every question the audit asks is really "is this a better card",
   * and a step that fills the gold slots with the right four is a better card.
   */
  const scoreChain = (chainIds: string[], t: BuildTemplate, arch: AccelerateFamily) => {
    const got = subsOfChain(chainIds);
    if (!got) return null;
    const byChem = archetypesByChem(got.subs, height, styleOptions);
    // A trim that costs the card its archetype is not a trim, it is a different plan.
    if (!byChem.has(arch)) return null;
    const played = playedAs(got.subs, t, arch);
    const ps = psOfChain(chainIds, got.sim, t, played.style);
    return { ...got, played, ps, total: totalOf(played.s.score, ps, got.sim) };
  };

  const auditChain = (chainIds: string[], t: BuildTemplate, arch: AccelerateFamily) => {
    let ids = [...chainIds];
    let best = scoreChain(ids, t, arch)?.total ?? -Infinity;
    const dropped: string[] = [];
    /** Steps kept because they earn the plan nothing but are not doing nothing. */
    const offPlan: { name: string; igs: number }[] = [];
    /** Every stat this plan either maximises or gates on — nothing here is spare. */
    const cares = [...new Set([...Object.keys(t.maximise), ...Object.keys(floorsOf(t))])];

    // Greedy, and repeated: dropping one step can make a second one redundant too.
    //
    // Never past `locked`. Those steps are the starting point you chose — a build already under way,
    // or the point on an existing chain you asked to continue from — and an audit that decides the
    // second of them earns nothing is answering a question nobody asked: the evo is already spent.
    // Trimming it also silently moves the start, so the row that comes back is not a continuation of
    // your build at all.
    for (let pass = 0; pass < ids.length; pass++) {
      let removedOne = false;
      for (let i = locked; i < ids.length; i++) {
        if (required.has(ids[i])) continue;
        const shorter = ids.filter((_, j) => j !== i);
        if (shorter.length === 0) continue;
        const scored = scoreChain(shorter, t, arch);
        if (!scored || scored.total < best - TRIM_EPS) continue;

        // The plan would not miss it. Would the card?
        //
        // Two ways it would, and the second is the one a total hides. A step can be small and still
        // land entirely on a stat the position runs on: the plan's score credits nothing below the
        // pass mark and nothing above a stat's cap, so a step that takes acceleration from 82 to 90
        // scores exactly zero and reads as free to delete. It is not. Any loss at all on a stat this
        // plan maximises or gates keeps the step, whatever the arithmetic says.
        const whole = subsOfChain(ids);
        const cost = whole ? igsOf(whole.subs) - igsOf(scored.subs) : 0;
        const touchesWhatMatters =
          !!whole && cares.some(key => (scored.subs[key] ?? 0) < (whole.subs[key] ?? 0));
        const name = availableEvolutions[ids[i]]?.name || ids[i];
        if (cost > TRIM_IGS || touchesWhatMatters) {
          if (!offPlan.some(x => x.name === name)) offPlan.push({ name, igs: cost });
          continue;
        }

        dropped.push(name);
        ids = shorter;
        best = scored.total;
        removedOne = true;
        break;
      }
      if (!removedOne) break;
    }

    // Which steps could be done in either order.
    //
    // The order in a chain is usually forced — an evo capped at 92 OVR has to come before the one
    // that takes the card past it — but where it is not, that is worth knowing: an evening with an
    // hour in it can spend that hour on whichever of the two is the shorter grind and end up at the
    // same card.
    //
    // "The same card" is judged the way the row is judged, not stat for stat. Swapping two evos
    // almost always moves something by a point, because every boost has its own cap — of the pairs
    // in one pool where both orders were legal, none produced an identical card and half were
    // identical to the plan. So a swap is only offered when the plan cannot tell the difference,
    // *and* the card ends on the same OVR: a swap that ends a point higher has quietly spent
    // headroom the evos still to come are gated on.
    const SWAP_EPS = 0.1;
    /** True when `a` is at least `b` everywhere and better somewhere. */
    const dominates = (a: Record<string, number>, b: Record<string, number>) => {
      let strictly = false;
      for (const key of Object.keys(a)) {
        if ((a[key] ?? 0) < (b[key] ?? 0)) return false;
        if ((a[key] ?? 0) > (b[key] ?? 0)) strictly = true;
      }
      return strictly;
    };
    const swappable: [string, string][] = [];
    const asIs = scoreChain(ids, t, arch);
    const asIsOvr = subsOfChain(ids)?.sim.finalOvr;
    if (asIs && asIsOvr !== undefined) {
      for (let i = locked; i < ids.length - 1; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          if (ids[i] === ids[j]) continue;
          const swapped = [...ids];
          [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
          const other = scoreChain(swapped, t, arch);
          const otherSim = subsOfChain(swapped);
          if (!other || !otherSim) continue;
          if (otherSim.sim.finalOvr !== asIsOvr) continue;
          if (other.total < asIs.total - SWAP_EPS) continue;
          // Nor when one order is simply the better card. The plan not being able to tell them
          // apart is not the same as their being the same: if every sub-stat of one is at least as
          // high as the other's and one is higher, the lower one is a mistake rather than a choice,
          // however little the plan cares about the stats it lost.
          if (dominates(asIs.subs, otherSim.subs) || dominates(otherSim.subs, asIs.subs)) continue;
          swappable.push([
            availableEvolutions[ids[i]]?.name || ids[i],
            availableEvolutions[ids[j]]?.name || ids[j]
          ]);
        }
      }
    }

    // What one more evo out of the pool would still be worth.
    //
    // `psFix` is the same question asked of one kind of evo only: the ones that convert the card's
    // rarity to one that hands out the PlayStyle picker. It has to be asked separately, and in its
    // own currency, because PlayStyles no longer count towards the ranking — so the evo that fixes
    // a set of gold slots spent on nothing will never be the highest-scoring addition. It is judged
    // on what it does to the PlayStyles, and only rejected if it costs the stats something real.
    let more: { name: string; gain: number } | null = null;
    let psFix: { name: string; costs: number; from: number; to: number } | null = null;
    const used = new Set(ids);
    const after = subsOfChain(ids);
    const canPickAlready = canPickPlayStyles(after?.sim.finalBio.rarity ?? '');
    /** Where the PlayStyles stand without it — what a conversion would be improving on. */
    const psNow = scoreChain(ids, t, arch)?.ps.score ?? 0;
    /** Worth mentioning only if it moves the PlayStyles this far, and costs the stats no more. */
    const PS_FIX_GAIN = 5;
    const PS_FIX_COST = 0.5;
    if (after) {
      for (const id of poolIds) {
        if (used.has(id)) continue;
        const evo = availableEvolutions[id];
        if (!evo) continue;
        if (!validateRequirement(evo, after.sim.finalOvr, after.sim.finalStats, after.sim.finalPlayStyles, after.sim.finalBio).eligible) continue;
        const scored = scoreChain([...ids, id], t, arch);
        if (!scored) continue;
        const gain = scored.total - best;
        if (gain >= MORE_EPS && (!more || gain > more.gain)) more = { name: evo.name, gain };
        if (
          !canPickAlready &&
          evo.rarityChange &&
          FREE_PLAYSTYLE_RARITIES.includes(evo.rarityChange) &&
          scored.ps.score - psNow >= PS_FIX_GAIN &&
          gain >= -PS_FIX_COST &&
          (!psFix || scored.ps.score > psFix.to)
        ) {
          psFix = { name: evo.name, costs: gain, from: psNow, to: scored.ps.score };
        }
      }
    }

    return { ids, dropped, offPlan, more, swappable, psFix };
  };

  /** One template's answer: its frontier of real choices, best first. */
  interface Answer {
    t: BuildTemplate;
    rows: Row[];
  }

  const answers: Answer[] = [];

  for (const t of templates) {
    // Builds that clear the plan's floors come first, then the rest — rather than one pile winning
    // outright. Picking only the clean pile would let a single build that scrapes over a floor hide
    // four better ones, and picking only the best pile would bury the fact that a card cannot reach
    // the bar at all. Every row says which side of it that build is on.
    //
    // The tier is settled here rather than at shortlist time: the search bucketed builds by their
    // best case, and which side of the floors a build is really on is only known once its style is
    // chosen.
    const scored = TIERS.flatMap(tier => shortlists.get(`${t.id}|${tier}`) || [])
      .map(e => {
        const played = playedAs(e.cand.subs, t, e.arch);
        const sim = simOfChain(e.cand.chainIds);
        const ps = sim
          ? psOfChain(e.cand.chainIds, sim, t, played.style)
          : { score: 0, before: 0, canPick: false, picks: { gold: [], silver: [] }, node: null, wasted: [], missing: [], emptyGold: 0 };
        return {
          e,
          s: played.s,
          style: played.style,
          subs: played.subs,
          ps,
          total: totalOf(played.s.score, ps, sim),
          tierIdx: TIERS.indexOf(tierOf(played.s.under.length === 0, e.fallback))
        };
      })
      // Under a plan's own floor is a build you should be told about — it is the plan you asked for,
      // played short. Under a fieldable floor is not a build at all: a card that cannot run, cannot
      // last the game or cannot keep the ball is not recommended with a note, it is not recommended.
      .filter(row => !row.s.under.some(u => u.key in FIELDABLE_FLOORS))
      // The same tie-break again, one level up: two builds the plan scores identically are ordered
      // by which leaves more card behind.
      .sort((a, b) => a.tierIdx - b.tierIdx || b.total - a.total || igsOf(b.subs) - igsOf(a.subs));
    if (scored.length === 0) continue;

    // Inside a template, drop anything another build beats outright — same or better on every
    // stat the plan is built on, and no more evos. What is left is a set of real choices.
    const axes = Object.keys(t.maximise);
    const axesOf = (subs: Record<string, number>) => axes.map(k => subs[k] ?? 0);
    const frontier = scored.filter(({ e, tierIdx, subs, ps }) =>
      !scored.some(({ e: o, tierIdx: oTier, subs: oSubs, ps: oPs }) => {
        // A build that misses a floor never knocks out one that clears it, however good its numbers
        // on the axes look — that is the whole point of having a floor.
        if (o.cand === e.cand || oTier > tierIdx) return false;
        const a = axesOf(oSubs);
        const b = axesOf(subs);
        const pairs: [number, number][] = [
          ...a.map((v, i) => [v, b[i]] as [number, number]),
          [e.cand.chainIds.length, o.cand.chainIds.length]
        ];
        return pairs.every(([x, y]) => x >= y) && pairs.some(([x, y]) => x > y);
      })
    );

    // A build that reached the plan's archetype answers the plan; one that fell back to Controlled
    // is the consolation. So the fallbacks are held back while anything reached it — and shown, all
    // of them, when nothing did, because "here is the best card this pool builds, and it is not
    // Explosive" is an answer and an empty list is not.
    const reached = frontier.filter(row => !row.e.fallback);
    const choices = t.controlledFallback || reached.length === 0 ? frontier : reached;

    // Then thin it to choices a person would actually weigh. Two builds a point apart on every axis
    // are one build shown twice, and a shortlist of those is the thing that wastes an evening.
    const rows: Row[] = [];
    for (const row of choices) {
      const mine = axesOf(row.subs);
      const dup = rows.some(kept => {
        const theirs = axesOf(kept.subs);
        return mine.every((v, i) => Math.abs(v - theirs[i]) <= SAME_BUILD)
          && Math.abs(igsOf(kept.subs) - igsOf(row.subs)) <= SAME_IGS
          && kept.e.cand.chainIds.length === row.e.cand.chainIds.length;
      });
      if (dup) continue;
      rows.push(row);
      if (rows.length >= OUT_PER_TEMPLATE) break;
    }

    // A build you liked is on the list whatever the thinning made of it.
    for (const [key, entry] of liked) {
      if (!key.startsWith(`${t.id}|`)) continue;
      if (rows.some(r => r.e.cand === entry.cand)) continue;
      const scoredLike = scoreChain(entry.cand.chainIds, t, entry.arch);
      if (!scoredLike) continue;
      rows.push({
        e: entry,
        s: scoredLike.played.s,
        style: scoredLike.played.style,
        subs: scoredLike.played.subs,
        ps: scoredLike.ps
      });
    }

    if (rows.length > 0) answers.push({ t, rows });
  }

  /**
   * Audit first, then rank. The audit changes the chain — it drops steps the plan would not miss —
   * so a build's real score is only known after it, and ranking on the score it had before means
   * the row printed #1 can be beaten by the one printed #2. The trim is also where the style is
   * settled for good: a shorter chain is a different card and can want a different one.
   */
  const prepared = answers
    .map(({ t, rows }) => {
      // Two rows can trim down to the same chain — the same build offered twice is not a choice.
      const emitted = new Set<string>();
      const built = [];
      for (const row of rows) {
        const checked = auditChain(row.e.cand.chainIds, t, row.e.arch);
        const key = canonical(checked.ids);
        if (emitted.has(key)) continue;
        emitted.add(key);

        const rescored = scoreChain(checked.ids, t, row.e.arch);
        const s = rescored?.played.s ?? row.s;
        const subs = rescored?.played.subs ?? row.subs;
        const style = rescored?.played.style ?? row.style;
        // Only now, on a chain that is going to be shown, is it worth searching for where the
        // picks belong — inside the audit they stay at the end, where they cost one simulation.
        // The picks are a service, not a vote: they change which PlayStyles the finished card
        // carries, never which build was chosen.
        const placed = placePicks(checked.ids, t, style);
        const ps = placed?.ps ?? rescored?.ps ?? row.ps;
        built.push({
          e: row.e,
          checked,
          placed,
          s,
          subs,
          ps,
          style,
          total: totalOf(s.score, ps, rescored?.sim ?? simOfChain(checked.ids)),
          tierIdx: TIERS.indexOf(tierOf(s.under.length === 0, row.e.fallback))
        });
      }
      built.sort((a, b) => a.tierIdx - b.tierIdx || b.total - a.total);
      return { t, built };
    })
    .filter(a => a.built.length > 0);

  // Best plan first, so #1 is the best card this pool can build and not merely the first template
  // in the file. A chain that answers two plans is listed under both — being the best playmaker and
  // the best CAM is two different things to know, and hiding the second is how the CAM list ends up
  // empty for a card that is obviously a CAM.
  prepared.sort((a, b) => (b.built[0]?.total ?? 0) - (a.built[0]?.total ?? 0));

  const out: EvolutionPath[] = [];
  let rank = 0;

  for (const { t, built } of prepared) {
    const best = built[0];

    for (const row of built) {
      const { e, style, s, subs, ps, checked } = row;
      const cand = e.cand;
      const chainIds = checked.ids;
      rank += 1;

      // The picks travel with the build. A card that can assign its own PlayStyles and is handed a
      // chain without them is a recommendation you have to finish by hand, one PlayStyle at a time,
      // re-reading the position to remember which four — which is the work this is meant to do.
      const withPicks = row.placed?.chain ?? chainIds;
      const full = simulateEvoChain(withPicks, baseBio, baseOvr, baseStats, basePlayStyles);
      // The style the row is scored under, named — it is an instruction, not a footnote: the same
      // build read bare is a different card, and often a failing one.
      const how = style === null ? 'bare' : `on ${style}`;
      // How much room is left before the archetype breaks. On an Explosive card every point of
      // strength eats this margin, which is the thing a stat total can never tell you.
      const agi = subs.agility ?? 0;
      const str = subs.strength ?? 0;
      const margin =
        e.arch === 'Explosive' ? ` · agi ${agi} − str ${str} = +${agi - str}`
        : e.arch === 'Lengthy' ? ` · str ${str} − agi ${agi} = +${str - agi}`
        : '';
      const archNote =
        (e.fallback ? `${e.arch} ${how} (no ${t.archetype} on this card)` : `${e.arch} ${how}`) + margin;

      const topStats = Object.keys(t.maximise).slice(0, 5);
      // Stamina is printed on every row whether or not the plan leans on it, because it is the one
      // gate that applies to all of them and "clears the bar" should never have to be taken on trust.
      const shown = topStats.includes('stamina') ? topStats : [...topStats, 'stamina'];
      const statLine = shown.map(k => `${prettySub(k)} ${subs[k] ?? 0}`).join(' · ');

      const delta = best && row !== best
        ? topStats
            .map(k => ({ k, d: (subs[k] ?? 0) - (best.subs[k] ?? 0) }))
            .filter(x => x.d !== 0)
            .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
            .slice(0, 3)
            .map(x => `${x.d > 0 ? '+' : ''}${x.d} ${prettySub(x.k)}`)
            .join(', ')
        : '';

      // What the style is actually carrying: floors the bare card misses and it clears. Without
      // this the row reads "all pass" next to a stat panel showing the bare number that doesn't.
      const bare = scoreForTemplate(cand.subs, t, reach);
      const carried = style
        ? bare.under
            .filter(u => !s.under.some(x => x.key === u.key))
            .map(u => `${prettySub(u.key)} ${u.value}→${subs[u.key] ?? 0}`)
        : [];

      const verdict = s.under.length > 0
        ? `FAILS ${s.under.slice(0, 3).map(u => `${prettySub(u.key)} ${u.value}/${u.floor}`).join(', ')}`
        : s.left
          ? `all pass · gives up ${prettySub(s.left.key)} ${s.left.value} (${s.left.reach} reachable)`
          : 'all pass · nothing left on the table';

      // What the PlayStyles come to, and how they got there. Three different answers, because they
      // send you somewhere different: picks made for you, a picker with nothing left worth using,
      // or a set you are stuck with and why — the gold slots an evo spent on nothing, or the
      // PlayStyles this position wants that nothing in the chain hands out.
      const psNote = (() => {
        const at = `PS ${ps.score.toFixed(1)}/100`;
        const picked = row.placed?.picked ?? [];
        if (picked.length > 0) {
          // Where the picks sit is part of the instruction, not a detail: taking them mid-chain is
          // what stops the evos after it filling those slots with something you did not choose.
          const pickAt = withPicks.findIndex(isPlayStyleNodeId);
          const when = pickAt < chainIds.length
            ? ` right after ${availableEvolutions[chainIds[pickAt - 1]]?.name || `step ${pickAt}`}`
            : '';
          return `${at} · pick ${picked.join(', ')}${when} (${(row.placed?.without ?? ps.before).toFixed(1)} without)`;
        }
        if (ps.canPick) return `${at} · free picks, nothing left worth adding`;
        // Only worth saying while there is something to be done about it. A card holding a
        // PlayStyle this position ignores and still scoring 95 has not wasted anything that
        // matters, and the note reads as a contradiction next to the number.
        if (ps.score >= 90) return at;
        if (ps.wasted.length > 0) return `${at} · gold slots spent on ${ps.wasted.join(', ')}`;
        if (ps.missing.length > 0) return `${at} · no ${ps.missing.join('/')}`;
        return at;
      })();

      const gained = full.finalBio.primaryPositions
        .split(',').map(p => p.trim().toUpperCase()).filter(p => p && !basePositions.has(p));
      // Counted on the evos alone. A PlayStyle pick is not an evo, but some evos cap how many
      // PlayStyles the card they accept may carry, so filling the slots can close a door — worth a
      // line of its own rather than a headroom number that quietly went down.
      const noPicks = simulateEvoChain(chainIds, baseBio, baseOvr, baseStats, basePlayStyles);
      const open = headroomOf(chainIds, noPicks);
      const closes = ps.node ? open - headroomOf(chainIds, full) : 0;
      const evoNames = chainIds.map(id => availableEvolutions[id]?.name || id).join(' ➜ ');

      out.push({
        id: `v2-path-${Date.now()}-${rank}`,
        name: `#${rank}`,
        description:
          `${upVoted.has(canonical(chainIds)) ? '★ you liked this · ' : ''}` +
          `${t.name} · +${s.score.toFixed(1)} over 90 · ${verdict}` +
          `${carried.length > 0 ? ` · ${style} carries ${carried.join(', ')}` : ''}` +
          `${delta ? ` · ${delta} vs best` : ''}` +
          ` · ${psNote}` +
          `${checked.psFix
            ? ` · PS fix: ${checked.psFix.name} unlocks free picks — PS ${checked.psFix.from.toFixed(1)}→${checked.psFix.to.toFixed(1)}` +
              `${checked.psFix.costs < 0 ? ` for ${checked.psFix.costs.toFixed(1)} on the stats` : ''}`
            : ''}` +
          `${closes > 0 ? ` · picks close ${closes} later evo${closes > 1 ? 's' : ''}` : ''}` +
          ` · ${archNote} · OVR ${cand.ovr} · IGS ${cand.igs} · ${statLine}` +
          `${gained.length > 0 ? ` · +${gained.join('/')}` : ''}` +
          `${checked.dropped.length > 0 ? ` · dropped ${checked.dropped.join(', ')} (worth nothing here)` : ''}` +
          `${checked.offPlan.length > 0
            ? ` · ${checked.offPlan.map(x => `${x.name} adds nothing this plan uses (+${x.igs} elsewhere)`).join(', ')}`
            : ''}` +
          `${checked.more ? ` · one more worth +${checked.more.gain.toFixed(1)}: ${checked.more.name}` : ''}` +
          `${checked.swappable.length > 0
            ? ` · either order: ${checked.swappable.map(([a, b]) => `${a} ⇄ ${b}`).join(', ')}`
            : ''}` +
          ` · ${costOf(chainIds)} · ${open} more evos still open — ${evoNames}`,
        isRecommended: true,
        chemStyle: style,
        chainIds: [...withPicks],
        steps: full.steps
      });
    }
  }

  input.report?.({
    visited,
    floors: Object.entries(FIELDABLE_FLOORS).map(([key, floor]) => ({ key, floor, best: reached[key] }))
  });

  return out;
}
