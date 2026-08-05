import { useState, useMemo, useEffect } from 'react';
import { playersDatabase } from './data/playersData';
import { chemStyles } from './data/chemStyles';
import { defaultEvolutionPaths, availableEvolutions } from './data/evolutionsData';
import { PlayerData, StatsData, PlayStylesData, EvolutionPath, EvoFilters } from './types/player';
import { HeaderCard } from './components/HeaderCard';
import { StatsGrid } from './components/StatsGrid';
import { ChemistryGrid } from './components/ChemistryGrid';
import { PlayStylesSection } from './components/PlayStylesSection';
import { EvolutionChainWorkbench } from './components/EvolutionChainWorkbench';
import { calculateAccelerateType } from './utils/statUtils';
import { simulateEvoChain, analyzeEvolutions } from './utils/evoEngine';
import { EvolutionDefinition } from './types/player';
import { PlayerSelectionModal } from './components/PlayerSelectionModal';
import { EvoPoolModal } from './components/EvoPoolModal';
import { ManualPathModal } from './components/ManualPathModal';
import { EvoDetailsModal } from './components/EvoDetailsModal';
import { SquadPanel } from './components/SquadPanel';
import { ImportPlayerModal } from './components/ImportPlayerModal';
import { Trophy, RefreshCw, LayoutGrid, Layers, Upload } from 'lucide-react';
import { Squad, SquadMember, PlayerEvoState } from './types/player';

const DEFAULT_PATH_ID = 'default-path';

