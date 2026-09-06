import React, { useEffect } from 'react';
import { X, Plus, Trash2, RotateCcw, ExternalLink } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { getPlayStyleIconUrl } from '../utils/playstyles';
import { daysUntilExpiry, reachableOvrCeiling } from '../utils/statUtils';
import { useModal } from '../utils/modalStack';

const FACE_LABELS: Record<string, string> = {
  pac: 'Pace', sho: 'Shooting', pas: 'Passing', dri: 'Dribbling', def: 'Defending', phy: 'Physical'
};
export const EvoDetailsModal = ({
  evoId,
  onClose,
  onAddEvo,
  usedBy,
  onSelectPlayer,
  onToggleDisabled,
  isDisabled
}: {
  evoId: string | null;
  onClose: () => void;
  onAddEvo?: (id: string) => void;
  /**
   * The cards running this evo in game right now — its in-game record, not a drafted plan.
   *
   * Most evos are one to a club, so "is this already spoken for" is the question an evo's page gets
   * asked most often, and answering it used to mean opening cards one at a time until you found it.
   */
  usedBy?: { id: string; name: string }[];
  /** Opens one of those cards. Absent where the modal has no card view to send you to. */
  onSelectPlayer?: (id: string) => void;
  /** Switch the evo out of this team's pool, or back into it. The pool card's bin, on the page. */
  onToggleDisabled?: (id: string) => void;
  isDisabled?: boolean;
}) => {
  useModal(!!evoId, { onClose });

  useEffect(() => {
    if (!evoId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && onAddEvo) {
        onAddEvo(evoId);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [evoId, onAddEvo]);

  if (!evoId) return null;
  const evo = availableEvolutions[evoId];
  if (!evo) return null;

  return (
    <div id="evo-details-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1a1c1a] border border-gray-700 w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1f211f] rounded-t-2xl">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white tracking-wide truncate">{evo.name}</h2>
            {evo.nameZh && <p className="text-xs text-gray-500 mt-0.5 truncate">{evo.nameZh}</p>}
          </div>
          <div className="flex items-center gap-3">
            {onAddEvo && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddEvo(evoId);
                }}
                className="px-4 py-1.5 bg-fcGreen hover:bg-[#1db954] text-black font-bold rounded-lg text-sm flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            )}
            {onToggleDisabled && (
              <button
                onClick={e => { e.stopPropagation(); onToggleDisabled(evoId); }}
                title={isDisabled ? 'Put this evo back in the pool' : 'Take this evo out of the pool — nothing is deleted, and it can be put back'}
                className={`p-1.5 rounded-full transition-colors ${
                  isDisabled
                    ? 'text-fcGreen hover:bg-fcGreen hover:text-black'
                    : 'text-red-400 hover:bg-red-500 hover:text-white'
                }`}
              >
                {isDisabled ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* What the evo says it is, in its own words. Every evo carries one, and this is the only
              place it can be read: the pool card behind this has room for a name and a price and
              nothing else, and the chain workbench only shows the blurb for evos already in a
              chain — which is too late to be deciding whether you want the evo. */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400 leading-relaxed">{evo.description}</p>
            {/* Chinese under English rather than instead of it: the English is the game's own
                wording, which is what a FUTBIN page will be headed with. The Chinese line carries
                the part the blurb never says — which position, how big, and what it skips. */}
            {evo.descriptionZh && (
              <p className="text-[13px] text-gray-500 leading-relaxed">{evo.descriptionZh}</p>
            )}
          </div>

          {/* The terms of the thing: what it costs, how long it lasts, how many levels, how many
              times. None of it is an upgrade and all of it decides whether the upgrades are worth
              having, so it sits with the blurb rather than under Upgrades. */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {evo.cost && (
              <span className="px-2 py-1 rounded bg-[#121212] border border-gray-800 text-gray-300 font-semibold">{evo.cost}</span>
            )}
            {(() => {
              const days = daysUntilExpiry(evo);
              if (days === null) return null;
              return (
                <span
                  title={`Expires ${new Date(`${evo.expiresAt}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                  className={`px-2 py-1 rounded border font-bold ${
                    days <= 2 ? 'bg-red-950/60 text-red-300 border-red-700/60'
                    : days <= 7 ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                    : 'bg-[#121212] text-gray-300 border-gray-800'
                  }`}
                >
                  {days <= 0 ? 'expired' : `${days} days left`}
                </span>
              );
            })()}
            {evo.levels && evo.levels.length > 0 && (
              <span className="px-2 py-1 rounded bg-[#121212] border border-gray-800 text-gray-300 font-semibold">
                {evo.levels.length} {evo.levels.length === 1 ? 'level' : 'levels'}
              </span>
            )}
            {(evo.maxRepeatable ?? 1) > 1 && (
              <span className="px-2 py-1 rounded bg-fcGold/15 border border-fcGold/40 text-fcGold font-bold">
                repeatable ×{evo.maxRepeatable}
              </span>
            )}
            {evo.trainingTime && (
              <span className="px-2 py-1 rounded bg-[#121212] border border-gray-800 text-gray-300 font-semibold">{evo.trainingTime}</span>
            )}
            {evo.futbinLink && (
              <a
                href={evo.futbinLink}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="px-2 py-1 rounded bg-[#121212] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 font-semibold flex items-center gap-1"
              >
                FUTBIN <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Who is already running it. Above the requirements on purpose: whether the evo is spent
              decides whether the rest of the page is worth reading. */}
          {usedBy && usedBy.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                In game on {usedBy.length === 1 ? 'this card' : `these ${usedBy.length} cards`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {usedBy.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (!onSelectPlayer) return;
                      onSelectPlayer(p.id);
                      onClose();
                    }}
                    disabled={!onSelectPlayer}
                    title={onSelectPlayer ? `Open ${p.name}` : undefined}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                      onSelectPlayer
                        ? 'bg-fcGreen/10 border-fcGreen/40 text-fcGreen hover:bg-fcGreen hover:text-black cursor-pointer'
                        : 'bg-[#121212] border-gray-800 text-gray-300 cursor-default'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Requirements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(evo.requirements || {}).map(([key, val]) => {
                if (val === undefined) return null;
                if (Array.isArray(val) && val.length === 0) return null;
                const displayKey = key.replace('max', 'Max ').replace('PlayStylesPlus', 'PS+').replace('PlayStyles', 'PS');
                const isPositionReq = key === 'positions' || key === 'excludedPositions';
                return (
                  <div key={key} className={`p-2 rounded border flex flex-col items-center justify-center text-center ${
                    isPositionReq ? 'bg-red-950/40 border-red-900/50' : 'bg-[#121212] border-gray-800'
                  }`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isPositionReq ? 'text-red-500' : 'text-gray-500'}`}>
                      {key === 'excludedPositions' ? 'Excluded Pos' : key === 'positions' ? 'Req Pos' : displayKey}
                    </span>
                    <span className={`font-bold text-sm ${isPositionReq ? 'text-red-400' : 'text-gray-200'}`}>
                      {Array.isArray(val) ? val.join(', ') : val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Upgrades */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Upgrades</h3>
            {evo.ovrBoost && (
              <div className="mb-3 bg-gradient-to-r from-yellow-900/30 to-yellow-950/10 p-3 rounded-lg border border-yellow-700/50 flex justify-between items-center">
                <span className="text-yellow-500 font-bold text-sm tracking-wide">OVR Boost</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-lg">+{evo.ovrBoost.boost}</span>
                  <span className="text-gray-500 text-xs">Limit: {evo.ovrBoost.limit}</span>
                  {/* What it can actually leave a card on: the printed limit and the OVR it still
                      accepts, whichever binds first. A +1 to 99 that takes nothing above 91 tops
                      out at 92, and the limit alone does not say so. */}
                  {evo.ovrBoost.boost > 0 && reachableOvrCeiling(evo) !== evo.ovrBoost.limit && (
                    <span className="text-sky-300 text-xs font-bold" title="Highest OVR this evo can leave a card on, given the OVR it still accepts">
                      → {reachableOvrCeiling(evo)} max
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Face boosts before the sub-stats, because they are the larger promise and the subs
                under them are prorated from these rather than stated in their own right. */}
            {evo.faceBoosts && Object.keys(evo.faceBoosts).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {Object.entries(evo.faceBoosts).map(([face, boost]) => (
                  <div key={face} className="bg-green-950/30 p-2 rounded border border-fcGreen/40 flex justify-between items-center text-xs">
                    <span className="text-fcGreen uppercase font-bold">{FACE_LABELS[face] || face}</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-fcGreen font-bold">+{boost.boost}</span>
                      <span className="text-gray-600 text-[9px]">≤{boost.limit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(evo.weakFootBoost || evo.skillMovesBoost) && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {evo.weakFootBoost ? (
                  <div className="bg-[#121212] p-2 rounded border border-gray-800 flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold">Weak Foot</span>
                    <span className="text-fcGreen font-mono font-bold">+{evo.weakFootBoost}</span>
                  </div>
                ) : null}
                {evo.skillMovesBoost ? (
                  <div className="bg-[#121212] p-2 rounded border border-gray-800 flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase font-bold">Skill Moves</span>
                    <span className="text-fcGreen font-mono font-bold">+{evo.skillMovesBoost}</span>
                  </div>
                ) : null}
              </div>
            )}
            {evo.positionsAdded && evo.positionsAdded.length > 0 && (
              <div className="mb-3 bg-purple-900/20 p-3 rounded-lg border border-purple-800/40 flex justify-between items-center">
                <span className="text-purple-400 font-bold text-sm tracking-wide">Position Added</span>
                <span className="text-purple-300 font-bold text-base">+ {evo.positionsAdded.join(', ')}</span>
              </div>
            )}
            {evo.rarityChange && (
              <div className="mb-3 bg-purple-900/20 p-3 rounded-lg border border-purple-800/40 flex justify-between items-center">
                <span className="text-purple-400 font-bold text-sm tracking-wide">Rarity Change</span>
                <span className="text-purple-300 font-bold text-base">{evo.rarityChange}</span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(evo.subStatBoosts || {}).map(([stat, boost]) => (
                <div key={stat} className="bg-[#121212] p-2 rounded border border-gray-800 flex justify-between items-center text-xs group hover:border-fcGreen/50 transition-colors">
                  <span className="text-gray-400 uppercase font-bold">{stat}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-fcGreen">+{boost.boost}</span>
                    <span className="text-gray-600 text-[9px]">≤{boost.limit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* PlayStyles */}
          {((evo.playStylesAdded?.gold?.length || 0) > 0 || (evo.playStylesAdded?.silver?.length || 0) > 0) && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                PlayStyles Added
                {evo.playStylesLimit && (
                  <span className="text-[10px] font-semibold text-gray-500 normal-case tracking-normal">
                    slots up to{evo.playStylesLimit.gold !== undefined ? ` ${evo.playStylesLimit.gold} PS+` : ''}
                    {evo.playStylesLimit.silver !== undefined ? ` ${evo.playStylesLimit.silver} PS` : ''}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {(evo.playStylesAdded?.gold || []).map(ps => (
                   <div key={`gold-${ps}`} className="relative group">
                     <img src={getPlayStyleIconUrl(ps, true)} alt={ps} title={ps} className="w-16 h-16 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                     <span className="absolute -top-1 -right-2 text-[8px] text-black bg-yellow-500 px-1 rounded-sm font-black tracking-wider shadow-sm">PS+</span>
                   </div>
                ))}
                {(evo.playStylesAdded?.silver || []).map(ps => (
                   <div key={`silver-${ps}`} className="relative group">
                     <img src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-12 h-12 drop-shadow-[0_0_4px_rgba(156,163,175,0.4)]" />
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* The level breakdown. It is the only place that says what arrives when — an evo that
              hands over its PlayStyle+ at level four is a different proposition from one that leads
              with it, and the totals above cannot say which. */}
          {evo.levels && evo.levels.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Levels</h3>
              <div className="flex flex-col gap-2">
                {evo.levels.map((level, i) => (
                  <div key={level.name || i} className="bg-[#121212] rounded-lg border border-gray-800 p-2.5">
                    <div className="text-[11px] font-bold text-gray-300 mb-1.5">{level.name || `Level ${i + 1}`}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {level.upgrades.map((u, j) => (
                        <span
                          key={j}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            /^Challenge/i.test(u)
                              ? 'bg-black/40 text-gray-500 border-gray-800 font-normal'
                              : 'bg-green-950/30 text-gray-300 border-gray-800'
                          }`}
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
