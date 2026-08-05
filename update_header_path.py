import re

with open('src/components/HeaderCard.tsx', 'r') as f:
    content = f.read()

# Base card rendering
base_card_new = '''                {/* Base Card Chip — always present, so an empty path still anchors on the raw card */}
                <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                  renderPath.id === activePathId && baseIndex === -1 ? 'ring-1 ring-purple-500/60 rounded' : ''
                }`}>
                  <button
                    onClick={() => onNodeClick(-1)}
                    title="Original Base Card"
                    className={`shrink-0 p-1.5 rounded font-bold flex flex-col transition-all shadow gap-1 ${
                      selectedNodes.includes(-1)
                        ? 'bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]'
                        : 'bg-[#1f211f] text-gray-200 border-gray-700 hover:border-gray-500 hover:text-white'
                    } border`}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                        {rawBaseOvr}/{rawPlayStyles.base.gold.length + (rawPlayStyles.ev?.gold?.length || 0)}
                      </span>
                      <span className="text-[10.5px]">Base Card</span>
                    </div>
                    <div className="flex gap-2 items-center px-1 mb-0.5">
                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] ${selectedNodes.includes(-1) ? 'bg-black/20 border-black/30' : 'bg-gray-800/80 border-gray-600'}`}>
                        <span className={`${selectedNodes.includes(-1) ? 'text-black' : 'text-white'} font-bold`}>BS</span>
                        <span className={`${selectedNodes.includes(-1) ? 'text-black' : 'text-blue-400'} font-bold`}>{Object.values(rawStats).reduce((acc, f) => acc + f.baseFace, 0)}</span>
                      </div>
                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] ${selectedNodes.includes(-1) ? 'bg-black/20 border-black/30' : 'bg-gray-800/80 border-gray-600'}`}>
                        <span className={`${selectedNodes.includes(-1) ? 'text-black' : 'text-white'} font-bold`}>IGS</span>
                        <span className={`${selectedNodes.includes(-1) ? 'text-black' : 'text-blue-400'} font-bold`}>{Object.values(rawStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5">
                      {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                        const val = rawStats[statKey as keyof StatsData].baseFace;
                        return (
                          <div key={statKey} className={`flex gap-0.5 items-center px-1 py-0.5 rounded text-[8.5px] shadow-inner border ${selectedNodes.includes(-1) ? 'bg-black/10 border-black/20' : 'bg-black/40 border-gray-800/50'}`}>
                            <span className={`${selectedNodes.includes(-1) ? 'text-black/70' : 'text-gray-400'} uppercase`}>{statKey}</span>
                            <span className={`font-black ${selectedNodes.includes(-1) ? 'text-black' : getStatColorClass(val)}`}>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                    {(() => {
                      const gold = [...rawPlayStyles.base.gold, ...(rawPlayStyles.ev?.gold || [])];
                      const silver = [...rawPlayStyles.base.silver, ...(rawPlayStyles.ev?.silver || [])];
                      if (gold.length === 0 && silver.length === 0) return null;
                      return (
                        <div className={`flex flex-wrap items-center gap-1 mt-0.5 border-t pt-1 ${selectedNodes.includes(-1) ? 'border-black/20' : 'border-gray-700/50'}`}>
                          {gold.map(ps => (
                            <img key={`g-${ps}`} src={getPlayStyleIconUrl(ps, true)} alt={ps} title={`${ps} (PS+)`} className="w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
                          ))}
                          {silver.map(ps => (
                            <img key={`s-${ps}`} src={getPlayStyleIconUrl(ps, false)} alt={ps} title={ps} className="w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]" />
                          ))}
                        </div>
                      );
                    })()}
                  </button>
                  {onSetBase && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetBase(renderPath.id, -1); }}
                      className={`absolute -top-1.5 -left-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
                        renderPath.id === activePathId && baseIndex === -1
                          ? 'bg-purple-600 text-white opacity-100'
                          : 'bg-purple-900/90 text-purple-400 hover:bg-purple-600 hover:text-white opacity-0 group-hover/node:opacity-100'
                      }`}
                      title={renderPath.id === activePathId && baseIndex === -1
                        ? 'New builds start from the raw card'
                        : 'Build from the raw card again'}
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>'''

content = re.sub(
    r'                \{\/\* Base Card Chip — always present, so an empty path still anchors on the raw card \*\/\}[\s\S]*?<\/\RefreshCw>\s*<\/button>\s*\)\}\s*<\/div>',
    base_card_new,
    content
)

