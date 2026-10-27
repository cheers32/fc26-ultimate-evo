import React from 'react';
import { COLOR_HEX, CubeState, FACE_NAME_ZH, FaceName, NET_LAYOUT, STICKERS, inMovedLayer, netSticker } from './cubeModel';

/**
 * The cube unfolded flat: every sticker at once, nothing hidden round the back.
 * Folding it back up in your head is how you read a real cube's state off this map.
 */

interface Props {
  state: CubeState;
  cell?: number;
  highlight?: string | null;
  onStickerClick?: (index: number) => void;
}

export const CubeNet: React.FC<Props> = ({ state, cell = 22, highlight, onStickerClick }) => {
  const gap = 2;
  const faceSize = cell * 2 + gap;
  const pad = 8;
  const padY = 18;
  return (
    <div className="relative" style={{ width: faceSize * 4 + pad * 3, height: faceSize * 3 + padY * 3 }}>
      {(Object.keys(NET_LAYOUT) as FaceName[]).map(face => {
        const { col, row } = NET_LAYOUT[face];
        return (
          <div
            key={face}
            className="absolute grid"
            style={{
              left: col * (faceSize + pad),
              top: padY + row * (faceSize + padY),
              gridTemplateColumns: `repeat(2, ${cell}px)`,
              gap
            }}
          >
            {[0, 1].flatMap(r =>
              [0, 1].map(c => {
                const idx = netSticker(face, r, c);
                const lit = highlight && inMovedLayer(highlight, STICKERS[idx].pos);
                return (
                  <button
                    key={`${r}${c}`}
                    type="button"
                    disabled={!onStickerClick}
                    onClick={() => onStickerClick?.(idx)}
                    className={`rounded-[5px] border border-black/40 ${onStickerClick ? 'hover:scale-110 transition-transform' : ''} ${lit ? 'cube-sticker-lit' : ''}`}
                    style={{ width: cell, height: cell, background: COLOR_HEX[state[idx]] }}
                  />
                );
              })
            )}
            <span
              className="absolute text-[10px] font-bold text-gray-500 pointer-events-none"
              style={{ left: 0, top: -14 }}
            >
              {FACE_NAME_ZH[face]} {face}
            </span>
          </div>
        );
      })}
    </div>
  );
};
