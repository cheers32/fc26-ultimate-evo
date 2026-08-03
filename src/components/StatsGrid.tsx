import React from 'react';
import { StatsData, EvolutionDefinition } from '../types/player';
import { calculateChip } from '../utils/statUtils';

interface StatsGridProps {
  baseStats: StatsData;
  previewStats: StatsData;
  activeChemBoosts: Record<string, number>;
  activeEvo?: EvolutionDefinition | null;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  baseStats,
  previewStats,
  activeChemBoosts,
  activeEvo
}) => {
  const getStatColorClass = (val: number) => {
    if (val >= 95) return 'text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.4)] font-black';
    if (val >= 90) return 'text-fcGreen font-bold';
    if (val >= 80) return 'text-lime-400 font-semibold';
    if (val >= 70) return 'text-yellow-500 font-semibold';
    return 'text-red-500 opacity-90';
  };
  
  // Calculate Utilization stats if a specific EVO is selected
  let totalAllowedBoost = 0;
  let totalActualBoost = 0;
  
  if (activeEvo) {
    Object.keys(baseStats).forEach(faceKey => {
      Object.keys(baseStats[faceKey].subs).forEach(subKey => {
        const allowed = activeEvo.subStatBoosts[subKey]?.boost || 0;
        if (allowed > 0) {
          totalAllowedBoost += allowed;
          const actual = Math.max(0, previewStats[faceKey].subs[subKey].base - baseStats[faceKey].subs[subKey].base);
          totalActualBoost += actual;
        }
      });
    });
  }

  const utilPercent = totalAllowedBoost > 0 ? (totalActualBoost / totalAllowedBoost) * 100 : 100;
  let utilVerdict = '';
  let utilColor = '';

  if (activeEvo && totalAllowedBoost > 0) {
    if (utilPercent >= 90) {
      utilVerdict = 'Exceptional (Highly Recommended)';
      utilColor = 'text-fcGreen border-fcGreen bg-green-950/40';
    } else if (utilPercent >= 70) {
      utilVerdict = 'Good (Worth Doing)';
      utilColor = 'text-yellow-400 border-yellow-500 bg-yellow-950/40';
    } else if (utilPercent >= 50) {
      utilVerdict = 'Sub-optimal (Many stats capped)';
      utilColor = 'text-orange-400 border-orange-500 bg-orange-950/40';
    } else {
      utilVerdict = 'Poor (Not worth the upgrade)';
      utilColor = 'text-red-400 border-red-500 bg-red-950/40';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4" id="stats-grid">
      {Object.keys(baseStats).map((faceKey) => {
        const baseFaceData = baseStats[faceKey];
        const previewFaceData = previewStats[faceKey];
        
        let totalFaceValBase = 0;
        let totalFaceValChem = 0;

        const subRows = Object.keys(baseFaceData.subs).map((subKey) => {
          const subDataBase = baseFaceData.subs[subKey];
          const subDataPreview = previewFaceData.subs[subKey];
          const boost = activeChemBoosts[subKey] || 0;

          const activeBase = subDataBase.base;
          const effectiveVal = subDataPreview.base;
          const showEvo = effectiveVal !== activeBase;

          const finalVal = Math.min(99, effectiveVal + boost);

          totalFaceValBase += effectiveVal * subDataBase.w;
          totalFaceValChem += finalVal * subDataBase.w;

          const actualBoost = Math.max(0, effectiveVal - activeBase);
          let utilChip = null;

          if (activeEvo && activeEvo.subStatBoosts[subKey]) {
            const allowedBoost = activeEvo.subStatBoosts[subKey].boost;
            const limit = activeEvo.subStatBoosts[subKey].limit;
            utilChip = calculateChip(activeBase, allowedBoost, limit, actualBoost, false);
          } else if (activeEvo && activeEvo.faceBoosts?.[faceKey]) {
            const allowedBoost = activeEvo.faceBoosts[faceKey].boost;
            const limit = activeEvo.faceBoosts[faceKey].limit;
            utilChip = calculateChip(activeBase, allowedBoost, limit, actualBoost, false);
          } else if (actualBoost > 0) {
            utilChip = { text: `+${actualBoost}`, className: 'text-fcGreen border-fcGreen bg-green-950/40 border px-1.5' };
          }

          return (
            <div key={subKey} className="flex justify-between items-center text-[12px] text-fcTextDim my-[2px] hover:text-white transition-colors">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate">{subDataBase.label}</span>
                {utilChip && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${utilChip.className}`}>
                    {utilChip.text}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end font-mono">
                <span className={`w-5 text-right ${getStatColorClass(activeBase)}`}>{activeBase}</span>
                
                <span className={`text-[10px] mx-1 ${showEvo ? 'text-gray-500' : 'text-transparent'}`}>➜</span>
                <span className={`w-5 text-right ${showEvo ? getStatColorClass(effectiveVal) : 'text-transparent'}`}>
                  {showEvo ? effectiveVal : '00'}
                </span>

                <span className={`font-normal text-[11px] ml-1.5 w-10 text-left tracking-tighter ${boost > 0 ? 'text-fcGreen font-bold' : 'text-transparent'}`}>
                  {boost > 0 ? `➜ +${boost}` : '➜ +0'}
                </span>

                <span className={`w-5 text-right ${boost > 0 ? getStatColorClass(finalVal) : 'text-transparent'}`}>
                  {boost > 0 ? finalVal : '00'}
                </span>
              </div>
            </div>
          );
        });

        // Face Stat totals
        const activeBaseFaceVal = baseFaceData.baseFace;
        const effectiveFaceVal = previewFaceData.baseFace;
        const showEvoFace = effectiveFaceVal !== activeBaseFaceVal;

        const faceBoost = Math.round(totalFaceValChem) - Math.round(totalFaceValBase);
        const newFaceVal = effectiveFaceVal + faceBoost;

        return (
          <div
            key={faceKey}
            className="bg-[#1f211f] p-3 rounded-lg border border-gray-800/90 hover:border-gray-700 transition-all shadow-md group"
          >
            <h3 className="font-bold mb-0.5 text-base text-white group-hover:text-fcGreen transition-colors flex items-center justify-between">
              {baseFaceData.label}
            </h3>

            <div className="text-[18px] text-gray-200 mb-2 flex items-center font-mono">
              <span className={`w-7 text-right ${getStatColorClass(activeBaseFaceVal)}`}>{activeBaseFaceVal}</span>
              
              <span className={`text-[13px] mx-1.5 font-normal tracking-tighter ${showEvoFace ? 'text-gray-500' : 'text-transparent'}`}>
                ➜
              </span>
              <span className={`w-7 text-right ${showEvoFace ? getStatColorClass(effectiveFaceVal) : 'text-transparent'}`}>
                {showEvoFace ? effectiveFaceVal : '00'}
              </span>

              <span className={`text-[13px] font-normal ml-2 w-10 text-left tracking-tighter ${faceBoost > 0 ? 'text-fcGreen font-bold' : 'text-transparent'}`}>
                {faceBoost > 0 ? `➜ +${faceBoost}` : '➜ +0'}
              </span>

              <span className={`w-8 text-right ml-1.5 ${faceBoost > 0 ? getStatColorClass(newFaceVal) : 'text-transparent'}`}>
                {faceBoost > 0 ? newFaceVal : '00'}
              </span>
            </div>

            <div className="space-y-0.5 border-t border-gray-800/60 pt-2">{subRows}</div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
