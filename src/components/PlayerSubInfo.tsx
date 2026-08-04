import React from 'react';
import { PlayerBio, PlayStylesData } from '../types/player';
import { getPlayStyleIconUrl } from '../utils/playstyles';

interface PlayerSubInfoProps {
  bio: PlayerBio;
  playStyles: PlayStylesData;
  isEvo: boolean;
}

export const PlayerSubInfo: React.FC<PlayerSubInfoProps> = ({ bio, playStyles, isEvo }) => {
  // Gold PlayStyles stats
  const goldBase = playStyles.base.gold.length;
  const goldLimit = playStyles.limits.gold;
  const goldEvTotal = playStyles.ev.gold.length;
  let goldAdded = 0;
  if (isEvo) {
    const availGold = Math.max(0, goldLimit - goldBase);
    goldAdded = Math.min(availGold, goldEvTotal);
  }
  const goldCurrent = goldBase + goldAdded;

  // Silver PlayStyles stats
  const silverBase = playStyles.base.silver.length;
  const silverLimit = playStyles.limits.silver;
  const silverEvTotal = playStyles.ev.silver.length;
  let silverAdded = 0;
  if (isEvo) {
    const availSilver = Math.max(0, silverLimit - silverBase);
    silverAdded = Math.min(availSilver, silverEvTotal);
  }
  const silverCurrent = silverBase + silverAdded;

  return (
    <div className="flex flex-wrap items-center gap-4 ml-auto lg:mt-0 mt-2">
      {/* PlayStyles */}
      {(playStyles.base.gold.length > 0 || playStyles.ev.gold.length > 0 || playStyles.base.silver.length > 0 || playStyles.ev.silver.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Gold PlayStyles */}
          {(playStyles.base.gold.length > 0 || playStyles.ev.gold.length > 0) && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 mr-0.5">
                {goldCurrent}
              </span>
              {playStyles.base.gold.map((ps) => (
                <img key={ps} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={ps} className="w-9 h-9 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]" />
              ))}
              {isEvo && (
                <>
                  {playStyles.ev.gold.slice(0, goldAdded).map((ps) => (
                    <div key={ps} className="relative">
                      <img src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (NEW)`} className="w-9 h-9 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                      <span className="absolute -top-1 -right-2 text-[6px] font-black bg-green-900 text-green-400 px-0.5 rounded shadow-sm">NEW</span>
                    </div>
                  ))}
                  {playStyles.ev.gold.slice(goldAdded).map((ps) => (
                    <div key={ps} className="relative opacity-50 grayscale">
                      <img src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (LIMIT REACHED)`} className="w-9 h-9" />
                      <span className="absolute -top-1 -right-2 text-[6px] font-black bg-red-900 text-red-400 px-0.5 rounded shadow-sm">LIMIT</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Silver PlayStyles */}
          {(playStyles.base.silver.length > 0 || playStyles.ev.silver.length > 0) && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-gray-800 text-gray-300 border border-gray-600 mr-0.5">
                {silverCurrent}
              </span>
              {playStyles.base.silver.map((ps) => (
                <img key={ps} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-7 h-7 drop-shadow-[0_0_2px_rgba(156,163,175,0.3)]" />
              ))}
              {isEvo && (
                <>
                  {playStyles.ev.silver.slice(0, silverAdded).map((ps) => (
                    <div key={ps} className="relative">
                      <img src={getPlayStyleIconUrl(ps, false)} alt={ps} title={`${ps} (NEW)`} className="w-7 h-7 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]" />
                      <span className="absolute -top-1 -right-2 text-[6px] font-black bg-green-900 text-green-400 px-0.5 rounded shadow-sm">NEW</span>
                    </div>
                  ))}
                  {playStyles.ev.silver.slice(silverAdded).map((ps) => (
                    <div key={ps} className="relative opacity-50 grayscale">
                      <img src={getPlayStyleIconUrl(ps, false)} alt={ps} title={`${ps} (LIMIT REACHED)`} className="w-7 h-7" />
                      <span className="absolute -top-1 -right-2 text-[6px] font-black bg-red-900 text-red-400 px-0.5 rounded shadow-sm">LIMIT</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Positions & Skills & Weak Foot */}
      <div className="flex items-center gap-4 text-xs font-medium text-white border-l border-gray-700/60 pl-4">
        {/* Positions */}
        <div className="flex items-center gap-1.5 text-gray-300 font-bold">
          <span className="text-sm leading-none">🎯</span> {bio.primaryPositions}
        </div>
        
        {/* Skills & Weak Foot */}
        <div className="flex items-center gap-1.5 border-l border-gray-700/60 pl-4">
          <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">SM</span>
          <span>{bio.skillMoves} <span className="text-yellow-400">★</span></span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-gray-700/60 pl-4">
          <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">WF</span>
          <span>{bio.weakFoot} <span className="text-yellow-400">★</span></span>
        </div>
      </div>
    </div>
  );
};