step_node_new = '''                    <React.Fragment key={`${id}-${idx}`}>
                      <div className={`flex items-center gap-0.5 group/node shrink-0 relative ${
                        inBasePrefix ? 'ring-1 ring-purple-500/60 rounded' : ''
                      }`}>
                        <button
                          onClick={() => onNodeClick(idx)}
                          title={`Preview Step ${idx + 1} (${evo.name}) stats`}
                          className={`shrink-0 p-1.5 rounded font-bold flex flex-col transition-all cursor-pointer shadow gap-1 border text-left ${baseClass}`}
                        >
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="font-mono tracking-tight font-extrabold opacity-80 text-[10.5px]">
                              {(() => {
                                const prevOvr = idx === 0 ? rawBaseOvr : renderPath.steps![idx - 1].ovrAfter;
                                const ovrDiff = stepResult ? stepResult.ovrAfter - prevOvr : 0;
                                return ovrDiff > 0 ? <span className={`${isStepActive ? 'text-black' : 'text-fcGreen'} font-bold text-[10px] mr-0.5`}>+{ovrDiff}</span> : null;
                              })()}
                              {stepResult ? stepResult.ovrAfter : '?'}/{afterPsPlus}
                            </span>
                            <span className="text-[10.5px]">{evo.name}</span>
                            <span className={`font-bold text-[9.5px] tracking-wide font-mono opacity-90 ${isStepActive ? 'text-black' : 'text-gray-300'}`}>
                              ({evo.requirements.maxOvr || 99}/{evo.requirements.maxPlayStylesPlus ?? '∞'}/+{evo.ovrBoost.boost})
                            </span>
                          </div>
                          {stepResult && (
                            <>
                              <div className="flex gap-2 items-center px-1 mb-0.5">
                                {(() => {
                                  const prevStats = idx === 0 ? rawStats : renderPath.steps![idx - 1].statsAfter;
                                  const prevFace = Object.values(prevStats).reduce((a, b) => a + b.baseFace, 0);
                                  const curFace = Object.values(stepResult.statsAfter).reduce((a, b) => a + b.baseFace, 0);
                                  const bsDiff = curFace - prevFace;

                                  const prevIgs = Object.values(prevStats).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                                  const curIgs = Object.values(stepResult.statsAfter).reduce((acc, f) => acc + Object.values(f.subs).reduce((subAcc, s) => subAcc + s.base, 0), 0);
                                  const igsDiff = curIgs - prevIgs;

                                  return (
                                    <>
                                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] ${isStepActive ? 'bg-black/20 border-black/30' : 'bg-gray-800/80 border-gray-600'}`}>
                                        <span className={`${isStepActive ? 'text-black' : 'text-white'} font-bold`}>BS</span>
                                        <div className="flex items-baseline gap-0.5">
                                          {bsDiff > 0 && <span className={`${isStepActive ? 'text-black' : 'text-fcGreen'} font-bold text-[7.5px]`}>+{bsDiff}</span>}
                                          <span className={`${isStepActive ? 'text-black' : 'text-blue-400'} font-bold`}>{curFace}</span>
                                        </div>
                                      </div>
                                      <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded border text-[9px] ${isStepActive ? 'bg-black/20 border-black/30' : 'bg-gray-800/80 border-gray-600'}`}>
                                        <span className={`${isStepActive ? 'text-black' : 'text-white'} font-bold`}>IGS</span>
                                        <div className="flex items-baseline gap-0.5">
                                          {igsDiff > 0 && <span className={`${isStepActive ? 'text-black' : 'text-fcGreen'} font-bold text-[7.5px]`}>+{igsDiff}</span>}
                                          <span className={`${isStepActive ? 'text-black' : 'text-blue-400'} font-bold`}>{curIgs}</span>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="grid grid-cols-3 gap-0.5">
                                {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(statKey => {
                                  const val = stepResult.statsAfter[statKey as keyof StatsData].baseFace;
                                  const prevStats = idx === 0 ? rawStats : renderPath.steps![idx - 1].statsAfter;
                                  const prevVal = prevStats[statKey as keyof StatsData].baseFace;
                                  const diff = val - prevVal;
                                  
                                  let diffColor = isStepActive ? "text-black/80" : "text-gray-300";
                                  if (diff >= 8) diffColor = isStepActive ? "text-purple-900 font-bold" : "text-purple-400 font-bold";
                                  else if (diff >= 4) diffColor = isStepActive ? "text-green-900 font-bold" : "text-fcGreen font-bold";
                                  else if (diff >= 2) diffColor = isStepActive ? "text-lime-900 font-semibold" : "text-lime-400 font-semibold";

                                  return (
                                    <div key={statKey} className={`flex gap-0.5 items-center px-1 py-0.5 rounded text-[8.5px] shadow-inner border ${isStepActive ? 'bg-black/10 border-black/20' : 'bg-black/40 border-gray-800/50'}`}>
                                      <span className={`${isStepActive ? 'text-black/70' : 'text-gray-400'} uppercase`}>{statKey}</span>
                                      <div className="flex items-baseline gap-0.5 ml-0.5">
                                        {diff > 0 && <span className={`${diffColor} text-[7px] leading-none tracking-tighter`}>+{diff}</span>}
                                        <span className={`font-black ${isStepActive ? 'text-black' : getStatColorClass(val)}`}>{val}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* PlayStyle Additions */}
                              {(() => {
                                const prevPlayStyles = idx === 0 ? rawPlayStyles : renderPath.steps![idx - 1].playStylesAfter;
                                
                                const beforeGold = [...prevPlayStyles.base.gold, ...(prevPlayStyles.ev?.gold || [])];
                                const beforeSilver = [...prevPlayStyles.base.silver, ...(prevPlayStyles.ev?.silver || [])];
                                
                                const afterGold = [...stepResult.playStylesAfter.base.gold, ...(stepResult.playStylesAfter.ev?.gold || [])];
                                const afterSilver = [...stepResult.playStylesAfter.base.silver, ...(stepResult.playStylesAfter.ev?.silver || [])];
                                
                                const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
                                const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
                                
                                if (afterGold.length === 0 && afterSilver.length === 0) return null;
                                
                                return (
                                  <div className={`flex flex-wrap items-center gap-1 mt-0.5 border-t pt-1 ${isStepActive ? 'border-black/20' : 'border-gray-700/50'}`}>
                                    {afterGold.map(ps => {
                                      const isNew = addedGold.includes(ps);
                                      return (
                                        <img 
                                          key={`g-${ps}`} 
                                          src={getPlayStyleIconUrl(ps, true)} 
                                          alt={ps} 
                                          title={`${ps} (PS+)`} 
                                          className={`w-4 h-4 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)] ${isNew ? `ring-[1.5px] ${isStepActive ? 'ring-black ring-offset-transparent' : 'ring-fcGreen ring-offset-[#1f211f]'} ring-offset-[1.5px] rounded-full` : ''}`} 
                                        />
                                      );
                                    })}
                                    {afterSilver.map(ps => {
                                      const isNew = addedSilver.includes(ps);
                                      return (
                                        <img 
                                          key={`s-${ps}`} 
                                          src={getPlayStyleIconUrl(ps, false)} 
                                          alt={ps} 
                                          title={ps} 
                                          className={`w-3.5 h-3.5 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)] ${isNew ? `ring-[1.5px] ${isStepActive ? 'ring-black ring-offset-transparent' : 'ring-fcGreen ring-offset-[#1f211f]'} ring-offset-[1px] rounded-full` : ''}`} 
                                        />
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </>
                          )}
                        </button>
                        {onViewEvo && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewEvo(id); }}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-blue-900/90 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                            title="View Evolution Details"
                          >
                            <Eye className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {onSetBase && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onSetBase(renderPath.id, idx); }}
                            className={`absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full transition-opacity z-10 shadow-sm ${
                              renderPath.id === activePathId && baseIndex === idx
                                ? 'bg-purple-600 text-white opacity-100'
                                : 'bg-purple-900/90 text-purple-400 hover:bg-purple-600 hover:text-white opacity-0 group-hover/node:opacity-100'
                            }`}
                            title={renderPath.id === activePathId && baseIndex === idx
                              ? 'New builds start from here'
                              : 'Set this step as base to build upon'}
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {onRemoveNode && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemoveNode(renderPath.id, idx); }}
                            className="absolute -top-1.5 -left-1.5 p-0.5 bg-red-900/90 text-red-400 hover:bg-red-600 hover:text-white rounded-full opacity-0 group-hover/node:opacity-100 transition-opacity z-10 shadow-sm"
                            title="Delete this step and all following steps"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      {idx < renderPath.chainIds.length - 1 && (
                        <span className="text-gray-600 text-[10px] shrink-0">➜</span>
                      )}
                    </React.Fragment>'''

content = re.sub(
    r'                    <React\.Fragment key=\{`\$\{id\}-\$\{idx\}`\}>[\s\S]*?<\/React\.Fragment>',
    step_node_new,
    content
)

# Fix missing baseClass in replacement
content = content.replace('bg-[#1f211f] text-gray-200 border-gray-700 hover:border-gray-500 hover:text-white', 'bg-[#1f211f] text-gray-200 border-gray-700 hover:border-gray-500 hover:text-white')

# Ensure we have pt-2 pl-2 for the container as we did in manual path modal
content = content.replace(
    'className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pb-2 items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800"',
    'className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pt-2 pl-2 pb-2 items-center gap-1.5 bg-[#1a1c1a] p-2.5 rounded-lg border border-gray-800"'
)


with open('src/components/HeaderCard.tsx', 'w') as f:
    f.write(content)
