import React, { useMemo, useState } from 'react';
import { ChevronDown, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { PlayerData, Squad, SquadSlot, StatsData } from '../types/player';
import { fitScore, controlModeFor } from '../utils/fitScore';
import { simulateEvoChain } from '../utils/evoEngine';
import { getStatColorClass } from '../utils/statUtils';

/**
 * A squad laid out the way it is actually played, because a list of eleven names doesn't answer
 * the question you have in front of it — who is out of position, and who would be better where.
 *
 * 4-2-3-1 only, deliberately: it's the formation being built for, and a slot's position is what
 * makes "wrong position" and "fit here" mean anything. The twelve slots beside it are the rest of
 * the squad, which has no position to be judged against — that is the whole difference between the
 * two halves.
 *
 * Nothing here owns anything. A slot points at a player and one of that player's builds, and every
 * number on the card is recomputed from those two things.
 */

export interface PitchSlot {
  id: string;
  /** The position the slot demands — what a card is judged against when it sits here. */
  pos: string;
  /** Percentages, so the pitch scales with its container. */
  x: number;
  y: number;
}

export const FORMATION_4231: PitchSlot[] = [
  { id: 'gk', pos: 'GK', x: 50, y: 92 },
  { id: 'lb', pos: 'LB', x: 12, y: 72 },
  { id: 'lcb', pos: 'CB', x: 35, y: 74 },
  { id: 'rcb', pos: 'CB', x: 65, y: 74 },
  { id: 'rb', pos: 'RB', x: 88, y: 72 },
  { id: 'lcdm', pos: 'CDM', x: 35, y: 51 },
  { id: 'rcdm', pos: 'CDM', x: 65, y: 51 },
  { id: 'lw', pos: 'LM', x: 13, y: 31 },
  { id: 'cam', pos: 'CAM', x: 50, y: 31 },
  { id: 'rw', pos: 'RM', x: 87, y: 31 },
  { id: 'st', pos: 'ST', x: 50, y: 11 }
];

/** The rest of the squad. No position, so nothing here is ever "out of position". */
export const RESERVE_SLOTS: string[] = Array.from({ length: 12 }, (_, i) => `res${i + 1}`);

/** Every slot on the pitch and beside it. A squad is exactly these and nothing else. */
export const ALL_SLOT_IDS: string[] = [...FORMATION_4231.map(s => s.id), ...RESERVE_SLOTS];

/** Positions that play the same role closely enough not to be worth a warning. */
const INTERCHANGEABLE: Record<string, string[]> = {
  LM: ['LW', 'LM'],
  RM: ['RW', 'RM'],
  CAM: ['CAM', 'CF'],
  CDM: ['CDM', 'CM'],
  ST: ['ST', 'CF'],
  CB: ['CB'],
  LB: ['LB', 'LWB'],
  RB: ['RB', 'RWB'],
  GK: ['GK']
};

const playsHere = (slotPos: string, playerPositions: string[]): boolean => {
  const accepted = INTERCHANGEABLE[slotPos] || [slotPos];
  return playerPositions.some(p => accepted.includes(p));
};

/** The six headline stats, in card order, as they end up after the build. */
const faceStats = (stats: StatsData) =>
  Object.keys(stats)
    .slice(0, 6)
    .map(key => ({ key, label: stats[key].label, value: stats[key].baseFace }));

interface SlotDetail {
  entry: SquadSlot;
  player: PlayerData;
  name: string;
  ovr: number;
  positions: string[];
  faces: { key: string; label: string; value: number }[];
  fitFor: (pos: string) => number;
}

interface SquadPitchProps {
  squads: Squad[];
  activeSquadId: string | null;
  onSelectSquad: (squadId: string) => void;
  /** Open the build standing in a slot back up in the workbench. */
  onOpenSlot: (entry: SquadSlot) => void;
  /** Take the card off the pitch. The build stays saved on the player. */
  onClearSlot: (squadId: string, slotId: string) => void;
  /** Start another squad — a squad is one pitch, so a new pitch is a new squad. */
  onCreateSquad: (name: string) => string;
  onDeleteSquad: (squadId: string) => void;
  /** One click on an empty slot: the build currently open goes straight in there. */
  onAddCurrentToSlot: (squadId: string | null, slotId: string) => void;
  /** Drag one slot onto another — they trade places, whether or not the target is occupied. */
  onSwapSlots: (squadId: string, fromSlotId: string, toSlotId: string) => void;
  /** Name of the build on screen, for the "add me here" tooltip. */
  currentName?: string;
  playersById: Record<string, PlayerData>;
}

export const SquadPitch: React.FC<SquadPitchProps> = ({
  squads,
  activeSquadId,
  onSelectSquad,
  onOpenSlot,
  onClearSlot,
  onCreateSquad,
  onDeleteSquad,
  onAddCurrentToSlot,
  onSwapSlots,
  currentName,
  playersById
}) => {
  /** Which slot is being dragged. A squad is only its slots, so that is the only thing to drag. */
  const [dragSlot, setDragSlot] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const squad = squads.find(s => s.id === activeSquadId) || squads[0] || null;

  /**
   * Everything a card shows, worked out from the two things a slot stores: which player, and which
   * of their builds. Nothing is read from a snapshot, so a card can never be out of date.
   */
  const details = useMemo(() => {
    const map = new Map<string, SlotDetail>();
    if (!squad) return map;

    Object.entries(squad.slots || {}).forEach(([slotId, entry]) => {
      const player = playersById[entry.playerId];
      // A slot pointing at a player who is gone is an empty slot — App drops these on read.
      if (!player) return;

      const result = simulateEvoChain(
        entry.chainIds,
        player.bio,
        player.ovr,
        player.stats,
        player.playStyles
      );
      const positions = result.finalBio.primaryPositions.split(',').map(p => p.trim()).filter(Boolean);

      map.set(slotId, {
        entry,
        player,
        name: player.bio.name,
        ovr: result.finalOvr,
        positions,
        faces: faceStats(result.finalStats),
        // Judged as if the slot's position were the player's own — that is the question the
        // pitch is asking: what is this card worth *here*.
        fitFor: (pos: string) =>
          fitScore({
            stats: result.finalStats,
            playStyles: result.finalPlayStyles,
            bio: { ...result.finalBio, primaryPositions: pos },
            mode: controlModeFor({ ...result.finalBio, primaryPositions: pos })
          }).total
      });
    });
    return map;
  }, [squad, playersById]);

  /** Every slot is a drop target, so the handlers are the same wherever the slot is drawn. */
  const dropProps = (slotId: string) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!dragSlot) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverSlot !== slotId) setDragOverSlot(slotId);
    },
    onDragLeave: () => setDragOverSlot(prev => (prev === slotId ? null : prev)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverSlot(null);
      const from = dragSlot;
      setDragSlot(null);
      if (from && squad && from !== slotId) onSwapSlots(squad.id, from, slotId);
    }
  });

  /**
   * An empty slot is a button, not a hint: one click puts the build on screen into it. That is the
   * whole point — the squad is assembled from the workbench without a detour through a list.
   */
  const renderEmpty = (slotId: string, pos?: string) => {
    const isOver = dragOverSlot === slotId;
    return (
      <button
        onClick={() => onAddCurrentToSlot(squad?.id ?? null, slotId)}
        title={currentName ? `Put ${currentName} here` : 'Put the current build here'}
        {...dropProps(slotId)}
        className={`w-[64px] h-[58px] rounded-xl border border-dashed flex flex-col items-center justify-center transition-colors ${
          isOver
            ? 'border-fcGreen bg-fcGreen/15 text-fcGreen'
            : 'border-gray-700 bg-black/40 text-gray-600 hover:border-fcGreen/70 hover:bg-fcGreen/5 hover:text-fcGreen'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        {pos && <span className="text-[9px] font-bold mt-0.5">{pos}</span>}
      </button>
    );
  };

  /** A filled slot. Same card on the pitch and in the reserves; only the fit warning differs. */
  const renderCard = (slotId: string, detail: SlotDetail, pos?: string) => {
    const mismatch = !!pos && detail.positions.length > 0 && !playsHere(pos, detail.positions);
    const fit = pos ? detail.fitFor(pos) : 0;
    const isOver = dragOverSlot === slotId;
    const isDragging = dragSlot === slotId;

    return (
      <div
        draggable
        onDragStart={e => {
          e.dataTransfer.effectAllowed = 'move';
          // Firefox refuses to start a drag without payload, even one nothing reads.
          e.dataTransfer.setData('text/plain', slotId);
          setDragSlot(slotId);
        }}
        onDragEnd={() => {
          setDragSlot(null);
          setDragOverSlot(null);
        }}
        {...dropProps(slotId)}
        onClick={() => onOpenSlot(detail.entry)}
        title={
          detail.name +
          (pos ? `\nFit at ${pos}: ${fit.toFixed(1)}` : '') +
          (mismatch ? `\nOut of position (plays ${detail.positions.join(', ')})` : '') +
          `\n${detail.faces.map(f => `${f.label} ${f.value}`).join(' · ')}` +
          '\nDrag onto another slot to swap'
        }
        className={`w-[64px] rounded-xl p-1 border cursor-grab active:cursor-grabbing transition-all ${
          isDragging ? 'opacity-40' : ''
        } ${
          isOver
            ? 'border-fcGreen bg-fcGreen/15'
            : mismatch
            ? 'bg-red-950/40 border-red-800/70 hover:border-red-500'
            : 'bg-[#1f211f] border-gray-700 hover:border-fcGreen'
        }`}
      >
        <div className="relative flex justify-center">
          <div className="relative">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-600 bg-[#121212]">
              {detail.player.avatarUrl && (
                <img
                  src={detail.player.avatarUrl}
                  alt=""
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Plain, and tucked into the corner of the portrait: the rating is what the card is
                for, not something it has to shout. */}
            <span className="absolute -bottom-1 -right-1 w-[17px] h-[17px] rounded-full bg-[#121212] border border-gray-600 text-gray-200 text-[9px] font-bold flex items-center justify-center leading-none">
              {detail.ovr}
            </span>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              if (squad) onClearSlot(squad.id, slotId);
            }}
            title="Take this card off the pitch — the build stays saved on the player"
            className="absolute -top-1 -right-1 p-[1px] bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white rounded-full border border-gray-700 transition-colors"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="text-[9px] font-bold text-gray-300 truncate text-center leading-tight mt-0.5">
          {detail.name.split(' ').slice(-1)[0]}
        </div>
        {/* The six headline stats, in card order — the numbers you actually compare cards on. */}
        <div className="grid grid-cols-3 gap-x-0.5 font-mono text-[8px] leading-[10px] text-center">
          {detail.faces.map(face => (
            <span key={face.key} className={getStatColorClass(face.value)}>
              {face.value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderSlot = (slotId: string, pos?: string) => {
    const detail = details.get(slotId);
    return detail ? renderCard(slotId, detail, pos) : renderEmpty(slotId, pos);
  };

  return (
    <div className="flex flex-col gap-2 w-full lg:w-[484px]">
      <div className="flex items-start gap-2">
        {/* The pitch. Markings are drawn rather than imported so it stays one file and one colour scheme. */}
        <div className="relative w-[330px] shrink-0 aspect-[33/46] rounded-xl border border-gray-800 bg-gradient-to-b from-[#132a17] to-[#0d1f11] overflow-hidden">
          <div className="absolute inset-2 border border-white/10 rounded" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square border border-white/10 rounded-full" />
          <div className="absolute left-2 right-2 top-1/2 h-px bg-white/10" />
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[46%] h-[14%] border border-white/10 border-t-0" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[46%] h-[14%] border border-white/10 border-b-0" />
          {FORMATION_4231.map(slot => (
            <div
              key={slot.id}
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              {renderSlot(slot.id, slot.pos)}
            </div>
          ))}
        </div>

        {/* The twelve beside the pitch: the rest of the squad, judged on nothing but their numbers. */}
        <div className="grid grid-cols-2 gap-1.5 content-start">
          {RESERVE_SLOTS.map(slotId => (
            <div key={slotId}>{renderSlot(slotId)}</div>
          ))}
        </div>
      </div>

      {/* Which pitch you are looking at, and how to get another one. A squad is one pitch. */}
      <div className="flex items-center gap-1.5 px-0.5">
        <div className="relative">
          <select
            value={squad?.id || ''}
            onChange={e => onSelectSquad(e.target.value)}
            disabled={squads.length === 0}
            className="appearance-none bg-[#121212] border border-gray-800 rounded-lg pl-2.5 pr-7 py-1 text-[11px] font-bold text-gray-200 focus:border-fcGreen focus:outline-none cursor-pointer disabled:text-gray-600 max-w-[150px]"
          >
            {squads.length === 0 && <option value="">No squad yet</option>}
            {squads.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={() => {
            const name = window.prompt('Name the new squad', `Squad ${squads.length + 1}`);
            if (!name?.trim()) return;
            onSelectSquad(onCreateSquad(name.trim()));
          }}
          title="Start another squad — a new pitch of its own"
          className="p-1 rounded-lg border border-gray-800 bg-[#121212] text-gray-400 hover:text-fcGreen hover:border-fcGreen/60 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {squad && (
          <button
            onClick={() => {
              // Only the pitch goes: the builds standing on it belong to their players.
              if (window.confirm(`Delete the squad "${squad.name}"? The builds on it stay saved.`)) {
                onDeleteSquad(squad.id);
              }
            }}
            title="Delete this squad — the builds on it stay saved on their players"
            className="p-1 rounded-lg border border-gray-800 bg-[#121212] text-gray-500 hover:text-red-400 hover:border-red-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <span className="text-[10px] text-gray-600 font-mono ml-0.5">4-2-3-1</span>
        <span className="text-[10px] text-gray-600 font-mono">
          {details.size}/{ALL_SLOT_IDS.length}
        </span>
        <span className="text-[10px] text-gray-600">Click a slot to add · drag to swap</span>
      </div>
    </div>
  );
};
