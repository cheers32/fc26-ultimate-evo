import React from 'react';
import { PlayStylesData, PlayerBio } from '../types/player';
import { Shield, Award } from 'lucide-react';

interface PlayStylesSectionProps {
  playStyles: PlayStylesData;
  roles: PlayerBio['roles'];
  evoPreview: boolean;
  evoLocked: boolean;
}

export const PlayStylesSection: React.FC<PlayStylesSectionProps> = ({
  playStyles,
  roles,
  evoPreview,
  evoLocked
}) => {
  const isEvo = evoPreview || evoLocked;

  // Gold PlayStyles stats
  const goldBase = playStyles.base.gold.length;
  const goldLimit = playStyles.limits.gold;
  const goldEvTotal = playStyles.ev.gold.length;
  let goldAdded = 0;
  let goldMissed = 0;

  if (isEvo) {
    const availGold = Math.max(0, goldLimit - goldBase);
    goldAdded = Math.min(availGold, goldEvTotal);
    goldMissed = goldEvTotal - goldAdded;
  }
  const goldCurrent = goldBase + goldAdded;
  const goldIsCapped = goldCurrent >= goldLimit;

  // Silver PlayStyles stats
  const silverBase = playStyles.base.silver.length;
  const silverLimit = playStyles.limits.silver;
  const silverEvTotal = playStyles.ev.silver.length;
  let silverAdded = 0;
  let silverMissed = 0;

  if (isEvo) {
    const availSilver = Math.max(0, silverLimit - silverBase);
    silverAdded = Math.min(availSilver, silverEvTotal);
    silverMissed = silverEvTotal - silverAdded;
  }
  const silverCurrent = silverBase + silverAdded;
  const silverIsCapped = silverCurrent >= silverLimit;

  return (
    <div className="mt-10 border-t border-gray-800 pt-6">
      <h2 className="text-xl font-bold tracking-wide text-white mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" />
        Skills & PlayStyles
      </h2>

      <div className="flex flex-col gap-6 mb-8">
        {/* PlayStyles+ (Gold) */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              PlayStyles+ (Gold)
            </h3>
            <div className="flex gap-2 items-center">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  goldIsCapped
                    ? 'bg-red-900/40 text-red-400 border border-red-800/50 shadow-[0_0_6px_rgba(239,68,68,0.3)]'
                    : 'bg-[#1f2937] text-gray-300 border border-[#4b5563]'
                }`}
              >
                {goldCurrent} / {goldLimit} MAX {goldIsCapped ? '(CAPPED)' : ''}
              </span>

              {isEvo && goldAdded > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-400 border border-green-800/50">
                  +{goldAdded} Upgraded
                </span>
              )}
              {isEvo && goldMissed > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-800/50">
                  {goldMissed} Missed
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {playStyles.base.gold.map((ps) => (
              <span
                key={ps}
                className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-black px-3.5 py-1.5 rounded-md font-extrabold text-sm shadow-md border border-yellow-300"
              >
                {ps}
              </span>
            ))}

            {isEvo && (
              <>
                {playStyles.ev.gold.slice(0, goldAdded).map((ps) => (
                  <span
                    key={ps}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3.5 py-1.5 rounded-md font-bold text-sm shadow-md border border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex items-center gap-1.5 animate-fade-in"
                  >
                    {ps}
                    <span className="text-[9px] font-black bg-black/40 px-1 py-0.5 rounded">NEW</span>
                  </span>
                ))}
                {playStyles.ev.gold.slice(goldAdded).map((ps) => (
                  <span
                    key={ps}
                    className="bg-[#1f2937] text-gray-500 px-3.5 py-1.5 rounded-md font-bold text-sm border border-red-900/50 opacity-60 flex items-center gap-1.5"
                  >
                    <span className="line-through decoration-red-500 decoration-2">{ps}</span>
                    <span className="text-[9px] font-black text-red-400">LIMIT</span>
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* PlayStyles (Silver) */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              PlayStyles (Silver)
            </h3>
            <div className="flex gap-2 items-center">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  silverIsCapped
                    ? 'bg-red-900/40 text-red-400 border border-red-800/50 shadow-[0_0_6px_rgba(239,68,68,0.3)]'
                    : 'bg-[#1f2937] text-gray-300 border border-[#4b5563]'
                }`}
              >
                {silverCurrent} / {silverLimit} MAX {silverIsCapped ? '(CAPPED)' : ''}
              </span>

              {isEvo && silverAdded > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-400 border border-green-800/50">
                  +{silverAdded} Upgraded
                </span>
              )}
              {isEvo && silverMissed > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-800/50">
                  {silverMissed} Missed
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {playStyles.base.silver.map((ps) => (
              <span key={ps} className="bg-gray-300 text-black px-3 py-1 rounded-md font-bold text-sm shadow-sm">
                {ps}
              </span>
            ))}

            {isEvo && (
              <>
                {playStyles.ev.silver.slice(0, silverAdded).map((ps) => (
                  <span
                    key={ps}
                    className="bg-green-100 text-green-900 px-3 py-1 rounded-md font-bold text-sm shadow-md border border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)] flex items-center gap-1"
                  >
                    {ps}
                    <span className="text-[9px] font-black bg-green-300/60 px-1 rounded">NEW</span>
                  </span>
                ))}
                {playStyles.ev.silver.slice(silverAdded).map((ps) => (
                  <span
                    key={ps}
                    className="bg-[#1f2937] text-gray-500 px-3 py-1 rounded-md font-bold text-sm border border-red-900/50 opacity-60 flex items-center gap-1"
                  >
                    <span className="line-through decoration-red-500 decoration-2">{ps}</span>
                    <span className="text-[9px] font-black text-red-400">LIMIT</span>
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="mt-8 bg-[#1f211f] p-5 rounded-xl border border-gray-800">
        <h2 className="text-lg font-bold tracking-wide text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-fcGreen" />
          Position & Roles
        </h2>
        <div className="text-[13px] text-gray-300 space-y-2 font-mono">
          {Object.entries(roles).map(([pos, posRoles]) => (
            <div key={pos} className="flex flex-wrap gap-2 items-center pt-1">
              <span className="text-white font-bold bg-[#2A2D2A] px-2 py-0.5 rounded text-xs uppercase">{pos}:</span>
              {posRoles.map((r) => (
                <span key={r} className="bg-[#121212] px-2 py-1 rounded border border-gray-700 text-gray-300">
                  {r}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
