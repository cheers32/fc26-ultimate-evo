/**
 * A 2×2 cube as 24 stickers.
 *
 * Every sticker is named by where it sits — the cubie's position (each axis ±1) and the direction
 * it faces — so a turn is nothing more than rotating those vectors. The state is just the colour
 * in each of the 24 slots. Axes: x to the right, y up, z towards you (the front).
 */

export type Color = 'W' | 'Y' | 'G' | 'B' | 'R' | 'O' | 'X';
export type Vec = [number, number, number];
export type FaceName = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';
export type CubeState = Color[];

/** X is a sticker nobody has coloured in yet. */
export const COLORS: Exclude<Color, 'X'>[] = ['W', 'Y', 'G', 'B', 'R', 'O'];

export const COLOR_HEX: Record<Color, string> = {
  W: '#F8F8F8',
  Y: '#FFD500',
  G: '#00A651',
  B: '#0B5FD6',
  R: '#D7263D',
  O: '#FF7A00',
  X: '#3A3D3A'
};

export const COLOR_NAME: Record<Color, string> = {
  W: '白',
  Y: '黄',
  G: '绿',
  B: '蓝',
  R: '红',
  O: '橙',
  X: '空'
};

export const FACE_DIR: Record<FaceName, Vec> = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  R: [1, 0, 0],
  L: [-1, 0, 0],
  F: [0, 0, 1],
  B: [0, 0, -1]
};

export const FACE_NAME_ZH: Record<FaceName, string> = {
  U: '上',
  D: '下',
  F: '前',
  B: '后',
  L: '左',
  R: '右'
};

export const FACES: FaceName[] = ['U', 'D', 'R', 'L', 'F', 'B'];

export function faceOf(n: Vec): FaceName {
  if (n[0] === 1) return 'R';
  if (n[0] === -1) return 'L';
  if (n[1] === 1) return 'U';
  if (n[1] === -1) return 'D';
  return n[2] === 1 ? 'F' : 'B';
}

export const vecEq = (a: Vec, b: Vec) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

export interface Sticker {
  pos: Vec;
  normal: Vec;
  face: FaceName;
}

export const CUBIE_POSITIONS: Vec[] = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBIE_POSITIONS.push([x, y, z]);

export const STICKERS: Sticker[] = [];
for (const pos of CUBIE_POSITIONS) {
  for (let axis = 0; axis < 3; axis++) {
    const normal: Vec = [0, 0, 0];
    normal[axis] = pos[axis];
    STICKERS.push({ pos, normal, face: faceOf(normal) });
  }
}

const keyOf = (pos: Vec, normal: Vec) => `${pos.join(',')}|${normal.join(',')}`;
const INDEX = new Map(STICKERS.map((s, i) => [keyOf(s.pos, s.normal), i]));

export function stickerIndex(pos: Vec, normal: Vec): number {
  const i = INDEX.get(keyOf(pos, normal));
  if (i === undefined) throw new Error(`no sticker at ${keyOf(pos, normal)}`);
  return i;
}

export const SOLVED_SCHEME: Record<FaceName, Color> = { U: 'W', D: 'Y', F: 'G', B: 'B', R: 'R', L: 'O' };

export const solvedCube = (scheme: Record<FaceName, Color> = SOLVED_SCHEME): CubeState =>
  STICKERS.map(s => scheme[s.face]);

export const blankCube = (): CubeState => STICKERS.map(() => 'X');

// ---------------------------------------------------------------------------------------------
// Turns
// ---------------------------------------------------------------------------------------------

/** A quarter turn: rotate about +axis by dir·90°, on one layer or (layer null) the whole cube. */
interface MoveDef {
  axis: 0 | 1 | 2;
  layer: number | null;
  dir: 1 | -1;
}

/** Clockwise as seen looking at that face — which is −90° about the face's own outward axis. */
const BASE_MOVES: Record<string, MoveDef> = {
  R: { axis: 0, layer: 1, dir: -1 },
  L: { axis: 0, layer: -1, dir: 1 },
  U: { axis: 1, layer: 1, dir: -1 },
  D: { axis: 1, layer: -1, dir: 1 },
  F: { axis: 2, layer: 1, dir: -1 },
  B: { axis: 2, layer: -1, dir: 1 },
  x: { axis: 0, layer: null, dir: -1 },
  y: { axis: 1, layer: null, dir: -1 },
  z: { axis: 2, layer: null, dir: -1 }
};

