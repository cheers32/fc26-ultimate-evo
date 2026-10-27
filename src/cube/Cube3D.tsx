import React, { useRef } from 'react';
import {
  COLOR_HEX,
  CUBIE_POSITIONS,
  CubeState,
  FACE_DIR,
  FaceName,
  FACES,
  inMovedLayer,
  parseMove,
  stickerIndex,
  Vec
} from './cubeModel';

/**
 * The cube in CSS 3D: eight cubies, six faces each, no WebGL needed.
 *
 * CSS's y axis points down where the model's points up, so positions flip y, and a rotation of
 * θ about axis a in the model is rotate3d(ax, −ay, az, −θ) on screen.
 */

export interface View {
  yaw: number;
  pitch: number;
}

export const DEFAULT_VIEW: View = { yaw: -35, pitch: 28 };

interface Props {
  state: CubeState;
  view: View;
  onViewChange: (v: View) => void;
  /** A turn in progress: which move and how far through it (0–1). */
  anim: { move: string; t: number } | null;
  /** Ring the stickers of the layer this move would turn. */
  highlight?: string | null;
  onStickerClick?: (index: number) => void;
  size?: number;
}

const FACE_CSS: Record<FaceName, string> = {
  F: 'translateZ(var(--h))',
  B: 'rotateY(180deg) translateZ(var(--h))',
  R: 'rotateY(90deg) translateZ(var(--h))',
  L: 'rotateY(-90deg) translateZ(var(--h))',
  U: 'rotateX(90deg) translateZ(var(--h))',
  D: 'rotateX(-90deg) translateZ(var(--h))'
};

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function animTransform(move: string, t: number): string {
  const { def, turns } = parseMove(move);
  const quarters = turns === 3 ? -1 : turns;
  const theta = def.dir * 90 * quarters * ease(t);
  const axis: Vec = [0, 0, 0];
  axis[def.axis] = 1;
  return `rotate3d(${axis[0]}, ${-axis[1]}, ${axis[2]}, ${-theta}deg) `;
}

export const Cube3D: React.FC<Props> = ({ state, view, onViewChange, anim, highlight, onStickerClick, size = 64 }) => {
  const h = size / 2;
  const drag = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, view, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;
    onViewChange({
      yaw: d.view.yaw + dx * 0.5,
      pitch: Math.max(-85, Math.min(85, d.view.pitch - dy * 0.5))
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved && onStickerClick) {
      // Pointer capture retargets the up event, so find what's actually under the finger.
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const idx = el?.closest('[data-sticker]')?.getAttribute('data-sticker');
      if (idx != null) onStickerClick(Number(idx));
    }
  };

  return (
    <div
      className="relative select-none touch-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      style={{ width: size * 4.4, height: size * 4.4, perspective: size * 14 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
    >
      <div
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-view.pitch}deg) rotateY(${view.yaw}deg)`,
          ['--h' as string]: `${h}px`
        }}
      >
        {CUBIE_POSITIONS.map(pos => {
          const moving = anim && inMovedLayer(anim.move, pos);
          const lit = highlight && !anim && inMovedLayer(highlight, pos);
          return (
            <div
              key={pos.join()}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                left: -h,
                top: -h,
                transformStyle: 'preserve-3d',
                transform:
                  (moving ? animTransform(anim!.move, anim!.t) : '') +
                  `translate3d(${pos[0] * h}px, ${-pos[1] * h}px, ${pos[2] * h}px)`
              }}
            >
              {FACES.map(face => {
                const dir = FACE_DIR[face];
                const axis = dir.findIndex(v => v !== 0);
                const outward = pos[axis] === dir[axis];
                const idx = outward ? stickerIndex(pos, dir) : -1;
                return (
                  <div
                    key={face}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transform: FACE_CSS[face],
                      background: '#0d0d0d',
                      borderRadius: size * 0.08,
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {outward && (
                      <div
                        data-sticker={idx}
                        className={lit ? 'cube-sticker-lit' : undefined}
                        style={{
                          position: 'absolute',
                          inset: size * 0.06,
                          borderRadius: size * 0.12,
                          background: COLOR_HEX[state[idx]],
                          boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.25)',
                          cursor: onStickerClick ? 'pointer' : undefined
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
