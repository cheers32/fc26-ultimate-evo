import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { PlayerData } from '../types/player';
import { FC26_PLAYSTYLES, getPlayStyleIconUrl } from '../utils/playstyles';
import { FREE_PLAYSTYLE_RARITIES } from '../utils/evoEngine';
import { useModal } from '../utils/modalStack';

/**
 * The rarities that are not a picker, offered so a mis-read import can be corrected to the truth
 * rather than only to something convenient.
 *
 * Every one an evo gates on is here — an evo that requires Futties or refuses World Tour Silver
 * Stars can only be judged if the card can say which it is — alongside the versions the catalogue
 * already ships. The list is not exhaustive and does not need to be: the card's current value is
 * always offered, so a rarity nobody has typed yet survives being edited.
 */
const OTHER_RARITIES = [
  'Base Icon', 'Cornerstones', 'Festival of Football Captains', 'Futties Evo', 'Gold Rare',
  'Greats of the Game Icon', 'Icon', 'Knockout Royalty Icon', 'Path to Glory', 'Prime Heroes',
  'Summer Stars', 'Team of the Season', 'Team of the Week', 'Thunderstruck', 'Time Warp',
  'TOTY', 'Trophy Titans Icon', 'Ultimate Scream', 'World Tour Silver Stars', 'Custom'
];

interface EditPlayerModalProps {
  player: PlayerData;
  onClose: () => void;
  onSave: (
    id: string,
    newUrl: string,
    newName: string,
    newFutbinUrl: string,
    newPositions: string,
    gold: string[],
    silver: string[],
    newOvr: number,
    /** How many PlayStyle+ and PlayStyle slots the card actually has. */
    slots: { gold: number; silver: number },
    /** The card's version. Decides evo eligibility and whether PlayStyles can be picked at all. */
    newRarity: string
  ) => void;
}

export function EditPlayerModal({ player, onClose, onSave }: EditPlayerModalProps) {
  const [avatarUrl, setAvatarUrl] = useState(player.avatarUrl || '');
  const [playerName, setPlayerName] = useState(player.bio.name || '');
  const [positionsStr, setPositionsStr] = useState(player.bio.primaryPositions || '');
  const [futbinUrl, setFutbinUrl] = useState(player.futbinLink || '');
  // Held as text so the field can be emptied while typing; an empty or unreadable one saves as
  // the OVR the card already had.
  const [ovr, setOvr] = useState(String(player.ovr.base));
  /**
   * The card's version, which the importer guesses at and often gets wrong.
   *
   * It is not decoration. Evos require one or rule one out, and five of them hand the player the
   * PlayStyle picker — a card left on the importer's "Custom" fallback is ruled out by nothing,
   * matches nothing, and silently cannot pick, which quietly invalidates every PlayStyle the
   * recommendations assumed it could choose.
   */
  const [rarity, setRarity] = useState(player.bio.rarity || '');

  /**
   * How many PlayStyle slots the card has.
   *
   * Never read on import — every card was filed as four and eight, which is a guess dressed as
   * data. It decides whether an evo's PlayStyle lands: a card with seven plain slots that the model
   * believes has eight gets handed one the game never gives it. FUTBIN does not print the number
   * (it lists what a card has, not what it can hold), so it has to be typed in from the card.
   */
  const [goldSlots, setGoldSlots] = useState(String(player.playStyles.limits.gold));
  const [silverSlots, setSilverSlots] = useState(String(player.playStyles.limits.silver));

  const [goldPs, setGoldPs] = useState<Set<string>>(new Set(player.playStyles.base.gold.map(p => p.replace('+', ''))));
  const [silverPs, setSilverPs] = useState<Set<string>>(new Set(player.playStyles.base.silver));

  useModal(true, { onClose });

  const handleSave = () => {
    onSave(
      player.id,
      avatarUrl,
      playerName,
      futbinUrl,
      positionsStr,
      Array.from(goldPs).map(ps => ps + '+'),
      Array.from(silverPs),
      Number.isFinite(Number(ovr)) && Number(ovr) > 0 ? Number(ovr) : player.ovr.base,
      {
        gold: Number(goldSlots) > 0 ? Number(goldSlots) : player.playStyles.limits.gold,
        silver: Number(silverSlots) > 0 ? Number(silverSlots) : player.playStyles.limits.silver
      },
      rarity.trim() || player.bio.rarity
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
          {/* Name and OVR. The rating is editable because an import can get it wrong — Futbin
              prints it in a card widget whose shape moves — and a card claiming the wrong OVR is
              eligible for the wrong evos, which is the one field you cannot work around. */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-semibold text-gray-300">Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player Name"
                className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
              />
            </div>
            <div className="flex flex-col gap-2 w-24 shrink-0">
              <label className="text-sm font-semibold text-gray-300">OVR</label>
              <input
                type="number"
                min={1}
                max={99}
                value={ovr}
                onChange={(e) => setOvr(e.target.value)}
                placeholder={String(player.ovr.base)}
                className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
              />
            </div>
          </div>

          {/* The version. Grouped so the five that hand over the PlayStyle picker are one glance
              away — that is the difference the field exists to make, and it is invisible in a flat
              alphabetical list. The card's own value is always present, even if unknown here, so
              opening this dialog can never silently rewrite a rarity nobody has listed yet. */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-300">Rarity / Version</label>
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
            >
              {rarity && ![...FREE_PLAYSTYLE_RARITIES, ...OTHER_RARITIES].includes(rarity) && (
                <option value={rarity}>{rarity} (as imported)</option>
              )}
              <optgroup label="Picks its own PlayStyles">
                {FREE_PLAYSTYLE_RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
              </optgroup>
              <optgroup label="Everything else">
                {OTHER_RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
              </optgroup>
            </select>
            <p className="text-[11px] text-gray-500">
              {FREE_PLAYSTYLE_RARITIES.includes(rarity)
                ? 'This card assigns its own PlayStyles — empty slots are worth whatever the best ones for the position are.'
                : 'Evos require or rule out a version, and five of them let the card pick its own PlayStyles. An import that guessed "Custom" matches none of that.'}
            </p>
          </div>

          {/* How many slots the card has, which nothing else in the app can find out. */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-32">
              <label className="text-sm font-semibold text-gray-300">PlayStyle+ slots</label>
              <input
                type="number" min={0} max={9}
                value={goldSlots}
                onChange={(e) => setGoldSlots(e.target.value)}
                className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
              />
            </div>
            <div className="flex flex-col gap-2 w-32">
              <label className="text-sm font-semibold text-gray-300">PlayStyle slots</label>
              <input
                type="number" min={0} max={14}
                value={silverSlots}
                onChange={(e) => setSilverSlots(e.target.value)}
                className="w-full bg-[#0f100f] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-fcGreen focus:ring-1 focus:ring-fcGreen transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-500 self-end pb-3 flex-1">
              How many the card can hold, empty ones included — imports guess 4 and 8, and an evo
              will fill a slot the model thinks is there.
            </p>
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
