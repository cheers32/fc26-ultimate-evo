import { useState, useMemo } from 'react';
import { playersDatabase } from './data/playersData';
import { chemStyles } from './data/chemStyles';
import { defaultEvolutionPaths, availableEvolutions } from './data/evolutionsData';
import { EvolutionPath } from './types/player';
import { HeaderCard } from './components/HeaderCard';
import { EvolutionWorkbench } from './components/EvolutionWorkbench';
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
  const [selectedStep, setSelectedStep] = useState<'full' | number>('full');
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

  const evoLocked = selectedStep !== 'full';

  const activeChemName = hoveredChem || lockedChem;
  const activeChemBoosts = useMemo(() => {
    return activeChemName ? chemStyles[activeChemName] || {} : {};
  }, [activeChemName]);

  const handleSelectStep = (step: 'full' | number) => {
    setSelectedStep(step);
    if (!evoPreview) {
      setEvoPreview(true); // force preview on to see the transition
    }
  };

  const chainResult = useMemo(() => {
    return simulateEvoChain(activePath.chainIds, playerBio, initialOvrData, statsData, playStylesData);
  }, [activePath.chainIds, playerBio, initialOvrData, statsData, playStylesData]);

  const { activeBaseStats, previewStats, activeBaseOvr, previewOvr, activePlayStyles, previewPlayStyles } = useMemo(() => {
    let aBaseStats = statsData;
    let aBaseOvr = initialOvrData.base;
    let aPlayStyles = JSON.parse(JSON.stringify(playStylesData));
    aPlayStyles.ev = { gold: [], silver: [] };

    // Determine Base
    if (selectedStep !== 'full' && selectedStep > 0) {
      const baseIndex = selectedStep - 1;
      if (chainResult.steps[baseIndex]) {
        aBaseStats = chainResult.steps[baseIndex].statsAfter;
        aBaseOvr = chainResult.steps[baseIndex].ovrAfter;
        aPlayStyles.base = JSON.parse(JSON.stringify(chainResult.steps[baseIndex].playStylesAfter.base));
      }
    }

    let pStats = aBaseStats;
    let pOvr = aBaseOvr;
    let pPlayStyles = JSON.parse(JSON.stringify(aPlayStyles));

    // Determine Preview
    if (evoPreview) {
      if (selectedStep === 'full') {
        pStats = chainResult.finalStats;
        pOvr = chainResult.finalOvr;
        
        pPlayStyles.base = JSON.parse(JSON.stringify(playStylesData.base));
        
        const allGoldAdded = new Set<string>();
        const allSilverAdded = new Set<string>();
        chainResult.steps.forEach(step => {
           const evoDef = availableEvolutions[step.evoId];
           if (evoDef) {
             evoDef.playStylesAdded.gold.forEach(ps => allGoldAdded.add(ps));
             evoDef.playStylesAdded.silver.forEach(ps => allSilverAdded.add(ps));
           }
        });
        pPlayStyles.ev = {
          gold: Array.from(allGoldAdded),
          silver: Array.from(allSilverAdded)
        };
      } else {
        if (chainResult.steps[selectedStep]) {
          pStats = chainResult.steps[selectedStep].statsAfter;
          pOvr = chainResult.steps[selectedStep].ovrAfter;
          
          const evoDef = availableEvolutions[chainResult.steps[selectedStep].evoId];
          if (evoDef) {
            pPlayStyles.ev = {
              gold: [...evoDef.playStylesAdded.gold],
              silver: [...evoDef.playStylesAdded.silver]
            };
          }
        }
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
  }, [selectedStep, evoPreview, chainResult, statsData, initialOvrData, playStylesData]);

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

  const handleReset = () => {
    setHoveredChem(null);
    setLockedChem(null);
    setEvoPreview(false);
    setSelectedStep('full');
    setOvr(playersDatabase[selectedPlayerId].ovr);
    setActivePathId('empty-path');
    setEvosPool([]);
    setGeneratedPaths([]);
    setManualPaths([]);
  };

  const currentOvrVal = previewOvr;

  const activeEvo: EvolutionDefinition | null = selectedStep !== 'full' 
    ? availableEvolutions[activePath.chainIds[selectedStep]]
    : null;

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
            setSelectedStep('full');
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
          onAnalyze={() => {
            const results = analyzeEvolutions(evosPool, 3, playerBio, initialOvrData, statsData, playStylesData);
            setGeneratedPaths(results);
            if (results.length > 0) {
              setActivePathId(results[0].id);
              setSelectedStep('full');
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
        />

        {activeTab === 'workbench' && (
          <>
            {/* Evolution Workbench Controls */}
            <EvolutionWorkbench
              activePath={activePath}
              onSelectPath={(path) => {
                setActivePathId(path.id);
                setSelectedStep('full');
              }}
              evoPreview={evoPreview}
              selectedStep={selectedStep}
              onTogglePreview={() => {
                setEvoPreview(!evoPreview);
              }}
              onSelectStep={handleSelectStep}
              ovr={ovr}
              onUpdateOvr={setOvr}
            />

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
          setSelectedStep('full');
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
