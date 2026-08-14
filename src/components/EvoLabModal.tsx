import React from 'react';
import { Layers, X } from 'lucide-react';
import { useModal } from '../utils/modalStack';

/**
 * The EVO Chain Lab, over the page rather than instead of it. It is a reference — what the evos
 * are, what they demand — so the build it is being consulted about should stay where it was.
 */
export const EvoLabModal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children
}) => {
  useModal(true, { onClose });

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-start justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1c1a] border border-gray-700 w-full max-w-5xl rounded-2xl flex flex-col max-h-[92vh] shadow-2xl my-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1f211f] rounded-t-2xl shrink-0">
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-fcGreen" />
            EVO Chain Lab
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};
