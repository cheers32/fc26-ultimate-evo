import React from 'react';
import { PlayerBio } from '../types/player';
import { Shield } from 'lucide-react';

interface PlayStylesSectionProps {
  roles: PlayerBio['roles'];
}

export const PlayStylesSection: React.FC<PlayStylesSectionProps> = ({ roles }) => {
  return (
    <div className="mt-10 border-t border-gray-800 pt-6">
      {/* Roles Section */}
      <div className="bg-[#1f211f] p-5 rounded-xl border border-gray-800">
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
