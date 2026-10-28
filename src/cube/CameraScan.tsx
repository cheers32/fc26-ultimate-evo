import React, { useEffect, useRef, useState } from 'react';
import { Camera, ChevronLeft, X } from 'lucide-react';
import { COLOR_HEX, CubeState, FACE_NAME_ZH, applyMoves, blankCube } from './cubeModel';
import { Cube3D, DEFAULT_VIEW } from './Cube3D';
import { GUIDE, RGB, SCAN_STEPS, guessColor, photoStickers, sampleFrame, scansToCube, turnsUpTo } from './scan';

/**
 * Point the camera at the cube, one face at a time, and the colours fill themselves in.
 * The little cube beside the picture turns the way the real one should, so it's clear what to do.
 */

interface Props {
  onDone: (state: CubeState) => void;
  onClose: () => void;
}

const TURN_MS = 550;

export const CameraScan: React.FC<Props> = ({ onDone, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mirror, setMirror] = useState(false);
  const [live, setLive] = useState<RGB[] | null>(null);
  const [shots, setShots] = useState<RGB[][]>([]);
  const step = shots.length;
  const [flash, setFlash] = useState(false);
  /** The preview cube turning from the last hold into this one. */
  const [turning, setTurning] = useState<{ done: number; move: string; t: number } | null>(null);

  // Camera on while open, off when closed.
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (cancelled) return stream.getTracks().forEach(t => t.stop());
        // A camera facing you shows a mirror image, which is easier to line up against.
        setMirror(stream.getVideoTracks()[0]?.getSettings().facingMode !== 'environment');
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play();
      } catch (e) {
        const name = (e as DOMException)?.name;
        setError(
          name === 'NotAllowedError'
            ? '没有拿到摄像头权限。请在浏览器地址栏旁边允许使用摄像头，然后再点一次"用摄像头拍"。'
            : name === 'NotFoundError'
              ? '这台设备上没找到摄像头。'
              : '摄像头打不开（可能被别的程序占用了）。'
        );
      }
    })();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Read the four squares a few times a second for the live preview.
  useEffect(() => {
    const id = window.setInterval(() => {
      const v = videoRef.current;
      if (!v || v.readyState < 2 || !v.videoWidth) return;
      const scale = Math.min(1, 360 / Math.min(v.videoWidth, v.videoHeight));
      const w = Math.round(v.videoWidth * scale);
      const h = Math.round(v.videoHeight * scale);
      const canvas = (canvasRef.current ??= document.createElement('canvas'));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(v, 0, 0, w, h);
      setLive(sampleFrame(ctx, w, h));
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  // Show the turn to the next face on the little cube.
  useEffect(() => {
    const turn = SCAN_STEPS[step]?.turn ?? [];
    if (!turn.length) return setTurning(null);
    let raf = 0;
    let start = performance.now() + 250;
    let done = 0;
    const tick = (now: number) => {
      const t = Math.max(0, (now - start) / TURN_MS);
      if (t >= 1) {
        done++;
        start = now;
        if (done >= turn.length) return setTurning(null);
      }
      setTurning({ done, move: turn[done], t: Math.min(1, t) });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  // A camera that's covered, or still starting up, gives a black picture; don't take that.
  const dark = !live || live.every(([r, g, b]) => r + g + b < 60);

  const capture = () => {
    if (!live || dark) return;
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    const next = [...shots, live];
    if (next.length === SCAN_STEPS.length) onDone(scansToCube(next));
    else setShots(next);
  };

  // What's been read so far, held the way the cube should be held now.
  const partial = blankCube();
  shots.forEach((s, i) => photoStickers(i).forEach((idx, cell) => (partial[idx] = guessColor(s[cell]))));
  const current = SCAN_STEPS[step] ?? SCAN_STEPS[SCAN_STEPS.length - 1];
  const before = turnsUpTo(step - 1);
  const held = turning
    ? applyMoves(partial, [...before, ...current.turn.slice(0, turning.done)])
    : applyMoves(partial, turnsUpTo(step));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-start sm:items-center justify-center overflow-y-auto p-3">
      <div className="w-full max-w-3xl bg-[#1A1C1A] border border-gray-800 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">📷 用摄像头拍魔方</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2D2A]" title="关闭">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1.5">
          {SCAN_STEPS.map((s, i) => (
            <div
              key={s.face}
              className={`text-center text-xs font-bold rounded-lg py-1.5 ${
                i < step ? 'bg-fcGreen/20 text-fcGreen' : i === step ? 'bg-white text-black' : 'bg-[#121212] text-gray-500'
              }`}
            >
              {i < step ? '✓ ' : ''}
              {FACE_NAME_ZH[s.face]}
            </div>
          ))}
        </div>

        <div className="bg-[#121212] rounded-xl p-3 text-sm leading-relaxed flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white mb-1">
              第 {Math.min(step + 1, 6)} 步 / 共 6 步：拍「{FACE_NAME_ZH[current.face]}」面
            </p>
            <p className="text-gray-300">{current.say}</p>
            <p className="text-gray-500 mt-1">右边小魔方演示怎么转。让要拍的面正好装满白框，四个圆点颜色对了就点"拍这一面"。光线亮一点更准。</p>
          </div>
          {/* How to hold it: turns the way the real cube should, then the face to shoot is in front. */}
          <div className="shrink-0 w-[100px] h-[100px] flex items-center justify-center overflow-hidden">
            <div className="scale-[0.8]">
              <Cube3D
                state={held}
                view={DEFAULT_VIEW}
                onViewChange={() => {}}
                anim={turning ? { move: turning.move, t: turning.t } : null}
                size={28}
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-red-300 bg-red-950/30 border border-red-900/50 rounded-xl p-4">⚠️ {error}</div>
        ) : (
          <div className="flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-xl overflow-hidden bg-black">
              <div className="absolute inset-0" style={{ transform: mirror ? 'scaleX(-1)' : undefined }}>
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                {live && (
                  <div
                    className="absolute grid grid-cols-2"
                    style={{ inset: `${((1 - GUIDE) / 2) * 100}%` }}
                  >
                    {live.map((rgb, k) => (
                      <div key={k} className="flex items-center justify-center">
                        <span
                          className="w-6 h-6 rounded-full border-2 border-white shadow"
                          style={{ background: COLOR_HEX[guessColor(rgb)] }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* The guide: fit the cube's face to it. */}
              <div
                className="absolute border-[3px] border-white/90 rounded-lg pointer-events-none"
                style={{ inset: `${((1 - GUIDE) / 2) * 100}%`, boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)' }}
              >
                <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-white/50" />
                <div className="absolute top-1/2 left-0 right-0 border-t-2 border-white/50" />
              </div>
              {flash && <div className="absolute inset-0 bg-white/70" />}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={capture}
            disabled={dark || !!error}
            className="btn-cube bg-fcGreen text-black hover:bg-[#1db954] hover:text-black border-transparent disabled:opacity-40"
          >
            <Camera className="w-4 h-4" /> 拍这一面
          </button>
          <button onClick={() => setShots(s => s.slice(0, -1))} disabled={!step} className="btn-cube disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" /> 重拍上一面
          </button>
        </div>
      </div>
    </div>
  );
};
