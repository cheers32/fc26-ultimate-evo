import React from 'react';
import { ChemStylesData, StatsData } from '../types/player';
import {
  ACCELERATE_FAMILIES,
  ACCELERATE_TIERS_BY_FAMILY,
  ACCELERATE_TYPES,
  AccelerateType,
  calculateAccelerateFamily,
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

  // The same styles grouped twice over, because the two systems genuinely disagree — a card can be
  // Controlled in game and Controlled Explosive by the seven-way thresholds, and neither reading
  // is the other's summary.
  const groupedByFamily: Record<string, string[]> = { Explosive: [], Controlled: [], Lengthy: [] };

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

    groupedByFamily[calculateAccelerateFamily(acc, agi, str, heightCm)].push(name);
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

  /** One dense lookup grid of styles; shared by both groupings. */
  const styleGrid = (items: string[]) => (
    <div className="grid grid-cols-3 rounded-lg overflow-hidden border border-[#4b5563]/40">
      {[...items].sort((a, b) => getFaceBoost(b) - getFaceBoost(a)).map((name) => {
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
  );

  const heading = (text: string, count: number) => (
    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide flex items-baseline gap-1.5">
      {text}
      <span className="text-gray-700 font-mono text-[9px]">{count}</span>
    </h4>
  );

  return (
    <div className="border-t border-gray-800 pt-3 lg:border-t-0 lg:pt-0 lg:h-full flex flex-col gap-3 pl-0 lg:pl-2">
      {/* Two lists, not one nested in the other, because the two systems disagree about where the
          line falls rather than one being a refinement of the other: the game turns Explosive on at
          an agility lead of 10, while the seven-way thresholds lean Explosive from 4. Nesting would
          have to pick one of them to be the outer truth. */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[9px] font-bold uppercase tracking-wider text-fcGreen/70">In game · FC 26</div>
        {ACCELERATE_FAMILIES.map(family => {
          const items = groupedByFamily[family];
          if (!items || items.length === 0) return null;
          return (
            <div key={family} className="flex flex-col gap-0.5">
              {heading(family, items.length)}
              {styleGrid(items)}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-[9px] font-bold uppercase tracking-wider text-gray-600">Detailed · seven tiers</div>
        {ACCELERATE_TYPES.map(type => {
          const items = groupedChems[type];
          if (!items || items.length === 0) return null;
          return (
            <div key={type} className="flex flex-col gap-0.5">
              {heading(type, items.length)}
              {styleGrid(items)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
