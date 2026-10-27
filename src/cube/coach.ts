import {
  Color,
  CubeState,
  FACE_DIR,
  FaceName,
  Frame,
  Vec,
  applyMove,
  faceOf,
  frameFromCorner,
  isRotation,
  isSolved,
  oppositeColors,
  rotateFrame,
  rotateVec,
  stickerIndex,
  toCubies,
  turnsToMoves,
  vecEq
} from './cubeModel';

/**
 * The beginner's way, worked out for the cube in front of you.
 *
 * Four stages and only three formulas, each one short enough for a kid to learn by feel:
 *
 *   1. White layer on the bottom — put a white corner above its spot, repeat R U R' U'.
 *   2. Yellow up — keep doing R' D' R D on the front-right-top corner until yellow faces up,
 *      then turn only the top to bring the next one there. The bottom looks wrecked midway and
 *      comes back by itself at the end.
 *   3. Top corners in place — find the "headlights" (two top corners whose side colours match),
 *      put them on the left, and do the swap formula (T).
 *   4. Turn the top until it lines up.
 *
 * The plan is computed by actually running the method on a copy of the cube, so every count
 * ("repeat 3 times") is exactly what this cube needs.
 */

export type Stage = 1 | 2 | 3 | 4;
export type FormulaId = 'A' | 'B' | 'C';

export interface CoachSegment {
  stage: Stage;
  title: string;
  detail: string;
  moves: string[];
  formula?: FormulaId;
  /** For a repeated formula: how many times round. */
  repeat?: number;
}

export const STAGE_TITLES: Record<Stage, string> = {
  1: '拼好白色底层',
  2: '让黄色全部朝上',
  3: '顶层角块换位置',
  4: '最后对齐'
};

export const FORMULAS: Record<FormulaId, { name: string; nickname: string; moves: string[]; use: string }> = {
  A: {
    name: "R U R' U'",
    nickname: '右手四步',
    moves: ['R', 'U', "R'", "U'"],
    use: '第一步用：白角在右前上方，重复它，白角就会落到右前下方的位置。'
  },
  B: {
    name: "R' D' R D",
    nickname: '拧角四步',
    moves: ["R'", "D'", 'R', 'D'],
    use: '第二步用：重复它，右前上方的角就会转到黄色朝上。底层会乱，但最后会自己变回来！'
  },
  C: {
    name: "R U R' U' R' F R2 U' R' U' R U R' F'",
    nickname: '交换公式 T',
    moves: ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"],
    use: "第三步用：把右边两个顶角互换。前四下就是“右手四步”，很好记。"
  }
};

const DFR: Vec = [1, -1, 1];
const UFR: Vec = [1, 1, 1];
const D_SLOTS: Vec[] = [[1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]];
const U_SLOTS: Vec[] = [[1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1]];
const SIDES: FaceName[] = ['F', 'R', 'B', 'L'];

const normalsOf = (pos: Vec): Vec[] => [
  [pos[0], 0, 0],
  [0, pos[1], 0],
  [0, 0, pos[2]]
];

/** Every whole-cube orientation, each with the fewest rotations that reach it. */
const ORIENTATIONS: string[][] = (() => {
  const steps = ['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2'];
  const tag = Array.from({ length: 24 }, (_, i) => i);
  const seen = new Map<string, string[]>([[tag.join(), []]]);
  let frontier: [number[], string[]][] = [[tag, []]];
  while (frontier.length) {
    const next: [number[], string[]][] = [];
    for (const [s, seq] of frontier) {
      for (const m of steps) {
        const t = applyMove(s, m);
        const k = t.join();
        if (!seen.has(k)) {
          seen.set(k, [...seq, m]);
          next.push([t, [...seq, m]]);
        }
      }
    }
    frontier = next;
  }
  return [...seen.values()];
})();

class Sim {
  constructor(public s: CubeState, public frame: Frame) {}

  play(moves: string[]) {
    for (const m of moves) {
      this.s = applyMove(this.s, m);
      if (isRotation(m)) this.frame = rotateFrame(this.frame, m);
    }
  }

