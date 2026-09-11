import { EvolutionDefinition } from '../types/player';
import { availableEvolutions } from '../data/evolutionsData';

/**
 * Running an evo part-way.
 *
 * An evo's levels are claimed one at a time in game and nothing forces you to finish: Mr.
 * Undroppable hands out Agility at level 5, and a fullback who stops at four keeps the
 * agility-over-strength lead that decides his AcceleRATE. The engine used to apply an evo whole or
 * not at all, so that build could not be written down.
 *
 * The levels are stored as printed text — 'Agility +30 (97)' — and the boosts as data, and the two
 * are kept apart on purpose here: **the level lines decide which stats are in, the declared
 * `subStatBoosts` decide by how much.** Parsing a printed number and applying it would put a second
 * source of truth next to the first, and the printed line is the one nobody checks.
 *
 * That only works while every declared boost is named by some level. `levelPlan` says whether it is,
 * and callers hide the control when it isn't — three evos in the pool fail it today (two
 * goalkeeper ones whose levels print stats the definition never declares, and Passing the Test,
 * whose levels are missing a face its data has).
 */

const SUB_ALIASES: [string, string[]][] = [
  ['acceleration', ['Acceleration']], ['sprintSpeed', ['Sprint Speed']],
  ['positioning', ['Att. Position', 'Attacking Position', 'Positioning']], ['finishing', ['Finishing']],
  ['shotPower', ['Shot Power']], ['longShots', ['Long Shots']], ['volleys', ['Volleys']],
  ['penalties', ['Penalties']], ['vision', ['Vision']], ['crossing', ['Crossing']],
  ['freekick', ['FK Acc.', 'FK. Acc.', 'FK Accuracy', 'Free Kick', 'Free Kick Acc.', 'Free Kick Accuracy']],
  ['shortPass', ['Short Pass', 'Short Passing']], ['longPass', ['Long Pass', 'Long Passing']],
  ['curve', ['Curve']], ['agility', ['Agility']], ['balance', ['Balance']], ['reactions', ['Reactions']],
  ['ballControl', ['Ball Control']], ['dribbling', ['Dribbling', 'Drib.']], ['composure', ['Composure']],
  ['interceptions', ['Interceptions']], ['headingAcc', ['Heading Acc.', 'Heading Accuracy']],
  ['defAwareness', ['Def. Aware', 'Def. Awareness', 'Defensive Awareness']],
  ['standTackle', ['Stand Tackle', 'Standing Tackle']], ['slideTackle', ['Slide Tackle', 'Sliding Tackle']],
  ['jumping', ['Jumping']], ['stamina', ['Stamina']], ['strength', ['Strength']], ['aggression', ['Aggression']],
  ['diving', ['Diving']], ['handling', ['Handling']], ['kicking', ['Kicking']], ['reflexes', ['Reflexes']],
  ['gkPositioning', ['GK Positioning']], ['speed', ['GK Speed']]
];
const FACE_ALIASES: [string, string[]][] = [
  ['pac', ['PAC', 'Pace']], ['sho', ['SHO', 'Shooting']], ['pas', ['PAS', 'Passing']],
  ['dri', ['DRI', 'Dribbling']], ['def', ['DEF', 'Defending']], ['phy', ['PHY', 'Physical']]
];
/** Lines that say something real about the level but move no stat. */
const IGNORED = /^(PlayStyle\+?:|Positions?\b|Alt\.? ?Positions?\b|Rarity\b|Role:|→|Challenge\b|No challenges|No upgrades)/i;

type Parsed =
  | { kind: 'ignore' }
  | { kind: 'ovr' } | { kind: 'weakFoot' } | { kind: 'skillMoves' }
  | { kind: 'sub'; key: string } | { kind: 'face'; key: string }
  | { kind: 'either'; sub: string; face: string }
  | { kind: 'unparsed'; raw: string };

