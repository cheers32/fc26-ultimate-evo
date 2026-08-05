import React, { useState, useEffect } from 'react';
import { X, Check, Ban } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';

interface EvoPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  evosPool: string[];
  disabledEvos?: string[];
  requiredEvos?: string[];
  blockedEvos?: string[];
  onConfirm: (pool: string[], required: string[], blocked: string[]) => void;
}

export const EvoPoolModal: React.FC<EvoPoolModalProps> = ({
  isOpen,
  onClose,
  evosPool,
  disabledEvos = [],
  requiredEvos = [],
  blockedEvos = [],
  onConfirm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draftEvosPool, setDraftEvosPool] = useState<string[]>([]);
  const [draftRequiredEvos, setDraftRequiredEvos] = useState<string[]>([]);
  const [draftBlockedEvos, setDraftBlockedEvos] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDraftEvosPool(evosPool);
      setDraftRequiredEvos(requiredEvos);
      setDraftBlockedEvos(blockedEvos);
    }
  }, [isOpen, evosPool, requiredEvos, blockedEvos]);

  const handleConfirm = React.useCallback(() => {
    onConfirm(draftEvosPool, draftRequiredEvos, draftBlockedEvos);
    onClose();
  }, [draftEvosPool, draftRequiredEvos, draftBlockedEvos, onConfirm, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const isEvoDisabled = (id: string) => disabledEvos.includes(id);

  const toggleEvo = (id: string) => {
    if (draftEvosPool.includes(id)) {
      setDraftEvosPool(draftEvosPool.filter((e) => e !== id));
      if (draftRequiredEvos.includes(id)) {
        setDraftRequiredEvos(draftRequiredEvos.filter(e => e !== id));
      }
    } else {
      setDraftEvosPool([...draftEvosPool, id]);
      if (draftBlockedEvos.includes(id)) {
        setDraftBlockedEvos(draftBlockedEvos.filter(e => e !== id));
      }
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
      if (draftBlockedEvos.includes(id)) {
        setDraftBlockedEvos(draftBlockedEvos.filter(e => e !== id));
      }
    }
  };

  const toggleBlocked = (id: string) => {
    if (draftBlockedEvos.includes(id)) {
      setDraftBlockedEvos(draftBlockedEvos.filter(e => e !== id));
    } else {
      setDraftBlockedEvos([...draftBlockedEvos, id]);
      if (draftRequiredEvos.includes(id)) {
        setDraftRequiredEvos(draftRequiredEvos.filter(e => e !== id));
      }
      if (!draftEvosPool.includes(id)) {
        setDraftEvosPool([...draftEvosPool, id]);
      }
    }
  };

  const activeEvos = Object.values(availableEvolutions)
    .filter(evo => !isEvoDisabled(evo.id))
    .sort((a, b) => {
      const aReq = draftRequiredEvos.includes(a.id);
      const bReq = draftRequiredEvos.includes(b.id);
      if (aReq && !bReq) return -1;
      if (!aReq && bReq) return 1;

      const aBlock = draftBlockedEvos.includes(a.id);
      const bBlock = draftBlockedEvos.includes(b.id);
      if (aBlock && !bBlock) return -1;
      if (!aBlock && bBlock) return 1;

      return 0;
    });
  const disabledEvosList = Object.values(availableEvolutions).filter(evo => isEvoDisabled(evo.id));

  const filteredActiveEvos = activeEvos.filter(evo => !searchQuery || evo.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDisabledEvos = disabledEvosList.filter(evo => !searchQuery || evo.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedCount = draftEvosPool.length;
  const totalCount = Object.keys(availableEvolutions).length;

  const handleSelectAll = () => {
    setDraftEvosPool(Object.keys(availableEvolutions).filter(id => !isEvoDisabled(id)));
  };

  const handleClear = () => {
    setDraftEvosPool([]);
    setDraftRequiredEvos([]);
    setDraftBlockedEvos([]);
  };

  const EvoCard = ({ evo }: { evo: any }) => {
    const disabled = isEvoDisabled(evo.id);
    const isSelected = draftEvosPool.includes(evo.id);
    const isRequired = draftRequiredEvos.includes(evo.id);
    const isBlocked = draftBlockedEvos.includes(evo.id);

    return (
      <div
        key={evo.id}
        onClick={() => toggleEvo(evo.id)}
        className={`relative p-4 rounded-xl border transition-all ${
          isBlocked
            ? 'bg-red-950/10 border-red-900/30 cursor-pointer'
            : isSelected
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
        {disabled && !isSelected && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-900/50 rounded px-1.5 py-0.5">
            <Ban className="w-3 h-3" /> Disabled
          </div>
        )}
        <h3 className={`font-bold ${isBlocked ? 'text-red-400 opacity-90' : disabled && !isSelected ? 'text-gray-500 line-through' : isSelected ? 'text-fcGreen' : 'text-gray-200'}`}>
          {evo.name}
        </h3>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{evo.cost}</p>

        <div className="mt-3 flex gap-2 text-[10px]">
          <span className="px-2 py-1 bg-black/40 rounded text-gray-300">
            Max OVR {evo.requirements.maxOvr}
          </span>
          {evo.requirements.maxPace && (
            <span className="px-2 py-1 bg-black/40 rounded text-gray-300">
              Max PAC {evo.requirements.maxPace}
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
          <div 
            className="flex items-center gap-2 cursor-pointer z-10 hover:opacity-80" 
            onClick={(e) => { e.stopPropagation(); toggleBlocked(evo.id); }}
            title="Exclude from Auto Path Analysis"
          >
            <span className={`text-[9px] font-bold ${isBlocked ? 'text-red-400' : 'text-gray-500'}`}>
              NO AUTO
            </span>
            <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${isBlocked ? 'bg-red-500' : 'bg-gray-700'}`}>
              <div className={`w-2.5 h-2.5 bg-white rounded-full transition-transform ${isBlocked ? 'translate-x-3.5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <span className="text-sm font-semibold text-gray-300">
              {selectedCount} / {totalCount} Selected
            </span>
            <div className="flex gap-2 items-center flex-1 sm:flex-none justify-end">
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
                          draftBlockedEvos
                        );
                        onClose();
                      } else {
                        handleConfirm();
                      }
                    }
                  }}
                  className="w-full sm:w-48 bg-[#1a1c1a] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:border-fcGreen outline-none transition-colors"
                />
              <button onClick={handleSelectAll} className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded text-gray-300 hover:text-white transition-colors">
                Select All
              </button>
              <button onClick={handleClear} className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded text-gray-300 hover:text-white transition-colors">
                Clear
              </button>
            </div>
          </div>

          {/* Active EVOs Section */}
          {filteredActiveEvos.length > 0 && (
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
          {filteredDisabledEvos.length > 0 && (
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

          {filteredActiveEvos.length === 0 && filteredDisabledEvos.length === 0 && (
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
    </div>
  );
};