  slotSolved(pos: Vec) {
    return normalsOf(pos).every(n => this.s[stickerIndex(pos, n)] === this.frame[faceOf(n)]);
  }

  /** Where the piece that belongs at `home` is right now. */
  findPiece(home: Vec): Vec {
    const want = normalsOf(home).map(n => this.frame[faceOf(n)]).sort().join();
    for (const pos of [...D_SLOTS, ...U_SLOTS]) {
      const have = normalsOf(pos).map(n => this.s[stickerIndex(pos, n)]).sort().join();
      if (have === want) return pos;
    }
    throw new Error('piece not found');
  }

  colorAt(pos: Vec, face: FaceName): Color {
    return this.s[stickerIndex(pos, FACE_DIR[face])];
  }
}

/** Quarter turns about y (same direction as U and y) that take `from` to `to`. */
function yTurnsBetween(from: Vec, to: Vec): number {
  let v = from;
  for (let k = 0; k < 4; k++) {
    if (vecEq(v, to)) return k;
    v = rotateVec(v, 1, -1);
  }
  throw new Error('not on the same layer');
}

export function beginnerPlan(state: CubeState): CoachSegment[] | null {
  if (!toCubies(state)) return null;
  const opposite = oppositeColors(state)!;
  const plan: CoachSegment[] = [];
  if (isSolved(state)) return plan;

  // --- Hold it: white down, keeping whatever white corners are already together. -------------
  let best: { seq: string[]; sim: Sim; score: number } | null = null;
  for (const seq of ORIENTATIONS) {
    let s = state;
    for (const m of seq) s = applyMove(s, m);
    if (s[stickerIndex(DFR, FACE_DIR.D)] !== 'W') continue;
    const sim = new Sim(s, frameFromCorner(s, DFR, opposite));
    const score = D_SLOTS.filter(p => sim.slotSolved(p)).length;
    if (!best || score > best.score || (score === best.score && seq.length < best.seq.length)) {
      best = { seq, sim, score };
    }
  }
  const sim = best!.sim;
  if (best!.seq.length) {
    plan.push({
      stage: 1,
      title: '先拿好魔方',
      detail: '转动整个魔方（不是拧哦！），让白色朝下。手里的魔方要和屏幕上的一样。',
      moves: best!.seq
    });
  }

  // --- 1. White layer. ------------------------------------------------------------------------
  for (let guard = 0; guard < 12; guard++) {
    const open = D_SLOTS.filter(p => !sim.slotSolved(p));
    if (!open.length) break;
    const targets = open.map(home => ({ home, at: sim.findPiece(home) }));
    const pick = targets.find(t => t.at[1] === 1) ?? targets[0];

    if (pick.at[1] === -1) {
      const turn = turnsToMoves('y', yTurnsBetween(pick.at, DFR));
      plan.push({
        stage: 1,
        title: '先把放错的白角拿出来',
        detail:
          '这个白角在底层，但位置或方向不对。' +
          (turn.length ? '先转整个魔方让它到右前下方，' : '它就在右前下方，') +
          "做一次“右手四步” R U R' U'，它就会跑到顶层。",
        moves: [...turn, 'R', 'U', "R'", "U'"],
        formula: 'A',
        repeat: 1
      });
      sim.play(plan[plan.length - 1].moves);
      continue;
    }

    const turnCube = turnsToMoves('y', yTurnsBetween(pick.home, DFR));
    sim.play(turnCube);
    const turnTop = turnsToMoves('U', yTurnsBetween(sim.findPiece(DFR), UFR));
    sim.play(turnTop);
    if (turnCube.length || turnTop.length) {
      const parts: string[] = [];
      if (turnCube.length) parts.push('转整个魔方，让要放白角的空位到右前下方');
      if (turnTop.length) parts.push('转顶层，把这个白角放到它的正上方（右前上）');
      plan.push({ stage: 1, title: '对准位置', detail: parts.join('，然后') + '。', moves: [...turnCube, ...turnTop] });
    }

    let reps = 0;
    while (!sim.slotSolved(DFR) && reps < 6) {
      sim.play(['R', 'U', "R'", "U'"]);
      reps++;
    }
    plan.push({
      stage: 1,
      title: `右手四步 × ${reps}`,
      detail: `白角在右前上方了。重复做 R U R' U'，一共 ${reps} 遍，它就会落到下面、白色朝下。`,
      moves: Array.from({ length: reps }, () => ['R', 'U', "R'", "U'"]).flat(),
      formula: 'A',
      repeat: reps
    });
  }

  // --- 2. Yellow up. --------------------------------------------------------------------------
  const yellowUp = (pos: Vec) => sim.colorAt(pos, 'U') === sim.frame.U;
  let warned = false;
  for (let guard = 0; guard < 4; guard++) {
    const wrong = U_SLOTS.filter(p => !yellowUp(p));
    if (!wrong.length) break;
    const k = Math.min(...wrong.map(p => yTurnsBetween(p, UFR)));
    const turnTop = turnsToMoves('U', k);
    if (turnTop.length) {
      sim.play(turnTop);
      plan.push({
        stage: 2,
        title: '把一个没朝上的黄角转到右前上',
        detail: '只转顶层（U），不要转整个魔方！',
        moves: turnTop
      });
    }
    let reps = 0;
    while (!yellowUp(UFR) && reps < 6) {
      sim.play(["R'", "D'", 'R', 'D']);
      reps++;
    }
    plan.push({
      stage: 2,
      title: `拧角四步 × ${reps}`,
      detail:
        `重复做 R' D' R D，一共 ${reps} 遍，右前上的角就会黄色朝上。` +
        (warned ? '' : '白色底层会变乱——别害怕，全部黄角朝上以后它会自己变回来！'),
      moves: Array.from({ length: reps }, () => ["R'", "D'", 'R', 'D']).flat(),
      formula: 'B',
      repeat: reps
    });
    warned = true;
  }

  // --- 3. Top corners in place. ----------------------------------------------------------------
  const sidePos = (face: FaceName) => U_SLOTS.filter(p => normalsOf(p).some(n => vecEq(n, FACE_DIR[face])));
  const headlights = (face: FaceName) => {
    const [a, b] = sidePos(face);
    return sim.colorAt(a, face) === sim.colorAt(b, face);
  };
  for (let guard = 0; guard < 3; guard++) {
    const lit = SIDES.filter(headlights);
    if (lit.length === 4) break;
    if (lit.length) {
      const turnTop = turnsToMoves('U', yTurnsBetween(FACE_DIR[lit[0]], FACE_DIR.L));
      if (turnTop.length) {
        plan.push({
          stage: 3,
          title: '把"车灯"放到左边',
          detail: '看顶层四周：有一面的两个角颜色一样，像一对车灯。转顶层，把这对车灯转到左边。',
          moves: turnTop
        });
        sim.play(turnTop);
      }
      plan.push({
        stage: 3,
        title: '交换公式 T',
        detail: '车灯在左边，做一次交换公式，右边的两个角就换好了。',
        moves: [...FORMULAS.C.moves],
        formula: 'C',
        repeat: 1
      });
    } else {
      plan.push({
        stage: 3,
        title: '交换公式 T（先变出车灯）',
        detail: '顶层一对车灯都没有？直接做一次交换公式，车灯就会出现。',
        moves: [...FORMULAS.C.moves],
        formula: 'C',
        repeat: 1
      });
    }
    sim.play(FORMULAS.C.moves);
  }

  // --- 4. Line it up. ---------------------------------------------------------------------------
  for (let k = 0; k < 4; k++) {
    const turnTop = turnsToMoves('U', k);
    let s = sim.s;
    for (const m of turnTop) s = applyMove(s, m);
    if (isSolved(s)) {
      if (turnTop.length) {
        plan.push({
          stage: 4,
          title: '转顶层对齐',
          detail: '最后一下！转顶层，让四周的颜色都对上。',
          moves: turnTop
        });
      }
      sim.play(turnTop);
      break;
    }
  }

  if (!isSolved(sim.s)) throw new Error('beginner plan did not solve the cube');
  return plan;
}
