import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, FastForward, Play, RefreshCw, RotateCcw, Shuffle, Undo2, Wand2 } from 'lucide-react';
import {
  COLORS,
  COLOR_HEX,
  COLOR_NAME,
  Color,
  CubeState,
  MOVE_WORDS,
  applyMove,
  applyMoves,
  blankCube,
  invertMove,
  invertMoves,
  isSolved,
  randomScramble,
  solvedCube,
  validateColors
} from './cubeModel';
import { CoachSegment, FORMULAS, FormulaId, STAGE_TITLES, Stage, beginnerPlan } from './coach';
import { solveOptimal } from './solver';
import { Cube3D, DEFAULT_VIEW, View } from './Cube3D';
import { CubeNet } from './CubeNet';

/**
 * A 2×2 to learn on: turn it, paint in the colours of the one in your hand, and have it walk
 * you through the beginner's method one turn at a time.
 */

type Tab = 'coach' | 'moves' | 'paint';

interface QueuedMove {
  move: string;
  /** Whether Undo should be able to take it back. */
  log: boolean;
}

type CoachKind = 'beginner' | 'optimal';

const DRAFT_KEY = 'cube.paintDraft';

function loadDraft(): CubeState | null {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
    return Array.isArray(saved) && saved.length === 24 ? saved : null;
  } catch {
    return null;
  }
}

interface Coach {
  /** The beginner's method, or the computer's fewest-turns solve walked through the same way. */
  kind: CoachKind;
  plan: CoachSegment[];
  /** How many of the plan's turns have been done, counting across segments. */
  done: number;
}

/** Which segment the next turn belongs to, and how far into it that is. */
function locate(plan: CoachSegment[], done: number) {
  let seg = 0;
  let idx = done;
  while (seg < plan.length && idx >= plan[seg].moves.length) {
    idx -= plan[seg].moves.length;
    seg++;
  }
  return { seg, idx };
}

const SPEEDS = [
  { label: '慢', ms: 650 },
  { label: '中', ms: 380 },
  { label: '快', ms: 180 }
];

