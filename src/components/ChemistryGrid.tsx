import React from 'react';
import { ChemStylesData, StatsData } from '../types/player';
import { calculateAccelerateType } from '../utils/statUtils';

interface ChemistryGridProps {
  chemStyles: ChemStylesData;
  previewStats: StatsData;
  hoveredChem: string | null;
  lockedChem: string | null;
  onHoverChem: (name: string | null) => void;
  onLockChem: (name: string) => void;
}

export const ChemistryGrid: React.FC<ChemistryGridProps> = ({
  chemStyles,
  previewStats,
  hoveredChem,
  lockedChem,
  onHoverChem,
  onLockChem
}) => {
  const names = Object.keys(chemStyles);

  const groupedChems: Record<string, string[]> = {
    Lengthy: [],
    Controlled: [],
    Explosive: []
  };

  names.forEach(name => {
    const boost = chemStyles[name] || {};
    const accBase = previewStats?.pac?.subs?.acceleration?.base || 50;
    const agiBase = previewStats?.dri?.subs?.agility?.base || 50;
    const strBase = previewStats?.phy?.subs?.strength?.base || 50;
    
    const acc = Math.min(99, accBase + (boost.acceleration || 0));
    const agi = Math.min(99, agiBase + (boost.agility || 0));
    const str = Math.min(99, strBase + (boost.strength || 0));
    
    const type = calculateAccelerateType(acc, agi, str);
    if (!groupedChems[type]) groupedChems[type] = [];
    groupedChems[type].push(name);
  });

  return (
    <div className="border-t border-gray-800 pt-3 lg:border-t-0 lg:pt-0 lg:h-full flex flex-col gap-4 pl-0 lg:pl-2">
      {['Lengthy', 'Controlled', 'Explosive'].map((group) => {
        const items = groupedChems[group];
        if (!items || items.length === 0) return null;

        return (
          <div key={group} className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-gray-400">{group}</h4>
            <div className="grid grid-cols-3 gap-2">
              {items.map((name) => {
                const isLocked = name === lockedChem;
                const isHovered = name === hoveredChem;

                return (
                  <button
                    key={name}
                    onMouseEnter={() => onHoverChem(name)}
                    onMouseLeave={() => onHoverChem(null)}
                    onClick={() => onLockChem(name)}
                    className={`
                      relative transition-all text-[11px] font-semibold py-2 px-1 rounded border cursor-pointer text-center select-none flex items-center justify-center gap-1.5
                      ${
                        isLocked
                          ? 'bg-[#1ED760]/20 text-[#1ED760] border-[#1ED760] shadow-[0_0_8px_rgba(30,215,96,0.2)]'
                          : isHovered
                          ? 'bg-[#374151] text-white border-gray-500'
                          : 'bg-[#1f2937]/50 text-gray-300 border-[#4b5563]/50 hover:bg-[#374151] hover:text-white hover:border-gray-500'
                      }
                    `}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
