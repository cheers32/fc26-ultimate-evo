import { CORNER_SLOTS, CubeState, applyMove, toCubies } from './cubeModel';

/**
 * The shortest solve, by table lookup.
 *
 * With only R, U and F the back-down-left corner never moves, so the cube is the arrangement of
 * the other seven: 7! placements × 3⁶ twists = 3,674,160 states. That's small enough to measure
 * every one of them's distance from solved once (a breadth-first sweep, well under a second) and
 * then walk downhill from any state. Every 2×2 is at most 11 such turns away.
 */

const FACES = ['R', 'U', 'F'];
const MOVE_NAMES = FACES.flatMap(f => [f, `${f}2`, `${f}'`]);
const N_PERM = 5040;
const N_ORI = 729;

/** What a quarter turn does to the corners: position i receives the piece from src[i], twisted by d[i]. */
function cubieMove(move: string) {
  const tags = new Array(24).fill(0);
  CORNER_SLOTS.forEach((slots, j) => slots.forEach((st, s) => (tags[st] = j * 3 + s)));
  const after = applyMove(tags, move);
  const src: number[] = [];
  const d: number[] = [];
  CORNER_SLOTS.forEach(slots => {
    const v = after[slots[0]];
    src.push(Math.floor(v / 3));
    d.push(v % 3);
  });
  return { src, d };
}

const FACT = [1, 1, 2, 6, 24, 120, 720];

function encodePerm(cp: number[]): number {
  let idx = 0;
  for (let i = 0; i < 7; i++) {
    let smaller = 0;
    for (let j = i + 1; j < 7; j++) if (cp[j] < cp[i]) smaller++;
    idx += smaller * FACT[6 - i];
  }
  return idx;
}

function decodePerm(idx: number): number[] {
  const pool = [0, 1, 2, 3, 4, 5, 6];
  const out: number[] = [];
  for (let i = 0; i < 7; i++) {
    const f = FACT[6 - i];
    const k = Math.floor(idx / f);
    idx %= f;
    out.push(pool.splice(k, 1)[0]);
  }
  return out;
}

function encodeOri(co: number[]): number {
  let idx = 0;
  for (let i = 0; i < 6; i++) idx = idx * 3 + co[i];
  return idx;
}

function decodeOri(idx: number): number[] {
  const co = new Array(7).fill(0);
  let sum = 0;
  for (let i = 5; i >= 0; i--) {
    co[i] = idx % 3;
    sum += co[i];
    idx = Math.floor(idx / 3);
  }
  co[6] = (3 - (sum % 3)) % 3;
  return co;
}

interface Tables {
  permMove: Uint16Array;
  oriMove: Uint16Array;
  dist: Uint8Array;
}

let tables: Tables | null = null;

function buildTables(): Tables {
  const quarters = FACES.map(cubieMove);
  const permMove = new Uint16Array(N_PERM * 9);
  const oriMove = new Uint16Array(N_ORI * 9);

  for (let p = 0; p < N_PERM; p++) {
    let cp = [...decodePerm(p), 7];
    for (let f = 0; f < 3; f++) {
      let c = cp;
      for (let t = 0; t < 3; t++) {
        const { src } = quarters[f];
        c = src.map(j => c[j]);
        permMove[p * 9 + f * 3 + t] = encodePerm(c);
      }
    }
  }
  for (let o = 0; o < N_ORI; o++) {
    const co0 = [...decodeOri(o), 0];
    for (let f = 0; f < 3; f++) {
      let c = co0;
      for (let t = 0; t < 3; t++) {
        const { src, d } = quarters[f];
        c = src.map((j, i) => (c[j] + d[i]) % 3);
        oriMove[o * 9 + f * 3 + t] = encodeOri(c);
      }
    }
  }

  const dist = new Uint8Array(N_PERM * N_ORI).fill(255);
  dist[0] = 0;
  let frontier = [0];
  for (let depth = 0; frontier.length; depth++) {
    const next: number[] = [];
    for (const idx of frontier) {
      const p = Math.floor(idx / N_ORI);
      const o = idx % N_ORI;
      for (let m = 0; m < 9; m++) {
        const n = permMove[p * 9 + m] * N_ORI + oriMove[o * 9 + m];
        if (dist[n] === 255) {
          dist[n] = depth + 1;
          next.push(n);
        }
      }
    }
    frontier = next;
  }
  return { permMove, oriMove, dist };
}

/** Build the tables now rather than on the first solve (they take a moment). */
export function warmSolver() {
  if (!tables) tables = buildTables();
}

/** Fewest-turns solve using R, U, F — or null if the colours don't make a real cube. */
export function solveOptimal(state: CubeState): string[] | null {
  const cubies = toCubies(state, 7);
  if (!cubies) return null;
  warmSolver();
  const { permMove, oriMove, dist } = tables!;

  let p = encodePerm(cubies.cp);
  let o = encodeOri(cubies.co);
  const out: string[] = [];
  while (dist[p * N_ORI + o] > 0) {
    const here = dist[p * N_ORI + o];
    for (let m = 0; m < 9; m++) {
      const np = permMove[p * 9 + m];
      const no = oriMove[o * 9 + m];
      if (dist[np * N_ORI + no] === here - 1) {
        out.push(MOVE_NAMES[m]);
        p = np;
        o = no;
        break;
      }
    }
  }
  return out;
}
