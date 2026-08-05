import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { PlayerData } from '../types/player';
import { FC26_PLAYSTYLES, getPlayStyleIconUrl } from '../utils/playstyles';

interface EditPlayerModalProps {
  player: PlayerData;
  onClose: () => void;
  onSave: (id: string, newUrl: string, newName: string, newFutbinUrl: string, newPositions: string, gold: string[], silver: string[]) => void;
}

export function EditPlayerModal({ player, onClose, onSave }: EditPlayerModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(player.avatarUrl || '');
  const [playerName, setPlayerName] = useState(player.bio.name || '');
  const [positionsStr, setPositionsStr] = useState(player.bio.primaryPositions || '');
  const [futbinUrl, setFutbinUrl] = useState(player.futbinLink || '');

  const [goldPs, setGoldPs] = useState<Set<string>>(new Set(player.playStyles.base.gold.map(p => p.replace('+', ''))));
  const [silverPs, setSilverPs] = useState<Set<string>>(new Set(player.playStyles.base.silver));

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    onSave(
      player.id,
      avatarUrl,
      playerName,
      futbinUrl,
      positionsStr,
      Array.from(goldPs).map(ps => ps + '+'),
      Array.from(silverPs)
    );
    onClose();
  };

  const togglePs = (ps: string) => {
    if (silverPs.has(ps)) {
      // Silver -> Gold
      setSilverPs(prev => { const s = new Set(prev); s.delete(ps); return s; });
      setGoldPs(prev => { const s = new Set(prev); s.add(ps); return s; });
    } else if (goldPs.has(ps)) {
      // Gold -> Off
      setGoldPs(prev => { const s = new Set(prev); s.delete(ps); return s; });
    } else {
      // Off -> Silver
      setSilverPs(prev => { const s = new Set(prev); s.add(ps); return s; });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#1A1C1A] border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1f211f]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Edit {player.bio.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player Name"
              className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
            />
          </div>

          {/* Futbin URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">Futbin URL</label>
            <input
              type="text"
              value={futbinUrl}
              onChange={(e) => setFutbinUrl(e.target.value)}
              placeholder="https://www.futbin.com/..."
              className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
            />
          </div>

          {/* Positions */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">Positions (comma separated)</label>
            <input
              type="text"
              value={positionsStr}
              onChange={(e) => setPositionsStr(e.target.value)}
              placeholder="e.g. ST, CF, LW"
              className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
            />
          </div>

          {/* Avatar URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">Avatar Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
            />
          </div>

          {/* PlayStyles with icons */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-gray-300">PlayStyles</label>
              <span className="text-[10px] text-gray-500">Click to cycle: Off → Silver → Gold+ → Off</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 p-3 bg-[#0f100f] border border-gray-800 rounded-lg">
              {FC26_PLAYSTYLES.map(({ name: ps }) => {
                const isGold = goldPs.has(ps);
                const isSilver = silverPs.has(ps);
                const iconUrl = getPlayStyleIconUrl(ps, isGold);

                return (
                  <button
                    key={ps}
                    onClick={() => togglePs(ps)}
                    title={`${ps}${isGold ? ' (Gold+)' : isSilver ? ' (Silver)' : ' (Off)'}`}
                    className={`relative flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all border ${
                      isGold
                        ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.25)]'
                        : isSilver
                        ? 'bg-gray-300/10 border-gray-400/30'
                        : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800 opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img
                      src={iconUrl}
                      alt={ps}
                      className={`w-8 h-8 object-contain ${!isGold && !isSilver ? 'grayscale' : ''}`}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className={`text-[8px] leading-tight text-center truncate w-full ${
                      isGold ? 'text-yellow-400 font-bold' : isSilver ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {ps}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#1f211f] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-fcGreen text-black px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1db954] transition-colors shadow-[0_0_15px_rgba(30,215,96,0.3)]"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
