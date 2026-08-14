import React, { useMemo, useRef, useState } from 'react';
import { Link2, X, AlertTriangle, Check } from 'lucide-react';
import { PlayerData } from '../types/player';
import { parseShareUrl, SharedBuild } from '../utils/shareLink';
import { simulateEvoChain, isPlayStyleNodeId } from '../utils/evoEngine';
import { useModal } from '../utils/modalStack';

/**
 * Bringing builds in from a share link.
 *
 * Builds belong to a team — whether one is even legal depends on the evos that team has — so a
 * build made under one team can't be read from another. The link is the way across: it carries the
 * card and the chain and nothing else, and this rebuilds it against the team it lands in.
 */

interface Parsed {
  line: string;
  build: SharedBuild | null;
  player?: PlayerData;
  ovr?: number;
  evoCount?: number;
  /** Already in this team's saves for that player — importing it again would be a duplicate. */
  duplicate?: boolean;
}

interface ImportBuildModalProps {
  onClose: () => void;
  playersById: Record<string, PlayerData>;
  /** What the team already has, so a link that's already in can say so before it's clicked. */
  existingChainsByPlayer: Record<string, string[]>;
  onImport: (builds: SharedBuild[]) => void;
}

export const ImportBuildModal: React.FC<ImportBuildModalProps> = ({
  onClose,
  playersById,
  existingChainsByPlayer,
  onImport
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useModal(true, { onClose, focusRef: inputRef });

  const parsed = useMemo<Parsed[]>(() => {
    // One link per line, not per whitespace run: a line that isn't a link should be one complaint,
    // not one per word in it.
    return text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(line => {
        // A whole URL, a bare query string, or just the value after `path=` — all the same thing.
        const build = parseShareUrl(line.includes('=') ? `?${line.split('?').pop()}` : `?path=${line}`);
        if (!build) return { line, build: null };

        const player = playersById[build.playerId];
        if (!player) return { line, build };

        const result = simulateEvoChain(
          build.chainIds,
          player.bio,
          player.ovr,
          player.stats,
          player.playStyles
        );
        return {
          line,
          build,
          player,
          ovr: result.finalOvr,
          evoCount: build.chainIds.filter(id => !isPlayStyleNodeId(id)).length,
          duplicate: (existingChainsByPlayer[build.playerId] || []).includes(build.chainIds.join('>'))
        };
      });
  }, [text, playersById, existingChainsByPlayer]);

  const importable = parsed.filter(p => p.player && !p.duplicate);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1c1a] border border-gray-700 w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1f211f] rounded-t-2xl">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Link2 className="w-5 h-5 text-fcGreen" />
            Import builds from links
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Builds are saved per team, so one made under another team doesn't appear here. Paste its
            share links — one per line — and they'll be rebuilt against this team's cards and saved
            to the players they belong to.
          </p>

          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder={'https://…/?path=rodri-91_1188_1177\nhttps://…/?path=maldini-89_1012'}
            className="w-full bg-[#121212] border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300 focus:border-fcGreen focus:outline-none resize-y"
          />

          {parsed.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {parsed.map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                    !p.player
                      ? 'border-red-900/60 bg-red-950/30'
                      : p.duplicate
                      ? 'border-gray-800 bg-[#151715]'
                      : 'border-green-900/60 bg-green-950/20'
                  }`}
                >
                  {!p.player ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="text-red-300 truncate">
                        {p.build
                          ? `No card called "${p.build.playerId}" in the library`
                          : 'Not a share link'}
                      </span>
                    </>
                  ) : (
                    <>
                      {p.duplicate ? (
                        <span className="w-3.5 h-3.5 shrink-0 text-gray-600 text-center leading-none">·</span>
                      ) : (
                        <Check className="w-3.5 h-3.5 text-fcGreen shrink-0" />
                      )}
                      <span className="w-7 shrink-0 font-black text-fcGold text-right">{p.ovr}</span>
                      <span className="font-bold text-gray-200 truncate">{p.player.bio.name}</span>
                      <span className="text-gray-500 shrink-0">
                        {p.evoCount} EVO{p.evoCount === 1 ? '' : 's'}
                      </span>
                      {p.duplicate && (
                        <span className="ml-auto text-gray-600 shrink-0">already saved</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-800 bg-[#1f211f] rounded-b-2xl">
          <span className="text-xs text-gray-500">
            {parsed.length === 0
              ? 'Nothing pasted yet'
              : `${importable.length} to import · ${parsed.length - importable.length} skipped`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onImport(importable.map(p => p.build!));
                onClose();
              }}
              disabled={importable.length === 0}
              className="px-4 py-1.5 bg-fcGreen hover:bg-[#1db954] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-lg text-sm"
            >
              Import {importable.length || ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