export default function App() {
  const [deletedDatabasePlayers, setDeletedDatabasePlayers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('futEvo_deleted_db_players');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [];
  });

  const [customPlayers, setCustomPlayers] = useState<Record<string, PlayerData>>(() => {
    try {
      const saved = localStorage.getItem('futEvo_custom_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: Repair broken custom players
        Object.values(parsed).forEach((p: any) => {
          if (p && p.stats) {
            const required = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
            required.forEach(f => {
              if (!p.stats[f]) {
                p.stats[f] = { label: f.toUpperCase(), baseFace: 50, evFace: 50, subs: {} };
              }
            });
          }
        });
        return parsed;
      }
    } catch(e) {}
    return {};
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPlayerSelectionOpen, setIsPlayerSelectionOpen] = useState(false);
  const [isManualPathOpen, setIsManualPathOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'append' | 'branch'>('append');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if ((e.key === '/' || e.code === 'Slash') && !isPlayerSelectionOpen && !isManualPathOpen) {
        e.preventDefault();
        setIsPlayerSelectionOpen(true);
      }

      if ((e.key === '.' || e.code === 'Period') && !isPlayerSelectionOpen && !isManualPathOpen) {
        e.preventDefault();
        setPickerMode('append');
        setIsManualPathOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerSelectionOpen, isManualPathOpen]);

  const handleImportPlayer = (player: PlayerData) => {
    const newCustomPlayers = { ...customPlayers, [player.id]: player };
    setCustomPlayers(newCustomPlayers);
    localStorage.setItem('futEvo_custom_players', JSON.stringify(newCustomPlayers));
    setSelectedPlayerId(player.id);
  };

  const handleDeletePlayer = (id: string) => {
    if (id.startsWith('custom-') || customPlayers[id]) {
      const newCustomPlayers = { ...customPlayers };
      delete newCustomPlayers[id];
      setCustomPlayers(newCustomPlayers);
      localStorage.setItem('futEvo_custom_players', JSON.stringify(newCustomPlayers));
    } else {
      const newDeleted = [...deletedDatabasePlayers, id];
      setDeletedDatabasePlayers(newDeleted);
      localStorage.setItem('futEvo_deleted_db_players', JSON.stringify(newDeleted));
    }
    
    if (selectedPlayerId === id) {
      // Find another available player to select
      const availableIds = Object.keys(allPlayersData).filter(pId => pId !== id);
      setSelectedPlayerId(availableIds.length > 0 ? availableIds[0] : 'rodri-91');
    }
  };

  const handleEditPlayerAvatar = (id: string, newUrl: string, newName: string, newFutbinUrl: string, newPositions: string, goldPs: string[], silverPs: string[]) => {
    // If it's a built-in player, we create an override in customPlayers
    const targetPlayer = customPlayers[id] || playersDatabase[id];
    if (targetPlayer) {
      const updatedPlayer = {
        ...targetPlayer,
        avatarUrl: newUrl || targetPlayer.avatarUrl,
        futbinLink: newFutbinUrl || targetPlayer.futbinLink,
        bio: {
          ...targetPlayer.bio,
          name: newName || targetPlayer.bio.name,
          primaryPositions: newPositions || targetPlayer.bio.primaryPositions
        },
        playStyles: {
          ...targetPlayer.playStyles,
          base: {
            ...targetPlayer.playStyles.base,
            gold: goldPs || targetPlayer.playStyles.base.gold,
            silver: silverPs || targetPlayer.playStyles.base.silver
          }
        }
      };
      const newCustomPlayers = {
        ...customPlayers,
        [id]: updatedPlayer
      };
      setCustomPlayers(newCustomPlayers);
      localStorage.setItem('futEvo_custom_players', JSON.stringify(newCustomPlayers));
    }
  };

  // Evolutions the user never wants used. Global rather than per-player, so it lives in
  // localStorage alongside custom players instead of in the per-player save files.
  const [disabledEvos, setDisabledEvos] = useState<string[]>(() => {
    let current: string[] = [];
    try {
      const saved = localStorage.getItem('futEvo_disabled_evos');
      if (saved) current = JSON.parse(saved);
    } catch(e) {}

    // Evos that ship switched off are folded in once each, tracked separately, so a later
    // re-enable in the UI isn't undone on the next load.
    let seeded: string[] = [];
    try {
      const saved = localStorage.getItem('futEvo_seeded_disabled');
      if (saved) seeded = JSON.parse(saved);
    } catch(e) {}

    const pending = Object.values(availableEvolutions)
      .filter(evo => evo.defaultDisabled && !seeded.includes(evo.id))
      .map(evo => evo.id);

    if (pending.length === 0) return current;

    const next = [...new Set([...current, ...pending])];
    localStorage.setItem('futEvo_disabled_evos', JSON.stringify(next));
    localStorage.setItem('futEvo_seeded_disabled', JSON.stringify([...seeded, ...pending]));
    return next;
  });

  const toggleEvoDisabled = (evoId: string) => {
    const next = disabledEvos.includes(evoId)
      ? disabledEvos.filter(id => id !== evoId)
      : [...disabledEvos, evoId];
    setDisabledEvos(next);
    localStorage.setItem('futEvo_disabled_evos', JSON.stringify(next));
  };

  // Squad management
  const [squads, setSquads] = useState<Squad[]>(() => {
    try {
      const saved = localStorage.getItem('futEvo_squads');
      if (saved) {
        // Members predating per-entry ids need one before they can be removed individually.
        return (JSON.parse(saved) as Squad[]).map(squad => ({
          ...squad,
          members: squad.members.map((m, i) => m.id ? m : { ...m, id: `${m.playerId}-${i}` })
        }));
      }
    } catch(e) {}
    return [];
  });

  const saveSquads = (newSquads: Squad[]) => {
    setSquads(newSquads);
    localStorage.setItem('futEvo_squads', JSON.stringify(newSquads));
  };

  const createSquad = (name: string) => {
    const newSquad: Squad = {
      id: Date.now().toString(),
      name,
      members: [],
      createdAt: Date.now()
    };
    saveSquads([...squads, newSquad]);
  };

  const deleteSquad = (squadId: string) => {
    saveSquads(squads.filter(s => s.id !== squadId));
  };

  const addPlayerToSquad = (squadId: string, playerId: string, playerState: PlayerEvoState, snapshot: SquadMember['snapshot']) => {
    const updatedSquads = squads.map(squad => {
      if (squad.id === squadId) {
        // A player may appear several times under different paths, so entries are keyed
        // by player + chain. Re-adding the same chain refreshes it instead of duplicating.
        const chainKey = snapshot.chainIds.join('>');
        const existingIndex = squad.members.findIndex(
          m => m.playerId === playerId && m.snapshot.chainIds.join('>') === chainKey
        );
        if (existingIndex >= 0) {
          const newMembers = [...squad.members];
          newMembers[existingIndex] = { ...newMembers[existingIndex], playerState, snapshot };
          return { ...squad, members: newMembers };
        }
        const member: SquadMember = {
          id: `${playerId}-${Date.now()}`,
          playerId,
          playerState,
          snapshot
        };
        return { ...squad, members: [...squad.members, member] };
      }
      return squad;
    });
    saveSquads(updatedSquads);
  };

  const removeSquadMember = (squadId: string, memberId: string) => {
    const updatedSquads = squads.map(squad => {
      if (squad.id === squadId) {
        return { ...squad, members: squad.members.filter(m => m.id !== memberId) };
      }
      return squad;
    });
    saveSquads(updatedSquads);
  };

  const allPlayersData = useMemo(() => {
    const combined = { ...playersDatabase, ...customPlayers };
    deletedDatabasePlayers.forEach(id => delete combined[id]);
    return combined;
  }, [customPlayers, deletedDatabasePlayers]);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('rodri-91');
  
  const currentPlayer = useMemo(() => allPlayersData[selectedPlayerId] || allPlayersData['rodri-91'], [selectedPlayerId, allPlayersData]);
  const playerBio = currentPlayer.bio;
  const initialOvrData = currentPlayer.ovr;
  const playStylesData = currentPlayer.playStyles;
  const statsData = currentPlayer.stats;

  const [hoveredChem, setHoveredChem] = useState<string | null>(null);
  const [lockedChem, setLockedChem] = useState<string | null>(null);
  const [evoPreview, setEvoPreview] = useState(false);

  const [ovr, setOvr] = useState(initialOvrData);

  const [playerStates, setPlayerStates] = useState<Record<string, PlayerEvoState>>({});

  const currentState = {
    activePathId: DEFAULT_PATH_ID,
    expandedPathIds: [DEFAULT_PATH_ID],
    comparePathId: null,
    evosPool: [],
    generatedPaths: [],
    manualPaths: [],
    evoFilters: { ovr: { max: 99 } },
    ...(playerStates[selectedPlayerId] as Partial<PlayerEvoState> || {})
  };

  const updateState = (updates: Partial<PlayerEvoState>) => {
    setPlayerStates(prev => {
      const current = {
        activePathId: DEFAULT_PATH_ID,
        expandedPathIds: [DEFAULT_PATH_ID],
        comparePathId: null,
        evosPool: [],
        generatedPaths: [],
        manualPaths: [],
        evoFilters: { ovr: { max: 99 } },
        ...(prev[selectedPlayerId] as Partial<PlayerEvoState> || {})
      };
      
      const newState = { ...current, ...updates };
      
      // Persist state silently
      fetch(`/api/saves/${selectedPlayerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState)
      }).catch(e => console.error('Failed to save player state:', e));

      return {
        ...prev,
        [selectedPlayerId]: newState
      };
    });
  };

  // Set when opening a squad member, so the effect below restores that snapshot
  // instead of the player's own save.
  const [pendingRestore, setPendingRestore] = useState<{ playerId: string; state: PlayerEvoState } | null>(null);

  const openSquadMember = (member: SquadMember) => {
    setPendingRestore({ playerId: member.playerId, state: member.playerState });
    setSelectedPlayerId(member.playerId);
    setEvoPreview(true);
    setActiveTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load persistence data when player changes
  useEffect(() => {
    if (pendingRestore && pendingRestore.playerId === selectedPlayerId) {
      const { state } = pendingRestore;
      setPlayerStates(prev => ({ ...prev, [selectedPlayerId]: state }));
      setPendingRestore(null);
      // Make the restored snapshot the player's live save too.
      fetch(`/api/saves/${selectedPlayerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(e => console.error('Failed to save restored squad state:', e));
      return;
    }

    let active = true;
    fetch(`/api/saves/${selectedPlayerId}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        if (!data.error) {
          setPlayerStates(prev => ({
            ...prev,
            [selectedPlayerId]: data
          }));
        }
      })
      .catch(e => console.error('No save found or error loading:', e));

    return () => { active = false; };
  }, [selectedPlayerId, pendingRestore]);

  const activePathId = currentState.activePathId;
  const evosPool = currentState.evosPool;
  // Disabling filters at point of use rather than rewriting every player's saved pool,
  // so re-enabling an evo restores it wherever it was already selected.
  const effectiveEvosPool = useMemo(
    () => evosPool.filter(id => !disabledEvos.includes(id)),
    [evosPool, disabledEvos]
  );
  const generatedPaths = currentState.generatedPaths;
  const manualPaths = currentState.manualPaths;
  const evoFilters = currentState.evoFilters;

  const setActivePathId = (val: string | ((prev: string) => string)) => {
    const nextId = typeof val === 'function' ? val(currentState.activePathId) : val;
    updateState({ 
      activePathId: nextId,
      expandedPathIds: currentState.expandedPathIds.includes(nextId) ? currentState.expandedPathIds : [...currentState.expandedPathIds, nextId]
    });
  };
  const setEvosPool = (val: string[] | ((prev: string[]) => string[])) => updateState({ evosPool: typeof val === 'function' ? val(currentState.evosPool) : val });
  const setGeneratedPaths = (val: EvolutionPath[] | ((prev: EvolutionPath[]) => EvolutionPath[])) => updateState({ generatedPaths: typeof val === 'function' ? val(currentState.generatedPaths) : val });
  const setManualPaths = (val: EvolutionPath[] | ((prev: EvolutionPath[]) => EvolutionPath[])) => updateState({ manualPaths: typeof val === 'function' ? val(currentState.manualPaths) : val });
  const setEvoFilters = (val: EvoFilters | ((prev: EvoFilters) => EvoFilters)) => updateState({ evoFilters: typeof val === 'function' ? val(currentState.evoFilters) : val });
  const baseIndex = currentState.baseIndex ?? -1;
  const setBaseIndex = (val: number) => updateState({ baseIndex: val });

  const [isEvoPoolOpen, setIsEvoPoolOpen] = useState(false);
  // 'append' grows the active path in place; 'branch' spins a new path off the chosen base.
  const [viewingEvoId, setViewingEvoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workbench' | 'card' | 'evos'>('workbench');

  // Every player starts on an empty "Default" path, so the card shows the raw base until
  // an evo is added. It only reaches manualPaths once something is appended to it.
  const defaultPath: EvolutionPath = useMemo(() => ({
    id: DEFAULT_PATH_ID,
    name: 'Default',
    description: 'Starting point — shows the base card until you add an EVO.',
    isRecommended: false,
    chainIds: []
  }), []);

  // Provide stable sorted paths
  const allPaths = useMemo(() => {
    const saved = [...currentState.generatedPaths, ...currentState.manualPaths].sort((a, b) => {
      // First sort by target ovr
      const aOvr = a.steps?.[a.steps.length - 1]?.ovrAfter || 0;
      const bOvr = b.steps?.[b.steps.length - 1]?.ovrAfter || 0;
      if (bOvr !== aOvr) return bOvr - aOvr;
      
      // If equal, sort by max req ovr of the first evo
      const aReq = availableEvolutions[a.chainIds[0]]?.requirements?.maxOvr || 0;
      const bReq = availableEvolutions[b.chainIds[0]]?.requirements?.maxOvr || 0;
      return bReq - aReq;
    });
    return saved.some(p => p.id === DEFAULT_PATH_ID) ? saved : [defaultPath, ...saved];
  }, [currentState.generatedPaths, currentState.manualPaths, defaultPath]);

  const activePath = useMemo(() => {
    return allPaths.find(p => p.id === activePathId) || defaultPath;
  }, [allPaths, activePathId, defaultPath]);

  const evoLocked = evoPreview; // Derived state for components that need to know if we are in preview mode

  const activeChemName = hoveredChem || lockedChem;
  const activeChemBoosts = useMemo(() => {
    return activeChemName ? chemStyles[activeChemName] || {} : {};
  }, [activeChemName]);

  const handleDeletePath = (pathId: string) => {
    const path = allPaths.find(p => p.id === pathId);
    if (path?.isFavorite) return;
    if (activePathId === pathId) {
      updateState({ activePathId: DEFAULT_PATH_ID });
    }
    updateState({
      manualPaths: manualPaths.filter(p => p.id !== pathId),
      generatedPaths: generatedPaths.filter(p => p.id !== pathId)
    });
  };

  const handleClearPaths = () => {
    updateState({
      generatedPaths: generatedPaths.filter(p => p.isFavorite),
      manualPaths: manualPaths.filter(p => p.isFavorite),
      activePathId: DEFAULT_PATH_ID,
      expandedPathIds: [DEFAULT_PATH_ID]
    });
  };

  // Drop one evo from the active path. Later steps may stop being eligible without it; the
  // chain simulation surfaces that rather than us silently trimming them.
  const handleRemoveNode = (pathId: string, index: number) => {
    const targetPathId = pathId;
    const path = allPaths.find(p => p.id === targetPathId);
    if (!path) return;

    const newChainIds = [...path.chainIds];
    newChainIds.splice(index, 1);
    const steps = simulateEvoChain(newChainIds, playerBio, initialOvrData, statsData, playStylesData).steps;
    
    // Auto paths become manual paths when edited
    const wasGenerated = currentState.generatedPaths.some(p => p.id === path.id);
    const updated: EvolutionPath = { 
      ...path, 
      id: wasGenerated ? `custom-${Date.now()}` : path.id,
      name: wasGenerated ? `${path.name} (Edited)` : path.name,
      chainIds: newChainIds, 
      steps 
    };

    // Removing a step shifts everything after it, so the base has to follow.
    const currentBase = currentState.baseIndex ?? -1;
    const nextBase = index <= currentBase ? currentBase - 1 : currentBase;

    // Editing an Analyze result makes it user-owned, matching the manual-path save behaviour:
    // otherwise the next Analyze run would silently discard the edit.
    updateState({
      baseIndex: nextBase,
      generatedPaths: wasGenerated
        ? currentState.generatedPaths.filter(p => p.id !== path.id)
        : currentState.generatedPaths,
      manualPaths: wasGenerated
        ? [...currentState.manualPaths, updated]
        : currentState.manualPaths.map(p => (p.id === path.id ? updated : p))
    });
  };

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
    setSelectionQueue([maxNode, maxNode]);
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

  const comparePath = useMemo(() => {
    return allPaths.find(p => p.id === currentState.comparePathId);
  }, [allPaths, currentState.comparePathId]);

  const compareChainResult = useMemo(() => {
    if (!comparePath) return null;
    return simulateEvoChain(comparePath.chainIds, playerBio, initialOvrData, statsData, playStylesData);
  }, [comparePath, playerBio, initialOvrData, statsData, playStylesData]);

  // The chosen base clamps to the active path, so switching to a shorter path can't leave
  // a stale index pointing past its end.
  const safeBaseIndex = Math.min(currentState.baseIndex ?? -1, activePath.chainIds.length - 1);
  const basePrefix = useMemo(
    () => activePath.chainIds.slice(0, safeBaseIndex + 1),
    [activePath.chainIds, safeBaseIndex]
  );

  // The player as the active path leaves them — this is what gets stored in a squad.
  const currentSnapshot = useMemo<SquadMember['snapshot']>(() => {
    const lastStep = chainResult.steps[chainResult.steps.length - 1];
    return {
      name: playerBio.name,
      pathName: activePath.name,
      chainIds: activePath.chainIds,
      generatedPaths: currentState.generatedPaths,
      manualPaths: currentState.manualPaths,
      baseOvr: initialOvrData.base,
      evoOvr: lastStep ? lastStep.ovrAfter : initialOvrData.base
    };
  }, [chainResult, playerBio.name, activePath.name, activePath.chainIds, initialOvrData.base]);

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
    if (compareChainResult) {
      // Comparison Mode: Base is comparePath (full), Preview is activePath (full) — the diff
      // reads as "the other path → your active path" rather than the reverse.
      const baseFinalStep = compareChainResult.steps[compareChainResult.steps.length - 1];
      const previewFinalStep = chainResult.steps[chainResult.steps.length - 1];
      
      if (baseFinalStep) {
        aBaseStats = baseFinalStep.statsAfter;
        aBaseOvr = baseFinalStep.ovrAfter;
        aPlayStyles.base = JSON.parse(JSON.stringify(baseFinalStep.playStylesAfter.base));
      } else {
        aBaseStats = statsData;
        aBaseOvr = initialOvrData.base;
        aPlayStyles.base = JSON.parse(JSON.stringify(playStylesData.base));
      }
      
      if (previewFinalStep) {
        pStats = previewFinalStep.statsAfter;
        pOvr = previewFinalStep.ovrAfter;
        
        const beforeGold = aPlayStyles.base.gold;
        const beforeSilver = aPlayStyles.base.silver;
        const afterGold = previewFinalStep.playStylesAfter.base.gold;
        const afterSilver = previewFinalStep.playStylesAfter.base.silver;
        
        const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
        const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
        
        pPlayStyles.ev = { gold: addedGold, silver: addedSilver };
      } else {
        pStats = statsData;
        pOvr = initialOvrData.base;
      }
    } else if (evoPreview && previewNode >= baseNode) {
      if (previewNode === -1) {
        pStats = statsData;
        pOvr = initialOvrData.base;
      } else {
        const pStep = chainResult.steps[previewNode];
        if (pStep) {
          pStats = pStep.statsAfter;
          pOvr = pStep.ovrAfter;
          
          const beforeGold = aPlayStyles.base.gold;
          const beforeSilver = aPlayStyles.base.silver;
          const afterGold = pStep.playStylesAfter.base.gold;
          const afterSilver = pStep.playStylesAfter.base.silver;
          
          const addedGold = afterGold.filter(ps => !beforeGold.includes(ps));
          const addedSilver = afterSilver.filter(ps => !beforeSilver.includes(ps));
          
          pPlayStyles.ev = { gold: addedGold, silver: addedSilver };
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
  }, [baseNode, previewNode, evoPreview, chainResult, compareChainResult, statsData, initialOvrData, playStylesData]);

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
    setActivePathId(DEFAULT_PATH_ID);
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
    const aggregatedOvrBoost = { boost: 0, limit: 0 };
    
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
         
         if (evo.ovrBoost) {
           aggregatedOvrBoost.boost += evo.ovrBoost.boost;
           aggregatedOvrBoost.limit = Math.max(aggregatedOvrBoost.limit, evo.ovrBoost.limit);
         }
      }
    }

    if (Object.keys(aggregatedBoosts).length === 0 && aggregatedOvrBoost.boost === 0) return null;

    return {
      id: 'aggregated',
      name: 'Aggregated Path',
      subStatBoosts: aggregatedBoosts,
      ovrBoost: aggregatedOvrBoost.boost > 0 ? aggregatedOvrBoost : undefined,
      playStylesAdded: { gold: [], silver: [] },
      requirements: {}
    } as unknown as EvolutionDefinition;
  }, [baseNode, previewNode, activePath.chainIds, availableEvolutions]);

  return (
    <div className="min-h-screen bg-[#121212] py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="bg-[#1A1C1A] p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-800/80">
        


        <HeaderCard
          onChangePlayer={() => setIsPlayerSelectionOpen(true)}
          bio={playerBio}
          futbinLink={currentPlayer.futbinLink}
          avatarUrl={currentPlayer.avatarUrl}
          activeBaseOvr={activeBaseOvr}
          previewOvr={previewOvr}
          activePath={activePath}
          allPaths={allPaths}
          activePathId={activePathId}
          expandedPathIds={[activePathId]}
          comparePathId={currentState.comparePathId}
          onSetComparePathId={(id) => updateState({ comparePathId: id })}
          onSelectPath={(id) => {
            updateState({ activePathId: id });
          }}
          onOpenEvoPool={() => setIsEvoPoolOpen(true)}
          onOpenManualPath={() => { setPickerMode('append'); setIsManualPathOpen(true); }}
          onBranchFromBase={() => { setPickerMode('branch'); setIsManualPathOpen(true); }}
          originalIgs={originalIgs}
          originalFaceSum={originalFaceSum}
          evoFilters={evoFilters}
          onEvoFiltersChange={setEvoFilters}
          onAnalyze={() => {
            const results = analyzeEvolutions(effectiveEvosPool, 5, playerBio, initialOvrData, statsData, playStylesData, evoFilters, basePrefix);
            setGeneratedPaths(results);
            if (results.length > 0) {
              setActivePathId(results[0].id);
              if (!evoPreview) setEvoPreview(true);
            }
          }}
          evosPool={effectiveEvosPool}
          evoPreview={evoPreview}
          evoLocked={evoLocked}
          accelerateType={accelerateType}
          igs={igs}
          faceSum={faceSum}
          activeEvo={activeEvo}
          selectedNodes={safeNodes}
          onNodeClick={handleNodeClick}
          playStyles={previewPlayStyles}
          onDeletePath={handleDeletePath}
          onToggleFavoritePath={(path) => {
            if (path.chainIds.length === 0) return;
            const isManual = manualPaths.some(p => p.id === path.id);
            if (isManual) {
              // Already manual: just flip the flag in place.
              updateState({
                manualPaths: manualPaths.map(p => p.id === path.id ? { ...p, isFavorite: !p.isFavorite } : p)
              });
            } else {
              // Starring a generated path promotes it to manual so the next Analyze run
              // (which replaces generatedPaths wholesale) can't silently discard it.
              updateState({
                generatedPaths: generatedPaths.filter(p => p.id !== path.id),
                manualPaths: [...manualPaths, { ...path, isFavorite: true }]
              });
            }
          }}
          onClearPaths={handleClearPaths}
          onViewEvo={(id) => setViewingEvoId(id)}
          baseIndex={safeBaseIndex}
          onSetBase={(pathId, idx) => {
            if (activePathId !== pathId) {
               updateState({ activePathId: pathId });
            }
            setBaseIndex(idx === safeBaseIndex ? -1 : idx);
          }}
          onRemoveNode={handleRemoveNode}
        />

        {activeTab === 'workbench' && (
          <>

            <div className="flex items-center gap-4 mb-3 px-1">
              <span className="font-bold text-sm text-gray-300 bg-gray-900/60 px-2 py-1 rounded border border-gray-800">
                {accelerateType}
              </span>

              <div className="font-medium flex items-center font-mono text-[13px] text-gray-300 bg-gray-900/60 px-3 py-1 rounded border border-gray-800">
                <span>{faceSum.activeBase}/{igs.activeBase}</span>
                {previewOvr !== activeBaseOvr && (
                  <>
                    <span className="text-gray-600 text-[11px] mx-1.5">➜</span>
                    <span className="text-[#EBB626] font-bold">{faceSum.effective}/{igs.effective}</span>
                  </>
                )}
                {(faceSum.diff > 0 || igs.diff > 0) && (
                  <>
                    <span className="text-fcGreen text-[11px] mx-1.5">➜</span>
                    <span className="text-fcGreen font-bold">{faceSum.chem}/{igs.chem} <span className="pl-1 text-[11px]">(+{faceSum.diff}/+{igs.diff})</span></span>
                  </>
                )}
              </div>
            </div>

            <StatsGrid
              baseStats={activeBaseStats}
              previewStats={previewStats}
              activeChemBoosts={activeChemBoosts}
              activeEvo={activeEvo}
              aside={
                <ChemistryGrid
                  chemStyles={chemStyles}
                  previewStats={previewStats}
                  hoveredChem={hoveredChem}
                  lockedChem={lockedChem}
                  onHoverChem={setHoveredChem}
                  onLockChem={(name) => {
                    setLockedChem(lockedChem === name ? null : name);
                  }}
                />
              }
            />

            <PlayStylesSection roles={playerBio.roles} />
          </>
        )}

        {activeTab === 'evos' && (
          <EvolutionChainWorkbench
            bio={playerBio}
            ovr={initialOvrData}
            stats={statsData}
            playStyles={playStylesData}
            disabledEvos={disabledEvos}
            onToggleDisabled={toggleEvoDisabled}
          />
        )}

        <div className="flex justify-center mt-6 mb-2">
          {/* Tab Navigation */}
          <div className="flex bg-[#121212] p-1 rounded-lg border border-gray-800/80 text-sm">
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-1.5 rounded-md font-bold flex items-center gap-2 transition-all ${
                activeTab === 'workbench'
                  ? 'bg-[#1ED760] text-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2D2A]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Stats Workbench
            </button>
            <button
              onClick={() => setActiveTab('evos')}
              className={`px-4 py-1.5 rounded-md font-bold flex items-center gap-2 transition-all ${
                activeTab === 'evos'
                  ? 'bg-[#1ED760] text-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2D2A]'
              }`}
            >
              <Layers className="w-4 h-4" />
              EVO Chain Lab
            </button>
          </div>
        </div>

        <div className="my-6">
          <SquadPanel
            squads={squads}
            onCreateSquad={createSquad}
            onDeleteSquad={deleteSquad}
            onAddPlayerToSquad={addPlayerToSquad}
            onRemoveMember={removeSquadMember}
            onOpenMember={openSquadMember}
            currentPlayerState={currentState}
            currentPlayerId={selectedPlayerId}
            currentSnapshot={currentSnapshot}
          />
        </div>

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
        disabledEvos={disabledEvos}
      />
      <ManualPathModal
        isOpen={isManualPathOpen}
        onClose={() => setIsManualPathOpen(false)}
        evosPool={evosPool}
        // Append grows the active path in place (so it keeps its id and name); branch leaves
        // it alone and starts a fresh path from the base prefix.
        editingPath={pickerMode === 'append' ? activePath : null}
        lockedPrefix={pickerMode === 'branch' ? basePrefix : []}
        onSave={(path) => {
          const isManual = manualPaths.some(p => p.id === path.id);
          if (isManual) {
            setManualPaths(manualPaths.map(p => p.id === path.id ? path : p));
          } else {
            // Editing a path that came from Analyze (or creating a brand new one) makes it
            // user-owned: it must leave generatedPaths so the next Analyze run (which replaces
            // generatedPaths wholesale) can't silently discard the edit.
            updateState({
              generatedPaths: generatedPaths.filter(p => p.id !== path.id),
              manualPaths: [...manualPaths, path]
            });
          }
          setActivePathId(path.id);
          setIsManualPathOpen(false);
          setBaseIndex(path.chainIds.length - 1);
          if (!evoPreview) setEvoPreview(true);
        }}
        baseBio={playerBio}
        baseOvr={initialOvrData}
        baseStats={statsData}
        basePlayStyles={playStylesData}
      />
      <EvoDetailsModal 
        evoId={viewingEvoId} 
        onClose={() => setViewingEvoId(null)} 
      />

      {isPlayerSelectionOpen && (
        <PlayerSelectionModal
          players={allPlayersData}
          onClose={() => setIsPlayerSelectionOpen(false)}
          onSelectPlayer={(id) => {
            setSelectedPlayerId(id);
            setHoveredChem(null);
            setLockedChem(null);
            setEvoPreview(false);
            setSelectionQueue([-1, -1]);
            const ovrData = allPlayersData[id]?.ovr || playersDatabase['rodri-91'].ovr;
            setOvr(ovrData);
          }}
          onOpenImport={() => setIsImportModalOpen(true)}
          onDeletePlayer={handleDeletePlayer}
          onEditPlayerAvatar={handleEditPlayerAvatar}
        />
      )}

      {isImportModalOpen && (
        <ImportPlayerModal 
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportPlayer}
        />
      )}
    </div>
  );
}
