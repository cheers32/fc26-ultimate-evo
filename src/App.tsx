import { useState, useMemo, useEffect, useRef } from 'react';
import { playersDatabase } from './data/playersData';
import { chemStyles } from './data/chemStyles';
import { defaultEvolutionPaths, availableEvolutions } from './data/evolutionsData';
import { PlayerData, StatsData, PlayStylesData, EvolutionPath, EvoFilters, PlayerBio, OvrData } from './types/player';
import { HeaderCard } from './components/HeaderCard';
import { PlayerSubInfo } from './components/PlayerSubInfo';
import { StatsGrid } from './components/StatsGrid';
import { ChemistryGrid } from './components/ChemistryGrid';
import { PlayStylesSection } from './components/PlayStylesSection';
import { EvolutionChainWorkbench } from './components/EvolutionChainWorkbench';
import { calculateAccelerateType, parseHeightCm } from './utils/statUtils';
import {
  simulateEvoChain,
  isPlayStyleNodeId,
  buildPlayStyleNodeId,
  parsePlayStyleNodeId,
  canPickPlayStyles
} from './utils/evoEngine';
import { runEvoSearch, EvoSearchHandle } from './utils/runEvoSearch';
import { useLibrary, useTeam, readActiveTeamId, writeActiveTeamId } from './utils/teamStore';
import { TeamListPage } from './components/TeamListPage';
import { EvolutionDefinition } from './types/player';
import { PlayerSelectionModal } from './components/PlayerSelectionModal';
import { EvoPoolModal, EvoStatuses } from './components/EvoPoolModal';
import { ManualPathModal } from './components/ManualPathModal';
import { EvoDetailsModal } from './components/EvoDetailsModal';
import { PlayStylePickerModal } from './components/PlayStylePickerModal';
import { SquadPanel } from './components/SquadPanel';
import { SquadPitch } from './components/SquadPitch';
import { ImportPlayerModal } from './components/ImportPlayerModal';
import { Trophy, RefreshCw, LayoutGrid, Layers, Upload, Users } from 'lucide-react';
import { Squad, SquadMember, PlayerEvoState } from './types/player';

const DEFAULT_PATH_ID = 'default-path';
// Stable identity so the picker's "no picks yet" prop doesn't change on every render.
const EMPTY_PICKS = { gold: [], silver: [] };

/**
 * Saves written before PlayStyle picks became a step kept them in a `freePlayStyles` field on
 * the path, applied at the end of whatever the chain happened to be. Convert those to a node at
 * the end of the chain — the same place — the first time such a save is read.
 */
function migratePlayStylePicks(
  state: PlayerEvoState,
  bio: PlayerBio,
  ovr: OvrData,
  stats: StatsData,
  playStyles: PlayStylesData
): PlayerEvoState {
  const migratePath = (path: EvolutionPath): EvolutionPath => {
    if (!path.freePlayStyles) return path;
    const { freePlayStyles, ...rest } = path;
    const picks = { gold: freePlayStyles.gold || [], silver: freePlayStyles.silver || [] };

    if (picks.gold.length + picks.silver.length === 0) return rest;
    if (path.chainIds.some(isPlayStyleNodeId)) return rest;

    // The old field applied at the end of whatever the chain was, so that's where the node goes.
    const chainIds = [...path.chainIds, buildPlayStyleNodeId(picks)];
    return { ...rest, chainIds, steps: simulateEvoChain(chainIds, bio, ovr, stats, playStyles).steps };
  };

  if (![...(state.generatedPaths || []), ...(state.manualPaths || [])].some(p => p.freePlayStyles)) {
    return state;
  }
  return {
    ...state,
    generatedPaths: (state.generatedPaths || []).map(migratePath),
    manualPaths: (state.manualPaths || []).map(migratePath)
  };
}

