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
    <div className="mt-4 border-t border-gray-800 pt-4">


      {/* Roles Section */}
      <div className="mt-2 bg-[#1f211f] p-4 rounded-xl border border-gray-800">
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
