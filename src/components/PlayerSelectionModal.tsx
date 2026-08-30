import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Upload, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { PlayerData } from '../types/player';
import { EditPlayerModal } from './EditPlayerModal';
import { useModal } from '../utils/modalStack';

interface PlayerSelectionModalProps {
  /** The cards this team uses. */
  players: Record<string, PlayerData>;
  /** The whole shared catalogue, so hidden cards can still be looked at and brought back. */
  libraryPlayers?: Record<string, PlayerData>;
  hiddenPlayerIds?: string[];
  /** Cards this team has already evolved — those with an in-game record carrying at least one evo. */
  evolvedPlayerIds?: string[];
  onClose: () => void;
  onSelectPlayer: (id: string) => void;
  onOpenImport: () => void;
  /** Stop using a card in this team. Nothing is deleted, and it can be undone. */
  onHidePlayer?: (id: string) => void;
  onUnhidePlayer?: (id: string) => void;
  /** Take a card out of the shared library, for every team. Not reversible. */
  onDeletePlayer?: (id: string) => void;
  onEditPlayerAvatar?: (id: string, newUrl: string, newName: string, newFutbinUrl: string, newPositions: string, gold: string[], silver: string[], newOvr: number, slots?: { gold: number; silver: number }) => void;
}

export function PlayerSelectionModal({
  players,
  libraryPlayers,
  hiddenPlayerIds = [],
  evolvedPlayerIds = [],
  onClose,
  onSelectPlayer,
  onOpenImport,
  onHidePlayer,
  onUnhidePlayer,
  onDeletePlayer,
  onEditPlayerAvatar
}: PlayerSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  /**
   * Positions to keep, and every one of them has to be on the card.
   *
   * "All of these" rather than "any of these" on purpose: a list of everyone who plays CB *or* CM is
   * most of the warehouse and answers nothing, while everyone who plays CB *and* CM is the short
   * list of cards that actually cover two holes at once — which is the question worth asking of a
   * shelf this size.
   */
  const [positionFilter, setPositionFilter] = useState<string[]>([]);
  /** Keep cards at or above this OVR. 0 is off. */
  const [minOvr, setMinOvr] = useState(0);
  /** Only the cards this team has already put evos into. */
  const [evolvedOnly, setEvolvedOnly] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  /**
   * Derived rather than stored, because the shelf can empty while you are looking at it: bring the
   * last hidden card back and the toggle out of this view goes with it, leaving nowhere to go.
   */
  const viewingHidden = showHidden && hiddenPlayerIds.length > 0;

  const playersList = useMemo(() => {
    if (!viewingHidden) return Object.values(players);
    // The hidden ones are exactly what this team's list has been cut down from, so they have to be
    // read off the shared catalogue rather than out of `players`.
    const shelf = libraryPlayers || players;
    return hiddenPlayerIds.map(id => shelf[id]).filter(Boolean);
  }, [players, libraryPlayers, hiddenPlayerIds, viewingHidden]);

  /** Positions actually present on the shelf, in the order a squad sheet lists them. */
  const positionOptions = useMemo(() => {
    const ORDER = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'];
    const seen = new Set<string>();
    for (const p of playersList) {
      for (const pos of p.bio.primaryPositions.split(',')) {
        const key = pos.trim().toUpperCase();
        if (key) seen.add(key);
      }
    }
    return [...ORDER.filter(x => seen.has(x)), ...[...seen].filter(x => !ORDER.includes(x)).sort()];
  }, [playersList]);

  const evolved = useMemo(() => new Set(evolvedPlayerIds), [evolvedPlayerIds]);
  // Counted over what this view can actually show. The team's record may name a card that is hidden
  // or no longer in the library, and a label promising 38 above a list of 37 is a bug report.
  const evolvedHere = useMemo(
    () => playersList.filter(p => evolved.has(p.id)).length,
    [playersList, evolved]
  );

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return playersList.filter(p => {
      if (!p.bio.name.toLowerCase().includes(q) && !p.bio.club.toLowerCase().includes(q)) return false;
      if (minOvr > 0 && (p.ovr?.base ?? 0) < minOvr) return false;
      if (evolvedOnly && !evolved.has(p.id)) return false;
      if (positionFilter.length > 0) {
        const own = new Set(p.bio.primaryPositions.split(',').map(x => x.trim().toUpperCase()));
        if (!positionFilter.every(pos => own.has(pos))) return false;
      }
      return true;
    });
  }, [playersList, searchQuery, positionFilter, minOvr, evolvedOnly, evolved]);

  const searchRef = useRef<HTMLInputElement>(null);

  // Escape is handled by the modal stack: the preview and the edit modal open on top of this one,
  // so they take it first and this closes only once they're gone. '/' is what opens this, so
  // inside it the same key returns to the search box.
  useModal(true, { onClose, focusRef: searchRef, focusKey: '/' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Select the first player on Enter
      if (e.key === 'Enter' && filteredPlayers.length > 0) {
        selectPlayer(filteredPlayers[0].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, filteredPlayers, onSelectPlayer]);

  /**
   * Picking a card is the whole interaction — the workbench behind this is the player's detail
   * view, so a preview in front of it was only ever a step to click through.
   */
  const selectPlayer = (id: string) => {
    // A hidden card isn't one this team uses, so picking it would open something the rest of the
    // app has already filtered away. The eye button is the way back.
    if (viewingHidden) return;
    onSelectPlayer(id);
    onClose();
  };

  const getStatColor = (val: number) => {
    if (val >= 90) return 'text-green-400';
    if (val >= 80) return 'text-lime-400';
    if (val >= 70) return 'text-yellow-400';
    if (val >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          
          {/* Filters. A shelf of this size is not searchable by name alone — the question is
              usually "who covers this position, at this rating", and that is two controls. */}
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950/50">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {viewingHidden ? 'Not used by this team' : 'Player Warehouse'}
              </h2>
              <p className="text-sm text-gray-400">
                {viewingHidden
                  ? 'These cards are still in the shared library, and their builds are still saved'
                  : 'Select a player to begin evolution'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {hiddenPlayerIds.length > 0 && (
                <button
                  onClick={() => setShowHidden(v => !v)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    viewingHidden
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  Hidden ({hiddenPlayerIds.length})
                </button>
              )}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredPlayers.length > 0) {
                      selectPlayer(filteredPlayers[0].id);
                    }
                  }}
                  placeholder="Search players..."
                  className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-fuchsia-500 w-64"
                />
              </div>
              <button
                onClick={onOpenImport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 hover:from-fuchsia-600/40 hover:to-purple-600/40 border border-fuchsia-500/30 text-fuchsia-200 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-fuchsia-900/10"
              >
                <Upload className="w-4 h-4" />
                Import Futbin Player
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Two controls, because the question this shelf gets asked is almost always "who covers
              this position, at this rating". Positions are AND-ed: picking CB and CM asks for the
              cards that cover both, which is a short list worth reading, rather than the union,
              which is most of the warehouse. */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-950/30">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">Position</span>
            {positionOptions.map(pos => {
              const picked = positionFilter.includes(pos);
              return (
                <button
                  key={pos}
                  onClick={() =>
                    setPositionFilter(cur => (picked ? cur.filter(x => x !== pos) : [...cur, pos]))
                  }
                  className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                    picked
                      ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm'
                      : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151] hover:text-white'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
            {positionFilter.length > 0 && (
              <button
                onClick={() => setPositionFilter([])}
                className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-bold ml-1"
              >
                Any
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {/* By the in-game record, so this is "cards this team has spent evos on" rather than
                  "cards someone drafted a plan for". */}
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={evolvedOnly}
                  onChange={e => setEvolvedOnly(e.target.checked)}
                  className="accent-fcGreen w-3.5 h-3.5"
                />
                Evolved ({evolvedHere})
              </label>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">OVR</label>
              <select
                value={minOvr}
                onChange={e => setMinOvr(Number(e.target.value))}
                className="bg-gray-900 border border-gray-700 rounded-lg text-sm text-white px-2 py-1.5 focus:outline-none focus:border-fuchsia-500"
              >
                <option value={0}>Any</option>
                {[99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 88, 86, 84, 80].map(v => (
                  <option key={v} value={v}>{v}+</option>
                ))}
              </select>
              <span className="text-[11px] text-gray-500 tabular-nums">
                {filteredPlayers.length}/{playersList.length}
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => selectPlayer(player.id)}
                  className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-500/10 transition-all text-left flex flex-col group relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-2 left-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditPlayerAvatar && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditingPlayerId(player.id);
                        }} 
                        className="bg-black/60 backdrop-blur-sm p-1.5 rounded text-gray-300 hover:text-white hover:bg-black border border-white/10"
                        title="Edit Player (Photo & PS+ Limit)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {viewingHidden
                      ? onUnhidePlayer && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onUnhidePlayer(player.id);
                            }}
                            className="bg-black/60 backdrop-blur-sm p-1.5 rounded text-fcGreen hover:bg-black border border-fcGreen/30"
                            title="Use this card in this team again"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )
                      : onHidePlayer && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onHidePlayer(player.id);
                            }}
                            className="bg-black/60 backdrop-blur-sm p-1.5 rounded text-gray-300 hover:text-white hover:bg-black border border-white/10"
                            title="Stop using this card in this team — its builds are kept, and other teams keep the card"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                    {onDeletePlayer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Spelled out because it is not the everyday action: hiding is.
                          if (window.confirm(
                            `Delete ${player.bio.name} from the shared library?\n\n` +
                            'Every team loses this card, and every build saved on it goes too. ' +
                            'This cannot be undone.\n\n' +
                            'To stop using it in this team only, close this and use the hide button instead.'
                          )) {
                            onDeletePlayer(player.id);
                          }
                        }}
                        className="bg-black/60 backdrop-blur-sm p-1.5 rounded text-red-400 hover:text-red-500 hover:bg-black border border-red-500/20"
                        title="Delete from the shared library — every team loses this card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-yellow-400 font-bold text-sm border border-yellow-500/20 z-10">
                    {player.ovr.base}
                  </div>
                  <div className="h-40 bg-gray-900 relative flex items-center justify-center p-4">
                    <img src={player.avatarUrl} alt={player.bio.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-3 border-t border-gray-800 bg-gray-950 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-sm truncate mb-2">{player.bio.name}</h3>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-auto">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">PAC</span>
                        <span className={`font-semibold ${getStatColor(player.stats.pac.baseFace)}`}>{player.stats.pac.baseFace}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">SHO</span>
                        <span className={`font-semibold ${getStatColor(player.stats.sho.baseFace)}`}>{player.stats.sho.baseFace}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">PAS</span>
                        <span className={`font-semibold ${getStatColor(player.stats.pas.baseFace)}`}>{player.stats.pas.baseFace}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">DRI</span>
                        <span className={`font-semibold ${getStatColor(player.stats.dri.baseFace)}`}>{player.stats.dri.baseFace}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">DEF</span>
                        <span className={`font-semibold ${getStatColor(player.stats.def.baseFace)}`}>{player.stats.def.baseFace}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">PHY</span>
                        <span className={`font-semibold ${getStatColor(player.stats.phy.baseFace)}`}>{player.stats.phy.baseFace}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {filteredPlayers.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No players found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPlayerId && players[editingPlayerId] && (
        <EditPlayerModal
          player={players[editingPlayerId]}
          onClose={() => setEditingPlayerId(null)}
          onSave={(id, url, name, futbinUrl, positions, gold, silver, ovr, slots) => {
            if (onEditPlayerAvatar) onEditPlayerAvatar(id, url, name, futbinUrl, positions, gold, silver, ovr, slots);
            setEditingPlayerId(null);
          }}
        />
      )}
    </>
  );
}
