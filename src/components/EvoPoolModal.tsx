import React from 'react';
import { X, Check } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';

interface EvoPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  evosPool: string[];
  setEvosPool: (pool: string[]) => void;
}

export const EvoPoolModal: React.FC<EvoPoolModalProps> = ({
  isOpen,
  onClose,
  evosPool,
  setEvosPool
}) => {
  if (!isOpen) return null;

  const toggleEvo = (id: string) => {
    if (evosPool.includes(id)) {
      setEvosPool(evosPool.filter((e) => e !== id));
    } else {
      setEvosPool([...evosPool, id]);
    }
  };

  const handleSelectAll = () => {
    setEvosPool(Object.keys(availableEvolutions));
  };

  const handleClear = () => {
    setEvosPool([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#1f211f]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Manage EVOs Pool</h2>
            <p className="text-xs text-gray-400 mt-1">Select evolutions to include in auto-analysis or manual path creation.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-300">
              {evosPool.length} / {Object.keys(availableEvolutions).length} Selected
            </span>
            <div className="flex gap-2">
              <button onClick={handleSelectAll} className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded text-gray-300 hover:text-white transition-colors">
                Select All
              </button>
              <button onClick={handleClear} className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded text-gray-300 hover:text-white transition-colors">
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(availableEvolutions).map((evo) => {
              const isSelected = evosPool.includes(evo.id);
              return (
                <div
                  key={evo.id}
                  onClick={() => toggleEvo(evo.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-green-950/30 border-fcGreen/60'
                      : 'bg-[#1f211f] border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-fcGreen rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                  <h3 className={`font-bold ${isSelected ? 'text-fcGreen' : 'text-gray-200'}`}>
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#1f211f] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-[#2A2D2A] hover:bg-[#374151] transition-colors border border-gray-700">
            Cancel
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#1ED760] hover:bg-[#1db954] transition-colors shadow-lg">
            Confirm Selection
          </button>
        </div>

      </div>
    </div>
  );
};
