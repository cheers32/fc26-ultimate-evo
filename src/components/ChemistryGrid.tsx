import React from 'react';
import { ChemStylesData } from '../types/player';
import { Sparkles } from 'lucide-react';

interface ChemistryGridProps {
  chemStyles: ChemStylesData;
  hoveredChem: string | null;
  lockedChem: string | null;
  onHoverChem: (name: string | null) => void;
  onLockChem: (name: string) => void;
}

export const ChemistryGrid: React.FC<ChemistryGridProps> = ({
  chemStyles,
  hoveredChem,
  lockedChem,
  onHoverChem,
  onLockChem
}) => {
  const names = Object.keys(chemStyles);

  return (
    <div className="mt-4 border-t border-gray-800 pt-3">
      {/* 5-Column Seamless Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0 border-l border-t border-[#4b5563] rounded-lg overflow-hidden bg-[#1f2937] shadow-xl">
        {names.map((name) => {
          const isLocked = name === lockedChem;
          const isHovered = name === hoveredChem;

          return (
            <button
              key={name}
              onMouseEnter={() => onHoverChem(name)}
              onMouseLeave={() => onHoverChem(null)}
              onClick={() => onLockChem(name)}
              className={`
                relative transition-all text-xs font-semibold py-2.5 px-2 border-r border-b border-[#4b5563] cursor-pointer text-center select-none
                ${
                  isLocked
                    ? 'bg-[#1ED760] text-[#121212] font-extrabold shadow-[0_0_12px_rgba(30,215,96,0.5)] z-10 border-r-transparent border-b-transparent'
                    : isHovered
                    ? 'bg-[#374151] text-white shadow-[inset_0_0_0_1px_#1ED760] z-10'
                    : 'bg-[#1f2937] text-gray-300 hover:text-white'
                }
              `}
            >
              {name}
            </button>
          );
        })}

        {/* Filler cells to complete 5x4 grid */}
        <div className="border-r border-b border-[#4b5563] bg-[#1a202c]/50 hidden md:block" />
        <div className="border-r border-b border-[#4b5563] bg-[#1a202c]/50 hidden md:block" />
      </div>
    </div>
  );
};
