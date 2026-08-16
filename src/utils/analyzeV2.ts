import { EvolutionDefinition, EvolutionPath, PlayerBio, StatsData } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';
import { chemStyles } from '../data/chemStyles';
import { STYLE_OPTIONS, optimistic, withStyle } from './chem';
import { ChainSearchInput, forEachChain, simulateEvoChain, validateRequirement } from './evoEngine';
import {
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
 * PlayStyles are deliberately absent — only stats and AcceleRATE, as asked — which also means
 * every number in a reason can be checked against the stat panel rather than taken on faith.
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
 * What a point of a stat is worth to a plan, counted from the pass mark rather than from zero.
 *
 * This is the difference between an end-game ranking and a spreadsheet. Scored from zero, 97 and 98
 * are within one percent of each other and the ranking barely notices; scored from 90 they are 7
 * and 8, and the second card is an eighth better at the thing it is for. Nothing is credited below
 * the pass mark, so a build cannot make up a failing stat by piling points onto a passing one.
 */
const valueOf = (v: number) => Math.max(0, v - ENDGAME_TARGET);

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
  heightCm?: number
): Map<AccelerateFamily, string[]> {
  const out = new Map<AccelerateFamily, string[]>();
  const acc = subs.acceleration ?? 50;
  const agi = subs.agility ?? 50;
  const str = subs.strength ?? 50;

  for (const [name, boosts] of Object.entries(chemStyles)) {
    const cap = (base: number, key: string) => Math.min(99, base + (boosts[key] || 0));
    const fam = calculateAccelerateFamily(
      cap(acc, 'acceleration'), cap(agi, 'agility'), cap(str, 'strength'), heightCm
    );
    const list = out.get(fam) || [];
    list.push(name);
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

export function analyzeEvolutionsV2(input: ChainSearchInput & { feedback?: V2Feedback }): EvolutionPath[] {
  const { baseBio, baseOvr, baseStats, basePlayStyles, poolIds } = input;
  const height = parseHeightCm(baseBio.height);

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
      if (score(entry.cand) <= score(list[at].cand)) return;
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

  // Pass one: fill the shortlists. A build is admitted to a template only if it can be made to read
  // that template's archetype — or Controlled, where the template says that is a real card too.
  forEachChain(input, (chainIds, state) => {
    const subs = subValues(state.stats);
    // What the pool reaches is measured with a style on, because that is how the card gets played:
    // 96 and 99 are the same number once a +3 style is on it, and a bar set at the bare 99 charges
    // every build for a gap that does not exist on the pitch.
    for (const [k, v] of Object.entries(optimistic(subs))) if (v > (achievable[k] ?? 0)) achievable[k] = v;

    // A build you have already turned down for this card does not come back.
    const ck = canonical(chainIds);
    if (downVoted.has(ck)) return;

    const byChem = archetypesByChem(subs, height);
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
      const provisional = scoreForTemplate(optimistic(subs, t.avoid), t, () => ENDGAME_TARGET);
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
  const playedAs = (cand: Candidate, t: BuildTemplate, arch: AccelerateFamily) => {
    let best: { style: string | null; subs: Record<string, number>; s: Scored } | null = null;
    for (const [style, boosts] of STYLE_OPTIONS) {
      const subs = style === null ? cand.subs : withStyle(cand.subs, boosts);
      const fam = calculateAccelerateFamily(
        subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, height
      );
      if (fam !== arch) continue;
      const s = scoreForTemplate(subs, t, reach);
      // Clearing the plan's floors beats scoring well under them, the same way it does between
      // builds: a style that carries the card over a gate is the style it would be played with,
      // even where another one reads better on the stats the plan is trying to maximise.
      const better =
        !best ||
        (s.under.length === 0) !== (best.s.under.length === 0)
          ? !best || s.under.length === 0
          : s.score > best.s.score;
      if (better) best = { style, subs, s };
    }
    // Every entry reached its archetype on some style — that is how it was admitted — but a card
    // whose stats moved under it is better shown bare than dropped.
    return best ?? { style: null, subs: cand.subs, s: scoreForTemplate(cand.subs, t, reach) };
  };

  interface Row {
    e: Entry;
    s: Scored;
    /** The style the row is scored and printed under; null is bare. */
    style: string | null;
    /** The card under that style — what the row's numbers are. */
    subs: Record<string, number>;
  }

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
        const played = playedAs(e.cand, t, e.arch);
        return {
          e,
          s: played.s,
          style: played.style,
          subs: played.subs,
          tierIdx: TIERS.indexOf(tierOf(played.s.under.length === 0, e.fallback))
        };
      })
      // Under a plan's own floor is a build you should be told about — it is the plan you asked for,
      // played short. Under a fieldable floor is not a build at all: a card that cannot run, cannot
      // last the game or cannot keep the ball is not recommended with a note, it is not recommended.
      .filter(row => !row.s.under.some(u => u.key in FIELDABLE_FLOORS))
      .sort((a, b) => a.tierIdx - b.tierIdx || b.s.score - a.s.score);
    if (scored.length === 0) continue;

    // Inside a template, drop anything another build beats outright — same or better on every
    // stat the plan is built on, and no more evos. What is left is a set of real choices.
    const axes = Object.keys(t.maximise);
    const axesOf = (subs: Record<string, number>) => axes.map(k => subs[k] ?? 0);
    const frontier = scored.filter(({ e, tierIdx, subs }) =>
      !scored.some(({ e: o, tierIdx: oTier, subs: oSubs }) => {
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
      const played = playedAs(entry.cand, t, entry.arch);
      rows.push({ e: entry, s: played.s, style: played.style, subs: played.subs });
    }

    if (rows.length > 0) answers.push({ t, rows });
  }

  // Best plan first, so #1 is the best card this pool can build and not merely the first template
  // in the file. A chain that answers two plans is listed under both — being the best playmaker and
  // the best CAM is two different things to know, and hiding the second is how the CAM list ends up
  // empty for a card that is obviously a CAM.
  answers.sort((a, b) => (b.rows[0]?.s.score ?? 0) - (a.rows[0]?.s.score ?? 0));

  const out: EvolutionPath[] = [];
  let rank = 0;

  for (const { t, rows } of answers) {
    const best = rows[0];

    for (const { e, s, style, subs } of rows) {
      const cand = e.cand;
      rank += 1;
      const full = simulateEvoChain(cand.chainIds, baseBio, baseOvr, baseStats, basePlayStyles);
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

      const delta = best && cand !== best.e.cand
        ? topStats
            .map(k => ({ k, d: (subs[k] ?? 0) - (best.subs[k] ?? 0) }))
            .filter(x => x.d !== 0)
            .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
            .slice(0, 3)
            .map(x => `${x.d > 0 ? '+' : ''}${x.d} ${prettySub(x.k)}`)
            .join(', ')
        : '';

      const verdict = s.under.length > 0
        ? `FAILS ${s.under.slice(0, 3).map(u => `${prettySub(u.key)} ${u.value}/${u.floor}`).join(', ')}`
        : s.left
          ? `all pass · gives up ${prettySub(s.left.key)} ${s.left.value} (${s.left.reach} reachable)`
          : 'all pass · nothing left on the table';

      const gained = cand.positions.filter(p => !basePositions.has(p));
      const open = headroomOf(cand.chainIds, full);
      const evoNames = cand.chainIds.map(id => availableEvolutions[id]?.name || id).join(' ➜ ');

      out.push({
        id: `v2-path-${Date.now()}-${rank}`,
        name: `#${rank}`,
        description:
          `${upVoted.has(canonical(cand.chainIds)) ? '★ you liked this · ' : ''}` +
          `${t.name} · +${s.score.toFixed(1)} over 90 · ${verdict}` +
          `${delta ? ` · ${delta} vs best` : ''}` +
          ` · ${archNote} · OVR ${cand.ovr} · IGS ${cand.igs} · ${statLine}` +
          `${gained.length > 0 ? ` · +${gained.join('/')}` : ''}` +
          ` · ${costOf(cand.chainIds)} · ${open} more evos still open — ${evoNames}`,
        isRecommended: true,
        chainIds: [...cand.chainIds],
        steps: full.steps
      });
    }
  }

  return out;
}
