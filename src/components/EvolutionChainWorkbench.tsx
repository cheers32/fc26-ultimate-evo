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
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {evo.requirements.maxOvr !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max OVR:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxOvr}</span></div>}
                    {evo.requirements.maxPace !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max Pace:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxPace}</span></div>}
                    {evo.requirements.maxDefending !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max Def:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxDefending}</span></div>}
                    {evo.requirements.maxPhysicality !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max Phy:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxPhysicality}</span></div>}
                    
                    {evo.requirements.maxPlayStylesPlus !== undefined && <div className="flex justify-between"><span className="text-fcGold opacity-70">Max PS+:</span><span className="font-bold text-fcGold">&lt;= {evo.requirements.maxPlayStylesPlus}</span></div>}
                    {evo.requirements.maxPlayStyles !== undefined && <div className="flex justify-between"><span className="text-gray-400">Max PS:</span><span className="font-bold text-gray-300">&lt;= {evo.requirements.maxPlayStyles}</span></div>}
                    
                    {evo.requirements.maxWeakFoot !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max WF:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxWeakFoot}★</span></div>}
                    {evo.requirements.maxSkillMoves !== undefined && <div className="flex justify-between"><span className="text-gray-500">Max SM:</span><span className="font-bold text-white">&lt;= {evo.requirements.maxSkillMoves}★</span></div>}
                  </div>
                  
                  {(evo.requirements.positions || evo.requirements.rarity || evo.requirements.notRarity) && (
                    <div className="pt-1 mt-1 border-t border-gray-800/60 space-y-1">
                      {evo.requirements.positions && <div className="flex justify-between"><span className="text-gray-500">Positions:</span><span className="font-bold text-white">{evo.requirements.positions.join(', ')}</span></div>}
                      {evo.requirements.rarity && <div className="flex justify-between"><span className="text-gray-500">Rarity:</span><span className="font-bold text-[#EBB626]">{evo.requirements.rarity}</span></div>}
                      {evo.requirements.notRarity && <div className="flex justify-between"><span className="text-gray-500">Not Rarity:</span><span className="font-bold text-red-400">{evo.requirements.notRarity}</span></div>}
                    </div>
                  )}

                  {/* Upgrades Section */}
                  <div className="flex justify-between text-fcGreen font-bold border-b border-gray-800/60 pb-1 mt-3 pt-2 mb-1">
                    <span>Upgrades</span>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 font-bold">OVR Rating Boost:</span>
                    <span className="font-black text-fcGreen text-[12px] bg-green-950/40 px-1.5 rounded border border-green-800/50">
                      +{evo.ovrBoost.boost} <span className="text-[10px] text-gray-500 ml-0.5">(Max {evo.ovrBoost.limit})</span>
                    </span>
                  </div>
                  
                  {evo.playStylesAdded.gold.length > 0 && (
                    <div className="flex justify-between items-start mt-1">
                      <span className="text-gray-500 whitespace-nowrap mr-2">PS+ Added:</span>
                      <span className="font-bold text-fcGold text-right">{evo.playStylesAdded.gold.join(', ')}</span>
                    </div>
                  )}
                  {evo.playStylesAdded.silver.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 whitespace-nowrap mr-2">PS Added:</span>
                      <span className="font-bold text-gray-300 text-right">{evo.playStylesAdded.silver.join(', ')}</span>
                    </div>
                  )}
                  
                  {(evo.weakFootBoost || evo.skillMovesBoost || evo.positionsAdded || evo.rarityChange) && (
                    <div className="grid grid-cols-2 gap-x-2 pt-1">
                      {evo.weakFootBoost && <div className="flex justify-between"><span className="text-gray-500">WF Boost:</span><span className="font-bold text-fcGreen">+{evo.weakFootBoost}★</span></div>}
                      {evo.skillMovesBoost && <div className="flex justify-between"><span className="text-gray-500">SM Boost:</span><span className="font-bold text-fcGreen">+{evo.skillMovesBoost}★</span></div>}
                      {evo.positionsAdded && <div className="flex justify-between col-span-2"><span className="text-gray-500">Pos Added:</span><span className="font-bold text-fcGreen">{evo.positionsAdded.join(', ')}</span></div>}
                      {evo.rarityChange && <div className="flex justify-between col-span-2"><span className="text-gray-500">New Rarity:</span><span className="font-bold text-[#EBB626]">{evo.rarityChange}</span></div>}
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
                                upgrade.includes('PlayStyle')
                                  ? 'bg-yellow-950/40 text-fcGold border-yellow-800/40'
                                  : 'bg-gray-800/50 text-gray-300 border-gray-700/50'
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

      {/* Evolution Experiment Chain Compare */}
      <div className="bg-[#1f211f] p-6 rounded-2xl border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-fcGold" />
          EVO Order Experiment & Chain Validator
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chain A (Total Glory -> Elite Midfielder) */}
          <div className="bg-[#161816] p-5 rounded-xl border border-green-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-fcGreen uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Experiment Path A (Recommended)
                </span>
                {chainAResult.isValidChain ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-fcGreen bg-green-950/80 px-2 py-0.5 rounded border border-green-600">
                    <CheckCircle className="w-3.5 h-3.5" /> 100% ELIGIBLE
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-600">
                    <XCircle className="w-3.5 h-3.5" /> INVALID CHAIN
                  </span>
                )}
              </div>

              {/* Chain Steps Sequence */}
              <div className="flex items-center gap-2 mb-4 bg-[#1f211f] p-3 rounded-lg border border-gray-800 text-xs font-bold">
                <span className="bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded border border-yellow-400/40">
                  Total Glory (#1076)
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span className="bg-green-500/20 text-green-300 px-2.5 py-1 rounded border border-green-400/40">
                  Elite Midfielder (#1159)
                </span>
              </div>

              {/* Step Validations */}
              <div className="space-y-2 text-xs">
                {chainAResult.steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#1f211f] border border-gray-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">Step {idx + 1}: {step.evoName}</span>
                      <div className="text-[10px] text-gray-400">Result OVR: <span className="text-fcGold font-bold">{step.ovrAfter}</span></div>
                    </div>
                    {step.validation.eligible ? (
                      <span className="text-fcGreen font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Eligible
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold text-[10px]">
                        {step.validation.reasons.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 text-xs flex justify-between font-bold">
              <span>Final Rating: <span className="text-fcGreen">{chainAResult.finalOvr} OVR</span></span>
              <span>Gold PlayStyles+: <span className="text-fcGold">{chainAResult.finalPlayStyles.base.gold.length}</span></span>
            </div>
          </div>

          {/* Chain B (Elite Midfielder -> Total Glory) */}
          <div className="bg-[#161816] p-5 rounded-xl border border-red-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Experiment Path B (Reversed Order)
                </span>
                {chainBResult.isValidChain ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-fcGreen bg-green-950/80 px-2 py-0.5 rounded border border-green-600">
                    <CheckCircle className="w-3.5 h-3.5" /> ELIGIBLE
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-600">
                    <XCircle className="w-3.5 h-3.5" /> INVALID REQUIREMENT
                  </span>
                )}
              </div>

              {/* Chain Steps Sequence */}
              <div className="flex items-center gap-2 mb-4 bg-[#1f211f] p-3 rounded-lg border border-gray-800 text-xs font-bold">
                <span className="bg-green-500/20 text-green-300 px-2.5 py-1 rounded border border-green-400/40">
                  Elite Midfielder (#1159)
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span className="bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded border border-yellow-400/40 opacity-60">
                  Total Glory (#1076)
                </span>
              </div>

              {/* Step Validations */}
              <div className="space-y-2 text-xs">
                {chainBResult.steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#1f211f] border border-gray-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">Step {idx + 1}: {step.evoName}</span>
                      <div className="text-[10px] text-gray-400">Result OVR: <span className="text-fcGold font-bold">{step.ovrAfter}</span></div>
                    </div>
                    {step.validation.eligible ? (
                      <span className="text-fcGreen font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Eligible
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold text-[10px] max-w-[180px] text-right">
                        ❌ {step.validation.reasons.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-red-400 flex justify-between font-bold">
              <span>Status: Blocked by Max 94 OVR limit</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
