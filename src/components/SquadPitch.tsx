import React, { useMemo, useState } from 'react';
import { ChevronDown, UserPlus, X } from 'lucide-react';
import { PlayerData, Squad, SquadMember } from '../types/player';
import { fitScore, controlModeFor } from '../utils/fitScore';
import { simulateEvoChain } from '../utils/evoEngine';

/**
 * A squad laid out the way it is actually played, because a list of eleven names doesn't answer
 * the question you have in front of it — who is out of position, and who would be better where.
 *
 * 4-2-3-1 only, deliberately: it's the formation being built for, and a slot's position is what
 * makes "wrong position" and "fit here" mean anything.
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
  { id: 'lcb', pos: 'CB', x: 36, y: 78 },
  { id: 'rcb', pos: 'CB', x: 64, y: 78 },
  { id: 'rb', pos: 'RB', x: 88, y: 72 },
  { id: 'lcdm', pos: 'CDM', x: 36, y: 55 },
  { id: 'rcdm', pos: 'CDM', x: 64, y: 55 },
  { id: 'lw', pos: 'LM', x: 14, y: 33 },
  { id: 'cam', pos: 'CAM', x: 50, y: 35 },
  { id: 'rw', pos: 'RM', x: 86, y: 33 },
  { id: 'st', pos: 'ST', x: 50, y: 13 }
];

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

interface SquadPitchProps {
  squads: Squad[];
  activeSquadId: string | null;
  onSelectSquad: (squadId: string) => void;
  onOpenMember: (member: SquadMember) => void;
  onRemoveMember: (squadId: string, memberId: string) => void;
  /** Assign the member sitting in the bench to a slot, or clear a slot. */
  onAssignSlot: (squadId: string, slotId: string, memberId: string | null) => void;
  playersById: Record<string, PlayerData>;
  children?: React.ReactNode;
}

