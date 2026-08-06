import React, { useState, useEffect } from 'react';
import { X, Check, Ban, Eye } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { displayExcludedPositions } from '../utils/statUtils';
import { EvoDetailsModal } from './EvoDetailsModal';

interface EvoPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  evosPool: string[];
  disabledEvos?: string[];
  requiredEvos?: string[];
  onConfirm: (pool: string[], required: string[], disabled: string[]) => void;
}

export const EvoPoolModal: React.FC<EvoPoolModalProps> = ({
  isOpen,
  onClose,
  evosPool,
  disabledEvos = [],
  requiredEvos = [],
  onConfirm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draftEvosPool, setDraftEvosPool] = useState<string[]>([]);
  const [draftRequiredEvos, setDraftRequiredEvos] = useState<string[]>([]);
  const [draftDisabledEvos, setDraftDisabledEvos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'active' | 'disabled'>('active');
  const [filterMustInclude, setFilterMustInclude] = useState(false);
  const [filterSecondary, setFilterSecondary] = useState(false);
  const [filterNewRarity, setFilterNewRarity] = useState(false);
  const [filterNewPosition, setFilterNewPosition] = useState(false);
  const [viewingEvo, setViewingEvo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraftEvosPool(evosPool);
      setDraftRequiredEvos(requiredEvos);
      setDraftDisabledEvos(disabledEvos);
    }
  }, [isOpen, evosPool, requiredEvos, disabledEvos]);

  const handleConfirm = React.useCallback(() => {
    onConfirm(draftEvosPool, draftRequiredEvos, draftDisabledEvos);
    onClose();
  }, [draftEvosPool, draftRequiredEvos, draftDisabledEvos, onConfirm, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // The details modal opens on top of this one and handles its own keys — Escape there must
      // close it rather than the pool underneath, and Enter must not confirm the whole selection.
      if (document.getElementById('evo-details-modal')) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') {
        // Only if we aren't typing in the search input (it has its own enter handler)
        if (document.activeElement?.tagName !== 'INPUT') {
          handleConfirm();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleConfirm]);

  if (!isOpen) return null;

  const isEvoDisabled = (id: string) => draftDisabledEvos.includes(id);

  const toggleEvo = (id: string) => {
    if (draftEvosPool.includes(id)) {
      setDraftEvosPool(draftEvosPool.filter((e) => e !== id));
      if (draftRequiredEvos.includes(id)) {
        setDraftRequiredEvos(draftRequiredEvos.filter(e => e !== id));
      }
    } else {
      setDraftEvosPool([...draftEvosPool, id]);
    }
  };

  const toggleRequired = (id: string) => {
    if (draftRequiredEvos.includes(id)) {
      setDraftRequiredEvos(draftRequiredEvos.filter(e => e !== id));
    } else {
      setDraftRequiredEvos([...draftRequiredEvos, id]);
      if (!draftEvosPool.includes(id)) {
        setDraftEvosPool([...draftEvosPool, id]);
      }
    }
  };

  
  const toggleDisabledToggle = (id: string) => {
    if (draftDisabledEvos.includes(id)) {
      setDraftDisabledEvos(draftDisabledEvos.filter(e => e !== id));
    } else {
      setDraftDisabledEvos([...draftDisabledEvos, id]);
    }
  };



  const activeEvos = Object.values(availableEvolutions)
    .filter(evo => !isEvoDisabled(evo.id))
    ;
  const disabledEvosList = Object.values(availableEvolutions).filter(evo => isEvoDisabled(evo.id));



  const filteredActiveEvos = activeEvos.filter(evo => {
    if (filterMustInclude && !draftRequiredEvos.includes(evo.id)) return false;
    if (filterSecondary && viewMode === 'active' && draftEvosPool.includes(evo.id)) return false; // EXCLUDED means not in pool
    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterNewRarity && !evo.rarityChange) return false;
    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
    return true;
  });
  const filteredDisabledEvos = disabledEvosList.filter(evo => {
    if (filterMustInclude && !draftRequiredEvos.includes(evo.id)) return false;
    if (filterSecondary && viewMode === 'disabled' && !draftEvosPool.includes(evo.id)) return false; // SELECTED means in pool
    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterNewRarity && !evo.rarityChange) return false;
    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
    return true;
  });

  const selectedCount = draftEvosPool.length;
  const totalCount = Object.keys(availableEvolutions).length;

  const handleSelectAll = () => {
    setDraftEvosPool(Object.keys(availableEvolutions).filter(id => !isEvoDisabled(id)));
  };

  const handleClear = () => {
    setDraftEvosPool([]);
    setDraftRequiredEvos([]);
  };

  const EvoCard = ({ evo }: { evo: any }) => {
    const disabled = isEvoDisabled(evo.id);
    const isSelected = draftEvosPool.includes(evo.id);
    const isRequired = draftRequiredEvos.includes(evo.id);

    return (
      <div
        key={evo.id}
        onClick={() => toggleEvo(evo.id)}
        className={`relative p-4 rounded-xl border transition-all ${
isSelected
            ? 'bg-green-950/30 border-fcGreen/60 cursor-pointer'
            : disabled
            ? 'bg-[#141614] border-red-900/40 hover:border-red-800/60 cursor-pointer'
            : 'bg-[#1f211f] border-gray-800 hover:border-gray-600 cursor-pointer'
        }`}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 w-5 h-5 bg-fcGreen rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-black" />
          </div>
        )}
        <div className="flex items-start justify-between pr-7 gap-2">
          <h3 className={`font-bold leading-tight ${disabled && !isSelected ? 'text-gray-500 line-through' : isSelected ? 'text-fcGreen' : 'text-gray-200'}`}>
            {evo.name}
          </h3>
          <button
            onClick={(e) => { e.stopPropagation(); setViewingEvo(evo.id); }}
            className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto mr-1 shrink-0"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleDisabledToggle(evo.id); }}
            title={disabled
              ? 'Re-enable — Analyze and the EVOs pool can use it again'
              : 'Disable globally — excluded from Analyze and not selectable in the EVOs pool'}
            className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded border transition-colors shrink-0 z-10 ${
              disabled
                ? 'text-red-400 bg-red-950/60 border-red-800/60 hover:bg-red-900/60'
                : 'text-gray-400 bg-black/40 border-gray-700 hover:text-red-400 hover:border-red-800/60'
            }`}
          >
            <Ban className="w-2.5 h-2.5" /> {disabled ? 'Disabled' : 'Disable'}
          </button>
        </div>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{evo.cost}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
          <span className="px-2 py-1 bg-black/40 rounded text-gray-300">
            Max OVR {evo.requirements.maxOvr}
          </span>
          {evo.requirements.maxPace && (
            <span className="px-2 py-1 bg-black/40 rounded text-gray-300">
              Max PAC {evo.requirements.maxPace}
            </span>
          )}
          {evo.requirements.positions && evo.requirements.positions.length > 0 && (
            <span className="px-2 py-1 bg-red-950/40 rounded text-red-400 border border-red-900/50 font-bold">
              Req Pos: {evo.requirements.positions.join(', ')}
            </span>
          )}
          {displayExcludedPositions(evo).length > 0 && (
            <span className="px-2 py-1 bg-red-950/40 rounded text-red-400 border border-red-900/50 font-bold">
              Excl Pos: {displayExcludedPositions(evo).join(', ')}
            </span>
          )}
          {evo.maxRepeatable && evo.maxRepeatable > 1 && (
            <span className="px-2 py-1 bg-fcGold/20 rounded text-fcGold border border-fcGold/40 font-bold">
              Repeatable: {evo.maxRepeatable}
            </span>
          )}
          {evo.trainingTime && (
            <span className="px-2 py-1 bg-blue-950/40 rounded text-blue-400 border border-blue-800/40 font-bold">
              Training: {evo.trainingTime}
            </span>
          )}
          {evo.positionsAdded && evo.positionsAdded.length > 0 && (
            <span className="px-2 py-1 bg-purple-950/40 rounded text-purple-400 border border-purple-800/40 font-bold">
              + Pos: {evo.positionsAdded.join(', ')}
            </span>
          )}
          {evo.rarityChange && (
            <span className="px-2 py-1 bg-purple-950/40 rounded text-purple-400 border border-purple-800/40 font-bold">
              Rarity → {evo.rarityChange}
            </span>
          )}
        </div>

        {/* Toggles */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
          <div 
            className="flex items-center gap-2 cursor-pointer z-10 hover:opacity-80" 
            onClick={(e) => { e.stopPropagation(); toggleRequired(evo.id); }}
          >
            <span className={`text-[9px] font-bold ${isRequired ? 'text-fcGreen' : 'text-gray-500'}`}>
              MUST INCLUDE
            </span>
            <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${isRequired ? 'bg-fcGreen' : 'bg-gray-700'}`}>
              <div className={`w-2.5 h-2.5 bg-white rounded-full transition-transform ${isRequired ? 'translate-x-3.5' : 'translate-x-0'}`} />
            </div>
          </div>


        </div>
      </div>
    );
  };

  // One shape for every control in the toolbar. They used to be a mix of text-xs/text-[10px] and
  // rounded/rounded-lg in a single justify-between row, which fell apart as soon as it wrapped.
  const control = 'px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap';
  const controlOff = 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151] hover:text-gray-200';
  const controlOn = 'bg-fcGreen text-black border-fcGreen/80 shadow-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1f211f]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Manage EVOs Pool</h2>
            <p className="text-xs text-gray-400 mt-1">Select evolutions for auto-analysis and manual path creation. Disabled EVOs can still be included in the pool.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
          <div className="flex flex-col gap-3 mb-6">
            {/* Row 1: which list you're looking at */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-300">
                {selectedCount} / {totalCount} Selected
              </span>

              {filterMustInclude ? (
                <span className="text-[11px] font-bold text-fcGreen uppercase tracking-widest px-3 py-1.5 bg-green-950/30 border border-green-900/50 rounded-lg">
                  Viewing Must Include
                </span>
              ) : (
                <div className="flex bg-[#2A2D2A] p-1 rounded-lg border border-gray-700/50">
                  <button
                    onClick={() => { setViewMode('active'); setFilterSecondary(false); }}
                    className={`px-4 py-1 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                      viewMode === 'active' ? 'bg-fcGreen text-black shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> ACTIVE
                  </button>
                  <button
                    onClick={() => { setViewMode('disabled'); setFilterSecondary(false); }}
                    className={`px-4 py-1 text-[11px] font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                      viewMode === 'disabled' ? 'bg-red-500 text-black shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" /> DISABLED
                  </button>
                </div>
              )}
            </div>

            {/* Row 2: narrowing that list down, then the bulk actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {!filterMustInclude && (
                <button
                  onClick={() => setFilterSecondary(!filterSecondary)}
                  className={`${control} ${
                    filterSecondary
                      ? (viewMode === 'active' ? 'bg-red-950/80 text-red-400 border-red-800/80 shadow-sm' : 'bg-green-950/80 text-fcGreen border-green-800/80 shadow-sm')
                      : controlOff
                  }`}
                >
                  {viewMode === 'active' ? (
                    <><X className="w-3.5 h-3.5" /> EXCLUDED</>
                  ) : (
                    <><Check className="w-3.5 h-3.5" /> SELECTED</>
                  )}
                </button>
              )}
              <button
                onClick={() => { setFilterMustInclude(!filterMustInclude); setFilterSecondary(false); }}
                className={`${control} ${filterMustInclude ? controlOn : controlOff}`}
              >
                ★ MUST INCLUDE
              </button>
              <button
                onClick={() => setFilterNewRarity(!filterNewRarity)}
                className={`${control} ${filterNewRarity ? controlOn : controlOff}`}
              >
                NEW RARITY
              </button>
              <button
                onClick={() => setFilterNewPosition(!filterNewPosition)}
                className={`${control} ${filterNewPosition ? controlOn : controlOff}`}
              >
                NEW POSITION
              </button>

              {/* Search and the bulk actions travel as one group, so a narrow modal drops all
                  three to the next line together instead of stranding them apart. */}
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="text"
                  placeholder="Search EVOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const topEvo = filteredActiveEvos[0] || filteredDisabledEvos[0];
                      if (topEvo && !draftEvosPool.includes(topEvo.id)) {
                        onConfirm(
                          [...draftEvosPool, topEvo.id],
                          draftRequiredEvos,
                          draftDisabledEvos
                        );
                        onClose();
                      } else {
                        handleConfirm();
                      }
                    }
                  }}
                  className="w-44 sm:w-52 bg-[#1a1c1a] border border-gray-700 rounded-lg px-3 py-1.5 text-[11px] text-gray-300 focus:border-fcGreen outline-none transition-colors"
                />
                <button onClick={handleSelectAll} className={`${control} ${controlOff}`}>
                  Select All
                </button>
                <button onClick={handleClear} className={`${control} ${controlOff}`}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Active EVOs Section */}
          {(viewMode === 'active' || filterMustInclude) && filteredActiveEvos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-fcGreen mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Active Evolutions ({filteredActiveEvos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredActiveEvos.map((evo) => (
                  <EvoCard key={evo.id} evo={evo} />
                ))}
              </div>
            </div>
          )}

          {/* Disabled EVOs Section */}
          {(viewMode === 'disabled' || filterMustInclude) && filteredDisabledEvos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Disabled Evolutions ({filteredDisabledEvos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDisabledEvos.map((evo) => (
                  <EvoCard key={evo.id} evo={evo} />
                ))}
              </div>
            </div>
          )}

          {((viewMode === 'active' && !filterMustInclude && filteredActiveEvos.length === 0) || (viewMode === 'disabled' && !filterMustInclude && filteredDisabledEvos.length === 0) || (filterMustInclude && filteredActiveEvos.length === 0 && filteredDisabledEvos.length === 0)) && (
            <div className="text-center py-8 text-gray-500">
              No evolutions found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#1f211f] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-[#2A2D2A] hover:bg-[#374151] transition-colors border border-gray-700">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#1ED760] hover:bg-[#1db954] transition-colors shadow-lg">
            Confirm Selection
          </button>
        </div>

      </div>

      {/* The eye on every card sets this — without the modal rendered here, clicking it did nothing. */}
      <EvoDetailsModal evoId={viewingEvo} onClose={() => setViewingEvo(null)} />
    </div>
  );
};
