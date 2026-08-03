import React, { useState } from 'react';
import { availableEvolutions } from '../data/evolutionsData';
import { simulateEvoChain } from '../utils/evoEngine';
import { PlayerBio, OvrData, StatsData, PlayStylesData } from '../types/player';
import { ExternalLink, CheckCircle, XCircle, ArrowRight, GitCompare, Sparkles, Layers } from 'lucide-react';

interface EvolutionChainWorkbenchProps {
  bio: PlayerBio;
  ovr: OvrData;
  stats: StatsData;
  playStyles: PlayStylesData;
}

export const EvolutionChainWorkbench: React.FC<EvolutionChainWorkbenchProps> = ({
  bio,
  ovr,
  stats,
  playStyles
}) => {
  const [selectedChainA, setSelectedChainA] = useState<string[]>(['1076', '1159']);
  const [selectedChainB, setSelectedChainB] = useState<string[]>(['1159', '1076']);

  const chainAResult = simulateEvoChain(selectedChainA, bio, ovr, stats, playStyles);
  const chainBResult = simulateEvoChain(selectedChainB, bio, ovr, stats, playStyles);

  return (
    <div className="space-y-8 my-6">
      
      {/* EVOs Registry Cards */}
      <div className="bg-[#1f211f] p-6 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-fcGreen" />
            Registered EA FC 26 Evolutions
          </h2>
          <span className="text-xs text-gray-400 bg-black/40 px-2.5 py-1 rounded border border-gray-700">
            {Object.keys(availableEvolutions).length} Evolutions Stored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(availableEvolutions).map((evo) => (
            <div key={evo.id} className="bg-[#161816] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-fcGold text-base flex items-center gap-1.5">
                    {evo.name}
                    <span className="text-[10px] text-gray-400 font-normal">#{evo.id}</span>
                    {evo.maxRepeatable && evo.maxRepeatable > 1 && (
                      <span className="px-1.5 py-0.5 bg-fcGold/20 rounded text-[10px] text-fcGold border border-fcGold/40 font-bold ml-2">
                        Repeatable: {evo.maxRepeatable}
                      </span>
                    )}
                    {evo.trainingTime && (
                      <span className="px-1.5 py-0.5 bg-blue-950/40 rounded text-[10px] text-blue-400 border border-blue-800/40 font-bold ml-2">
                        Training: {evo.trainingTime}
                      </span>
                    )}
                    {evo.rarityChange && (
                      <span className="px-1.5 py-0.5 bg-purple-950/40 rounded text-[10px] text-purple-400 border border-purple-800/40 font-bold ml-2">
                        Rarity → {evo.rarityChange}
                      </span>
                    )}
                  </span>
                  <a
                    href={evo.futbinLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-fcGreen hover:underline flex items-center gap-1 bg-green-950/60 px-2 py-0.5 rounded border border-green-800/60"
                  >
                    FUTBIN <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-gray-400 mb-3">{evo.description}</p>
                
                {/* Requirements Tag */}
                <div className="text-[11px] text-gray-300 bg-[#1f211f] p-2.5 rounded-lg border border-gray-800 space-y-1 font-mono">
                  <div className="flex justify-between text-fcGreen font-bold border-b border-gray-800/60 pb-1 mb-1">
                    <span>Requirements</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0 text-white">
                    {evo.requirements.maxOvr !== undefined && <div className="flex gap-1 text-blue-400"><span>Max OVR:</span><span className="font-bold">{evo.requirements.maxOvr}</span></div>}
                    {evo.requirements.maxPace !== undefined && <div className="flex gap-1"><span>Max Pace:</span><span className="font-bold">{evo.requirements.maxPace}</span></div>}
                    {evo.requirements.maxDefending !== undefined && <div className="flex gap-1"><span>Max Def:</span><span className="font-bold">{evo.requirements.maxDefending}</span></div>}
                    {evo.requirements.maxPhysicality !== undefined && <div className="flex gap-1"><span>Max Phy:</span><span className="font-bold">{evo.requirements.maxPhysicality}</span></div>}
                    
                    {evo.requirements.maxPlayStylesPlus !== undefined && <div className="flex gap-1"><span>Max PS+:</span><span className="font-bold">{evo.requirements.maxPlayStylesPlus}</span></div>}
                    {evo.requirements.maxPlayStyles !== undefined && <div className="flex gap-1"><span>Max PS:</span><span className="font-bold">{evo.requirements.maxPlayStyles}</span></div>}
                    {evo.requirements.maxTotalPositions !== undefined && <div className="flex gap-1"><span>Max Positions:</span><span className="font-bold">{evo.requirements.maxTotalPositions}</span></div>}
                    
                    {evo.requirements.maxWeakFoot !== undefined && <div className="flex gap-1"><span>Max WF:</span><span className="font-bold">{evo.requirements.maxWeakFoot}★</span></div>}
                    {evo.requirements.maxSkillMoves !== undefined && <div className="flex gap-1"><span>Max SM:</span><span className="font-bold">{evo.requirements.maxSkillMoves}★</span></div>}
                  </div>
                  
                  {(evo.requirements.positions || evo.requirements.excludedPositions || evo.requirements.rarity || evo.requirements.notRarity) && (
                    <div className="pt-0.5 mt-0.5 border-t border-gray-800/60 flex flex-wrap gap-x-3 gap-y-0 text-white">
                      {evo.requirements.positions && <div className="flex gap-1"><span>Positions:</span><span className="font-bold">{evo.requirements.positions.join(', ')}</span></div>}
                      {evo.requirements.excludedPositions && <div className="flex gap-1"><span>Excluded:</span><span className="font-bold">{evo.requirements.excludedPositions.join(', ')}</span></div>}
                      {evo.requirements.rarity && <div className="flex gap-1"><span>Rarity:</span><span className="font-bold">{evo.requirements.rarity}</span></div>}
                      {evo.requirements.notRarity && <div className="flex gap-1"><span>Not Rarity:</span><span className="font-bold">{evo.requirements.notRarity}</span></div>}
                    </div>
                  )}


                </div>

                {/* EVO Levels Breakdown */}
                {evo.levels && evo.levels.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-800">
                    <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fcGold" />
                      Evolution Level Breakdown
                    </h4>
                    <div className="space-y-2">
                      {evo.levels.map((level, lIdx) => (
                        <div key={lIdx} className="bg-black/30 p-2.5 rounded border border-gray-800/60">
                          <span className="text-[10px] font-black text-fcGreen uppercase tracking-wider block mb-1.5">
                            {level.name}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {level.upgrades.map((upgrade, uIdx) => (
                              <span key={uIdx} className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                (upgrade.includes('PlayStyle+'))
                                  ? 'bg-yellow-950/40 text-fcGold border-yellow-800/40'
                                  : (upgrade.includes('Skill Moves') || upgrade.includes('Weak Foot'))
                                  ? 'bg-orange-950/50 text-orange-500 border-orange-800/50'
                                  : upgrade.includes('PlayStyle:')
                                  ? 'bg-slate-700/40 text-slate-200 border-slate-500/50'
                                  : upgrade.includes('OVR')
                                  ? 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                                  : upgrade.includes('Face')
                                  ? 'bg-gray-800/40 text-gray-500 border-gray-700/40'
                                  : 'bg-green-950/40 text-fcGreen border-green-800/40'
                              }`}>
                                {upgrade}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};