/** One printed upgrade line, as what it moves. The magnitude is deliberately dropped. */
export function parseLevelLine(line: string): Parsed {
  const text = line.trim();
  if (IGNORED.test(text)) return { kind: 'ignore' };
  const m = /^(.+?)\s*([+-]\d+)\s*(?:\((\d+)\))?$/.exec(text);
  if (!m) return { kind: 'unparsed', raw: text };
  let name = m[1].trim().replace(/:$/, '');
  // 'Physical Face +30 (89)' names the face outright, which settles Dribbling and Physical.
  let facePrinted = false;
  const faceSuffix = /^(.+?)\s+Face$/i.exec(name);
  if (faceSuffix) { name = faceSuffix[1].trim(); facePrinted = true; }
  if (/^(OVR|Overall Rating)$/i.test(name)) return { kind: 'ovr' };
  if (/^Weak Foot$/i.test(name)) return { kind: 'weakFoot' };
  if (/^(Skill Moves|Skills)$/i.test(name)) return { kind: 'skillMoves' };
  // 'Passing/Kicking +20' — one line for the outfield stat and the keeper one.
  const halves = name.split('/').map(x => x.trim()).filter(Boolean);
  if (halves.length > 1) {
    for (const half of halves) {
      const r = parseLevelLine(`${half} ${m[2]}`);
      if (r.kind !== 'unparsed') return r;
    }
  }
  const lc = name.toLowerCase();
  const face = FACE_ALIASES.find(([, al]) => al.some(a => a.toLowerCase() === lc));
  const sub = SUB_ALIASES.find(([, al]) => al.some(a => a.toLowerCase() === lc));
  if (facePrinted && face) return { kind: 'face', key: face[0] };
  if (sub && face) return { kind: 'either', sub: sub[0], face: face[0] };
  if (sub) return { kind: 'sub', key: sub[0] };
  if (face) return { kind: 'face', key: face[0] };
  return { kind: 'unparsed', raw: text };
}

export interface LevelSlice {
  subs: string[];
  faces: string[];
  ovr: boolean;
  weakFoot: boolean;
  skillMoves: boolean;
  /** PlayStyles granted at this level, by the name printed after 'PlayStyle+:' / 'PlayStyle:'. */
  playStyles: string[];
}
export interface LevelPlan {
  /** Every declared boost is named by some level, so a partial run can be trusted. */
  complete: boolean;
  slices: LevelSlice[];
}

const planCache = new Map<string, LevelPlan>();

/** What each level of an evo turns on, and whether the levels account for all of its data. */
export function levelPlan(evo: EvolutionDefinition): LevelPlan {
  const held = planCache.get(evo.id);
  if (held) return held;
  const subKeys = new Set(Object.keys(evo.subStatBoosts ?? {}));
  const faceKeys = new Set(Object.keys(evo.faceBoosts ?? {}));
  const slices: LevelSlice[] = [];
  let clean = true;
  for (const level of evo.levels ?? []) {
    const slice: LevelSlice = { subs: [], faces: [], ovr: false, weakFoot: false, skillMoves: false, playStyles: [] };
    for (const line of level.upgrades) {
      const ps = /^PlayStyle\+?:\s*(.+?)\s*(?:\(\d+\))?$/i.exec(line.trim());
      if (ps) { slice.playStyles.push(ps[1].trim()); continue; }
      const r = parseLevelLine(line);
      if (r.kind === 'ovr') slice.ovr = true;
      else if (r.kind === 'weakFoot') slice.weakFoot = true;
      else if (r.kind === 'skillMoves') slice.skillMoves = true;
      else if (r.kind === 'sub') { if (subKeys.has(r.key)) slice.subs.push(r.key); else clean = false; }
      else if (r.kind === 'face') { if (faceKeys.has(r.key)) slice.faces.push(r.key); else clean = false; }
      else if (r.kind === 'either') {
        if (subKeys.has(r.sub)) slice.subs.push(r.sub);
        else if (faceKeys.has(r.face)) slice.faces.push(r.face);
        else clean = false;
      } else if (r.kind === 'unparsed') clean = false;
    }
    slices.push(slice);
  }
  const namedSubs = new Set(slices.flatMap(s => s.subs));
  const namedFaces = new Set(slices.flatMap(s => s.faces));
  const complete =
    clean && slices.length > 1 &&
    [...subKeys].every(k => namedSubs.has(k)) &&
    [...faceKeys].every(k => namedFaces.has(k));
  const plan = { complete, slices };
  planCache.set(evo.id, plan);
  return plan;
}