export default function App() {
  // Which team's state the app is looking at. The team owns its EVO pool and its squads; the
  // player and EVO libraries below are global, so a card imported by anyone shows up for everyone.
  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => readActiveTeamId());
  const {
    team,
    loading: teamLoading,
    error: teamError,
    setEvoStatuses: setTeamEvoStatuses,
    saveSquad: persistSquad,
    deleteSquad: removeSquadFromTeam
  } = useTeam(activeTeamId);

  const openTeam = (teamId: string | null) => {
    writeActiveTeamId(teamId);
    setActiveTeamId(teamId);
  };

  const [deletedDatabasePlayers, setDeletedDatabasePlayers] = useLibrary<string[]>('deletedPlayers', []);

  const [storedCustomPlayers, setCustomPlayers] = useLibrary<Record<string, PlayerData>>('customPlayers', {});
  // Repair custom players that were saved without a full stat block, whatever they came from —
  // the shared copy arrives after mount, so this can't be a one-off at initialisation.
  const customPlayers = useMemo(() => {
    Object.values(storedCustomPlayers || {}).forEach((p: any) => {
      if (p && p.stats) {
        ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(f => {
          if (!p.stats[f]) {
            p.stats[f] = { label: f.toUpperCase(), baseFace: 50, evFace: 50, subs: {} };
          }
        });
      }
    });
    return storedCustomPlayers || {};
  }, [storedCustomPlayers]);

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

      if ((e.key === 'a' || e.key === 'A') && !isPlayerSelectionOpen && !isManualPathOpen) {
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
    setActiveMemberId(null);
    setSelectedPlayerId(player.id);
  };

  const handleDeletePlayer = (id: string) => {
    if (id.startsWith('custom-') || customPlayers[id]) {
      const newCustomPlayers = { ...customPlayers };
      delete newCustomPlayers[id];
      setCustomPlayers(newCustomPlayers);
    } else {
      const newDeleted = [...deletedDatabasePlayers, id];
      setDeletedDatabasePlayers(newDeleted);
    }
    
    if (selectedPlayerId === id) {
      // Find another available player to select
      const availableIds = Object.keys(allPlayersData).filter(pId => pId !== id);
      setActiveMemberId(null);
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
    }
  };

  // Which evos this team can use. It belongs to the team, not to the player and not to the app:
  // the same card is spent for one account and untouched for another, so two teams looking at the
  // same evo can legitimately disagree about whether it is available.
  const evoStatuses: EvoStatuses = useMemo(() => team?.evoStatuses || {}, [team?.evoStatuses]);

  const disabledEvos = useMemo(
    () => Object.entries(evoStatuses).filter(([, s]) => s === 'disabled').map(([id]) => id),
    [evoStatuses]
  );
  const evosPool = useMemo(
    () => Object.entries(evoStatuses).filter(([, s]) => s === 'included' || s === 'required').map(([id]) => id),
    [evoStatuses]
  );
  const requiredEvos = useMemo(
    () => Object.entries(evoStatuses).filter(([, s]) => s === 'required').map(([id]) => id),
    [evoStatuses]
  );

  // Evos that ship switched off are folded into a team's statuses once, when it is first opened.
  const seededTeams = useRef(new Set<string>());
  useEffect(() => {
    if (!team || seededTeams.current.has(team.id)) return;
    seededTeams.current.add(team.id);
    const pending = Object.values(availableEvolutions)
      .filter(evo => evo.defaultDisabled && !evoStatuses[evo.id])
      .map(evo => evo.id);
    if (pending.length === 0) return;
    const next: EvoStatuses = { ...evoStatuses };
    pending.forEach(id => { next[id] = 'disabled'; });
    setTeamEvoStatuses(next);
  }, [team, evoStatuses, setTeamEvoStatuses]);

  const toggleEvoDisabled = (evoId: string) => {
    const next: EvoStatuses = { ...evoStatuses };
    if (next[evoId] === 'disabled') delete next[evoId];
    else next[evoId] = 'disabled';
    setTeamEvoStatuses(next);
  };

  // Squads belong to the team, and they are the only place a finished build lives: a path that
  // isn't in a squad is a draft, and drafts don't survive leaving the page.
  const squads = useMemo(
    () => (team?.squads || []).map(squad => ({
      ...squad,
      // Members predating per-entry ids need one before they can be removed individually.
      members: (squad.members || []).map((m, i) => (m.id ? m : { ...m, id: `${m.playerId}-${i}` }))
    })),
    [team?.squads]
  );

  /** Every squad write goes through here so one changed squad is one request. */
  const saveSquads = (next: Squad[]) => {
    const before = new Map(squads.map(s => [s.id, JSON.stringify(s)]));
    next.forEach(squad => {
      if (before.get(squad.id) !== JSON.stringify(squad)) persistSquad(squad);
    });
    const kept = new Set(next.map(s => s.id));
    squads.filter(s => !kept.has(s.id)).forEach(s => removeSquadFromTeam(s.id));
  };

  const createSquad = (name: string): string => {
    const newSquad: Squad = {
      id: Date.now().toString(),
      name,
      members: [],
      createdAt: Date.now()
    };
    saveSquads([...squads, newSquad]);
    return newSquad.id;
  };

  const deleteSquad = (squadId: string) => {
    saveSquads(squads.filter(s => s.id !== squadId));
  };

  /**
   * `steps` is 98% of a saved build by size and every byte of it is derivable from `chainIds`,
   * so it never goes to the server — it is recomputed when the build is opened again.
   */
  const withoutSteps = <T,>(value: T): T => {
    if (Array.isArray(value)) return value.map(withoutSteps) as T;
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .filter(([key]) => key !== 'steps')
          .map(([key, v]) => [key, withoutSteps(v)])
      ) as T;
    }
    return value;
  };

  const addPlayerToSquad = (squadId: string, playerId: string, rawState: PlayerEvoState, rawSnapshot: SquadMember['snapshot']): string | null => {
    const playerState = withoutSteps(rawState);
    const snapshot = withoutSteps(rawSnapshot);
    let newMemberId: string | null = null;
    const updatedSquads = squads.map(squad => {
      if (squad.id === squadId) {
        const member: SquadMember = {
          id: `${playerId}-${Date.now()}`,
          playerId,
          playerState,
          snapshot
        };
        newMemberId = member.id;
        return { ...squad, members: [...squad.members, member] };
      }
      return squad;
    });
    saveSquads(updatedSquads);
    return newMemberId;
  };

  const updatePlayerInSquad = (squadId: string, memberId: string, rawState: PlayerEvoState, rawSnapshot: SquadMember['snapshot']) => {
    const playerState = withoutSteps(rawState);
    const snapshot = withoutSteps(rawSnapshot);
    const updatedSquads = squads.map(squad => {
      if (squad.id === squadId) {
        const existingIndex = squad.members.findIndex(m => m.id === memberId);
        if (existingIndex >= 0) {
          const newMembers = [...squad.members];
          newMembers[existingIndex] = { ...newMembers[existingIndex], playerState, snapshot };
          return { ...squad, members: newMembers };
        }
      }
      return squad;
    });
    saveSquads(updatedSquads);
  };

  /** Puts a build in a slot, or clears one. A member can only stand in one place at a time. */
  const assignSquadSlot = (squadId: string, slotId: string, memberId: string | null) => {
    saveSquads(
      squads.map(squad => {
        if (squad.id !== squadId) return squad;
        const slots = { ...(squad.slots || {}) };
        Object.keys(slots).forEach(key => {
          if (memberId && slots[key] === memberId) delete slots[key];
        });
        if (memberId) slots[slotId] = memberId;
        else delete slots[slotId];
        return { ...squad, slots };
      })
    );
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
      
      // Paths are drafts until they are put in a squad — that is what makes a build real — so
      // nothing here is persisted. Leaving the page is meant to clear the workbench.
      return {
        ...prev,
        [selectedPlayerId]: { ...current, ...updates }
      };
    });
  };

  // Set when opening a squad member, so the effect below restores that snapshot
  // instead of the player's own save.
  const [pendingRestore, setPendingRestore] = useState<{ playerId: string; state: PlayerEvoState } | null>(null);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const openSquadMember = (member: SquadMember) => {
    setPendingRestore({ playerId: member.playerId, state: member.playerState });
    setActiveMemberId(member.id);
    setSelectedPlayerId(member.playerId);
    setEvoPreview(true);
    setActiveTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load persistence data when player changes
  useEffect(() => {
    if (pendingRestore && pendingRestore.playerId === selectedPlayerId) {
      // Opening a squad member loads that build into the workbench, which is the only way a
      // saved build comes back — there is no per-player save behind it any more.
      const withSteps = (paths: EvolutionPath[] = []) =>
        paths.map(path =>
          path.steps
            ? path
            : {
                ...path,
                steps: simulateEvoChain(path.chainIds, playerBio, initialOvrData, statsData, playStylesData).steps
              }
        );
      const restored = migratePlayStylePicks(
        pendingRestore.state,
        playerBio,
        initialOvrData,
        statsData,
        playStylesData
      );
      setPlayerStates(prev => ({
        ...prev,
        [selectedPlayerId]: {
          ...restored,
          generatedPaths: withSteps(restored.generatedPaths),
          manualPaths: withSteps(restored.manualPaths)
        }
      }));
      setPendingRestore(null);
    }
  }, [selectedPlayerId, pendingRestore, playerBio, initialOvrData, statsData, playStylesData]);

  const activePathId = currentState.activePathId;
  // Disabling filters at point of use rather than rewriting the team's pool,
  // so re-enabling an evo restores it wherever it was already selected.
  const effectiveEvosPool = useMemo(
    () => evosPool.filter(id => !disabledEvos.includes(id)),
    [evosPool, disabledEvos]
  );
  const generatedPaths = currentState.generatedPaths;
  const manualPaths = currentState.manualPaths;
  // The must-haves come from the team's pool, not from this player's filters — "required" is a
  // statement about the team's cards, and it has to mean the same thing on every player screen.
  const evoFilters = useMemo(
    () => ({ ...currentState.evoFilters, requiredEvos }),
    [currentState.evoFilters, requiredEvos]
  );

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
  // Which PlayStyle node the picker is editing: an index in the chain, 'new' to add one at the
  // end, or null when it's closed.
  const [playStylePickerTarget, setPlayStylePickerTarget] = useState<number | 'new' | null>(null);
  // 'append' grows the active path in place; 'branch' spins a new path off the chosen base.
  const [viewingEvoId, setViewingEvoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workbench' | 'card' | 'evos'>('workbench');
  // Which squad the pitch is showing. Defaults to the team's first, which is the one every team
  // is created with.
  const [activeSquadId, setActiveSquadId] = useState<string | null>(null);

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
      const firstEvoId = (p: EvolutionPath) => p.chainIds.find(id => !isPlayStyleNodeId(id));
      const aReq = availableEvolutions[firstEvoId(a) || '']?.requirements?.maxOvr || 0;
      const bReq = availableEvolutions[firstEvoId(b) || '']?.requirements?.maxOvr || 0;
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

  // Writes a PlayStyle pick into the chain. `target` is the index of the node being edited, or
  // 'new' to add one at the end of the chain — where the pick is actually being made. A chain can
  // hold several, since a build can reach a point where PlayStyles are assignable more than once.
  // Saving an empty pick removes that node.
  const handleSetPlayStyleNode = (
    pathId: string,
    picks: { gold: string[]; silver: string[] },
    target: number | 'new'
  ) => {
    const path = allPaths.find(p => p.id === pathId);
    if (!path) return;

    const newChainIds = [...path.chainIds];
    const isEmpty = picks.gold.length === 0 && picks.silver.length === 0;
    let insertedAt: number | null = null;
    let removedAt: number | null = null;

    if (target === 'new') {
      if (isEmpty) return;
      insertedAt = newChainIds.length;
      newChainIds.push(buildPlayStyleNodeId(picks));
    } else if (isEmpty) {
      removedAt = target;
      newChainIds.splice(target, 1);
    } else {
      newChainIds[target] = buildPlayStyleNodeId(picks);
    }

    const steps = simulateEvoChain(newChainIds, playerBio, initialOvrData, statsData, playStylesData).steps;
    const updated: EvolutionPath = { ...path, chainIds: newChainIds, steps };

    // Adding or dropping a step shifts everything after it, so the base has to follow.
    let nextBase = currentState.baseIndex ?? -1;
    if (removedAt !== null && removedAt <= nextBase) nextBase -= 1;
    if (insertedAt !== null && insertedAt <= nextBase) nextBase += 1;

    // The path may live in generatedPaths, in manualPaths, or in neither — the "Default" path is
    // synthesised on the fly and only joins manualPaths once something is added to it. Editing an
    // Analyze result makes it user-owned either way, so the next Analyze run (which replaces
    // generatedPaths wholesale) can't discard the edit.
    const isManual = currentState.manualPaths.some(p => p.id === path.id);
    updateState({
      baseIndex: nextBase,
      generatedPaths: currentState.generatedPaths.filter(p => p.id !== path.id),
      manualPaths: isManual
        ? currentState.manualPaths.map(p => (p.id === path.id ? updated : p))
        : [...currentState.manualPaths, updated]
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

  // A new pick is made at the end of the chain, so that's the card state it has to be legal for.
  const canAddPlayStylePick = canPickPlayStyles(chainResult.finalBio.rarity);

  // What the card looks like just before the pick lands: everything up to that point is locked,
  // and the picks go on top of it. For a new pick that's the end of the chain; for an existing
  // node it's the step before it.
  const playStylesBeforePick = (target: number | 'new') => {
    if (target === 'new') return chainResult.finalPlayStyles;
    if (target === 0) return playStylesData;
    return chainResult.steps[target - 1]?.playStylesAfter || playStylesData;
  };
  const rarityAtPick = (target: number | 'new') => {
    if (target === 'new') return chainResult.finalBio.rarity;
    if (target === 0) return playerBio.rarity;
    return chainResult.steps[target - 1]?.bioAfter.rarity || playerBio.rarity;
  };

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
  // The path search runs in a worker; these drive the button's busy state and let the user
  // abandon a run that is taking too long.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const analyzeHandle = useRef<EvoSearchHandle | null>(null);

  const cancelAnalyze = () => {
    analyzeHandle.current?.cancel();
    analyzeHandle.current = null;
    setIsAnalyzing(false);
    setAnalyzeProgress(0);
  };

  const runAnalyze = () => {
    analyzeHandle.current?.cancel();
    setIsAnalyzing(true);
    setAnalyzeProgress(0);

    const handle = runEvoSearch(
      {
        poolIds: effectiveEvosPool,
        maxDepth: 5,
        bio: playerBio,
        ovr: initialOvrData,
        stats: statsData,
        playStyles: playStylesData,
        filters: evoFilters,
        prefixChainIds: basePrefix
      },
      nodes => setAnalyzeProgress(nodes)
    );
    analyzeHandle.current = handle;

    handle.promise
      .then(results => {
        if (analyzeHandle.current !== handle) return; // superseded by a newer run
        analyzeHandle.current = null;
        setIsAnalyzing(false);
        setGeneratedPaths(results);
        if (results.length > 0) {
          setActivePathId(results[0].id);
          if (!evoPreview) setEvoPreview(true);
        }
      })
      .catch(err => {
        if (err?.name === 'AbortError') return; // cancelAnalyze already reset the state
        if (analyzeHandle.current !== handle) return;
        analyzeHandle.current = null;
        setIsAnalyzing(false);
        console.error('Evolution search failed:', err);
      });
  };

  // Abandon an in-flight search when the player changes, so its result can't land on someone else.
  useEffect(() => {
    return () => analyzeHandle.current?.cancel();
  }, [selectedPlayerId]);

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

  const { activeBaseStats, previewStats, activeBaseOvr, previewOvr, activePlayStyles, previewPlayStyles, previewBio } = useMemo(() => {
    let aBaseStats = statsData;
    let aBaseOvr = initialOvrData.base;
    let aPlayStyles = JSON.parse(JSON.stringify(playStylesData));
    aPlayStyles.ev = { gold: [], silver: [] };
    let aBaseBio = playerBio;

    // 1. Determine Base
    if (baseNode === -1) {
      aBaseStats = statsData;
      aBaseOvr = initialOvrData.base;
      aPlayStyles.base = JSON.parse(JSON.stringify(playStylesData.base));
      aBaseBio = playerBio;
    } else {
      const bStep = chainResult.steps[baseNode];
      if (bStep) {
        aBaseStats = bStep.statsAfter;
        aBaseOvr = bStep.ovrAfter;
        aPlayStyles.base = JSON.parse(JSON.stringify(bStep.playStylesAfter.base));
        aBaseBio = bStep.bioAfter;
      }
    }

    let pStats = aBaseStats;
    let pOvr = aBaseOvr;
    let pPlayStyles = JSON.parse(JSON.stringify(aPlayStyles));
    let pBio = aBaseBio;

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
        aBaseBio = baseFinalStep.bioAfter;
      } else {
        aBaseStats = statsData;
        aBaseOvr = initialOvrData.base;
        // No steps on the compare path, so its "final" is the raw card (plus any free picks).
        aPlayStyles.base = JSON.parse(JSON.stringify(compareChainResult.finalPlayStyles.base));
        aBaseBio = playerBio;
      }
      
      if (previewFinalStep) {
        pStats = previewFinalStep.statsAfter;
        pOvr = previewFinalStep.ovrAfter;
        pBio = previewFinalStep.bioAfter;
        
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
        pBio = playerBio;
      }
    } else if (evoPreview && previewNode >= baseNode) {
      if (previewNode === -1) {
        pStats = statsData;
        pOvr = initialOvrData.base;
        pBio = playerBio;
      } else {
        const pStep = chainResult.steps[previewNode];
        if (pStep) {
          pStats = pStep.statsAfter;
          pOvr = pStep.ovrAfter;
          pBio = pStep.bioAfter;
          
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
      previewPlayStyles: pPlayStyles,
      previewBio: pBio
    };
  }, [baseNode, previewNode, evoPreview, chainResult, compareChainResult, statsData, initialOvrData, playStylesData, playerBio]);

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

    const accType = calculateAccelerateType(accVal, agiVal, strVal, parseHeightCm(playerBio.height));

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
    setActiveMemberId(null);
  };

  const currentOvrVal = previewOvr;

  const activeEvo: EvolutionDefinition | null = useMemo(() => {
    if (previewNode < 0 || baseNode >= previewNode) return null;

    if (previewNode - baseNode === 1) {
      // A PlayStyle node has no boosts to chip against — there's no evo behind it.
      return availableEvolutions[activePath.chainIds[previewNode]] || null;
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


  const excludedCount = useMemo(() => {
    const totalCount = Object.keys(availableEvolutions).length;
    const activeCount = totalCount - disabledEvos.length;
    return activeCount - effectiveEvosPool.length;
  }, [disabledEvos.length, effectiveEvosPool.length]);

  const extraCount = useMemo(() => {
    return evosPool.filter(id => disabledEvos.includes(id)).length;
  }, [evosPool, disabledEvos]);

  const handleAddToCurrentSquad = () => {
    let targetSquadId = activeSquadId;
    if (!targetSquadId && squads.length > 0) targetSquadId = squads[0].id;
    if (!targetSquadId) return alert('No squad available. Create one first.');
    const newId = addPlayerToSquad(targetSquadId, selectedPlayerId, currentState, currentSnapshot);
    if (newId) setActiveMemberId(newId);
  };

  const handleUpdateCurrentSquad = () => {
    if (!activeMemberId) return;
    let targetSquadId = activeSquadId;
    if (!targetSquadId && squads.length > 0) targetSquadId = squads[0].id;
    if (targetSquadId) {
      updatePlayerInSquad(targetSquadId, activeMemberId, currentState, currentSnapshot);
    }
  };

  const handleCreateNewSquadAndAdd = () => {
    const name = window.prompt('Enter new squad name:', 'New Squad');
    if (!name) return;
    
    const newSquadId = Date.now().toString();
    const newMemberId = `${selectedPlayerId}-${Date.now()}`;
    const newSquad: Squad = {
      id: newSquadId,
      name,
      formation: '4-3-3', // Default formation
      members: [{
        id: newMemberId,
        playerId: selectedPlayerId,
        playerState: withoutSteps(currentState),
        snapshot: withoutSteps(currentSnapshot)
      }],
      slots: {},
      createdAt: Date.now()
    };
    
    saveSquads([...squads, newSquad]);
    setActiveSquadId(newSquadId);
    setActiveMemberId(newMemberId);
  };

  // The team list is the way in: without one there is no pool and no squads to show.
  if (!activeTeamId || (!team && !teamLoading)) {
    return <TeamListPage onOpenTeam={openTeam} activeTeamId={activeTeamId} />;
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-sm text-gray-600 animate-pulse">
        Loading team…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-1 pb-2 px-2 sm:px-4 flex justify-center items-start">
      <div className="bg-[#1A1C1A] p-2.5 sm:p-4 rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-800/80">
        {teamError && <div className="text-red-400 text-xs mb-1">{teamError}</div>}
        
        <HeaderCard
          teamName={team.name}
          onOpenTeamList={() => openTeam(null)}
          onChangePlayer={() => setIsPlayerSelectionOpen(true)}
          bio={previewBio}
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
          canPickFreePlayStyles={canAddPlayStylePick}
          onOpenPlayStylePicker={(target) => setPlayStylePickerTarget(target)}
          rawBaseOvr={initialOvrData.base}
          rawPlayStyles={playStylesData}
          rawStats={statsData}
          rawRarity={playerBio.rarity}
          rawPositions={playerBio.primaryPositions}
          originalIgs={originalIgs}
          originalFaceSum={originalFaceSum}
          evoFilters={evoFilters}
          excludedCount={excludedCount}
          extraCount={extraCount}
          onEvoFiltersChange={setEvoFilters}
          onAnalyze={runAnalyze}
          isAnalyzing={isAnalyzing}
          analyzeProgress={analyzeProgress}
          onCancelAnalyze={cancelAnalyze}
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

            <div className="flex flex-wrap items-center gap-3 mb-2 px-1">
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

              <PlayerSubInfo bio={previewBio} playStyles={previewPlayStyles} isEvo={activePath.chainIds.length > 0} />
            </div>

            <StatsGrid
              baseStats={activeBaseStats}
              previewStats={previewStats}
              activeChemBoosts={activeChemBoosts}
              activeEvo={activeEvo}
              aside={
                <SquadPitch
                  squads={squads}
                  activeSquadId={activeSquadId}
                  onSelectSquad={setActiveSquadId}
                  onOpenMember={openSquadMember}
                  onRemoveMember={removeSquadMember}
                  onAssignSlot={assignSquadSlot}
                  playersById={allPlayersData}
                >
                  <ChemistryGrid
                    chemStyles={chemStyles}
                    previewStats={previewStats}
                    hoveredChem={hoveredChem}
                    lockedChem={lockedChem}
                    heightCm={parseHeightCm(playerBio.height)}
                    onHoverChem={setHoveredChem}
                    onLockChem={(name) => {
                      setLockedChem(lockedChem === name ? null : name);
                    }}
                  />
                </SquadPitch>
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

        <div className="mt-8 mb-4 border-b border-gray-800/80 pb-2 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-1.5 rounded-md font-bold flex items-center gap-2 transition-all ${
                activeTab === 'workbench'
                  ? 'bg-blue-600 text-white shadow'
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
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2D2A]'
              }`}
            >
              <Layers className="w-4 h-4" />
              EVO Chain Lab
            </button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAddToCurrentSquad}
              className="px-3 py-1.5 bg-green-950/40 hover:bg-green-900/60 border border-green-700/60 rounded-md text-green-400 text-xs font-bold transition-colors"
            >
              Add to Current Squad
            </button>
            <button
              onClick={handleUpdateCurrentSquad}
              disabled={!activeMemberId}
              title={!activeMemberId ? 'Open a build from the squad first to update it' : 'Update the opened build in the squad'}
              className="px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed bg-blue-950/40 hover:bg-blue-900/60 border border-blue-700/60 rounded-md text-blue-400 text-xs font-bold transition-colors"
            >
              Update Current Squad
            </button>
            <button
              onClick={handleCreateNewSquadAndAdd}
              className="px-3 py-1.5 bg-[#1f2937] hover:bg-[#374151] border border-gray-600 rounded-md text-gray-300 text-xs font-bold transition-colors"
            >
              Create New Squad & Add
            </button>
          </div>
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
        evoStatuses={evoStatuses}
        setEvoStatuses={setTeamEvoStatuses}
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
          setBaseIndex(path.chainIds.length - 1);
          if (!evoPreview) setEvoPreview(true);
        }}
        baseBio={playerBio}
        baseOvr={initialOvrData}
        baseStats={statsData}
        basePlayStyles={playStylesData}
        evoFilters={evoFilters}
      />
      <EvoDetailsModal
        evoId={viewingEvoId}
        onClose={() => setViewingEvoId(null)}
      />
      <PlayStylePickerModal
        isOpen={playStylePickerTarget !== null}
        onClose={() => setPlayStylePickerTarget(null)}
        rarity={rarityAtPick(playStylePickerTarget ?? 'new')}
        lockedGold={playStylesBeforePick(playStylePickerTarget ?? 'new').base.gold}
        lockedSilver={playStylesBeforePick(playStylePickerTarget ?? 'new').base.silver}
        limits={playStylesBeforePick(playStylePickerTarget ?? 'new').limits}
        picks={typeof playStylePickerTarget === 'number'
          ? parsePlayStyleNodeId(activePath.chainIds[playStylePickerTarget])
          : EMPTY_PICKS}
        onSave={(picks) => handleSetPlayStyleNode(activePath.id, picks, playStylePickerTarget ?? 'new')}
      />

      {isPlayerSelectionOpen && (
        <PlayerSelectionModal
          players={allPlayersData}
          onClose={() => setIsPlayerSelectionOpen(false)}
          onSelectPlayer={(id) => {
            setActiveMemberId(null);
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
