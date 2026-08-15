import React, { useEffect, useState } from 'react';
import { Plus, Users, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { TeamSummary, teamApi } from '../utils/teamStore';

/**
 * The way in. Every team on the server is listed here for everybody — there is no access control
 * yet by design, so sharing a team is just telling someone its name.
 */
interface TeamListPageProps {
  onOpenTeam: (teamId: string) => void;
  /** Shown when the user backed out of a team rather than arriving cold. */
  activeTeamId?: string | null;
}

const formatWhen = (ms: number) => {
  if (!ms) return '';
  const days = Math.floor((Date.now() - ms) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(ms).toLocaleDateString();
};

export const TeamListPage: React.FC<TeamListPageProps> = ({ onOpenTeam, activeTeamId }) => {
  const [teams, setTeams] = useState<TeamSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  /** The team whose delete has been asked for but not yet spelled out. */
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const load = () => {
    setError(null);
    teamApi
      .list()
      .then(setTeams)
      .catch(err => {
        setTeams([]);
        setError(err.message);
      });
  };

  useEffect(load, []);

  const create = async () => {
    const name = newName.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      const team = await teamApi.create(name);
      setNewName('');
      onOpenTeam(team.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the team');
    } finally {
      setBusy(false);
    }
  };

  /**
   * Deleting a team takes every build and squad in it, and the server deletes for real — there is
   * no undo in the app and none in the store either. A `confirm()` was not enough of a gate: on a
   * phone the trash icon and the OK button are two taps a few hundred milliseconds apart, and that
   * is exactly how a team went missing. Typing the name is the point — it cannot be done by
   * accident, and it makes you read which team you are on.
   */
  const remove = async (team: TeamSummary) => {
    setConfirmingId(team.id);
    setConfirmText('');
    setError(null);
  };

  const confirmRemove = async (team: TeamSummary) => {
    if (confirmText.trim() !== team.name) return;
    try {
      await teamApi.remove(team.id);
      setConfirmingId(null);
      setConfirmText('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the team');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="flex items-end justify-between gap-4 mb-1">
          <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Teams
          </h1>
          <button
            onClick={load}
            title="Reload the list"
            className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-[#1f211f] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          A team is one account's worth of state — its own EVO pool and its own squads. The player and
          EVO libraries are shared by everyone. Anyone with the link can open any team.
        </p>

        <div className="flex gap-2 mb-8">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && create()}
            placeholder="New team name…"
            className="flex-1 bg-[#121212] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:border-fcGreen focus:outline-none transition-colors"
          />
          <button
            onClick={create}
            disabled={!newName.trim() || busy}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-black bg-[#1ED760] hover:bg-[#1db954] disabled:bg-gray-800 disabled:text-gray-600 transition-colors shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>

        {error && (
          <div className="mb-6 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            {error}
          </div>
        )}

        {teams === null ? (
          <div className="text-sm text-gray-600 animate-pulse">Loading teams…</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No teams yet — create one above to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {teams.map(team => (
              <div key={team.id} className="flex flex-col">
                <div
                  onClick={() => onOpenTeam(team.id)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    team.id === activeTeamId
                      ? 'bg-green-950/20 border-fcGreen/50'
                      : 'bg-[#1f211f] border-gray-800 hover:border-gray-600 hover:bg-[#252825]'
                  } ${confirmingId === team.id ? 'rounded-b-none border-b-0' : ''}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-gray-800 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-gray-500 group-hover:text-fcGreen transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-200 group-hover:text-white truncate">{team.name}</div>
                    <div className="text-[11px] text-gray-600 font-mono">
                      {team.id}
                      {team.updatedAt ? ` · updated ${formatWhen(team.updatedAt)}` : ''}
                    </div>
                  </div>
                  {/* Dimmed rather than hidden: `opacity-0` still takes taps, and a phone has no
                      hover to reveal what it is about to delete. */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      remove(team);
                    }}
                    title="Delete this team"
                    className="p-2 text-gray-700 hover:text-red-400 rounded-lg hover:bg-red-950/30 transition-colors opacity-40 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-fcGreen transition-colors shrink-0" />
                </div>

                {confirmingId === team.id && (
                  <div className="rounded-b-xl border border-red-900/60 border-t-0 bg-red-950/20 p-4 flex flex-col gap-3">
                    <p className="text-xs text-red-200/90 leading-relaxed">
                      This deletes <span className="font-bold">{team.name}</span> for good — every
                      build saved on it, its EVO pool and its squads. There is no undo. Type{' '}
                      <span className="font-mono font-bold text-white">{team.name}</span> to confirm.
                    </p>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && confirmRemove(team)}
                        placeholder={team.name}
                        className="flex-1 bg-[#121212] border border-red-900/60 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-red-500 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          setConfirmingId(null);
                          setConfirmText('');
                        }}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => confirmRemove(team)}
                        disabled={confirmText.trim() !== team.name}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