/** Whether an evo can be run part-way: its levels have to account for all of its data. */
export function supportsPartialLevels(evo: EvolutionDefinition): boolean {
  return levelPlan(evo).complete;
}

const cutCache = new Map<string, EvolutionDefinition>();

/**
 * The evo as it stands after `levels` of it, or unchanged when that is all of them.
 *
 * Magnitudes come from the evo's own data — the level lines only say which keys are in yet.
 */
export function evoAtLevels(evo: EvolutionDefinition, levels: number): EvolutionDefinition {
  const plan = levelPlan(evo);
  if (!plan.complete || levels >= plan.slices.length || levels < 1) return evo;
  const key = `${evo.id}@${levels}`;
  const held = cutCache.get(key);
  if (held) return held;
  const done = plan.slices.slice(0, levels);
  const subs = new Set(done.flatMap(s => s.subs));
  const faces = new Set(done.flatMap(s => s.faces));
  const styles = new Set(done.flatMap(s => s.playStyles));
  const pick = <T extends Record<string, unknown>>(src: T | undefined, keep: Set<string>) =>
    Object.fromEntries(Object.entries(src ?? {}).filter(([k]) => keep.has(k))) as T;
  const cut: EvolutionDefinition = {
    ...evo,
    name: `${evo.name} (Lv ${levels}/${plan.slices.length})`,
    ovrBoost: done.some(s => s.ovr) ? evo.ovrBoost : { boost: 0, limit: evo.ovrBoost.limit },
    subStatBoosts: pick(evo.subStatBoosts, subs),
    faceBoosts: evo.faceBoosts ? pick(evo.faceBoosts, faces) : evo.faceBoosts,
    weakFootBoost: done.some(s => s.weakFoot) ? evo.weakFootBoost : undefined,
    skillMovesBoost: done.some(s => s.skillMoves) ? evo.skillMovesBoost : undefined,
    playStylesAdded: evo.playStylesAdded && {
      gold: (evo.playStylesAdded.gold ?? []).filter(p => styles.has(p.replace(/\+$/, ''))),
      silver: (evo.playStylesAdded.silver ?? []).filter(p => styles.has(p.replace(/\+$/, '')))
    },
    levels: evo.levels?.slice(0, levels)
  };
  cutCache.set(key, cut);
  return cut;
}

/** `1187@4` is Mr. Undroppable stopped at level four; a bare `1187` is all of it. */
export const parseEvoNodeId = (nodeId: string): { evoId: string; levels: number | null } => {
  const at = nodeId.indexOf('@');
  if (at < 0) return { evoId: nodeId, levels: null };
  const n = Number(nodeId.slice(at + 1));
  return { evoId: nodeId.slice(0, at), levels: Number.isFinite(n) && n > 0 ? n : null };
};

export const makeEvoNodeId = (evoId: string, levels: number | null, total: number): string =>
  levels === null || levels >= total ? evoId : `${evoId}@${levels}`;

/**
 * One evo, by the id a chain step carries — level suffix and all.
 *
 * Every lookup that turns a chainId into a definition goes through here, so a partially-run evo
 * flows into the simulation, the validators and the UI without any of them knowing about levels.
 */
export function resolveEvo(nodeId: string): EvolutionDefinition | undefined {
  const { evoId, levels } = parseEvoNodeId(nodeId);
  const evo = availableEvolutions[evoId];
  if (!evo) return undefined;
  return levels === null ? evo : evoAtLevels(evo, levels);
}
