import { useState, useMemo, useEffect } from 'react';
import { playersDatabase } from './data/playersData';
import { chemStyles } from './data/chemStyles';
import { defaultEvolutionPaths, availableEvolutions } from './data/evolutionsData';
import { EvolutionPath } from './types/player';
import { HeaderCard } from './components/HeaderCard';
import { StatsGrid } from './components/StatsGrid';
import { ChemistryGrid } from './components/ChemistryGrid';
import { PlayStylesSection } from './components/PlayStylesSection';
import { FcCardPreview } from './components/FcCardPreview';
import { EvolutionChainWorkbench } from './components/EvolutionChainWorkbench';
import { calculateAccelerateType } from './utils/statUtils';
import { simulateEvoChain, analyzeEvolutions } from './utils/evoEngine';
import { EvolutionDefinition } from './types/player';
import { PlayerCarousel } from './components/PlayerCarousel';
import { EvoPoolModal } from './components/EvoPoolModal';
import { ManualPathModal } from './components/ManualPathModal';
import { Trophy, RefreshCw, LayoutGrid, CreditCard, Layers } from 'lucide-react';

export default function App() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('rodri-91');
  
  const currentPlayer = useMemo(() => playersDatabase[selectedPlayerId] || playersDatabase['rodri-91'], [selectedPlayerId]);
  const playerBio = currentPlayer.bio;
  const initialOvrData = currentPlayer.ovr;
  const playStylesData = currentPlayer.playStyles;
  const statsData = currentPlayer.stats;

  const [hoveredChem, setHoveredChem] = useState<string | null>(null);
  const [lockedChem, setLockedChem] = useState<string | null>(null);
  const [evoPreview, setEvoPreview] = useState(false);

  const [ovr, setOvr] = useState(initialOvrData);
  
  type PlayerEvoState = {
    activePathId: string;
    evosPool: string[];
    generatedPaths: EvolutionPath[];
    manualPaths: EvolutionPath[];
  };

  const [playerStates, setPlayerStates] = useState<Record<string, PlayerEvoState>>({});

  const currentState = playerStates[selectedPlayerId] || {
    activePathId: 'empty-path',
    evosPool: [],
    generatedPaths: [],
    manualPaths: []
  };

  const updateState = (updates: Partial<PlayerEvoState>) => {
    setPlayerStates(prev => {
      const current = prev[selectedPlayerId] || {
        activePathId: 'empty-path',
        evosPool: [],
        generatedPaths: [],
        manualPaths: []
      };
      return {
        ...prev,
        [selectedPlayerId]: { ...current, ...updates }
      };
    });
  };

  const activePathId = currentState.activePathId;
  const evosPool = currentState.evosPool;
  const generatedPaths = currentState.generatedPaths;
  const manualPaths = currentState.manualPaths;

  const setActivePathId = (val: string | ((prev: string) => string)) => updateState({ activePathId: typeof val === 'function' ? val(currentState.activePathId) : val });
  const setEvosPool = (val: string[] | ((prev: string[]) => string[])) => updateState({ evosPool: typeof val === 'function' ? val(currentState.evosPool) : val });
  const setGeneratedPaths = (val: EvolutionPath[] | ((prev: EvolutionPath[]) => EvolutionPath[])) => updateState({ generatedPaths: typeof val === 'function' ? val(currentState.generatedPaths) : val });
  const setManualPaths = (val: EvolutionPath[] | ((prev: EvolutionPath[]) => EvolutionPath[])) => updateState({ manualPaths: typeof val === 'function' ? val(currentState.manualPaths) : val });

  const [isEvoPoolOpen, setIsEvoPoolOpen] = useState(false);
  const [isManualPathOpen, setIsManualPathOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'workbench' | 'card' | 'evos'>('workbench');

  const emptyPath: EvolutionPath = useMemo(() => ({
    id: 'empty-path',
    name: 'No Path',
    description: 'No evolution path selected.',
    isRecommended: false,
    chainIds: []
  }), []);

  const allPaths = useMemo(() => {
    return [...generatedPaths, ...manualPaths];
  }, [generatedPaths, manualPaths]);

  const activePath = useMemo(() => {
    return allPaths.find(p => p.id === activePathId) || emptyPath;
  }, [allPaths, activePathId, emptyPath]);

  const evoLocked = evoPreview; // Derived state for components that need to know if we are in preview mode

  const activeChemName = hoveredChem || lockedChem;
  const activeChemBoosts = useMemo(() => {
    return activeChemName ? chemStyles[activeChemName] || {} : {};
  }, [activeChemName]);

  // Queue of the last two clicked nodes (indices -1 to length-1)
  const [selectionQueue, setSelectionQueue] = useState<[number, number]>([-1, 0]);
  
  // Safe bounds for the queue
  const activePathLength = activePath.chainIds.length;
  const maxNode = activePathLength > 0 ? activePathLength - 1 : -1;
  const safeNodes: [number, number] = [
    Math.min(maxNode, Math.max(-1, selectionQueue[0])),
    Math.min(maxNode, Math.max(-1, selectionQueue[1]))
  ];

  // Initialize selection when path changes or is first loaded
  useEffect(() => {
    setSelectionQueue([-1, maxNode]);
  }, [activePathId, maxNode]);

  const handleNodeClick = (nodeIndex: number) => {
    setSelectionQueue([safeNodes[1], nodeIndex]);
    if (!evoPreview) setEvoPreview(true);
  };

  const baseNode = Math.min(safeNodes[0], safeNodes[1]);
  const previewNode = Math.max(safeNodes[0], safeNodes[1]);

  const chainResult = useMemo(() => {
    return simulateEvoChain(activePath.chainIds, playerBio, initialOvrData, statsData, playStylesData);
  }, [activePath.chainIds, playerBio, initialOvrData, statsData, playStylesData]);

  const { activeBaseStats, previewStats, activeBaseOvr, previewOvr, activePlayStyles, previewPlayStyles } = useMemo(() => {
    let aBaseStats = statsData;
    let aBaseOvr = initialOvrData.base;
    let aPlayStyles = JSON.parse(JSON.stringify(playStylesData));
    aPlayStyles.ev = { gold: [], silver: [] };

    // 1. Determine Base
    if (baseNode === -1) {
      aBaseStats = statsData;
      aBaseOvr = initialOvrData.base;
      aPlayStyles.base = JSON.parse(JSON.stringify(playStylesData.base));
    } else {
      const bStep = chainResult.steps[baseNode];
      if (bStep) {
        aBaseStats = bStep.statsAfter;
        aBaseOvr = bStep.ovrAfter;
        aPlayStyles.base = JSON.parse(JSON.stringify(bStep.playStylesAfter.base));
      }
    }

    let pStats = aBaseStats;
    let pOvr = aBaseOvr;
    let pPlayStyles = JSON.parse(JSON.stringify(aPlayStyles));

    // 2. Determine Preview
    if (evoPreview && previewNode >= baseNode) {
      if (previewNode === -1) {
        pStats = statsData;
        pOvr = initialOvrData.base;
      } else {
        const pStep = chainResult.steps[previewNode];
        if (pStep) {
          pStats = pStep.statsAfter;
          pOvr = pStep.ovrAfter;
        }
        
        const addedGold = new Set<string>();
        const addedSilver = new Set<string>();
        for (let i = baseNode + 1; i <= previewNode; i++) {
          const step = chainResult.steps[i];
          if (!step) continue;
          const evoDef = availableEvolutions[step.evoId];
          if (evoDef) {
            evoDef.playStylesAdded.gold.forEach(ps => addedGold.add(ps));
            evoDef.playStylesAdded.silver.forEach(ps => addedSilver.add(ps));
          }
        }
        pPlayStyles.ev = { gold: Array.from(addedGold), silver: Array.from(addedSilver) };
      }
    }

    return {
      activeBaseStats: aBaseStats,
      previewStats: pStats,
      activeBaseOvr: aBaseOvr,
      previewOvr: pOvr,
      activePlayStyles: aPlayStyles,
      previewPlayStyles: pPlayStyles
    };
  }, [baseNode, previewNode, evoPreview, chainResult, statsData, initialOvrData, playStylesData]);

  // Calculate IGS & Face Stats Summary
  const { igs, faceSum, accelerateType } = useMemo(() => {
    let currentActiveBaseIgs = 0;
    let currentEffectiveIgs = 0;
    let currentChemIgs = 0;

    let currentActiveBaseFace = 0;
    let currentEffectiveFace = 0;
    let currentChemFace = 0;

    let agiVal = 0;
    let strVal = 0;
    let accVal = 0;

    Object.keys(activeBaseStats).forEach((faceKey) => {
      const baseFaceData = activeBaseStats[faceKey];
      const previewFaceData = previewStats[faceKey];

      let totalFaceValBase = 0;
      let totalFaceValChem = 0;

      Object.keys(baseFaceData.subs).forEach((subKey) => {
        const subDataBase = baseFaceData.subs[subKey];
        const subDataPreview = previewFaceData.subs[subKey];
        
        const boost = activeChemBoosts[subKey] || 0;

        const activeBase = subDataBase.base;
        const effectiveVal = subDataPreview.base;
        const finalVal = Math.min(99, effectiveVal + boost);

        totalFaceValBase += effectiveVal * subDataBase.w;
        totalFaceValChem += finalVal * subDataBase.w;

        currentActiveBaseIgs += activeBase;
        currentEffectiveIgs += effectiveVal;
        currentChemIgs += finalVal;

        if (subKey === 'agility') agiVal = finalVal;
        if (subKey === 'strength') strVal = finalVal;
        if (subKey === 'acceleration') accVal = finalVal;
      });

      const activeBaseFaceVal = baseFaceData.baseFace;
      const effectiveFaceVal = previewFaceData.baseFace;
      const faceBoost = Math.round(totalFaceValChem) - Math.round(totalFaceValBase);
      const newFaceVal = effectiveFaceVal + faceBoost;

      currentActiveBaseFace += activeBaseFaceVal;
      currentEffectiveFace += effectiveFaceVal;
      currentChemFace += newFaceVal;
    });

    const accType = calculateAccelerateType(accVal, agiVal, strVal);

    return {
      igs: {
        activeBase: currentActiveBaseIgs,
        effective: currentEffectiveIgs,
        chem: currentChemIgs,
        diff: currentChemIgs - currentEffectiveIgs
      },
      faceSum: {
        activeBase: currentActiveBaseFace,
        effective: currentEffectiveFace,
        chem: currentChemFace,
        diff: currentChemFace - currentEffectiveFace
      },
      accelerateType: accType
    };
  }, [activeChemBoosts, activeBaseStats, previewStats]);

  const { originalIgs, originalFaceSum } = useMemo(() => {
    let igs = 0;
    let face = 0;
    Object.values(statsData).forEach(faceData => {
      face += faceData.baseFace;
      Object.values(faceData.subs).forEach(s => {
        igs += s.base;
      });
    });
    return { originalIgs: igs, originalFaceSum: face };
  }, [statsData]);

  const handleReset = () => {
    setHoveredChem(null);
    setLockedChem(null);
    setEvoPreview(false);
    setSelectionQueue([-1, -1]);
    setOvr(playersDatabase[selectedPlayerId].ovr);
    setActivePathId('empty-path');
    setEvosPool([]);
    setGeneratedPaths([]);
    setManualPaths([]);
  };

  const currentOvrVal = previewOvr;

  const activeEvo: EvolutionDefinition | null = useMemo(() => {
    if (previewNode < 0 || baseNode >= previewNode) return null;

    if (previewNode - baseNode === 1) {
      return availableEvolutions[activePath.chainIds[previewNode]];
    }
    
    // For multi-step diffs, aggregate the limits and boosts!
    const aggregatedBoosts: Record<string, { boost: number, limit: number }> = {};
    for (let i = baseNode + 1; i <= previewNode; i++) {
      const evoId = activePath.chainIds[i];
      const evo = availableEvolutions[evoId];
      if (evo) {
         Object.keys(evo.subStatBoosts).forEach(subKey => {
            if (!aggregatedBoosts[subKey]) {
               aggregatedBoosts[subKey] = { boost: 0, limit: 0 };
            }
            aggregatedBoosts[subKey].boost += evo.subStatBoosts[subKey].boost;
            aggregatedBoosts[subKey].limit = Math.max(aggregatedBoosts[subKey].limit, evo.subStatBoosts[subKey].limit);
         });
      }
    }

    if (Object.keys(aggregatedBoosts).length === 0) return null;

    return {
      id: 'aggregated',
      name: 'Aggregated Path',
      subStatBoosts: aggregatedBoosts,
      playStylesAdded: { gold: [], silver: [] },
      requirements: {}
    } as unknown as EvolutionDefinition;
  }, [baseNode, previewNode, activePath.chainIds, availableEvolutions]);

  return (
    <div className="min-h-screen bg-[#121212] py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="bg-[#1A1C1A] p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-800/80">
        
        {/* Top Navbar / Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-800/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fcGreen to-emerald-700 flex items-center justify-center font-black text-black shadow-md">
              FC
            </div>
            <span className="font-extrabold tracking-wide text-lg text-white uppercase">
              EA FC 26 Stats Calculator
            </span>
          </div>

          {/* Tab Navigation & Reset */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#121212] p-1 rounded-lg border border-gray-800 text-xs">
              <button
                onClick={() => setActiveTab('workbench')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'workbench'
                    ? 'bg-[#1ED760] text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Stats Workbench
              </button>

              <button
                onClick={() => setActiveTab('evos')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'evos'
                    ? 'bg-[#1ED760] text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                EVO Chain Lab
              </button>

              <button
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'card'
                    ? 'bg-[#1ED760] text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Visual FC Card
              </button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 bg-[#2A2D2A]/80 hover:bg-[#374151] px-3 py-1.5 rounded-md transition-colors border border-gray-700/60"
              title="Reset all selections"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Player Selector Strip */}
        <PlayerCarousel
          players={playersDatabase}
          selectedPlayerId={selectedPlayerId}
          onSelectPlayer={(id) => {
            setSelectedPlayerId(id);
            setHoveredChem(null);
            setLockedChem(null);
            setEvoPreview(false);
            setSelectionQueue([-1, -1]);
            setOvr(playersDatabase[id].ovr);
          }}
        />

        <HeaderCard
          bio={playerBio}
          futbinLink={currentPlayer.futbinLink}
          activeBaseOvr={activeBaseOvr}
          previewOvr={previewOvr}
          activePath={activePath}
          allPaths={allPaths}
          activePathId={activePathId}
          onSelectPath={setActivePathId}
          onOpenEvoPool={() => setIsEvoPoolOpen(true)}
          onOpenManualPath={() => setIsManualPathOpen(true)}
          originalIgs={originalIgs}
          originalFaceSum={originalFaceSum}
          onAnalyze={() => {
            const results = analyzeEvolutions(evosPool, 3, playerBio, initialOvrData, statsData, playStylesData);
            setGeneratedPaths(results);
            if (results.length > 0) {
              setActivePathId(results[0].id);
              if (!evoPreview) setEvoPreview(true);
            }
          }}
          evosPoolCount={evosPool.length}
          evoPreview={evoPreview}
          evoLocked={evoLocked}
          accelerateType={accelerateType}
          igs={igs}
          faceSum={faceSum}
          activeEvo={activeEvo}
          selectedNodes={safeNodes}
          onNodeClick={handleNodeClick}
        />

        {activeTab === 'workbench' && (
          <>
            <StatsGrid
              baseStats={activeBaseStats}
              previewStats={previewStats}
              activeChemBoosts={activeChemBoosts}
              activeEvo={activeEvo}
            />

            {/* Chemistry Styles Selector */}
            <ChemistryGrid
              chemStyles={chemStyles}
              hoveredChem={hoveredChem}
              lockedChem={lockedChem}
              onHoverChem={setHoveredChem}
              onLockChem={(name) => {
                setLockedChem(lockedChem === name ? null : name);
              }}
            />

            <PlayStylesSection
              playStyles={previewPlayStyles}
              roles={playerBio.roles}
              evoPreview={evoPreview}
              evoLocked={evoLocked}
            />
          </>
        )}

        {activeTab === 'evos' && (
          <EvolutionChainWorkbench
            bio={playerBio}
            ovr={initialOvrData}
            stats={statsData}
            playStyles={playStylesData}
          />
        )}

        {activeTab === 'card' && (
          /* Visual FC Card View */
          <div className="py-8 bg-[#121212]/60 rounded-2xl border border-gray-800 my-4 flex flex-col items-center">
            <FcCardPreview
              bio={playerBio}
              ovrVal={currentOvrVal}
              activePath={activePath}
              stats={previewStats}
              activeChemBoosts={activeChemBoosts}
              activeChemName={activeChemName}
              evoLocked={evoLocked}
              evoPreview={evoPreview}
            />

            <div className="mt-6 text-center text-xs text-gray-400 max-w-md">
              <p className="font-semibold text-white mb-1">Visual Card Summary</p>
              <p>
                Showing {playerBio.name} with OVR {currentOvrVal},{' '}
                EVO Chain: {activePath.name},{' '}
                {activeChemName ? `Chemistry Style: ${activeChemName}` : 'No Chemistry Style active'},{' '}
                AccelerATE: {accelerateType}.
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 pt-4 border-t border-gray-800/80 text-center text-xs text-fcTextDim flex items-center justify-between flex-wrap gap-2">
          <span>EA FC 26 Player Stats & Evolution Preview Calculator</span>
          <span className="flex items-center gap-1 text-fcGreen font-medium">
            <Trophy className="w-3.5 h-3.5" /> Built for Ultimate Team Enthusiasts
          </span>
        </div>

      </div>
      <EvoPoolModal
        isOpen={isEvoPoolOpen}
        onClose={() => setIsEvoPoolOpen(false)}
        evosPool={evosPool}
        setEvosPool={setEvosPool}
      />
      <ManualPathModal
        isOpen={isManualPathOpen}
        onClose={() => setIsManualPathOpen(false)}
        evosPool={evosPool}
        onSave={(path) => {
          setManualPaths([...manualPaths, path]);
          setActivePathId(path.id);
          setIsManualPathOpen(false);
          if (!evoPreview) setEvoPreview(true);
        }}
        baseBio={playerBio}
        baseOvr={initialOvrData}
        baseStats={statsData}
        basePlayStyles={playStylesData}
      />
    </div>
  );
}
