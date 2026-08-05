import { X, Check, Zap } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { PlayerData } from '../types/player';
import { StatsGrid } from './StatsGrid';
import { PlayerSubInfo } from './PlayerSubInfo';
import { calculateAccelerateType } from '../utils/statUtils';

interface PlayerDetailsModalProps {
  player: PlayerData;
  onClose: () => void;
  onSelect: (playerId: string) => void;
  onDelete?: (playerId: string) => void;
}

export function PlayerDetailsModal({ player, onClose, onSelect, onDelete }: PlayerDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Enter confirms. No "are you typing?" guard: this modal has no inputs of its own, and the
      // search box behind it keeps focus — the picker's own Enter handler already stands down
      // while this modal is open, so the keypress is ours to take.
      if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(player.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelect, player.id]);

  // Calculate top-line stats
  const accelerateType = useMemo(() => {
    return calculateAccelerateType(
      player.stats.pac.subs.acceleration.base,
      player.stats.dri.subs.agility.base,
      player.stats.phy.subs.strength.base
    );
  }, [player]);

  const { faceTotal, igsTotal } = useMemo(() => {
    let igs = 0;
    let face = 0;
    Object.values(player.stats).forEach(faceData => {
      face += faceData.baseFace;
      Object.values(faceData.subs).forEach(s => {
        igs += s.base;
      });
    });
    return { faceTotal: face, igsTotal: igs };
  }, [player.stats]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#121212] border border-gray-700 rounded-2xl w-full max-w-6xl flex flex-col shadow-2xl relative overflow-hidden h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Background Blur Effect */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-fuchsia-900/20 to-transparent pointer-events-none" />

        {/* Close Button (Floating) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors border border-gray-700/50 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 pt-10 relative z-10 space-y-6">
          
          {/* Top Info Card (Mirrors HeaderCard) */}
          <div className="flex flex-col gap-3 bg-[#1f211f]/60 p-4 rounded-xl border border-gray-800/80 backdrop-blur-sm">
                    <div className="flex w-full min-w-0 justify-between items-center gap-6">
              {/* LEFT SIDE: Avatar + Name + Position + Rating */}
              <div className="flex items-center gap-4 shrink-0">
                {/* Avatar */}
                {player.avatarUrl && (
                  <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden border-2 border-gray-600 bg-[#121212] flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <img
                      src={player.avatarUrl}
                      alt={player.bio.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://futhead.cursecdn.com/static/img/24/players/p_placeholder.png';
                      }}
                    />
                  </div>
                )}
                
                {/* Name, Position, OVR */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                      {player.bio.name}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black px-2 py-0.5 rounded font-bold text-lg shadow-sm border border-yellow-300 flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-black/60 text-xs font-semibold tracking-wider">OVR</span>
                      <span>{player.ovr.base}</span>
                    </div>
                    
                    <span className="text-gray-300 font-bold text-sm bg-gray-800/80 px-2 py-0.5 rounded border border-gray-700/50 shadow-sm">{player.bio.primaryPositions}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Bio details + Stats */}
              <div className="flex flex-col gap-4 ml-auto border-l border-gray-800/60 pl-6 flex-1 min-w-0 justify-center py-2">
                
                {/* Row 1: Bio + SM/WF */}
                <div className="flex flex-wrap items-center gap-2 text-gray-300 font-medium text-xs">
                  <span>{player.bio.nation}</span>
                  <span className="text-gray-600">|</span>
                  <span>{player.bio.league}</span>
                  <span className="text-gray-600">|</span>
                  <span>{player.bio.club}</span>
                  <span className="text-gray-600">|</span>
                  <span>{player.bio.rarity}</span>
                  <div className="flex items-center gap-2 text-gray-400 pl-3 border-l border-gray-700/60">
                    <span>{player.bio.height}</span>
                    <span className="text-gray-600">|</span>
                    <span>{player.bio.footAge}</span>
                    {player.bio.bodyType && (
                      <>
                        <span className="text-gray-600">|</span>
                        <span>{player.bio.bodyType}</span>
                      </>
                    )}
                  </div>

                </div>

                {/* Row 2: PlayStyles */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <PlayerSubInfo bio={player.bio} playStyles={player.playStyles} isEvo={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-[#1A1C1A] border border-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-3 px-1">
              <span className="font-bold text-sm text-gray-300 bg-gray-900/60 px-2 py-1 rounded border border-gray-800">
                {accelerateType}
              </span>

              <div className="font-medium flex items-center font-mono text-[13px] text-gray-300 bg-gray-900/60 px-3 py-1 rounded border border-gray-800">
                <span>{faceTotal}/{igsTotal}</span>
              </div>
            </div>
            
            <StatsGrid 
              baseStats={player.stats} 
              previewStats={player.stats} 
              activeChemBoosts={{}} 
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-between gap-3 bg-[#1A1C1A] relative z-10">
          <div>
            {player.id.startsWith('custom-') && onDelete && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this custom player?')) {
                    onDelete(player.id);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              >
                Delete Custom Player
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-300 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSelect(player.id)}
              className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold bg-fcGreen hover:bg-[#1db954] text-black rounded-lg transition-all shadow-lg"
            >
              <Check className="w-5 h-5" />
              Select Player
              <kbd className="ml-1 px-1.5 py-0.5 bg-black/20 border border-black/30 rounded text-[10px] font-mono">⏎</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
