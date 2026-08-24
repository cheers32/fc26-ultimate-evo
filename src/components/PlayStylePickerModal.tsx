import React, { useEffect, useRef, useState } from 'react';
import { X, Search, Star, Circle } from 'lucide-react';
import { FC26_PLAYSTYLES, getPlayStyleIconUrl } from '../utils/playstyles';
import { useModal } from '../utils/modalStack';
import { PlayStylesData } from '../types/player';
import { effectiveGoldLimit, effectiveSilverLimit } from '../utils/evoEngine';

interface PlayStylePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rarity: string;
  // PlayStyles the card already has at this point in the chain — shown locked, not removable here.
  lockedGold: string[];
  lockedSilver: string[];
  limits: { gold: number; silver: number };
  // The picks currently on this path's PlayStyle node, if it has one.
  picks: { gold: string[]; silver: string[] };
  // Saving with nothing selected removes the node from the chain.
  onSave: (picks: { gold: string[]; silver: string[] }) => void;
}

const baseName = (ps: string) => ps.replace('+', '').trim();

export const PlayStylePickerModal: React.FC<PlayStylePickerModalProps> = ({
  isOpen,
  onClose,
  rarity,
  lockedGold,
  lockedSilver,
  limits,
  picks,
  onSave
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draftGold, setDraftGold] = useState<string[]>([]);
  const [draftSilver, setDraftSilver] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  // Seed the draft from the saved picks when the modal opens, and only then — the parent rebuilds
  // this object on every render, so watching `picks` here would reset the user's in-progress
  // selection any time anything else on the page re-rendered.
  const savedPicks = useRef(picks);
  savedPicks.current = picks;

  useEffect(() => {
    if (isOpen) {
      setDraftGold(savedPicks.current.gold);
      setDraftSilver(savedPicks.current.silver);
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSave = React.useCallback(() => {
    onSave({ gold: draftGold, silver: draftSilver });
    onClose();
  }, [draftGold, draftSilver, onSave, onClose]);

  // 's' is what opens the picker, so inside it the same key returns to the search box.
  useModal(isOpen, { onClose, focusRef: searchRef, focusKey: 's' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement?.tagName !== 'INPUT') handleSave();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSave]);

  if (!isOpen) return null;

  const lockedGoldNames = lockedGold.map(baseName);
  const lockedSilverNames = lockedSilver.map(baseName);
  // Picking PS+ for something the chain gave as a plain PlayStyle upgrades it, exactly as an evo
  // granting the gold version would: it takes a gold slot and gives the silver one back.
  const upgradeCount = draftGold.filter(ps => lockedSilverNames.includes(baseName(ps))).length;
  const goldCount = lockedGold.length + draftGold.length;
  const silverCount = lockedSilver.length + draftSilver.length - upgradeCount;
  // Through the effective limits, not the card's own: the current rules give every card five
  // gold and eight plain slots, and reading `limits` here capped the picker at whatever the card
  // was imported with.
  // The helpers take a whole PlayStylesData; this modal only gets the limits and what is locked in,
  // which is all they read — the card's own cap and how many it is already carrying.
  const asPlayStyles = (gold: string[], silver: string[]) =>
    ({ limits, base: { gold, silver }, ev: { gold: [], silver: [] } }) as PlayStylesData;
  const goldMax = effectiveGoldLimit(asPlayStyles(lockedGold, lockedSilver));
  const silverMax = effectiveSilverLimit(asPlayStyles(lockedGold, lockedSilver));
  const goldFull = goldCount >= goldMax;
  const silverFull = silverCount >= silverMax;

  const setTier = (name: string, tier: 'gold' | 'silver' | null) => {
    setDraftGold(prev => prev.filter(ps => baseName(ps) !== name));
    setDraftSilver(prev => prev.filter(ps => baseName(ps) !== name));
    if (tier === 'gold') setDraftGold(prev => [...prev, name]);
    if (tier === 'silver') setDraftSilver(prev => [...prev, name]);
  };

  const filtered = FC26_PLAYSTYLES.filter(ps =>
    !searchQuery || ps.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1f211f]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">PlayStyle Pick</h2>
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-purple-400 font-semibold">{rarity}</span> unlocks picking any PlayStyle — these become a step in the chain, right after the evo that unlocked them.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-800 bg-[#121212] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${goldFull ? 'bg-yellow-950/40 border-yellow-700/60 text-yellow-400' : 'bg-black/40 border-gray-700 text-gray-300'}`}>
              <Star className="w-3.5 h-3.5" /> PS+ {goldCount}/{goldMax}
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${silverFull ? 'bg-gray-700/60 border-gray-500 text-gray-200' : 'bg-black/40 border-gray-700 text-gray-300'}`}>
              <Circle className="w-3.5 h-3.5" /> PS {silverCount}/{silverMax}
            </span>
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search PlayStyles..."
              className="w-full bg-black/40 border border-gray-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-fcGreen/60"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map(({ name }) => {
              const isLockedGold = lockedGoldNames.includes(name);
              const isLockedSilver = lockedSilverNames.includes(name);
              const isLocked = isLockedGold || isLockedSilver;
              const isFreeGold = draftGold.some(ps => baseName(ps) === name);
              const isFreeSilver = draftSilver.some(ps => baseName(ps) === name);
              const tier: 'gold' | 'silver' | null = isLockedGold || isFreeGold ? 'gold' : (isLockedSilver || isFreeSilver ? 'silver' : null);
              // Already PS+ from the chain leaves nothing to pick. Already a plain PlayStyle still
              // leaves the upgrade to PS+ open — only re-picking the plain version is a no-op.
              const goldDisabled = isLockedGold || (tier !== 'gold' && goldFull);
              const silverDisabled = isLocked || (tier !== 'silver' && silverFull);

              return (
                <div
                  key={name}
                  className={`relative rounded-xl border p-3 flex flex-col items-center gap-2 transition-colors ${
                    tier === 'gold' ? 'bg-yellow-950/20 border-yellow-700/50' :
                    tier === 'silver' ? 'bg-gray-800/40 border-gray-500/50' :
                    'bg-[#1f211f] border-gray-800'
                  }`}
                >
                  {isLocked && (
                    <span className={`absolute top-1.5 right-1.5 text-[8px] font-black uppercase tracking-wider px-1 rounded bg-black/50 ${
                      isLockedSilver && isFreeGold ? 'text-fcGreen' : 'text-gray-500'
                    }`}>
                      {isLockedSilver && isFreeGold ? 'Upgraded' : 'From Evo'}
                    </span>
                  )}
                  <img
                    src={getPlayStyleIconUrl(name, tier === 'gold')}
                    alt={name}
                    title={name}
                    className={`w-12 h-12 ${tier === 'gold' ? 'drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]' : tier === 'silver' ? 'drop-shadow-[0_0_4px_rgba(156,163,175,0.5)]' : 'opacity-60'}`}
                  />
                  <span className="text-[11px] font-semibold text-gray-200 text-center leading-tight">{name}</span>
                  <div className="flex gap-1.5 mt-0.5">
                    <button
                      disabled={goldDisabled}
                      onClick={() => setTier(name, tier === 'gold' ? null : 'gold')}
                      title="PlayStyle+"
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                        tier === 'gold'
                          ? 'bg-yellow-500 text-black border-yellow-400'
                          : goldDisabled
                          ? 'bg-black/30 text-gray-600 border-gray-800 cursor-not-allowed'
                          : 'bg-black/40 text-yellow-400 border-yellow-800/60 hover:bg-yellow-950/50'
                      }`}
                    >
                      PS+
                    </button>
                    <button
                      disabled={silverDisabled}
                      onClick={() => setTier(name, tier === 'silver' ? null : 'silver')}
                      title="PlayStyle"
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors ${
                        tier === 'silver'
                          ? 'bg-gray-300 text-black border-gray-200'
                          : silverDisabled
                          ? 'bg-black/30 text-gray-600 border-gray-800 cursor-not-allowed'
                          : 'bg-black/40 text-gray-300 border-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      PS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-[#1f211f] flex justify-end items-center gap-3">
          {(picks.gold.length > 0 || picks.silver.length > 0) && (
            <button
              onClick={() => { onSave({ gold: [], silver: [] }); onClose(); }}
              className="mr-auto px-4 py-2 text-sm font-semibold text-red-400 hover:text-white border border-red-900/60 hover:bg-red-900/40 rounded-lg transition-colors"
            >
              Remove Step
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-bold text-black bg-fcGreen hover:bg-[#1db954] rounded-lg shadow-md transition-colors">
            Save PlayStyles
          </button>
        </div>
      </div>
    </div>
  );
};