export const SquadPitch: React.FC<SquadPitchProps> = ({
  squads,
  activeSquadId,
  onSelectSquad,
  onOpenMember,
  onRemoveMember,
  onAssignSlot,
  playersById,
  children
}) => {
  const [pickingSlot, setPickingSlot] = useState<string | null>(null);

  const squad = squads.find(s => s.id === activeSquadId) || squads[0] || null;

  /**
   * Everything the pitch needs about a member, worked out once: which card it is, what it became,
   * and what that is worth in the slot it's standing in.
   */
  const details = useMemo(() => {
    const map = new Map<
      string,
      {
        member: SquadMember;
        player?: PlayerData;
        name: string;
        ovr: number;
        positions: string[];
        fitFor: (pos: string) => number;
      }
    >();
    if (!squad) return map;

    squad.members.forEach(member => {
      const player = playersById[member.playerId];
      if (!player) {
        map.set(member.id, {
          member,
          // Falls back to whatever the snapshot recorded — an imported build may name the card by id.
          name: member.snapshot?.name || member.playerId,
          ovr: member.snapshot?.evoOvr || 0,
          positions: [],
          fitFor: () => 0
        });
        return;
      }

      const result = simulateEvoChain(
        member.snapshot?.chainIds || [],
        player.bio,
        player.ovr,
        player.stats,
        player.playStyles
      );
      const positions = result.finalBio.primaryPositions.split(',').map(p => p.trim()).filter(Boolean);

      map.set(member.id, {
        member,
        player,
        // The library is the authority on a card's name; the snapshot may predate a rename.
        name: player.bio.name,
        ovr: result.finalOvr,
        positions,
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

  if (!squad) return null;

  const assigned: Record<string, string> = squad.slots || {};
  const usedMemberIds = new Set(Object.values(assigned));
  const bench = squad.members.filter(m => !usedMemberIds.has(m.id));

  const renderSlot = (slot: PitchSlot) => {
    const memberId = assigned[slot.id];
    const detail = memberId ? details.get(memberId) : undefined;
    const isPicking = pickingSlot === slot.id;

    if (!detail) {
      return (
        <button
          key={slot.id}
          onClick={() => setPickingSlot(isPicking ? null : slot.id)}
          style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full border border-dashed flex flex-col items-center justify-center transition-colors ${
            isPicking
              ? 'border-fcGreen bg-fcGreen/10 text-fcGreen'
              : 'border-gray-700 bg-black/40 text-gray-600 hover:border-gray-500 hover:text-gray-400'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="text-[9px] font-bold mt-0.5">{slot.pos}</span>
        </button>
      );
    }

    const mismatch = detail.positions.length > 0 && !playsHere(slot.pos, detail.positions);
    const fit = detail.fitFor(slot.pos);

    return (
      <div
        key={slot.id}
        style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 group/slot"
      >
        <button
          onClick={() => onOpenMember(detail.member)}
          title={`${detail.name} — ${detail.member.snapshot?.pathName || 'build'}\nFit at ${slot.pos}: ${fit.toFixed(
            1
          )}${mismatch ? `\nOut of position (plays ${detail.positions.join(', ')})` : ''}`}
          className={`w-[54px] flex flex-col items-center gap-0.5 rounded-lg p-1 border transition-all ${
            mismatch
              ? 'bg-red-950/40 border-red-800/70 hover:border-red-500'
              : 'bg-[#1f211f] border-gray-700 hover:border-fcGreen'
          }`}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 bg-[#121212]">
              {detail.player?.avatarUrl && (
                <img src={detail.player.avatarUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 px-1 rounded text-[9px] font-black leading-tight border ${
                mismatch
                  ? 'bg-red-900 text-red-200 border-red-700'
                  : 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black border-yellow-300'
              }`}
            >
              {detail.ovr}
            </span>
          </div>
          <span className="text-[9px] font-bold text-gray-300 truncate max-w-[50px]">
            {detail.name.split(' ').slice(-1)[0]}
          </span>
          <div className="flex items-center gap-1 text-[8px] font-mono">
            <span className={mismatch ? 'text-red-400 font-bold' : 'text-gray-500'}>{slot.pos}</span>
            <span className="text-amber-400">{fit.toFixed(0)}</span>
          </div>
        </button>
        <button
          onClick={() => onAssignSlot(squad.id, slot.id, null)}
          title="Clear this slot"
          className="absolute -top-1.5 -right-1.5 p-0.5 bg-gray-800 text-gray-500 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/slot:opacity-100 transition-opacity"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {/* The pitch. Markings are drawn rather than imported so it stays one file and one colour scheme. */}
      <div className="relative w-full max-w-[300px] aspect-[3/4] rounded-xl border border-gray-800 bg-gradient-to-b from-[#132a17] to-[#0d1f11] overflow-hidden">
        <div className="absolute inset-2 border border-white/10 rounded" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square border border-white/10 rounded-full" />
        <div className="absolute left-2 right-2 top-1/2 h-px bg-white/10" />
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[46%] h-[14%] border border-white/10 border-t-0" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[46%] h-[14%] border border-white/10 border-b-0" />
        {FORMATION_4231.map(renderSlot)}
      </div>

      {/* Squad selector bar — placed below the pitch */}
      <div className="flex items-center gap-2 px-0.5">
        <div className="relative">
          <select
            value={squad.id}
            onChange={e => onSelectSquad(e.target.value)}
            className="appearance-none bg-[#121212] border border-gray-800 rounded-lg pl-2.5 pr-7 py-1 text-[11px] font-bold text-gray-200 focus:border-fcGreen focus:outline-none cursor-pointer"
          >
            {squads.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <span className="text-[10px] text-gray-600 font-mono">4-2-3-1</span>
        {pickingSlot && (
          <span className="text-[10px] text-fcGreen">Pick someone from the bench below</span>
        )}
      </div>

      {/* ChemistryGrid or other elements inserted between pitch and bench */}
      {children}

      {/* The bench is every build in the squad that isn't on the pitch. */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-600">
          Bench · {bench.length}
        </span>
        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
          {bench.length === 0 ? (
            <span className="text-[10px] text-gray-700">Everything in this squad is on the pitch.</span>
          ) : (
            bench.map(member => {
              const detail = details.get(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => {
                    if (pickingSlot) {
                      onAssignSlot(squad.id, pickingSlot, member.id);
                      setPickingSlot(null);
                    } else {
                      onOpenMember(member);
                    }
                  }}
                  onContextMenu={e => {
                    e.preventDefault();
                    onRemoveMember(squad.id, member.id);
                  }}
                  title={
                    pickingSlot
                      ? 'Put this build in the selected slot'
                      : 'Open this build — right-click to drop it from the squad'
                  }
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
                    pickingSlot
                      ? 'border-fcGreen/60 bg-fcGreen/10 text-fcGreen hover:bg-fcGreen/20'
                      : 'border-gray-800 bg-[#1f211f] text-gray-400 hover:border-gray-600 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-gray-300">{detail?.ovr || member.snapshot?.evoOvr}</span>
                  <span className="truncate max-w-[90px]">{detail?.name || member.playerId}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