const MoveChip: React.FC<{ move: string; state?: 'done' | 'next' | 'todo'; onClick?: () => void }> = ({
  move,
  state = 'todo',
  onClick
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    title={MOVE_WORDS[move]}
    className={`min-w-[2.4rem] px-2 py-1 rounded-lg font-mono font-bold text-sm transition-colors ${
      state === 'done'
        ? 'bg-[#1a1c1a] text-gray-600'
        : state === 'next'
          ? 'bg-fcGreen text-black ring-2 ring-fcGreen/40'
          : 'bg-[#2A2D2A] text-gray-200'
    } ${onClick ? 'hover:bg-[#3a3d3a] hover:text-white' : ''}`}
  >
    {move}
  </button>
);

export default function CubeApp() {
  const [cube, setCube] = useState<CubeState>(() => solvedCube());
  const [queue, setQueue] = useState<QueuedMove[]>([]);
  const [anim, setAnim] = useState<{ move: string; t: number } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState<Tab>('coach');
  const [coach, setCoach] = useState<Coach | null>(null);
  const [scramble, setScramble] = useState<string[] | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  // The painting is slow work, so it outlives tab switches and reloads; only the buttons that
  // say so replace it.
  const [draft, setDraft] = useState<CubeState>(() => loadDraft() ?? solvedCube());
  /** On the colour tab: false while painting, true once the painted cube is being solved there. */
  const [paintFollowing, setPaintFollowing] = useState(false);
  const editing = tab === 'paint' && !paintFollowing;
  const [paintColor, setPaintColor] = useState<Color>('W');
  const [paintErrors, setPaintErrors] = useState<string[]>([]);
  /** The fewest-turns search is under way (its tables take a moment the first time). */
  const [solving, setSolving] = useState(false);
  const [showFullPlan, setShowFullPlan] = useState(false);

  const busy = useRef(false);
  const generation = useRef(0);
  const speedMs = useRef(SPEEDS[speed].ms);
  speedMs.current = SPEEDS[speed].ms;

  // One turn at a time off the front of the queue, animated, then committed to the cube.
  useEffect(() => {
    if (busy.current || queue.length === 0) return;
    busy.current = true;
    const gen = generation.current;
    const { move, log: logIt } = queue[0];
    const dur = speedMs.current * (move.endsWith('2') ? 1.4 : 1);
    let start: number | null = null;
    const step = (now: number) => {
      if (gen !== generation.current) return; // reset mid-turn: drop it
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / dur);
      if (t < 1) {
        setAnim({ move, t });
        requestAnimationFrame(step);
        return;
      }
      busy.current = false;
      setAnim(null);
      setCube(c => {
        const next = applyMove(c, move);
        if (isSolved(next) && !isSolved(c)) setCelebrate(true);
        return next;
      });
      if (logIt) setLog(l => [...l, move]);
      setQueue(q => q.slice(1));
    };
    setAnim({ move, t: 0 });
    requestAnimationFrame(step);
  }, [queue]);

  const idle = queue.length === 0 && !anim;

  /** Throw away anything queued or mid-turn, and put this on the cube right away. */
  const setCubeNow = useCallback((state: CubeState) => {
    generation.current++;
    busy.current = false;
    setQueue([]);
    setAnim(null);
    setCube(state);
    setLog([]);
    setCoach(null);
    setCelebrate(false);
  }, []);

  const enqueue = useCallback((moves: string[], logIt = true) => {
    setCelebrate(false);
    setQueue(q => [...q, ...moves.map(move => ({ move, log: logIt }))]);
  }, []);

  /** A turn the coach didn't ask for: its plan no longer matches the cube. */
  const manual = useCallback(
    (moves: string[]) => {
      setCoach(null);
        enqueue(moves);
    },
    [enqueue]
  );

  const undo = () => {
    // While the coach is going, Undo is its step back, so the lesson keeps its place.
    if (coach && coach.done > 0) return coachBack();
    if (!idle || !log.length) return;
    const last = log[log.length - 1];
    setLog(l => l.slice(0, -1));
    setCoach(null);
    enqueue([invertMove(last)], false);
  };

  const doScramble = () => {
    const s = randomScramble(11);
    setCubeNow(applyMoves(solvedCube(), s));
    setScramble(s);
    setTab('coach');
  };

  const doReset = () => {
    setCubeNow(solvedCube());
    setScramble(null);
  };

  // Keyboard: r l u d f b x y z, with Shift for the reverse turn.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editing || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      const map: Record<string, string> = { r: 'R', l: 'L', u: 'U', d: 'D', f: 'F', b: 'B', x: 'x', y: 'y', z: 'z' };
      if (!map[k]) return;
      e.preventDefault();
      manual([map[k] + (e.shiftKey ? "'" : '')]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing, manual]);

  // --- Coach ---------------------------------------------------------------------------------

  const startCoach = (kind: CoachKind = coach?.kind ?? 'beginner', state: CubeState = cube) => {
    setShowFullPlan(false);
    if (kind === 'beginner') {
      const plan = beginnerPlan(state);
      if (plan) setCoach({ kind, plan, done: 0 });
      return;
    }
    setSolving(true);
    // Let "计算中" paint before the search holds the thread.
    setTimeout(() => {
      const moves = solveOptimal(state);
      setSolving(false);
      if (!moves) return;
      const plan: CoachSegment[] = moves.length
        ? [
            {
              stage: 1,
              title: `电脑最快解法：${moves.length} 下`,
              detail:
                '这是电脑算出来的最少步数。魔方拿着别换方向：屏幕上朝你的那面就是手里朝你的那面，然后一下一下跟着转。只用右、上、前三层，左后下那个角从头到尾不会动。',
              moves
            }
          ]
        : [];
      setCoach({ kind, plan, done: 0 });
    }, 30);
  };

  const where = coach ? locate(coach.plan, coach.done) : null;
  const currentSeg = coach && where!.seg < coach.plan.length ? coach.plan[where!.seg] : null;
  const nextMove = currentSeg ? currentSeg.moves[where!.idx] : null;
  const planMoves = useMemo(() => coach?.plan.flatMap(s => s.moves) ?? [], [coach?.plan]);

  // The coach's turns stay out of the Undo log: going back through them is the coach's own job.
  // Clicks queue up rather than wait for the turn in progress, so tapping Back three times
  // quickly goes back three turns.
  const coachStep = () => {
    if (!coach || !nextMove) return;
    enqueue([nextMove], false);
    setCoach({ ...coach, done: coach.done + 1 });
  };

  const coachSegment = () => {
    if (!coach || !currentSeg) return;
    const rest = currentSeg.moves.slice(where!.idx);
    enqueue(rest, false);
    setCoach({ ...coach, done: coach.done + rest.length });
  };

  const coachBack = () => {
    if (!coach || coach.done === 0) return;
    enqueue([invertMove(planMoves[coach.done - 1])], false);
    setCoach({ ...coach, done: coach.done - 1 });
  };

  // --- Paint ---------------------------------------------------------------------------------

  const paint = (i: number) => {
    setDraft(d => {
      const next = d.slice();
      next[i] = paintColor;
      return next;
    });
    setPaintErrors([]);
  };

  /** Put the painted colours on the cube and start solving it right here on the colour tab. */
  const applyDraft = (kind: CoachKind) => {
    const problems = validateColors(draft);
    setPaintErrors(problems);
    if (problems.length) return;
    setCubeNow(draft);
    setScramble(null);
    setPaintFollowing(true);
    startCoach(kind, draft);
  };

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Private window or storage off: the painting just won't survive a reload.
    }
  }, [draft]);

  const counts = useMemo(() => {
    const c = {} as Record<Color, number>;
    for (const col of [...COLORS, 'X' as Color]) c[col] = draft.filter(s => s === col).length;
    return c;
  }, [draft]);

  // --- What's on screen ----------------------------------------------------------------------

  const shown = editing ? draft : cube;
  const highlight = (tab === 'coach' || (tab === 'paint' && paintFollowing)) && idle ? nextMove : null;
  const playing = anim?.move ?? highlight;
  const solved = isSolved(cube);

  const coachPanel = (
    <CoachPanel
      coach={coach}
      solved={solved}
      idle={idle}
      currentSeg={currentSeg}
      nextMove={nextMove}
      celebrate={celebrate}
      showFullPlan={showFullPlan}
      onToggleFullPlan={() => setShowFullPlan(v => !v)}
      solving={solving}
      onStart={kind => startCoach(kind)}
      where={where}
      onStep={coachStep}
      onSegment={coachSegment}
      onBack={coachBack}
      onScramble={doScramble}
      onPaint={() => {
        setPaintFollowing(false);
        setTab('paint');
      }}
    />
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'coach', label: '👩‍🏫 教我还原' },
    { id: 'moves', label: '🔄 转法和公式' },
    { id: 'paint', label: '🎨 输入颜色' }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#1f211f]" title="返回 FC Evo">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">🧊 2×2 魔方小课堂</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] gap-6">
          {/* ---------------- Left: the cube ---------------- */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full bg-[#1A1C1A] rounded-2xl border border-gray-800 flex flex-col items-center pt-4 pb-3">
              <Cube3D
                state={shown}
                view={view}
                onViewChange={setView}
                anim={editing ? null : anim}
                highlight={highlight}
                onStickerClick={editing ? paint : undefined}
              />
              <div className="h-14 flex flex-col items-center justify-center text-center px-3">
                {editing ? (
                  <span className="text-sm text-gray-400">点格子涂上颜色 · 拖动可以转着看</span>
                ) : playing ? (
                  <>
                    <span className="font-mono text-2xl font-black text-fcGreen">{playing}</span>
                    <span className="text-sm text-gray-300">{MOVE_WORDS[playing]}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">拖动魔方可以转着看</span>
                )}
              </div>
              {celebrate && !editing && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-fcGreen text-black font-black text-lg shadow-glow-green animate-bounce">
                  🎉 还原成功！
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={doScramble} className="btn-cube">
                <Shuffle className="w-4 h-4" /> 打乱
              </button>
              <button onClick={doReset} className="btn-cube">
                <RefreshCw className="w-4 h-4" /> 复原
              </button>
              <button
                onClick={undo}
                disabled={editing || !((coach && coach.done > 0) || (idle && log.length))}
                className="btn-cube"
              >
                <Undo2 className="w-4 h-4" /> 撤销
              </button>
              <button onClick={() => setView(DEFAULT_VIEW)} className="btn-cube">
                <RotateCcw className="w-4 h-4" /> 摆正
              </button>
              <div className="flex rounded-lg overflow-hidden border border-gray-800">
                {SPEEDS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSpeed(i)}
                    className={`px-3 text-sm font-bold ${speed === i ? 'bg-[#2A2D2A] text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {scramble && !editing && (
              <div className="w-full text-center text-xs text-gray-400 bg-[#1A1C1A] border border-gray-800 rounded-xl px-3 py-2">
                想让手里的魔方一样乱？白色朝上、绿色朝前，照着转：
                <div className="font-mono text-sm text-gray-200 mt-1 break-words">{scramble.join(' ')}</div>
              </div>
            )}

            <div className="w-full bg-[#1A1C1A] rounded-2xl border border-gray-800 p-4 flex flex-col items-center">
              <div className="text-xs font-bold text-gray-500 mb-1 self-start">平面展开图（2D 地图）</div>
              <CubeNet state={shown} highlight={highlight} onStickerClick={editing ? paint : undefined} />
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                把魔方的 6 个面像纸盒一样摊平：中间的"前"就是朝着你的那一面，背面、底面也一眼都能看到。
              </p>
            </div>
          </div>

          {/* ---------------- Right: tabs ---------------- */}
          <div className="flex flex-col gap-4 min-w-0">
            <div className="flex gap-1 bg-[#1A1C1A] p-1 rounded-xl border border-gray-800">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                    tab === t.id ? 'bg-[#2A2D2A] text-white' : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'coach' && coachPanel}

            {tab === 'moves' && (
              <MovesPanel
                idle={idle}
                onMoves={manual}
                solving={solving}
                solved={solved}
                onOptimal={() => {
                  setTab('coach');
                  startCoach('optimal');
                }}
              />
            )}

            {tab === 'paint' && paintFollowing && (
              <>
                <div className="panel-cube flex items-center justify-between gap-3 flex-wrap py-3">
                  <span className="text-sm text-gray-300">🎨 正在解你涂的这个魔方</span>
                  <button onClick={() => setPaintFollowing(false)} className="btn-cube py-1.5">
                    ✏️ 回去改颜色
                  </button>
                </div>
                {coachPanel}
              </>
            )}

            {editing && (
              <div className="panel-cube flex flex-col gap-4">
                <div className="text-sm text-gray-300 leading-relaxed">
                  <p className="font-bold text-white mb-1">把手里魔方的颜色填进来</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-400">
                    <li>
                      拿着魔方，随便选一面<b className="text-gray-200">对着你</b>，这面就是<b className="text-gray-200">"前 F"</b>，朝天的是<b className="text-gray-200">"上 U"</b>。
                    </li>
                    <li>先选下面的颜色，再点魔方图上的格子。平面图最好点；3D 图拖着转也能点到背面。</li>
                    <li>
                      2×2 没有中心块，24 个格子都要填。看<b className="text-gray-200">"右 R"</b>时把魔方往左转一下看右面，看完记得转回来。
                    </li>
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setPaintColor(c)}
                      className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border-2 transition-colors ${
                        paintColor === c ? 'border-white bg-[#2A2D2A]' : 'border-transparent bg-[#121212] hover:bg-[#222]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-md border border-black/40" style={{ background: COLOR_HEX[c] }} />
                      <span className="text-sm font-bold">{COLOR_NAME[c]}</span>
                      <span className={`text-xs font-mono ${counts[c] === 4 ? 'text-fcGreen' : counts[c] > 4 ? 'text-red-400' : 'text-gray-500'}`}>
                        {counts[c]}/4
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => setPaintColor('X')}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border-2 ${
                      paintColor === 'X' ? 'border-white bg-[#2A2D2A]' : 'border-transparent bg-[#121212] hover:bg-[#222]'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-md border border-black/40" style={{ background: COLOR_HEX.X }} />
                    <span className="text-sm font-bold text-gray-400">橡皮</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => applyDraft('beginner')}
                    disabled={solving}
                    className="btn-cube bg-fcGreen text-black hover:bg-[#1db954] hover:text-black border-transparent"
                  >
                    <Check className="w-4 h-4" /> 涂好了，教我还原
                  </button>
                  <button onClick={() => applyDraft('optimal')} disabled={solving} className="btn-cube">
                    <Wand2 className="w-4 h-4" /> {solving ? '计算中…' : '涂好了，用电脑最快解法'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setDraft(blankCube()); setPaintErrors([]); }} className="btn-cube">
                    全部清空
                  </button>
                  <button onClick={() => { setDraft(cube); setPaintErrors([]); }} className="btn-cube">
                    换回屏幕上的魔方
                  </button>
                </div>

                {paintErrors.length > 0 && (
                  <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/50 rounded-xl p-3 space-y-1">
                    {paintErrors.map(p => (
                      <div key={p}>⚠️ {p}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------

const StageBar: React.FC<{ current: Stage | 5 }> = ({ current }) => (
  <div className="grid grid-cols-4 gap-1.5">
    {([1, 2, 3, 4] as Stage[]).map(s => (
      <div
        key={s}
        className={`rounded-lg px-2 py-1.5 text-center text-[11px] sm:text-xs font-bold leading-tight ${
          s < current ? 'bg-fcGreen/15 text-fcGreen' : s === current ? 'bg-fcGreen text-black' : 'bg-[#121212] text-gray-600'
        }`}
      >
        {s < current ? '✓ ' : `${s}. `}
        {STAGE_TITLES[s]}
      </div>
    ))}
  </div>
);

interface CoachPanelProps {
  coach: Coach | null;
  solved: boolean;
  idle: boolean;
  currentSeg: CoachSegment | null;
  nextMove: string | null;
  where: { seg: number; idx: number } | null;
  celebrate: boolean;
  showFullPlan: boolean;
  onToggleFullPlan: () => void;
  solving: boolean;
  onStart: (kind?: CoachKind) => void;
  onStep: () => void;
  onSegment: () => void;
  onBack: () => void;
  onScramble: () => void;
  onPaint: () => void;
}

const CoachPanel: React.FC<CoachPanelProps> = ({
  coach,
  solved,
  idle,
  currentSeg,
  nextMove,
  where,
  celebrate,
  showFullPlan,
  onToggleFullPlan,
  solving,
  onStart,
  onStep,
  onSegment,
  onBack,
  onScramble,
  onPaint
}) => {
  if (!coach) {
    if (solved) {
      return (
        <div className="panel-cube space-y-4">
          <p className="text-gray-300">
            {celebrate ? '🎉 太棒了，魔方还原啦！' : '屏幕上的魔方现在是还原好的。'}想练习的话：
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={onScramble} className="btn-cube">
              <Shuffle className="w-4 h-4" /> 随机打乱一个
            </button>
            <button onClick={onPaint} className="btn-cube">
              🎨 输入手里魔方的颜色
            </button>
          </div>
          <MethodOverview />
        </div>
      );
    }
    return (
      <div className="panel-cube space-y-4">
        <p className="text-gray-300">我会按"新手层先法"一步一步教，每一步都告诉你转哪里、转几下。</p>
        <button
          onClick={() => onStart('beginner')}
          disabled={!idle || solving}
          className="w-full py-3 rounded-xl bg-fcGreen text-black font-black text-lg hover:bg-[#1db954] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" /> 开始教我
        </button>
        <button
          onClick={() => onStart('optimal')}
          disabled={!idle || solving}
          className="w-full py-2.5 rounded-xl bg-[#2A2D2A] text-white font-bold hover:bg-[#3a3d3a] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" /> {solving ? '计算中…' : '跟着电脑最快解法做（不超过 11 下）'}
        </button>
        <MethodOverview />
      </div>
    );
  }

  if (!currentSeg) {
    return (
      <div className="panel-cube space-y-4 text-center">
        {coach.kind === 'beginner' && <StageBar current={5} />}
        <div className="text-5xl pt-4">🎉</div>
        <p className="text-xl font-black">还原成功！</p>
        <p className="text-gray-400 text-sm">
          {coach.kind === 'beginner'
            ? '再来一次？每次只用这三个公式，多练几遍就能背下来。'
            : `电脑只用了 ${coach.done} 下。想自己学会还原，还是用"开始教我"的新手方法。`}
        </p>
        <div className="flex justify-center gap-2">
          <button onClick={onBack} className="btn-cube">
            <ChevronLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={onScramble} className="btn-cube">
            <Shuffle className="w-4 h-4" /> 再打乱一个
          </button>
        </div>
      </div>
    );
  }

  const done = where!.idx;
  const optimal = coach.kind === 'optimal';
  return (
    <div className="panel-cube space-y-4">
      {!optimal && <StageBar current={currentSeg.stage} />}

      <div className="rounded-xl bg-[#121212] border border-gray-800 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-fcGreen">
            {optimal ? `第 ${done + 1} / ${currentSeg.moves.length} 下` : `第 ${currentSeg.stage} 步`}
          </span>
          <span className="text-lg font-black">{currentSeg.title}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{currentSeg.detail}</p>
        {currentSeg.formula && (
          <div className="text-xs text-gray-400">
            公式：<b className="text-gray-200">{FORMULAS[currentSeg.formula].nickname}</b>{' '}
            <span className="font-mono">{FORMULAS[currentSeg.formula].name}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {currentSeg.moves.map((m, i) => (
            <MoveChip key={i} move={m} state={i < done ? 'done' : i === done ? 'next' : 'todo'} />
          ))}
        </div>
      </div>

      {nextMove && (
        <div className="rounded-xl bg-fcGreen/10 border border-fcGreen/30 p-3 flex items-center gap-3">
          <span className="font-mono text-3xl font-black text-fcGreen w-14 text-center">{nextMove}</span>
          <span className="text-base text-gray-100">{MOVE_WORDS[nextMove]}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={coach.done === 0}
          title="退回上一下，可以一直往回退"
          className="px-4 py-3 rounded-xl bg-[#2A2D2A] text-white font-bold text-base hover:bg-[#3a3d3a] disabled:opacity-40 flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-5 h-5" /> 上一步
        </button>
        <button
          onClick={onStep}
          className="flex-1 py-3 rounded-xl bg-fcGreen text-black font-black text-base hover:bg-[#1db954] disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <ChevronRight className="w-5 h-5" /> 下一下
        </button>
        <button
          onClick={onSegment}
          className="flex-1 py-3 rounded-xl bg-[#2A2D2A] text-white font-bold text-base hover:bg-[#3a3d3a] disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          <FastForward className="w-5 h-5" /> {optimal ? '全部做完' : '这一段做完'}
        </button>
      </div>
      <div className="flex justify-between items-center gap-3 flex-wrap">
        {optimal ? (
          <button onClick={() => onStart('beginner')} disabled={!idle || solving} className="text-xs text-gray-500 hover:text-gray-200">
            换成新手方法教我
          </button>
        ) : (
          <button onClick={onToggleFullPlan} className="text-xs text-gray-500 hover:text-gray-200">
            {showFullPlan ? '收起全部步骤' : `查看全部步骤（共 ${coach.plan.length} 段）`}
          </button>
        )}
        <div className="flex gap-3">
          {!optimal && (
            <button onClick={() => onStart('optimal')} disabled={!idle || solving} className="text-xs text-gray-500 hover:text-gray-200 flex items-center gap-1">
              <Wand2 className="w-3 h-3" /> {solving ? '计算中…' : '换成电脑最快解法'}
            </button>
          )}
          <button onClick={() => onStart()} disabled={!idle || solving} className="text-xs text-gray-500 hover:text-gray-200 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> 重新分析
          </button>
        </div>
      </div>
      {!optimal && showFullPlan && (
        <ol className="space-y-1.5">
          {coach.plan.map((seg, i) => (
            <li
              key={i}
              className={`text-xs rounded-lg px-3 py-2 ${
                i < where!.seg ? 'text-gray-600' : i === where!.seg ? 'bg-[#2A2D2A] text-white' : 'text-gray-400'
              }`}
            >
              <span className="font-bold">
                {i < where!.seg ? '✓ ' : ''}
                {seg.stage}. {seg.title}
              </span>
              <span className="font-mono ml-2">{seg.moves.join(' ')}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs text-gray-500 leading-relaxed">
        手里的魔方跟着一起转：屏幕上朝你的那面 = 手里朝你的那面。转错了也没关系，点"撤销"或者重新输入颜色，再点"重新分析"。
      </p>
    </div>
  );
};

const MethodOverview: React.FC = () => (
  <div className="rounded-xl bg-[#121212] border border-gray-800 p-4 text-sm text-gray-400 space-y-2">
    <p className="font-bold text-gray-200">新手方法：4 步，只要 3 个公式</p>
    <ol className="space-y-1.5">
      <li>
        <b className="text-gray-200">1. 白色底层</b> — 白角放到右前上方，重复 <span className="font-mono text-gray-200">R U R' U'</span>
      </li>
      <li>
        <b className="text-gray-200">2. 黄色朝上</b> — 重复 <span className="font-mono text-gray-200">R' D' R D</span>，只转顶层换下一个角
      </li>
      <li>
        <b className="text-gray-200">3. 顶层换位置</b> — "车灯"放左边，做交换公式 T
      </li>
      <li>
        <b className="text-gray-200">4. 对齐</b> — 转顶层，完成！
      </li>
    </ol>
  </div>
);

// ---------------------------------------------------------------------------------------------

const MOVE_GROUPS: { title: string; moves: string[] }[] = [
  { title: '右 R / 左 L', moves: ['R', "R'", 'R2', 'L', "L'", 'L2'] },
  { title: '上 U / 下 D', moves: ['U', "U'", 'U2', 'D', "D'", 'D2'] },
  { title: '前 F / 后 B', moves: ['F', "F'", 'F2', 'B', "B'", 'B2'] },
  { title: '整个魔方', moves: ['x', "x'", 'y', "y'", 'z', "z'"] }
];

interface MovesPanelProps {
  idle: boolean;
  solved: boolean;
  onMoves: (moves: string[]) => void;
  solving: boolean;
  onOptimal: () => void;
}

const MovesPanel: React.FC<MovesPanelProps> = ({ idle, solved, onMoves, solving, onOptimal }) => (
  <div className="flex flex-col gap-4">
    <div className="panel-cube space-y-3">
      <p className="font-bold">怎么看转法记号</p>
      <ul className="text-sm text-gray-400 space-y-1">
        <li>
          字母 = 转哪一层：<b className="text-gray-200">R</b>右 <b className="text-gray-200">L</b>左 <b className="text-gray-200">U</b>上{' '}
          <b className="text-gray-200">D</b>下 <b className="text-gray-200">F</b>前 <b className="text-gray-200">B</b>后
        </li>
        <li>
          只有字母 = 看着那一面<b className="text-gray-200">顺时针</b>转 90°；带 <b className="text-gray-200 font-mono">'</b> = 反过来转；带{' '}
          <b className="text-gray-200 font-mono">2</b> = 转两下
        </li>
        <li>
          小写 <b className="text-gray-200 font-mono">x y z</b> = 整个魔方一起转（手里换个拿法），不是拧
        </li>
        <li>
          键盘也能转：按 <span className="font-mono">R</span>，加 Shift 就是 <span className="font-mono">R'</span>
        </li>
      </ul>
      <div className="space-y-2">
        {MOVE_GROUPS.map(g => (
          <div key={g.title} className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-20 shrink-0">{g.title}</span>
            {g.moves.map(m => (
              <MoveChip key={m} move={m} onClick={() => onMoves([m])} />
            ))}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-500">鼠标停在按钮上会显示怎么转。</p>
    </div>

    <div className="panel-cube space-y-3">
      <p className="font-bold">三个公式</p>
      {(Object.keys(FORMULAS) as FormulaId[]).map(id => {
        const f = FORMULAS[id];
        return (
          <div key={id} className="rounded-xl bg-[#121212] border border-gray-800 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span className="font-black">{f.nickname}</span>
                <span className="font-mono text-sm text-gray-300 ml-2">{f.name}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => onMoves(f.moves)} disabled={!idle} className="btn-cube py-1 text-xs">
                  <Play className="w-3 h-3" /> 演示
                </button>
                <button onClick={() => onMoves(invertMoves(f.moves))} disabled={!idle} className="btn-cube py-1 text-xs">
                  <Undo2 className="w-3 h-3" /> 倒回去
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">{f.use}</p>
          </div>
        );
      })}
      <p className="text-[11px] text-gray-500">
        小窍门："右手四步"连做 6 遍，魔方会变回原样——可以用来练手感。
      </p>
    </div>

    <div className="panel-cube space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold">电脑最快解法</p>
        <button onClick={onOptimal} disabled={!idle || solved || solving} className="btn-cube py-1 text-xs">
          <Wand2 className="w-3 h-3" /> {solving ? '计算中…' : '一步步跟着做'}
        </button>
      </div>
      <p className="text-xs text-gray-400">
        电脑算出的最少步数（任何 2×2 都不超过 11 下）。会跳到"教我还原"，跟新手方法一样能一下一下前进、后退。适合家长检查，不适合背——小朋友还是学上面的方法。
      </p>
    </div>
  </div>
);
