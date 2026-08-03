import React, { useState } from 'react';
import { PlayerData } from '../types/player';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

interface PlayerCarouselProps {
  players: Record<string, PlayerData>;
  selectedPlayerId: string;
  onSelectPlayer: (id: string) => void;
}

export const PlayerCarousel: React.FC<PlayerCarouselProps> = ({
  players,
  selectedPlayerId,
  onSelectPlayer
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedPlayer = players[selectedPlayerId];

  return (
    <div className="mb-4 border-b border-gray-800/80">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-[#1f211f] transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-fcGreen" />
          <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            Player Selection 
          </span>
          {!isExpanded && selectedPlayer && (
            <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#1a1c1a] pl-1 pr-2 py-1 rounded-md border border-gray-800 ml-2">
              <div className="w-6 h-6 shrink-0 rounded-full overflow-hidden border border-gray-600 bg-[#121212] flex items-center justify-center">
                <img
                  src={selectedPlayer.avatarUrl}
                  alt={selectedPlayer.bio.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://futhead.cursecdn.com/static/img/24/players/p_placeholder.png';
                  }}
                />
              </div>
              <span className="font-bold">{selectedPlayer.bio.name}</span>
              <span className="text-gray-500">({selectedPlayer.ovr.base})</span>
            </div>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="w-full flex overflow-x-auto py-4 px-2 gap-4 snap-x bg-black/20 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:rounded-full pb-3">
      {Object.values(players).map((player) => {
        const isSelected = player.id === selectedPlayerId;
        return (
          <div
            key={player.id}
            onClick={() => onSelectPlayer(player.id)}
            className={`cursor-pointer flex-shrink-0 w-48 rounded-xl p-3 border transition-all duration-300 snap-center flex flex-col items-center gap-3 relative overflow-hidden group ${
              isSelected
                ? 'bg-gradient-to-br from-fcGreen/20 to-emerald-900/40 border-fcGreen/60 shadow-[0_0_15px_rgba(30,215,96,0.2)]'
                : 'bg-[#2A2D2A]/80 border-gray-700/60 hover:bg-[#374151]/80 hover:border-gray-500/60'
            }`}
          >
            {/* Background Accent */}
            {isSelected && (
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-fcGreen/20 blur-2xl rounded-full" />
            )}
            
            <div className="relative">
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isSelected ? 'border-fcGreen' : 'border-gray-600'} p-0.5 bg-[#121212]`}>
                <img
                  src={player.avatarUrl}
                  alt={player.bio.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://futhead.cursecdn.com/static/img/24/players/p_placeholder.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-700">
                {player.ovr.base}
              </div>
            </div>
            
            <div className="text-center z-10 w-full">
              <h3 className={`font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {player.bio.name}
              </h3>
              <p className="text-xs text-fcTextDim truncate">
                {player.bio.primaryPositions.split(',')[0]} &bull; {player.bio.club}
              </p>
            </div>
          </div>
        );
      })}
      </div>
      )}
    </div>
  );
};