export function rotateVec(v: Vec, axis: number, dir: number): Vec {
  const [x, y, z] = v;
  if (axis === 0) return dir === 1 ? [x, -z, y] : [x, z, -y];
  if (axis === 1) return dir === 1 ? [z, y, -x] : [-z, y, x];
  return dir === 1 ? [-y, x, z] : [y, -x, z];
}

export interface ParsedMove {
  base: string;
  def: MoveDef;
  /** Quarter turns in the face's clockwise direction: 1, 2, or 3 (= one turn back). */
  turns: 1 | 2 | 3;
}

export function parseMove(move: string): ParsedMove {
  const base = move[0];
  const def = BASE_MOVES[base];
  if (!def) throw new Error(`unknown move ${move}`);
  const suffix = move.slice(1);
  const turns = suffix === '2' ? 2 : suffix === "'" ? 3 : 1;
  return { base, def, turns };
}

export const isRotation = (move: string) => move[0] === 'x' || move[0] === 'y' || move[0] === 'z';

/** Where each sticker goes under one quarter turn of a base move. */
const QUARTER_PERM: Record<string, number[]> = {};
for (const [base, def] of Object.entries(BASE_MOVES)) {
  QUARTER_PERM[base] = STICKERS.map((s, i) => {
    if (def.layer !== null && s.pos[def.axis] !== def.layer) return i;
    return stickerIndex(rotateVec(s.pos, def.axis, def.dir), rotateVec(s.normal, def.axis, def.dir));
  });
}

export function inMovedLayer(move: string, pos: Vec): boolean {
  const { def } = parseMove(move);
  return def.layer === null || pos[def.axis] === def.layer;
}

/** Works on any per-sticker array, not just colours, so the solver can push tags through it. */
export function applyMove<T>(state: T[], move: string): T[] {
  const { base, turns } = parseMove(move);
  const perm = QUARTER_PERM[base];
  let s = state;
  for (let t = 0; t < turns; t++) {
    const next = s.slice();
    for (let i = 0; i < 24; i++) next[perm[i]] = s[i];
    s = next;
  }
  return s;
}

export const applyMoves = <T,>(state: T[], moves: string[]): T[] => moves.reduce(applyMove, state);

/** The whole cube's own rotation of a vector under a move (for rotations; layer moves too). */
export function rotateVecByMove(v: Vec, move: string): Vec {
  const { def, turns } = parseMove(move);
  let r = v;
  for (let t = 0; t < turns; t++) r = rotateVec(r, def.axis, def.dir);
  return r;
}

export function invertMove(move: string): string {
  const { base, turns } = parseMove(move);
  return turns === 2 ? `${base}2` : turns === 1 ? `${base}'` : base;
}

export const invertMoves = (moves: string[]) => moves.slice().reverse().map(invertMove);

export const parseAlg = (alg: string) => alg.trim().split(/\s+/).filter(Boolean);

/** n quarter turns of a base move written the short way: U, U2, U' (or nothing). */
export function turnsToMoves(base: string, n: number): string[] {
  const k = ((n % 4) + 4) % 4;
  return k === 0 ? [] : k === 1 ? [base] : k === 2 ? [`${base}2`] : [`${base}'`];
}

export function isSolved(state: CubeState): boolean {
  return FACES.every(f => {
    const colors = STICKERS.map((s, i) => (s.face === f ? state[i] : null)).filter(Boolean);
    return colors.every(c => c === colors[0]);
  });
}

