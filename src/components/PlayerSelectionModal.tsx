import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Upload, Edit2, Trash2 } from 'lucide-react';
import { PlayerData } from '../types/player';
import { PlayerDetailsModal } from './PlayerDetailsModal';
import { EditPlayerModal } from './EditPlayerModal';
import { useModal } from '../utils/modalStack';

interface PlayerSelectionModalProps {
  players: Record<string, PlayerData>;
  onClose: () => void;
  onSelectPlayer: (id: string) => void;
  onOpenImport: () => void;
  onDeletePlayer?: (id: string) => void;
  onEditPlayerAvatar?: (id: string, newUrl: string, newName: string, newFutbinUrl: string, newPositions: string, gold: string[], silver: string[]) => void;
}

export function PlayerSelectionModal({ players, onClose, onSelectPlayer, onOpenImport, onDeletePlayer, onEditPlayerAvatar }: PlayerSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPlayerId, setPreviewPlayerId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);



  const playersList = useMemo(() => Object.values(players), [players]);

  const filteredPlayers = useMemo(() => {
    return playersList.filter(p => 
      p.bio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.club.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playersList, searchQuery]);

  const searchRef = useRef<HTMLInputElement>(null);

  // Escape is handled by the modal stack: the preview and the edit modal open on top of this one,
  // so they take it first and this closes only once they're gone. '/' is what opens this, so
  // inside it the same key returns to the search box.
  useModal(true, { onClose, focusRef: searchRef, focusKey: '/' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Select the first player on Enter
      if (e.key === 'Enter' && !previewPlayerId && filteredPlayers.length > 0) {
        onSelectPlayer(filteredPlayers[0].id);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, previewPlayerId, filteredPlayers, onSelectPlayer]);

  const handleSelectPreview = (id: string) => {
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
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950/50">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Player Warehouse</h2>
              <p className="text-sm text-gray-400">Select a player to begin evolution</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !previewPlayerId && filteredPlayers.length > 0) {
                      onSelectPlayer(filteredPlayers[0].id);
                      onClose();
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

          {/* Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredPlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => setPreviewPlayerId(player.id)}
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
                    {onDeletePlayer && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (window.confirm(`Delete ${player.bio.name}?`)) {
                            onDeletePlayer(player.id);
                          }
                        }} 
                        className="bg-black/60 backdrop-blur-sm p-1.5 rounded text-red-400 hover:text-red-500 hover:bg-black border border-red-500/20"
                        title="Delete Player"
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
          onSave={(id, url, name, futbinUrl, positions, gold, silver) => {
            if (onEditPlayerAvatar) onEditPlayerAvatar(id, url, name, futbinUrl, positions, gold, silver);
            setEditingPlayerId(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {previewPlayerId && players[previewPlayerId] && (
        <PlayerDetailsModal 
          player={players[previewPlayerId]}
          onClose={() => setPreviewPlayerId(null)}
          onSelect={handleSelectPreview}
          onDelete={onDeletePlayer ? (id) => {
            onDeletePlayer(id);
            setPreviewPlayerId(null);
          } : undefined}
        />
      )}
    </>
  );
}
