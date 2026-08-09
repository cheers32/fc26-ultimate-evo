import { useState, useEffect } from 'react';
import { X, Upload, Info } from 'lucide-react';
import { PlayerData } from '../types/player';
import { parseFutbinText } from '../utils/futbinParser';

interface ImportPlayerModalProps {
  onClose: () => void;
  onImport: (player: PlayerData) => void;
}

export function ImportPlayerModal({ onClose, onImport }: ImportPlayerModalProps) {
  const [rawText, setRawText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [futbinUrl, setFutbinUrl] = useState('');
  // Futbin's copied text gives no way to tell a PlayStyle+ from a plain one — they are one list,
  // plus ones first — so the count is asked for rather than guessed from OVR.
  const [goldCount, setGoldCount] = useState('3');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleImport = () => {
    setError(null);
    if (!rawText.trim()) {
      setError("Please paste the Futbin text first.");
      return;
    }

    // Left blank on purpose means "guess it from OVR", which is what the parser does without it.
    const trimmed = goldCount.trim();
    const player = parseFutbinText(
      rawText,
      avatarUrl,
      futbinUrl,
      trimmed === '' ? undefined : Number(trimmed)
    );
    if (player) {
      onImport(player);
      onClose();
    } else {
      setError("Failed to parse player data. Please ensure you copied the entire stats block from Futbin.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-2 text-fuchsia-400">
            <Upload className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Import Futbin Player</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3 text-sm text-blue-200">
            <Info className="w-5 h-5 flex-shrink-0 text-blue-400" />
            <p>
              Go to any FC 26 player page on Futbin. Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded mx-1">Ctrl+A</kbd> to select the entire page, then <kbd className="px-1.5 py-0.5 bg-gray-800 rounded mx-1">Ctrl+C</kbd> to copy. Paste the text below!
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              PlayStyle+ count
              <span className="ml-2 text-xs font-normal text-gray-500">
                how many of the listed PlayStyles are the gold ones — leave blank to guess from OVR
              </span>
            </label>
            <input
              type="number"
              min={0}
              max={8}
              value={goldCount}
              onChange={(e) => setGoldCount(e.target.value)}
              placeholder="3"
              className="w-24 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Futbin Player URL (Optional)</label>
              <input
                type="text"
                value={futbinUrl}
                onChange={(e) => setFutbinUrl(e.target.value)}
                placeholder="e.g., https://www.futbin.com/26/player/..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="e.g., https://cdn.futbin.com/..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Futbin Raw Text</label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the copied text here..."
              className="w-full h-64 bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-fuchsia-500/50 resize-none font-mono"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 flex justify-end gap-3 bg-gray-900/50 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleImport}
            className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-fuchsia-900/20"
          >
            Parse & Create Player
          </button>
        </div>
      </div>
    </div>
  );
}
