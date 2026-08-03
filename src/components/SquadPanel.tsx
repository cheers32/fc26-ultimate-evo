import React, { useState } from 'react';
import { Plus, Trash2, X, Users } from 'lucide-react';
import { Squad, SquadMember, PlayerEvoState } from '../types/player';

interface SquadPanelProps {
  squads: Squad[];
  onCreateSquad: (name: string) => void;
  onDeleteSquad: (squadId: string) => void;
  onAddPlayerToSquad: (
    squadId: string,
    playerId: string,
    playerState: PlayerEvoState,
    snapshot: SquadMember['snapshot']
  ) => void;
  onRemoveMember: (squadId: string, memberId: string) => void;
  onOpenMember: (member: SquadMember) => void;
  currentPlayerState: PlayerEvoState;
  currentPlayerId: string;
  currentSnapshot: SquadMember['snapshot'];
}

export const SquadPanel: React.FC<SquadPanelProps> = ({
  squads,
  onCreateSquad,
  onDeleteSquad,
  onAddPlayerToSquad,
  onRemoveMember,
  onOpenMember,
  currentPlayerState,
  currentPlayerId,
  currentSnapshot
}) => {
  const [newSquadName, setNewSquadName] = useState('');
  const [expandedSquadId, setExpandedSquadId] = useState<string | null>(null);

  const handleCreateSquad = () => {
    if (newSquadName.trim()) {
      onCreateSquad(newSquadName);
      setNewSquadName('');
    }
  };

  const handleAddCurrentPlayer = (squadId: string) => {
    onAddPlayerToSquad(squadId, currentPlayerId, currentPlayerState, currentSnapshot);
  };

  const countPlayers = (squad: Squad) =>
    new Set(squad.members.map(m => m.playerId)).size;

  // Adding the same player under a chain already stored refreshes that entry.
  const chainKey = currentSnapshot.chainIds.join('>');
  const hasSameChain = (squad: Squad) =>
    squad.members.some(
      m => m.playerId === currentPlayerId && m.snapshot.chainIds.join('>') === chainKey
    );

  return (
    <div className="bg-[#1f211f] p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-fcGreen" />
        <h2 className="text-lg font-bold text-white">Squads</h2>
      </div>

      {/* Create new squad */}
      <div className="mb-6 p-4 bg-[#121212] rounded-lg border border-gray-800">
        <label className="block text-xs font-semibold text-gray-400 mb-2">New Squad Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSquadName}
            onChange={(e) => setNewSquadName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateSquad()}
            placeholder="e.g., Midfield Trio"
            className="flex-1 bg-[#1a1c1a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-fcGreen outline-none transition-colors"
          />
          <button
            onClick={handleCreateSquad}
            disabled={!newSquadName.trim()}
            className="px-4 py-2 bg-fcGreen hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Squad list */}
      <div className="space-y-3">
        {squads.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No squads yet. Create one to get started!</p>
        ) : (
          squads.map((squad) => (
            <div
              key={squad.id}
              className="border border-gray-800 rounded-lg bg-[#121212] overflow-hidden"
            >
              {/* Squad header — the toggle and delete must stay siblings, never nested buttons */}
              <div className="flex items-center hover:bg-[#1a1c1a] transition-colors">
                <button
                  onClick={() =>
                    setExpandedSquadId(expandedSquadId === squad.id ? null : squad.id)
                  }
                  className="flex-1 min-w-0 px-4 py-3 flex items-center justify-between gap-3 text-left"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="font-semibold text-white truncate">{squad.name}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded shrink-0">
                      {countPlayers(squad)} player{countPlayers(squad) !== 1 ? 's' : ''}
                      {squad.members.length > countPlayers(squad) &&
                        ` · ${squad.members.length} paths`}
                    </span>
                  </span>
                  <span className="text-gray-400 shrink-0">
                    {expandedSquadId === squad.id ? '▼' : '▶'}
                  </span>
                </button>
                <button
                  onClick={() => onDeleteSquad(squad.id)}
                  className="p-1 mr-4 shrink-0 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                  title="Delete squad"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Squad content (expanded) */}
              {expandedSquadId === squad.id && (
                <div className="border-t border-gray-800 px-4 py-3 bg-[#0f0f0f] space-y-3">
                  {/* Add current player button */}
                  <button
                    onClick={() => handleAddCurrentPlayer(squad.id)}
                    className="w-full px-3 py-2 bg-green-950/40 hover:bg-green-950/60 border border-green-800/60 text-green-400 text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {hasSameChain(squad) ? 'Update' : 'Add'} {currentSnapshot.name} (
                    {currentSnapshot.evoOvr} OVR
                    {currentSnapshot.chainIds.length > 0
                      ? ` · ${currentSnapshot.chainIds.length} EVO${currentSnapshot.chainIds.length !== 1 ? 's' : ''}`
                      : ' · no EVOs'}
                    )
                  </button>

                  {/* Members list */}
                  {squad.members.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No members yet</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400">Members:</p>
                      {squad.members.map((member) => {
                        const snap = member.snapshot;
                        const gain = snap.evoOvr - snap.baseOvr;
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between gap-2 px-3 py-2 bg-[#1a1c1a] rounded border border-gray-800"
                          >
                            <button
                              onClick={() => onOpenMember(member)}
                              className="flex-1 min-w-0 text-left group"
                              title="Open this player with the EVO path saved here"
                            >
                              <p className="text-sm font-medium text-gray-300 group-hover:text-fcGreen truncate transition-colors">
                                {snap.name}
                                <span className="ml-2 text-fcGold font-bold">{snap.evoOvr}</span>
                                {gain > 0 && (
                                  <span className="ml-1 text-[10px] text-fcGreen">+{gain}</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {snap.chainIds.length > 0
                                  ? `${snap.pathName} · ${snap.chainIds.length} EVO${snap.chainIds.length !== 1 ? 's' : ''}`
                                  : 'No EVOs applied'}
                              </p>
                            </button>
                            <button
                              onClick={() => onRemoveMember(squad.id, member.id)}
                              className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors shrink-0"
                              title="Remove this entry"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
