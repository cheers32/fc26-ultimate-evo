import { COLORS, Color, CubeState, FaceName, applyMoves, netSticker } from './cubeModel';

/**
 * Reading a real cube's colours off the camera.
 *
 * The cube is shown one face at a time, turned between shots in a fixed order, so every photo
 * lands on a known face of the model. Each sticker is sampled from the middle of its cell, and
 * once all 24 are in they're sorted into colours together: every colour has to come out exactly
 * four times, which settles most of the red/orange and white/yellow mix-ups a camera makes.
 */

export type RGB = [number, number, number];

export interface ScanStep {
  /** The face of the model this photo fills. */
  face: FaceName;
  /** How to turn the whole cube from the previous shot to this one. */
  turn: string[];
  say: string;
}

export const SCAN_STEPS: ScanStep[] = [
  { face: 'F', turn: [], say: '随便选一面对着摄像头，这面就是"前"。记住哪面朝上，后面一直按提示转，别乱换！' },
  { face: 'R', turn: ['y'], say: '整个魔方往左转一下，让右边那面对着摄像头。' },
  { face: 'B', turn: ['y'], say: '再往左转一下。' },
  { face: 'L', turn: ['y'], say: '再往左转一下。' },
  { face: 'U', turn: ['y', "x'"], say: '再往左转一下回到第一面，然后把顶面往你这边翻下来，让它对着摄像头。' },
  { face: 'D', turn: ['x', 'x'], say: '往上翻两下（第一面会先翻回来），让底面对着摄像头。' }
];

/** The whole-cube turns from the starting hold to step i's hold. */
export const turnsUpTo = (i: number) => SCAN_STEPS.slice(0, i + 1).flatMap(s => s.turn);

/**
 * For step i, which sticker of the cube (as it was first held) is at each cell of the photo,
 * reading the photo top-left, top-right, bottom-left, bottom-right.
 */
export function photoStickers(i: number): number[] {
  const tags = applyMoves(Array.from({ length: 24 }, (_, k) => k), turnsUpTo(i));
  return [0, 1].flatMap(r => [0, 1].map(c => tags[netSticker('F', r, c)]));
}

// --- Colour ------------------------------------------------------------------------------------

type Lab = [number, number, number];

function toLab([r, g, b]: RGB): Lab {
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const x = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047;
  const y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  const z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

/** What each colour tends to look like through a phone or laptop camera indoors. */
const TYPICAL: Record<Exclude<Color, 'X'>, RGB> = {
  W: [215, 220, 220],
  Y: [210, 200, 40],
  G: [30, 150, 80],
  B: [25, 75, 170],
  R: [180, 30, 40],
  O: [230, 105, 30]
};

// Brightness swings with the light far more than hue does, so it counts for less.
const dist = (a: Lab, b: Lab) => Math.hypot((a[0] - b[0]) * 0.5, a[1] - b[1], a[2] - b[2]);

/** Best single guess for one sticker, for the live preview. */
export function guessColor(rgb: RGB): Exclude<Color, 'X'> {
  const lab = toLab(rgb);
  let best = COLORS[0];
  let bestD = Infinity;
  for (const c of COLORS) {
    const d = dist(lab, toLab(TYPICAL[c]));
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

/** Cheapest way to give each row its own column (Hungarian method, square matrix). */
function assign(cost: number[][]): number[] {
  const n = cost.length;
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(Infinity);
    const used = new Array(n + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) {
          minv[j] = cur;
          way[j] = j0;
        }
        if (minv[j] < delta) {
          delta = minv[j];
          j1 = j;
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0);
  }
  const rowToCol = new Array(n).fill(0);
  for (let j = 1; j <= n; j++) rowToCol[p[j] - 1] = j - 1;
  return rowToCol;
}

/**
 * Sort all 24 samples into six colours of four each. Starts from the typical colours, then
 * re-centres on what this cube under this light actually looks like and sorts again.
 */
export function classify(samples: RGB[]): Exclude<Color, 'X'>[] {
  // Every colour is there exactly four times, so the average of all 24 should be the average of
  // the six typical colours. Scaling each channel to make it so takes out the light's tint.
  const typicalMean = [0, 1, 2].map(d => COLORS.reduce((s, c) => s + TYPICAL[c][d], 0) / COLORS.length);
  const gain = [0, 1, 2].map(d => typicalMean[d] / Math.max(1, samples.reduce((s, x) => s + x[d], 0) / samples.length));
  const labs = samples.map(x => toLab(x.map((v, d) => Math.min(255, v * gain[d])) as RGB));
  let centres = COLORS.map(c => toLab(TYPICAL[c]));
  let out: Exclude<Color, 'X'>[] = [];
  for (let round = 0; round < 3; round++) {
    const cost = labs.map(l => COLORS.flatMap((_, k) => Array(4).fill(dist(l, centres[k]))));
    out = assign(cost).map(col => COLORS[Math.floor(col / 4)]);
    centres = COLORS.map(c => {
      const mine = labs.filter((_, i) => out[i] === c);
      const typical = toLab(TYPICAL[c]);
      // Keep the typical colour in the mix so one odd sticker can't drag a centre away.
      return typical.map((t, d) => (2 * mine.reduce((s, l) => s + l[d], 0) / mine.length + t) / 3) as Lab;
    });
  }
  return out;
}

/** Turn six photos (four samples each, in SCAN_STEPS order) into a cube to paint from. */
export function scansToCube(shots: RGB[][]): CubeState {
  const flat = shots.flat();
  const colors = classify(flat);
  const state: CubeState = new Array(24).fill('X');
  shots.forEach((_, i) => photoStickers(i).forEach((idx, cell) => (state[idx] = colors[i * 4 + cell])));
  return state;
}

// --- Sampling ----------------------------------------------------------------------------------

/** How much of the picture's short side the guide square takes up. */
export const GUIDE = 0.6;

/**
 * Read the four stickers inside the guide square: the middle of each cell, per-channel median so
 * a glint of light or a black edge doesn't throw it off.
 */
export function sampleFrame(ctx: CanvasRenderingContext2D, w: number, h: number): RGB[] {
  const side = Math.min(w, h) * GUIDE;
  const x0 = (w - side) / 2;
  const y0 = (h - side) / 2;
  const cell = side / 2;
  const box = Math.max(4, Math.round(cell * 0.4));
  const out: RGB[] = [];
  for (const r of [0, 1]) {
    for (const c of [0, 1]) {
      const cx = x0 + cell * (c + 0.5);
      const cy = y0 + cell * (r + 0.5);
      const { data } = ctx.getImageData(Math.round(cx - box / 2), Math.round(cy - box / 2), box, box);
      const ch: number[][] = [[], [], []];
      for (let k = 0; k < data.length; k += 4) for (let d = 0; d < 3; d++) ch[d].push(data[k + d]);
      out.push(ch.map(a => a.sort((p, q) => p - q)[a.length >> 1]) as RGB);
    }
  }
  return out;
}