export function randomScramble(length = 11): string[] {
  const bases = ['R', 'U', 'F', 'L', 'D', 'B'];
  const axisOf: Record<string, number> = { R: 0, L: 0, U: 1, D: 1, F: 2, B: 2 };
  const out: string[] = [];
  let lastAxis = -1;
  while (out.length < length) {
    const base = bases[Math.floor(Math.random() * bases.length)];
    if (axisOf[base] === lastAxis) continue;
    lastAxis = axisOf[base];
    out.push(base + ['', '2', "'"][Math.floor(Math.random() * 3)]);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// The flat map (2D net): which sticker is drawn in each cell
// ---------------------------------------------------------------------------------------------

/** Grid placement of each face in the cross-shaped net, in face-sized units. */
export const NET_LAYOUT: Record<FaceName, { col: number; row: number }> = {
  U: { col: 1, row: 0 },
  L: { col: 0, row: 1 },
  F: { col: 1, row: 1 },
  R: { col: 2, row: 1 },
  B: { col: 3, row: 1 },
  D: { col: 1, row: 2 }
};

/** The sticker at (row, col) of a face as you'd see it looking straight at that face. */
export function netSticker(face: FaceName, row: number, col: number): number {
  const a = col === 0 ? -1 : 1; // left → right
  const b = row === 0 ? 1 : -1; // top → bottom
  let pos: Vec;
  switch (face) {
    case 'F': pos = [a, b, 1]; break;
    case 'B': pos = [-a, b, -1]; break;
    case 'R': pos = [1, b, -a]; break;
    case 'L': pos = [-1, b, a]; break;
    case 'U': pos = [a, 1, -b]; break;
    case 'D': pos = [a, -1, b]; break;
  }
  return stickerIndex(pos, FACE_DIR[face]);
}

// ---------------------------------------------------------------------------------------------
// Corners: what each of the eight pieces is and how it's twisted
// ---------------------------------------------------------------------------------------------

/** The eight corner positions, with DBL last: it's the one R, U and F never move. */
export const CORNERS: Vec[] = [
  [1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1],
  [1, -1, 1], [-1, -1, 1], [1, -1, -1], [-1, -1, -1]
];

/**
 * Each corner's three sticker slots: the up/down one first, then the other two going round the
 * same way on every corner, so a twist is a well-defined number 0–2.
 */
export const CORNER_SLOTS: number[][] = CORNERS.map(p => {
  const ny: Vec = [0, p[1], 0];
  const nx: Vec = [p[0], 0, 0];
  const nz: Vec = [0, 0, p[2]];
  const order = -p[0] * p[1] * p[2] > 0 ? [ny, nx, nz] : [ny, nz, nx];
  return order.map(n => stickerIndex(p, n));
});

export const cornerIndexOf = (pos: Vec) => CORNERS.findIndex(p => vecEq(p, pos));

/** Which colours face which way once solved, read off one corner and filled in by opposites. */
export type Frame = Record<FaceName, Color>;

const OPPOSITE_FACE: Record<FaceName, FaceName> = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' };

/** Two colours are opposite when no corner carries both. Null if the colours can't be a cube. */
export function oppositeColors(state: CubeState): Record<Color, Color> | null {
  const together = new Map<Color, Set<Color>>();
  for (const slots of CORNER_SLOTS) {
    const cs = slots.map(i => state[i]);
    for (const a of cs) {
      if (!together.has(a)) together.set(a, new Set());
      for (const b of cs) together.get(a)!.add(b);
    }
  }
  const out = {} as Record<Color, Color>;
  for (const c of COLORS) {
    const seen = together.get(c);
    if (!seen) return null;
    const apart = COLORS.filter(o => !seen.has(o));
    if (apart.length !== 1) return null;
    out[c] = apart[0];
  }
  return out;
}

export function frameFromCorner(state: CubeState, pos: Vec, opposite: Record<Color, Color>): Frame {
  const frame = {} as Frame;
  for (let axis = 0; axis < 3; axis++) {
    const n: Vec = [0, 0, 0];
    n[axis] = pos[axis];
    const face = faceOf(n);
    const color = state[stickerIndex(pos, n)];
    frame[face] = color;
    frame[OPPOSITE_FACE[face]] = opposite[color];
  }
  return frame;
}

/** The frame after the whole cube is turned: each colour goes where its face went. */
export function rotateFrame(frame: Frame, move: string): Frame {
  const out = {} as Frame;
  for (const f of FACES) out[faceOf(rotateVecByMove(FACE_DIR[f], move))] = frame[f];
  return out;
}

export interface Cubies {
  /** cp[i]: which corner (by its home position) sits at position i. */
  cp: number[];
  /** co[i]: which of its home slots shows in position i's first (up/down) slot. */
  co: number[];
}

/** Read the cube as corner pieces, relative to the corner at `ref` being home. */
export function toCubies(state: CubeState, ref = 7): Cubies | null {
  const opposite = oppositeColors(state);
  if (!opposite) return null;
  const frame = frameFromCorner(state, CORNERS[ref], opposite);
  const home = CORNER_SLOTS.map(slots => slots.map(i => frame[STICKERS[i].face]));
  const cp: number[] = [];
  const co: number[] = [];
  for (let i = 0; i < 8; i++) {
    const actual = CORNER_SLOTS[i].map(s => state[s]);
    let found = false;
    for (let j = 0; j < 8 && !found; j++) {
      for (let r = 0; r < 3 && !found; r++) {
        if (actual.every((c, s) => c === home[j][(s + r) % 3])) {
          cp.push(j);
          co.push(r);
          found = true;
        }
      }
    }
    if (!found) return null;
  }
  if (new Set(cp).size !== 8) return null;
  if (co.reduce((a, b) => a + b, 0) % 3 !== 0) return null;
  return { cp, co };
}

/** Everything wrong with a hand-entered cube, in words a parent can act on. Empty if it's fine. */
export function validateColors(state: CubeState): string[] {
  const problems: string[] = [];
  const blanks = state.filter(c => c === 'X').length;
  if (blanks) problems.push(`还有 ${blanks} 个格子没涂颜色。`);
  for (const c of COLORS) {
    const n = state.filter(s => s === c).length;
    if (n !== 4) problems.push(`${COLOR_NAME[c]}色有 ${n} 个，应该正好 4 个。`);
  }
  if (problems.length) return problems;

  for (const slots of CORNER_SLOTS) {
    if (new Set(slots.map(i => state[i])).size !== 3) {
      problems.push('有一个角块上出现了两个一样的颜色——检查一下相邻的格子。');
      return problems;
    }
  }
  if (!oppositeColors(state)) {
    problems.push('颜色的对面关系对不上（比如白和黄应该永远不在同一个角上）。');
    return problems;
  }
  const opposite = oppositeColors(state)!;
  const frame = frameFromCorner(state, CORNERS[7], opposite);
  const home = CORNER_SLOTS.map(slots => slots.map(i => frame[STICKERS[i].face]));
  const cp: number[] = [];
  const co: number[] = [];
  for (let i = 0; i < 8; i++) {
    const actual = CORNER_SLOTS[i].map(s => state[s]);
    for (let j = 0; j < 8; j++) {
      for (let r = 0; r < 3; r++) {
        if (actual.every((c, s) => c === home[j][(s + r) % 3])) {
          cp.push(j);
          co.push(r);
        }
      }
    }
    if (cp.length !== i + 1) {
      problems.push('有一个角块的颜色顺序是镜像的，真实魔方上不存在——可能有两个格子涂反了。');
      return problems;
    }
  }
  if (new Set(cp).size !== 8) {
    problems.push('有两个角块一模一样，检查一下是不是涂错了。');
    return problems;
  }
  if (co.reduce((a, b) => a + b, 0) % 3 !== 0) {
    problems.push('有一个角被"拧歪"了（或者某个角的颜色涂错了位置）——这样的魔方转不回去。');
  }
  return problems;
}

// ---------------------------------------------------------------------------------------------
// Words for each move, the way you'd say it to a kid holding the cube
// ---------------------------------------------------------------------------------------------

export const MOVE_WORDS: Record<string, string> = {
  R: '右边一层 向上转 ⬆',
  "R'": '右边一层 向下转 ⬇',
  R2: '右边一层 转两下',
  L: '左边一层 向下转 ⬇',
  "L'": '左边一层 向上转 ⬆',
  L2: '左边一层 转两下',
  U: '顶层 向左转 ⬅',
  "U'": '顶层 向右转 ➡',
  U2: '顶层 转两下',
  D: '底层 向右转 ➡',
  "D'": '底层 向左转 ⬅',
  D2: '底层 转两下',
  F: '前面一层 顺时针 ↻',
  "F'": '前面一层 逆时针 ↺',
  F2: '前面一层 转两下',
  B: '后面一层 从前面看是逆时针 ↺',
  "B'": '后面一层 从前面看是顺时针 ↻',
  B2: '后面一层 转两下',
  x: '整个魔方 向上翻（前面翻到上面）',
  "x'": '整个魔方 向下翻（上面翻到前面）',
  x2: '整个魔方 翻个跟头（上下颠倒）',
  y: '整个魔方 向左转（右面转到前面）',
  "y'": '整个魔方 向右转（左面转到前面）',
  y2: '整个魔方 转半圈（后面转到前面）',
  z: '整个魔方 顺时针侧倒',
  "z'": '整个魔方 逆时针侧倒',
  z2: '整个魔方 侧着转半圈'
};
