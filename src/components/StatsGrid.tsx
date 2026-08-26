import React from 'react';
import { StatsData, EvolutionDefinition } from '../types/player';
import { calculateChip, getStatColorClass, faceWeight } from '../utils/statUtils';

interface StatsGridProps {
  baseStats: StatsData;
  previewStats: StatsData;
  activeChemBoosts: Record<string, number>;
  activeEvo?: EvolutionDefinition | null;
  // Rendered beside the grid, spanning its full height — e.g. the squad pitch.
  aside?: React.ReactNode;
  /** Rendered under the stat cards, in their column — e.g. the chemistry style picker. */
  below?: React.ReactNode;
  /** Rendered under the aside, in its column — e.g. the card's strengths and weaknesses. */
  asideBelow?: React.ReactNode;
  /**
   * All six panels on one row, tightened to fit. For the builder, where the grid is a reference
   * held next to the work rather than the page's own subject and every row it takes is a row of
   * the evo pool pushed off screen.
   */
  dense?: boolean;
  /**
   * Show the chemistry style's printed boost rather than what the card actually gained.
   *
   * Off by default, and the default is the honest one — a +6 on a stat sitting at 96 is a +3, and
   * printing +6 there describes the style rather than the card — so it reads the way the game does:
   * one column, holding where the stat ends up, with the gain marked beside it.
   *
   * On, it is the old layout in full: the card's number, the style's printed boost, and the result,
   * each in its own column. The printed number is what a style is picked by, and seeing all three
   * is what shows where the ceiling ate the difference — two styles that both bottom out against it
   * here are not the same style on the next card.
   */
  nominalChemBoost?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  baseStats,
  previewStats,
  activeChemBoosts,
  activeEvo,
  aside,
  below,
  asideBelow,
  dense = false,
  nominalChemBoost = false
}) => {
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

  // The evo/chem columns are placeholders when idle, which pushes every value far off the
  // right edge. Decide once, across all stats, so cards stay aligned with each other.
  const anyEvoDiff = Object.keys(baseStats).some(faceKey =>
    baseStats[faceKey].baseFace !== previewStats[faceKey].baseFace ||
    Object.keys(baseStats[faceKey].subs).some(
      subKey => baseStats[faceKey].subs[subKey].base !== previewStats[faceKey].subs[subKey].base
    )
  );
  const anyChemBoost = Object.values(activeChemBoosts).some(b => b !== 0);

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
      {/* The aside sits beside the grid rather than inside it. As a row-spanning grid item its
          full height was dividing across the two rows, so every card stretched to ~370px when
          Pace only needs ~105px. Out here the card rows size to their own content. */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* The stats and whatever reads with them share a column, so `below` lines up with the
            cards rather than running the width of the page. */}
        <div className={`flex-1 min-w-0 flex flex-col gap-3 ${dense ? '' : 'max-w-[740px]'}`}>
        <div
          className={`grid content-start ${
            dense
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'
          }`}
          id="stats-grid"
        >
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
          // One value column, the way the game and FUTBIN print it: where a stat ends up, with the
          // gain marked beside it. The card's own number only earns a column of its own once an evo
          // is in play and there is a before to compare against — and then a stat nothing touched
          // leaves the end column blank rather than printing the same number twice.
          const showEnd = !anyEvoDiff || finalVal !== activeBase;
          // What the style is printed as, or what the card actually got out of it — see
          // `nominalChemBoost`. They differ exactly where the 99 ceiling eats the difference.
          const shownBoost = nominalChemBoost ? boost : finalVal - effectiveVal;

          const weight = faceWeight(faceKey, subKey, subDataBase.w);
          totalFaceValBase += effectiveVal * weight;
          totalFaceValChem += finalVal * weight;

          const diff = effectiveVal - activeBase;
          let utilChip = null;

          if (activeEvo && activeEvo.subStatBoosts[subKey]) {
            const allowedBoost = activeEvo.subStatBoosts[subKey].boost;
            const limit = activeEvo.subStatBoosts[subKey].limit;
            utilChip = calculateChip(activeBase, allowedBoost, limit, Math.max(0, diff), false);
          } else if (activeEvo && activeEvo.faceBoosts?.[faceKey]) {
            const allowedBoost = activeEvo.faceBoosts[faceKey].boost;
            const limit = activeEvo.faceBoosts[faceKey].limit;
            utilChip = calculateChip(activeBase, allowedBoost, limit, Math.max(0, diff), false);
          } else if (diff > 0) {
            utilChip = { text: `+${diff}`, className: 'text-fcGreen border-fcGreen bg-green-950/40 border px-1.5' };
          } else if (diff < 0) {
            utilChip = { text: `${diff}`, className: 'text-red-500 border-red-500/50 bg-red-950/40 border px-1.5' };
          }

          return (
            <div key={subKey} className={`flex justify-between items-center text-fcTextDim hover:text-white transition-colors ${
              dense ? 'text-[10px] my-0' : 'text-[11px] my-[1.5px]'
            }`}>
              <div className="flex items-center gap-1 min-w-0">
                <span className="truncate">{subDataBase.label}</span>
                {utilChip && (
                  <span className={`text-[8.5px] font-bold px-1 py-0.2 rounded ${utilChip.className}`}>
                    {utilChip.text}
                  </span>
                )}
              </div>

              {/* Column widths here must match the face-stat row above so the two line up */}
              <div className="flex items-center justify-end font-mono">
                {nominalChemBoost ? (
                  <>
                    <span className={`w-6 shrink-0 text-right ${getStatColorClass(activeBase)}`}>{activeBase}</span>

                    {anyEvoDiff && (
                      <>
                        <span className={`w-3.5 shrink-0 text-center text-[9px] ${showEvo ? 'text-gray-500' : 'text-transparent'}`}>➜</span>
                        <span className={`w-6 shrink-0 text-right ${showEvo ? getStatColorClass(effectiveVal) : 'text-transparent'}`}>
                          {showEvo ? effectiveVal : '00'}
                        </span>
                      </>
                    )}

                    {anyChemBoost && (
                      <>
                        <span className={`font-normal text-[10.5px] ml-1 w-7 shrink-0 text-left tracking-tighter ${shownBoost > 0 ? 'text-fcGreen font-bold' : shownBoost < 0 ? 'text-red-500 font-bold' : 'text-transparent'}`}>
                          {shownBoost > 0 ? `+${shownBoost}` : shownBoost < 0 ? `${shownBoost}` : '+0'}
                        </span>

                        <span className={`w-6 shrink-0 text-right ${boost > 0 ? getStatColorClass(finalVal) : 'text-transparent'}`}>
                          {boost > 0 ? finalVal : '00'}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {anyEvoDiff && (
                      <>
                        <span className={`w-6 shrink-0 text-right ${getStatColorClass(activeBase)}`}>{activeBase}</span>
                        <span className={`w-3.5 shrink-0 text-center text-[9px] ${showEvo || finalVal !== activeBase ? 'text-gray-500' : 'text-transparent'}`}>➜</span>
                      </>
                    )}

                    {anyChemBoost && (
                      <span className={`font-normal text-[10.5px] mr-1 w-7 shrink-0 text-right tracking-tighter ${shownBoost > 0 ? 'text-fcGreen font-bold' : shownBoost < 0 ? 'text-red-500 font-bold' : 'text-transparent'}`}>
                        {shownBoost > 0 ? `+${shownBoost}` : shownBoost < 0 ? `${shownBoost}` : '+0'}
                      </span>
                    )}

                    <span className={`w-6 shrink-0 text-right ${showEnd ? getStatColorClass(finalVal) : 'text-transparent'}`}>
                      {showEnd ? finalVal : '00'}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        });

        // Face Stat totals
        const activeBaseFaceVal = baseFaceData.baseFace;
        const effectiveFaceVal = previewFaceData.baseFace;
        
        const anySubEvoFaceDiff = Object.keys(baseFaceData.subs).some(
          subKey => baseFaceData.subs[subKey].base !== previewFaceData.subs[subKey].base
        );
        const showEvoFace = effectiveFaceVal !== activeBaseFaceVal || anySubEvoFaceDiff;
        const faceIsZeroBoost = effectiveFaceVal === activeBaseFaceVal && anySubEvoFaceDiff;

        const faceBoost = Math.round(totalFaceValChem) - Math.round(totalFaceValBase);
        const newFaceVal = effectiveFaceVal + faceBoost;
        const showEndFace = !anyEvoDiff || showEvoFace || newFaceVal !== activeBaseFaceVal;

        return (
          <div
            key={faceKey}
            className={`bg-[#1f211f] rounded-lg border border-gray-800/90 hover:border-gray-700 transition-all shadow-md group ${
              dense ? 'p-1.5' : 'p-2.5'
            }`}
          >
            {/* Title left, totals right — same column widths as the sub rows below */}
            <div className={`flex items-center justify-between gap-1.5 ${dense ? 'mb-1' : 'mb-1.5'}`}>
              <h3 className={`font-bold text-white group-hover:text-fcGreen transition-colors truncate ${
                dense ? 'text-[11px]' : 'text-sm'
              }`}>
                {baseFaceData.label}
              </h3>

              <div className={`text-gray-200 flex items-center font-mono shrink-0 ${dense ? 'text-[12px]' : 'text-[15px]'}`}>
                {nominalChemBoost ? (
                  <>
                    <span className={`w-6 shrink-0 text-right ${getStatColorClass(activeBaseFaceVal)}`}>{activeBaseFaceVal}</span>

                    {anyEvoDiff && (
                      <>
                        <span className={`w-3.5 shrink-0 text-center text-[9px] font-normal ${showEvoFace ? 'text-gray-500' : 'text-transparent'} ${faceIsZeroBoost ? 'text-[8px] text-fcGreen font-bold' : ''}`}>
                          {faceIsZeroBoost ? '+0' : '➜'}
                        </span>
                        <span className={`w-6 shrink-0 text-right ${showEvoFace ? getStatColorClass(effectiveFaceVal) : 'text-transparent'}`}>
                          {showEvoFace ? effectiveFaceVal : '00'}
                        </span>
                      </>
                    )}

                    {anyChemBoost && (
                      <>
                        <span className={`text-[10.5px] font-normal ml-1 w-7 shrink-0 text-left tracking-tighter ${faceBoost > 0 ? 'text-fcGreen font-bold' : faceBoost < 0 ? 'text-red-500 font-bold' : 'text-transparent'}`}>
                          {faceBoost > 0 ? `+${faceBoost}` : faceBoost < 0 ? `${faceBoost}` : '+0'}
                        </span>

                        <span className={`w-6 shrink-0 text-right ${faceBoost > 0 ? getStatColorClass(newFaceVal) : 'text-transparent'}`}>
                          {faceBoost > 0 ? newFaceVal : '00'}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {anyEvoDiff && (
                      <>
                        <span className={`w-6 shrink-0 text-right ${getStatColorClass(activeBaseFaceVal)}`}>{activeBaseFaceVal}</span>
                        <span className={`w-3.5 shrink-0 text-center text-[9px] font-normal ${showEvoFace || newFaceVal !== activeBaseFaceVal ? 'text-gray-500' : 'text-transparent'} ${faceIsZeroBoost ? 'text-[8px] text-fcGreen font-bold' : ''}`}>
                          {faceIsZeroBoost ? '+0' : '➜'}
                        </span>
                      </>
                    )}

                    {anyChemBoost && (
                      <span className={`text-[10.5px] font-normal mr-1 w-7 shrink-0 text-right tracking-tighter ${faceBoost > 0 ? 'text-fcGreen font-bold' : faceBoost < 0 ? 'text-red-500 font-bold' : 'text-transparent'}`}>
                        {faceBoost > 0 ? `+${faceBoost}` : faceBoost < 0 ? `${faceBoost}` : '+0'}
                      </span>
                    )}

                    <span className={`w-6 shrink-0 text-right ${showEndFace ? getStatColorClass(newFaceVal) : 'text-transparent'}`}>
                      {showEndFace ? newFaceVal : '00'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={`border-t border-gray-800/60 ${dense ? 'pt-1' : 'space-y-0.5 pt-1.5'}`}>{subRows}</div>
          </div>
        );
      })}
        </div>
          {below}
        </div>

        {(aside || asideBelow) && (
          <div className="lg:shrink-0 flex flex-col">
            {aside}
            {asideBelow}
          </div>
        )}
      </div>
    </div>
  );
};
