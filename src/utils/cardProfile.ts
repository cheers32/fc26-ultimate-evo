import { BUILD_TEMPLATES, BuildTemplate, PASS_MARK, archetypePossible, floorsOf } from '../data/buildTemplates';
import { AccelerateFamily, calculateAccelerateFamily } from './statUtils';
import { chemStyles } from '../data/chemStyles';

/**
 * What a card already is, as opposed to what it could be built into.
 *
 * These are two different questions and the same rules cannot answer both. When *planning* — which
 * evos to spend on a card — the archetype has to be a hard gate: a 180cm card should never be handed
 * a Lengthy destroyer plan, because following it means paying for strength that the card can never
 * cash in as an archetype. That gate is what stops the shortlist filling up with cards nobody would
 * field, and it stays exactly as it is in analyzeV2.
 *
 * Applied to a card that is already built, the same gate gives a wrong answer. A 174cm Matthäus with
 * 99 interceptions and 96 strength is not "unsuitable for the Anchor CDM plan" — he already has the
 * profile, at no further cost, and nothing about his height changes what those numbers do. Judged
 * under the planning rules he was scored 7.2 as a mediocre playmaker, the one plan his frame let
 * through, while the profile he actually has scored 8.2 and was never shown.
 *
 * So judging drops the archetype gate and keeps the archetype as a fact. Every plan the card's
 * positions allow is scored, the best-fitting one names what the card is, and the archetype is
 * reported alongside — "an Anchor CDM's numbers, moving Controlled rather than Lengthy" says more
 * than either half on its own.
 */
export interface PlanFit {
  template: BuildTemplate;
  /** Average points above the pass mark on the stats this plan runs on, before any penalty. */
  score: number;
  /** Floors this card is under, worst first. */
  under: { key: string; value: number; floor: number }[];
  /** How the card stands to this plan's archetype. */
  archetype: 'reads' | 'with-style' | 'frame' | 'stats';
}

export interface CardProfile {
  /** Best-fitting plans, best first. */
  fits: PlanFit[];
  /** What the card reads bare, and what any chemistry style could make it. */
  bare: AccelerateFamily;
  reachable: AccelerateFamily[];
}

/** Every archetype some chemistry style could put this card on. The style is free at point of use. */
function archetypesByChem(subs: Record<string, number>, heightCm?: number): Set<AccelerateFamily> {
  const out = new Set<AccelerateFamily>();
  for (const boosts of Object.values(chemStyles)) {
    const cap = (v: number, k: string) => Math.min(99, v + (boosts[k] || 0));
    out.add(
      calculateAccelerateFamily(
        cap(subs.acceleration ?? 50, 'acceleration'),
        cap(subs.agility ?? 50, 'agility'),
        cap(subs.strength ?? 50, 'strength'),
        heightCm
      )
    );
  }
  return out;
}

/**
 * Which plans this card's numbers actually match, best first.
 *
 * Scored on the same scale as the recommendations — points above 90, with the worst floor miss
 * charged against it — so a fit here and a row from Analyze mean the same thing.
 */
export function profileCard(
  subs: Record<string, number>,
  positions: string[],
  heightCm?: number
): CardProfile {
  const own = new Set(positions.map(p => p.trim().toUpperCase()).filter(Boolean));
  const reachable = archetypesByChem(subs, heightCm);
  const bare = calculateAccelerateFamily(
    subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, heightCm
  );

  const fits = BUILD_TEMPLATES.filter(t => t.positions.some(p => own.has(p))).map(t => {
    let raw = 0;
    let total = 0;
    for (const [key, w] of Object.entries(t.maximise)) {
      raw += Math.max(0, (subs[key] ?? 0) - PASS_MARK) * w;
      total += w;
    }
    const floors = floorsOf(t);
    const under = Object.entries(floors)
      .map(([key, floor]) => ({ key, floor, value: subs[key] ?? 0 }))
      .filter(x => x.value < x.floor)
      .sort((a, b) => (b.floor - b.value) - (a.floor - a.value));

    // Why the card is or is not on this plan's archetype, kept apart from the score. "frame" is the
    // one that cannot be fixed: no evo and no style moves height.
    const archetype: PlanFit['archetype'] =
      bare === t.archetype ? 'reads'
      : reachable.has(t.archetype) ? 'with-style'
      : !archetypePossible(t.archetype, heightCm) ? 'frame'
      : 'stats';

    return {
      template: t,
      score: (total > 0 ? raw / total : 0) - under.reduce((m, u) => Math.max(m, u.floor - u.value), 0),
      under,
      archetype
    };
  });

  fits.sort((a, b) => b.score - a.score);
  return { fits, bare, reachable: [...reachable] };
}

/** One line for the card: what it is, how well, and how it moves. */
export function describeProfile(profile: CardProfile): string {
  const best = profile.fits[0];
  if (!best) return '';
  const note =
    best.archetype === 'reads' ? profile.bare
    : best.archetype === 'with-style' ? `${best.template.archetype} with a style`
    : `${profile.bare}, not ${best.template.archetype}`;
  return `${best.template.name} +${best.score.toFixed(1)} · ${note}`;
}
