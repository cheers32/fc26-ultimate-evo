import React from 'react';
import { ChemStylesData, StatsData } from '../types/player';
import {
  ACCELERATE_FAMILIES,
  ACCELERATE_TIERS_BY_FAMILY,
  ACCELERATE_TYPES,
  AccelerateType,
  accelerateLean,
  calculateAccelerateType
} from '../utils/statUtils';

interface ChemistryGridProps {
  chemStyles: ChemStylesData;
  previewStats: StatsData;
  hoveredChem: string | null;
  lockedChem: string | null;
  /** Height decides which AcceleRATE archetypes are reachable at all — without it every chem
   *  style is grouped as if the card were 180cm. */
  heightCm?: number;
  onHoverChem: (name: string | null) => void;
  onLockChem: (name: string) => void;
}

export const ChemistryGrid: React.FC<ChemistryGridProps> = ({
  chemStyles,
  previewStats,
  hoveredChem,
  lockedChem,
  heightCm,
  onHoverChem,
  onLockChem
}) => {
  const names = Object.keys(chemStyles);

  // Fastest to slowest, and all seven: the two "controlled" tiers used to be missing from this
  // list and got appended as they turned up, which put them after Lengthy instead of beside the
  // archetype they shade into.
  const groupedChems: Record<string, string[]> = Object.fromEntries(
    ACCELERATE_TYPES.map(type => [type, [] as string[]])
  );

  names.forEach(name => {
    const boost = chemStyles[name] || {};
    const accBase = previewStats?.pac?.subs?.acceleration?.base || 50;
    const agiBase = previewStats?.dri?.subs?.agility?.base || 50;
    const strBase = previewStats?.phy?.subs?.strength?.base || 50;

    const acc = Math.min(99, accBase + (boost.acceleration || 0));
    const agi = Math.min(99, agiBase + (boost.agility || 0));
    const str = Math.min(99, strBase + (boost.strength || 0));

    const type = calculateAccelerateType(acc, agi, str, heightCm);
    if (!groupedChems[type]) groupedChems[type] = [];
    groupedChems[type].push(name);
  });

  const getFaceBoost = (chemName: string) => {
    const boost = chemStyles[chemName] || {};
    let totalFaceBoost = 0;
    if (!previewStats) return 0;
    
    Object.keys(previewStats).forEach((faceKey) => {
      const faceData = previewStats[faceKey];
      let baseSum = 0;
      let chemSum = 0;
      Object.keys(faceData.subs).forEach((subKey) => {
        const subData = faceData.subs[subKey];
        const b = boost[subKey] || 0;
        const baseVal = subData.base;
        const finalVal = Math.min(99, baseVal + b);
        baseSum += baseVal * subData.w;
        chemSum += finalVal * subData.w;
      });
      totalFaceBoost += (Math.round(chemSum) - Math.round(baseSum));
    });
    return totalFaceBoost;
  };

  return (
    <div className="border-t border-gray-800 pt-3 lg:border-t-0 lg:pt-0 lg:h-full flex flex-col gap-2 pl-0 lg:pl-2">
      {/* Both groupings at once, nested rather than picked between: the outer heading is the word
          the game prints and collects exactly the styles the game collects, and the tiers inside it
          are the finer split, which is the part that says whether a style is comfortably in that
          archetype or one point from leaving it. */}
      {ACCELERATE_FAMILIES.map(family => {
        const tiers = ACCELERATE_TIERS_BY_FAMILY[family].filter(t => groupedChems[t]?.length > 0);
        if (tiers.length === 0) return null;
        const total = tiers.reduce((sum, t) => sum + groupedChems[t].length, 0);

        return (
          <div key={family} className="flex flex-col gap-1">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide flex items-baseline gap-1.5">
              {family}
              <span className="text-gray-700 font-mono text-[9px]">{total}</span>
            </h4>
            {tiers.map(group => {
        const items = groupedChems[group];

        // Sort items by highest total face stat boost
        items.sort((a, b) => getFaceBoost(b) - getFaceBoost(a));
        const lean = accelerateLean(group as AccelerateType);

        return (
          <div key={group} className="flex flex-col gap-0.5">
            {lean && (
              <span className="text-[9px] font-semibold text-gray-600 tracking-wide pl-0.5">
                · {lean}
              </span>
            )}
            {/* No gaps: the styles are a dense lookup table, and the gutters were costing more
                vertical space than the rows themselves. Borders collapse into a shared grid. */}
            <div className="grid grid-cols-3 rounded-lg overflow-hidden border border-[#4b5563]/40">
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
                      relative transition-colors text-[10.5px] font-semibold py-1 px-1 cursor-pointer text-center select-none flex items-center justify-center
                      border-r border-b border-[#4b5563]/25 last:border-r-0
                      ${
                        isLocked
                          ? 'bg-[#1ED760]/25 text-[#1ED760] ring-1 ring-inset ring-[#1ED760]'
                          : isHovered
                          ? 'bg-[#374151] text-white'
                          : 'bg-[#1f2937]/50 text-gray-300 hover:bg-[#374151] hover:text-white'
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
      })}
    </div>
  );
};
