import { useState, useMemo, useEffect, useRef } from 'react';
import { playersDatabase } from './data/playersData';
import { chemStyles } from './data/chemStyles';
import { defaultEvolutionPaths, availableEvolutions } from './data/evolutionsData';
import { PlayerData, StatsData, PlayStylesData, EvolutionPath, EvoFilters, PlayerBio, OvrData, PathFeedback } from './types/player';
import { feedbackForPlayer, feedbackKeyOf, flattenSubs, makeFeedback, templateIdFromDescription } from './utils/feedback';
import { BUILD_TEMPLATES } from './data/buildTemplates';
import { HeaderCard } from './components/HeaderCard';
import { PlayerSubInfo } from './components/PlayerSubInfo';
import { CardVerdict } from './components/CardVerdict';
import { StatsGrid } from './components/StatsGrid';
import { ChemistryGrid } from './components/ChemistryGrid';
import { EvolutionChainWorkbench } from './components/EvolutionChainWorkbench';
import { EvoLabModal } from './components/EvoLabModal';
import { calculateAccelerateType, calculateAccelerateFamily, parseHeightCm, accelerateLean, STAR_TIER_COUNT } from './utils/statUtils';
import { isModalOpen } from './utils/modalStack';
import { bestScore, scoreAtPosition } from './utils/positionScore';
import { playStyleScoreAt } from './utils/playStyleScore';
import {
  BASE_CARD_PATH_ID,
  DEFAULT_PATH_ID,
  IN_GAME_PATH_NAME,
  IN_GAME_STAR_TIER,
  isBaseCardPath,
  isInGamePath
} from './utils/paths';
import {
  simulateEvoChain,
  isPlayStyleNodeId,
  buildPlayStyleNodeId,
  parsePlayStyleNodeId,
  canPickPlayStyles
} from './utils/evoEngine';
import { runEvoSearch, EvoSearchHandle } from './utils/runEvoSearch';
import { buildShareUrl, clearShareParam, parseShareUrl, SharedBuild } from './utils/shareLink';
import { appUrlFor, currentUrl, readAppUrl } from './utils/appUrl';
import { ImportBuildModal } from './components/ImportBuildModal';
import {
  useLibrary,
  useTeam,
  purgePlayerFromOtherTeams,
  readActiveTeamId,
  writeActiveTeamId,
  readActivePlayerId,
  writeActivePlayerId
} from './utils/teamStore';
import { TeamListPage } from './components/TeamListPage';
import { EvolutionDefinition } from './types/player';
import { PlayerSelectionModal } from './components/PlayerSelectionModal';
import { EvoPoolModal, EvoStatuses } from './components/EvoPoolModal';
import { ManualPathModal } from './components/ManualPathModal';
import { EvoDetailsModal } from './components/EvoDetailsModal';
import { PlayStylePickerModal } from './components/PlayStylePickerModal';
import { SquadPitch, ALL_SLOT_IDS, formationOf } from './components/SquadPitch';
import { ImportPlayerModal } from './components/ImportPlayerModal';
import { Trophy, Layers } from 'lucide-react';
import { Squad, SquadSlot, PlayerEvoState } from './types/player';

/** The build a `?path=` link opens into. Fixed, so following the same link twice doesn't stack. */
const SHARED_PATH_ID = 'shared-path';

/** A player nobody has touched yet. A factory, so no two players share a mutable filters object. */
const emptyPlayerState = (): PlayerEvoState => ({
  activePathId: DEFAULT_PATH_ID,
  expandedPathIds: [DEFAULT_PATH_ID],
  comparePathId: null,
  evosPool: [],
  generatedPaths: [],
  manualPaths: [],
  evoFilters: { ovr: { max: 99 } }
});
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

/** Settings that belong to the person rather than to a card or a team. */
interface Preferences {
  assumeChemStyle?: boolean;
}

export default function App() {
  // Which team's state the app is looking at. The team owns its EVO pool and its squads; the
  // player and EVO libraries below are global, so a card imported by anyone shows up for everyone.
  // The address wins over the remembered team: a link someone sent, or a Back press, is a
  // statement about which team to open, and the last one this browser used is only a fallback.
  const [activeTeamId, setActiveTeamId] = useState<string | null>(
    () => readAppUrl().teamId ?? readActiveTeamId()
  );
  const {
    team,
    loading: teamLoading,
    error: teamError,
    setEvoStatuses: setTeamEvoStatuses,
    setHiddenPlayers,
    setSavedPathsForPlayer,
    addSavedPaths,
    saveSquad: persistSquad,
    deleteSquad: removeSquadFromTeam
  } = useTeam(activeTeamId);

  const openTeam = (teamId: string | null) => {
    writeActiveTeamId(teamId);
    setActiveTeamId(teamId);
  };

  const [deletedDatabasePlayers, setDeletedDatabasePlayers] = useLibrary<string[]>('deletedPlayers', []);

  /**
   * Whether every score in the app is read with the best legal chemistry style on.
   *
   * One setting for everything rather than one per card, and stored with the library rather than
   * with a player: which style you would actually put on a card is a matter of taste, and a number
   * that assumed one here and not on the next card is not comparable with itself. Off by default —
   * what comes back is the card as it is until you say otherwise.
   */
  const [preferences, setPreferences] = useLibrary<Preferences>('preferences', {});
  const assumeChemStyle = preferences.assumeChemStyle === true;
  const setAssumeChemStyle = (on: boolean) => setPreferences({ ...preferences, assumeChemStyle: on });

  // Your verdicts on recommended builds. Global rather than per team: this is taste, and it does
  // not change because you switched squads.
  const [pathFeedback, setPathFeedback] = useLibrary<Record<string, PathFeedback>>('pathFeedback', {});

  const [storedCustomPlayers, setCustomPlayers, customPlayersLoaded] =
    useLibrary<Record<string, PlayerData>>('customPlayers', {});
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

      // A shortcut that opens a modal has no business firing while one is already open — it used
      // to check only for the two it opens itself, so 'a' inside the evo pool or a details modal
      // opened the builder underneath them.
      if (isModalOpen()) return;

      if (e.key === '/' || e.code === 'Slash') {
        e.preventDefault();
        setIsPlayerSelectionOpen(true);
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPickerMode('append');
        setIsManualPathOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImportPlayer = (player: PlayerData) => {
    const newCustomPlayers = { ...customPlayers, [player.id]: player };
    setCustomPlayers(newCustomPlayers);
    setSelectedPlayerId(player.id);
  };

  /** Move off a card that is about to stop being available here. */
  const leaveCard = (id: string) => {
    if (selectedPlayerId !== id) return;
    const availableIds = Object.keys(allPlayersData).filter(pId => pId !== id);
    setSelectedPlayerId(availableIds.length > 0 ? availableIds[0] : 'rodri-91');
  };

  /**
   * "I'm not using this card." A statement about this team, like a disabled evo — the card stays in
   * the shared library for everyone else, and this team's builds for it are left alone, so the only
   * thing undoing it costs is putting the card back on the pitch.
   */
  const hidePlayerForTeam = (id: string) => {
    if (hiddenPlayers.includes(id)) return;
    setHiddenPlayers([...hiddenPlayers, id]);
    leaveCard(id);
  };

  const unhidePlayerForTeam = (id: string) => {
    setHiddenPlayers(hiddenPlayers.filter(pId => pId !== id));
  };

  /**
   * The card leaves the shared library — for a bad import or a duplicate, not for "I'm done with
   * it". Every team loses it, so every team's builds and squad slots for it have to go too: they
   * name a card that no longer exists, and nothing can open them again.
   */
  const deletePlayerFromLibrary = (id: string) => {
    if (id.startsWith('custom-') || customPlayers[id]) {
      const newCustomPlayers = { ...customPlayers };
      delete newCustomPlayers[id];
      setCustomPlayers(newCustomPlayers);
    } else {
      setDeletedDatabasePlayers([...deletedDatabasePlayers, id]);
    }

    // This team goes through the hook that owns it; the rest are patched directly, since nothing
    // on screen is showing them.
    setSavedPathsForPlayer(id, []);
    if (hiddenPlayers.includes(id)) setHiddenPlayers(hiddenPlayers.filter(pId => pId !== id));
    saveSquads(
      squads.map(squad => {
        const slots = Object.fromEntries(
          Object.entries(squad.slots).filter(([, entry]) => entry.playerId !== id)
        );
        return { ...squad, slots };
      })
    );
    purgePlayerFromOtherTeams(id, activeTeamId).catch(err =>
      console.error('Failed to clear the deleted card from the other teams:', err)
    );

    leaveCard(id);
  };

  const handleEditPlayerAvatar = (id: string, newUrl: string, newName: string, newFutbinUrl: string, newPositions: string, goldPs: string[], silverPs: string[], newOvr?: number) => {
    // If it's a built-in player, we create an override in customPlayers
    const targetPlayer = customPlayers[id] || playersDatabase[id];
    if (targetPlayer) {
      const updatedPlayer = {
        ...targetPlayer,
        avatarUrl: newUrl || targetPlayer.avatarUrl,
        futbinLink: newFutbinUrl || targetPlayer.futbinLink,
        // The OVR the card carries, and with it which evos will have it: an import that read the
        // rating wrong is otherwise unusable, since every evo gates on it.
        ovr: { ...targetPlayer.ovr, base: newOvr ?? targetPlayer.ovr.base },
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
  /** The whole shared catalogue, before this team's own opinion of it. */
  const libraryPlayers = useMemo(() => {
    const combined = { ...playersDatabase, ...customPlayers };
    deletedDatabasePlayers.forEach(id => delete combined[id]);
    return combined;
  }, [customPlayers, deletedDatabasePlayers]);

  const hiddenPlayers = useMemo(() => team?.hiddenPlayers || [], [team?.hiddenPlayers]);

  /** The cards this team actually uses — everything the app works from. */
  const allPlayersData = useMemo(() => {
    const visible = { ...libraryPlayers };
    hiddenPlayers.forEach(id => delete visible[id]);
    return visible;
  }, [libraryPlayers, hiddenPlayers]);

  /**
   * A squad is its pitch and nothing else: eleven on it, twelve beside it, twenty-three slots each
   * naming a player and one of that player's builds. It is a set of shortcuts — the builds
   * themselves belong to the players, in `savedPaths`.
   *
   * Anything that isn't a slot in this shape is dropped on read: a slot id the formation doesn't
   * have, and a slot naming a player who has since been deleted. Both are empty slots.
   */
  const squads = useMemo(
    () => (team?.squads || []).map(squad => {
      const slots: Record<string, SquadSlot> = {};
      Object.entries(squad.slots || {}).forEach(([slotId, entry]) => {
        if (!ALL_SLOT_IDS.includes(slotId)) return;
        if (!entry || typeof entry !== 'object' || !allPlayersData[entry.playerId]) return;
        slots[slotId] = { playerId: entry.playerId, chainIds: entry.chainIds || [] };
      });
      return { id: squad.id, name: squad.name, createdAt: squad.createdAt, formation: squad.formation, slots };
    }),
    [team?.squads, allPlayersData]
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
    const newSquad: Squad = { id: Date.now().toString(), name, slots: {}, createdAt: Date.now() };
    saveSquads([...squads, newSquad]);
    return newSquad.id;
  };

  /** The shape a squad is drawn and judged in. The slots keep whoever stands in them. */
  const setSquadFormation = (squadId: string, formationId: string) => {
    saveSquads(squads.map(s => (s.id === squadId ? { ...s, formation: formationId } : s)));
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

  /** Two slots trade occupants. Either may be empty, which makes this "move" as well as "swap". */
  const swapSquadSlots = (squadId: string, fromSlotId: string, toSlotId: string) => {
    saveSquads(
      squads.map(squad => {
        if (squad.id !== squadId) return squad;
        const slots = { ...(squad.slots || {}) };
        const from = slots[fromSlotId];
        const to = slots[toSlotId];
        if (to) slots[fromSlotId] = to;
        else delete slots[fromSlotId];
        if (from) slots[toSlotId] = from;
        else delete slots[toSlotId];
        return { ...squad, slots };
      })
    );
  };

  /**
   * The pitch's one-click add: the build on screen goes into the slot that was clicked.
   *
   * It is starred on the way in. The slot only points at the build, so the build has to be one the
   * player actually keeps — otherwise the pointer would dangle the moment the page was left.
   */
  const addCurrentPlayerToSlot = (squadId: string | null, slotId: string) => {
    starActivePath();

    let target = squads.find(s => s.id === (squadId || activeSquadId)) || squads[0] || null;
    let next = squads;
    if (!target) {
      // Clicking a slot with no squad at all is still a clear instruction — make one and use it.
      target = { id: Date.now().toString(), name: 'Main Squad', slots: {}, createdAt: Date.now(), formation: undefined };
      next = [...squads, target];
      setActiveSquadId(target.id);
    }

    const entry: SquadSlot = { playerId: selectedPlayerId, chainIds: activePath.chainIds };
    const key = `${entry.playerId}|${entry.chainIds.join('>')}`;
    const slots = { ...target.slots };
    // One build stands in one place at a time, so leaving the old slot is part of arriving here.
    Object.keys(slots).forEach(id => {
      if (`${slots[id].playerId}|${slots[id].chainIds.join('>')}` === key) delete slots[id];
    });
    slots[slotId] = entry;

    const targetId = target.id;
    saveSquads(next.map(s => (s.id === targetId ? { ...s, slots } : s)));
  };

  /** Takes the card off the pitch. The build it pointed at stays saved on its player. */
  const clearSquadSlot = (squadId: string, slotId: string) => {
    saveSquads(
      squads.map(squad => {
        if (squad.id !== squadId) return squad;
        const slots = { ...squad.slots };
        delete slots[slotId];
        return { ...squad, slots };
      })
    );
  };

  // Opens on whichever card this browser was last working on.
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    () => readAppUrl().playerId || readActivePlayerId() || 'rodri-91'
  );

  useEffect(() => {
    writeActivePlayerId(selectedPlayerId);
  }, [selectedPlayerId]);

  // --- Back and Forward ----------------------------------------------------------------------
  //
  // The team and the card are what make one screen a different screen from another, so those two
  // are what the history is made of. Everything else — which path is active, which modal is open —
  // is somewhere you are *within* a screen, and Escape is already the way out of those.

  /** True once the address has been reconciled with where the app actually opened. */
  const urlSynced = useRef(false);
  /** Set while a Back/Forward press is being applied, so following it isn't recorded as a move. */
  const navigatingBack = useRef(false);

  useEffect(() => {
    const target = appUrlFor({ teamId: activeTeamId, playerId: selectedPlayerId });
    if (target === currentUrl()) {
      urlSynced.current = true;
      navigatingBack.current = false;
      return;
    }

    // The first paint only writes down where the app already was — that is not a move, and
    // stacking an entry for it would leave a Back press that goes nowhere.
    if (!urlSynced.current || navigatingBack.current) {
      window.history.replaceState(null, '', target);
    } else {
      window.history.pushState(null, '', target);
    }
    urlSynced.current = true;
    navigatingBack.current = false;
  }, [activeTeamId, selectedPlayerId]);

  useEffect(() => {
    const onPopState = () => {
      const { teamId, playerId } = readAppUrl();
      navigatingBack.current = true;
      setActiveTeamId(teamId);
      writeActiveTeamId(teamId);
      if (playerId) {
        setSelectedPlayerId(playerId);
        writeActivePlayerId(playerId);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /**
   * An imported card arrives from the shared library after mount, so a remembered custom player is
   * legitimately missing on the first render and must not be discarded then — only once the
   * library has actually loaded and the card still isn't there, which means it was deleted (here
   * or in another browser).
   */
  useEffect(() => {
    if (!customPlayersLoaded) return;
    if (allPlayersData[selectedPlayerId]) return;
    setSelectedPlayerId(Object.keys(allPlayersData)[0] || 'rodri-91');
  }, [customPlayersLoaded, allPlayersData, selectedPlayerId]);


  const currentPlayer = useMemo(() => allPlayersData[selectedPlayerId] || allPlayersData['rodri-91'], [selectedPlayerId, allPlayersData]);
  const playerBio = currentPlayer.bio;
  const initialOvrData = currentPlayer.ovr;
  const playStylesData = currentPlayer.playStyles;
  const statsData = currentPlayer.stats;

  const playerFeedback = useMemo(
    () => feedbackForPlayer(pathFeedback || {}, selectedPlayerId),
    [pathFeedback, selectedPlayerId]
  );

  /**
   * Records a verdict on a build, with the card as it finishes rather than as it starts — a thumb
   * that does not carry the numbers it was cast on cannot be argued with later.
   */
  const ratePath = (
    path: EvolutionPath,
    verdict: 'up' | 'down' | null,
    reasons?: string[]
  ) => {
    const key = feedbackKeyOf(selectedPlayerId, path.chainIds);
    const next = { ...(pathFeedback || {}) };
    if (verdict === null) {
      delete next[key];
      setPathFeedback(next);
      return;
    }
    const full = simulateEvoChain(path.chainIds, playerBio, initialOvrData, statsData, playStylesData);
    const heightCm = parseHeightCm(full.finalBio.height);
    const subs = flattenSubs(full.finalStats);
    next[key] = makeFeedback(verdict, selectedPlayerId, playerBio, path.chainIds, full.finalOvr, full.finalStats, {
      templateId: templateIdFromDescription(path.description, BUILD_TEMPLATES),
      reasons,
      heightCm,
      archetype: calculateAccelerateFamily(subs.acceleration ?? 50, subs.agility ?? 50, subs.strength ?? 50, heightCm)
    });
    setPathFeedback(next);
  };

  const [hoveredChem, setHoveredChem] = useState<string | null>(null);
  const [lockedChem, setLockedChem] = useState<string | null>(null);
  const [evoPreview, setEvoPreview] = useState(false);

  const [ovr, setOvr] = useState(initialOvrData);

  const [playerStates, setPlayerStates] = useState<Record<string, PlayerEvoState>>({});

  const currentState = {
    ...emptyPlayerState(),
    ...(playerStates[selectedPlayerId] as Partial<PlayerEvoState> || {})
  };

  const updateState = (updates: Partial<PlayerEvoState>) => {
    setPlayerStates(prev => {
      const current = {
        ...emptyPlayerState(),
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

  // Set when a shared link drops a whole workbench state in; the effect below installs it once the
  // card it belongs to is on screen.
  const [pendingRestore, setPendingRestore] = useState<{ playerId: string; state: PlayerEvoState } | null>(null);

  // Set when a card on the pitch is clicked: which player, and which of their builds to open.
  const [pendingOpen, setPendingOpen] = useState<{ playerId: string; chainIds: string[] } | null>(null);

  // --- Shared builds -------------------------------------------------------------------------
  //
  // A `?path=` link carries a card and a chain. Read once at mount: the parameter is cleared as
  // soon as it has been used, and re-reading it later would find nothing.
  const [sharedBuild] = useState(() => parseShareUrl(window.location.search));
  const sharedBuildUsed = useRef(false);

  useEffect(() => {
    if (!sharedBuild || sharedBuildUsed.current) return;
    // A visitor with no team open lands on the team list first; hold the link until they pick one,
    // and until the shared library has arrived, or an imported card would look deleted.
    if (!activeTeamId || !customPlayersLoaded) return;

    sharedBuildUsed.current = true;
    clearShareParam();
    if (!allPlayersData[sharedBuild.playerId]) return;

    // Rides the same path as opening a squad member: switch card, then let the restore effect
    // rebuild the steps against that card's own stats.
    setPendingRestore({
      playerId: sharedBuild.playerId,
      state: {
        ...emptyPlayerState(),
        activePathId: SHARED_PATH_ID,
        expandedPathIds: [SHARED_PATH_ID],
        manualPaths: [
          {
            id: SHARED_PATH_ID,
            name: 'Shared build',
            description: 'Opened from a shared link.',
            chainIds: sharedBuild.chainIds
          }
        ]
      }
    });
    setSelectedPlayerId(sharedBuild.playerId);
  }, [sharedBuild, activeTeamId, customPlayersLoaded, allPlayersData]);

  // Install a shared build once its card is on screen.
  useEffect(() => {
    if (pendingRestore && pendingRestore.playerId === selectedPlayerId) {
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

  // --- Starred builds, saved on the team ------------------------------------------------
  //
  // Starring is the save. It already lifts a path out of the generated list so an Analyze run
  // can't discard it; the two effects below make that outlive the page.

  /**
   * Identity of a player's starred set, for deciding whether a write is needed. Compares what
   * actually gets stored rather than object identity, so a re-render or a round trip through the
   * server can't look like a change and start a write loop.
   */
  const starredKey = (paths: EvolutionPath[]) =>
    JSON.stringify(paths.map(p => [p.id, p.name, p.starTier ?? 1, p.doneUpTo ?? -1, p.chainIds.join('>')]));

  const starredForPlayer = useMemo(
    () =>
      withoutSteps(
        [...generatedPaths, ...manualPaths]
          .filter(p => p.isFavorite || isInGamePath(p))
          // Stored green, not merely painted green: the record keeps its colour on the next card,
          // the next device and the next release, without this rule having to run again to restore it.
          .map(p =>
            isInGamePath(p)
              ? { ...p, isFavorite: true, starTier: IN_GAME_STAR_TIER as NonNullable<EvolutionPath['starTier']> }
              : p
          )
      ),
    [generatedPaths, manualPaths]
  );

  /**
   * Which players have had the team's saves folded into their workbench. The persist effect below
   * refuses to write for a player that isn't in here: before hydration the workbench is empty, and
   * writing that emptiness back would delete the very builds still being loaded.
   */
  const hydratedPlayers = useRef<Set<string>>(new Set());

  /**
   * Changing team empties the workbench.
   *
   * Builds are the team's, so the ones on screen mean nothing under the next one. Leaving them
   * there didn't only show the wrong paths: hydration merged the new team's saves alongside them,
   * and the effect below then wrote the union back — so every card visited across a team switch
   * copied its builds into whichever team was opened next.
   */
  useEffect(() => {
    hydratedPlayers.current = new Set();
    setPlayerStates({});
    setPendingOpen(null);
    setActiveSquadId(null);
  }, [activeTeamId]);

  useEffect(() => {
    // Opening a squad member restores its own build; let that land first rather than racing it.
    if (!team || pendingRestore) return;
    if (hydratedPlayers.current.has(selectedPlayerId)) return;
    hydratedPlayers.current.add(selectedPlayerId);

    const saved = team.savedPaths?.[selectedPlayerId];
    if (!saved || saved.length === 0) return;

    setPlayerStates(prev => {
      const current = prev[selectedPlayerId];
      const existing = current?.manualPaths || [];
      const known = new Set(existing.map(p => p.id));
      const restored = saved
        .filter(p => !known.has(p.id))
        .map(p => ({
          ...p,
          isFavorite: true,
          // steps are dropped on the way out and rebuilt here, against this card's own stats.
          steps: simulateEvoChain(p.chainIds, playerBio, initialOvrData, statsData, playStylesData).steps
        }));
      if (restored.length === 0) return prev;
      return {
        ...prev,
        [selectedPlayerId]: {
          ...(current || emptyPlayerState()),
          manualPaths: [...existing, ...restored]
        }
      };
    });
  }, [team, selectedPlayerId, pendingRestore, playerBio, initialOvrData, statsData, playStylesData]);

  useEffect(() => {
    if (!team || !hydratedPlayers.current.has(selectedPlayerId)) return;
    const stored = team.savedPaths?.[selectedPlayerId] || [];
    if (starredKey(stored) === starredKey(starredForPlayer)) return;
    setSavedPathsForPlayer(selectedPlayerId, starredForPlayer);
  }, [team, selectedPlayerId, starredForPlayer, setSavedPathsForPlayer]);
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
  const [isEvoLabOpen, setIsEvoLabOpen] = useState(false);
  /**
   * Why the last Analyze run left the screen looking untouched, if it did.
   *
   * Two different things happen and they need different answers: the search genuinely found nothing
   * that clears the bar, or it found builds you already have. Reporting only the first was how the
   * second came back as silence — the button appeared to do nothing at all.
   */
  const [analyzeNothing, setAnalyzeNothing] =
    useState<{ reason: 'none' | 'duplicates'; assumedChem: boolean } | null>(null);
  const [isImportBuildOpen, setIsImportBuildOpen] = useState(false);
  // Which squad the pitch is showing. Defaults to the team's first, which is the one every team
  // is created with.
  const [activeSquadId, setActiveSquadId] = useState<string | null>(null);

  // Every player starts on an empty "Current" path, so the card shows the raw base until
  // an evo is added. It only reaches manualPaths once something is appended to it.
  const defaultPath: EvolutionPath = useMemo(() => ({
    id: DEFAULT_PATH_ID,
    name: IN_GAME_PATH_NAME,
    description: 'What you have actually done in game. Add the EVOs as you finish them.',
    isRecommended: false,
    chainIds: []
  }), []);

  // The card as it came, always there and never editable — the fixed point every other chip is
  // read against. Current moves as you play; this is what it moved from.
  const baseCardPath: EvolutionPath = useMemo(() => ({
    id: BASE_CARD_PATH_ID,
    name: 'Base Card',
    description: 'The card with no EVOs on it. Kept as it is, for comparison.',
    isRecommended: false,
    chainIds: []
  }), []);

  /**
   * The paths, sorted, with their steps worked out against the card as it is right now.
   *
   * `steps` used to be whatever was cached on the path when it was built, and the card underneath
   * can move: a PlayStyle pick, an edit, a changed rarity. Evos gate on those — `maxPlayStyles`,
   * `maxOvr`, position — so a chain that was legal when it was generated may not be any more, and
   * the row would keep showing the numbers from back then while the stat panel, which recomputes,
   * showed the truth. Recomputing here means there is one answer instead of two.
   */
  const allPaths = useMemo(() => {
    const withFreshSteps = (path: EvolutionPath): EvolutionPath => ({
      ...path,
      steps: simulateEvoChain(path.chainIds, playerBio, initialOvrData, statsData, playStylesData).steps
    });

    // A ranked shortlist has to be shown in its own order, or the number on the chip is the only
    // thing carrying it and the row reads as shuffled. Only V2's `#n` names match this.
    // Two ranked lists, each in its own order: `#n` is the card as it is, `Cn` is the card with a
    // chemistry style on. Bare leads, because it promises less.
    const rankOf = (p: EvolutionPath) => {
      const m = /^(#|C)(\d+)$/.exec(p.name);
      if (!m) return null;
      return (m[1] === '#' ? 0 : 1000) + Number(m[2]);
    };

    // Which side of the line a build is on is decided by the list it is in, not the name it wears.
    // Star a recommendation and it keeps its `#2`; it is yours from that moment and belongs up with
    // the rest of what you keep.
    const fresh = new Set(currentState.generatedPaths.map(p => p.id));

    const saved = [...currentState.generatedPaths, ...currentState.manualPaths]
      .map(withFreshSteps)
      .sort((a, b) => {
        // Your builds first, then this run's results as a block at the end — they are replaced
        // wholesale by the next run, and threading them through the builds you keep is what made a
        // fresh Analyze read as the row having been shuffled.
        const fa = fresh.has(a.id);
        const fb = fresh.has(b.id);
        if (fa !== fb) return fa ? 1 : -1;
        if (fa && fb) {
          const ra = rankOf(a);
          const rb = rankOf(b);
          if (ra !== null && rb !== null) return ra - rb;
          if (ra !== null) return -1;
          if (rb !== null) return 1;
        }
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
    const withDefault = saved.some(p => p.id === DEFAULT_PATH_ID) ? saved : [defaultPath, ...saved];
    // The base card leads, always, and is never one of the saved ones — it is synthesised here on
    // every render so nothing that writes paths can touch it.
    withDefault.unshift(baseCardPath);
    // The in-game record is starred green wherever it came from — a stored copy from before this
    // rule, an edit that dropped the flags, a fresh synthesis. One place to enforce it beats
    // remembering to set it at each of the half-dozen places a path gets written.
    return withDefault.map(p =>
      isInGamePath(p) && p.chainIds.length > 0
        ? { ...p, isFavorite: true, starTier: IN_GAME_STAR_TIER as NonNullable<EvolutionPath['starTier']> }
        : p
    );
  }, [
    currentState.generatedPaths,
    currentState.manualPaths,
    baseCardPath,
    defaultPath,
    playerBio,
    initialOvrData,
    statsData,
    playStylesData
  ]);

  const activePath = useMemo(() => {
    return allPaths.find(p => p.id === activePathId) || defaultPath;
  }, [allPaths, activePathId, defaultPath]);

  /**
   * What a recommendation is called once you keep it.
   *
   * `#2` is a rank in a list that is about to be replaced, so it stops being a name the moment the
   * build is yours. The plan it was ranked under is on the front of its own description, and that
   * is what it is: a Rock CB, a Cafu Full-Back. Names already taken get a number so two saves never
   * read the same. Anything you renamed yourself is left alone.
   */
  const keeperName = (path: EvolutionPath) => {
    if (!/^(#|C)\d+$/.test(path.name)) return path.name;
    const plan = BUILD_TEMPLATES.find(t => (path.description || '').includes(t.name))?.name;
    const base = plan || 'Saved build';
    const taken = new Set(allPaths.map(p => p.name));
    if (!taken.has(base)) return base;
    for (let n = 2; ; n++) if (!taken.has(`${base} ${n}`)) return `${base} ${n}`;
  };

  /**
   * Star the build on screen, which is what saving is: it lifts the path out of the generated list
   * so an Analyze run can't discard it, and the effect above writes it to the player's saves.
   * Putting a card on the pitch goes through here, because a slot is only a pointer at a save.
   */
  const starActivePath = () => {
    const path = activePath;
    if (path.chainIds.length === 0 || path.isFavorite) return;
    const starred = { ...path, isFavorite: true, starTier: 1 as const };
    if (manualPaths.some(p => p.id === path.id)) {
      updateState({ manualPaths: manualPaths.map(p => (p.id === path.id ? starred : p)) });
    } else {
      updateState({
        generatedPaths: generatedPaths.filter(p => p.id !== path.id),
        manualPaths: [...manualPaths, starred]
      });
    }
  };

  /**
   * Take builds off share links and save them to the players they name.
   *
   * The card on screen is the exception: while a player is open the workbench owns their starred
   * set and writes it back wholesale, so an import that went straight to the store would be
   * overwritten by the next render. That one goes in through the workbench instead.
   */
  const importSharedBuilds = (builds: SharedBuild[]) => {
    const byPlayer = new Map<string, string[][]>();
    builds.forEach(build => {
      if (!allPlayersData[build.playerId]) return;
      const chains = byPlayer.get(build.playerId) || [];
      const key = build.chainIds.join('>');
      if (chains.some(c => c.join('>') === key)) return;
      chains.push(build.chainIds);
      byPlayer.set(build.playerId, chains);
    });

    const additions: Record<string, EvolutionPath[]> = {};
    const forOpenCard: EvolutionPath[] = [];

    byPlayer.forEach((chains, playerId) => {
      const known = new Set(
        (playerId === selectedPlayerId
          ? allPaths
          : team?.savedPaths?.[playerId] || []
        ).map(p => p.chainIds.join('>'))
      );
      const fresh = chains
        .filter(chain => !known.has(chain.join('>')))
        .map((chain, i) => ({
          id: `import-${Date.now()}-${playerId}-${i}`,
          name: 'Imported build',
          description: '',
          isFavorite: true,
          starTier: 1 as const,
          chainIds: chain
        }));
      if (fresh.length === 0) return;

      if (playerId === selectedPlayerId) {
        forOpenCard.push(
          ...fresh.map(path => ({
            ...path,
            steps: simulateEvoChain(path.chainIds, playerBio, initialOvrData, statsData, playStylesData).steps
          }))
        );
      } else {
        additions[playerId] = fresh;
      }
    });

    if (Object.keys(additions).length > 0) addSavedPaths(additions);
    if (forOpenCard.length > 0) updateState({ manualPaths: [...manualPaths, ...forOpenCard] });
  };

  /**
   * Open the build a slot points at. The build is the player's, so it comes back from their saves —
   * the slot only says which player and which chain.
   */
  const openSquadSlot = (entry: SquadSlot) => {
    setPendingOpen({ playerId: entry.playerId, chainIds: entry.chainIds });
    setSelectedPlayerId(entry.playerId);
    setEvoPreview(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!pendingOpen || pendingOpen.playerId !== selectedPlayerId) return;
    const key = pendingOpen.chainIds.join('>');
    const found = allPaths.find(p => p.chainIds.join('>') === key);
    if (found) {
      updateState({ activePathId: found.id, expandedPathIds: [found.id] });
      setPendingOpen(null);
      return;
    }
    // Still on its way in from the player's saves — wait for the hydration effect rather than
    // standing up a second copy of the same chain.
    if ((team?.savedPaths?.[selectedPlayerId] || []).some(p => p.chainIds.join('>') === key)) return;

    const id = `slot-${Date.now()}`;
    updateState({
      activePathId: id,
      expandedPathIds: [id],
      manualPaths: [
        ...manualPaths,
        {
          id,
          name: 'From the pitch',
          description: '',
          isFavorite: true,
          starTier: 1,
          chainIds: pendingOpen.chainIds,
          steps: simulateEvoChain(pendingOpen.chainIds, playerBio, initialOvrData, statsData, playStylesData).steps
        }
      ]
    });
    setPendingOpen(null);
  }, [pendingOpen, selectedPlayerId, allPaths, team, manualPaths, playerBio, initialOvrData, statsData, playStylesData]);

  const evoLocked = evoPreview; // Derived state for components that need to know if we are in preview mode

  const activeChemName = hoveredChem || lockedChem;
  const activeChemBoosts = useMemo(() => {
    return activeChemName ? chemStyles[activeChemName] || {} : {};
  }, [activeChemName]);

  const handleDeletePath = (pathId: string) => {
    const path = allPaths.find(p => p.id === pathId);
    if (isBaseCardPath(path)) return;
    if (path?.isFavorite && !isInGamePath(path)) return;
    if (activePathId === pathId) {
      updateState({ activePathId: DEFAULT_PATH_ID });
    }
    updateState({
      manualPaths: manualPaths.filter(p => p.id !== pathId),
      generatedPaths: generatedPaths.filter(p => p.id !== pathId)
    });
  };

  /**
   * Copy a build so a variant can be tried without losing the original — the usual way a build gets
   * made is "this one, but with that step swapped out".
   *
   * The copy is always a manual path, whatever the original was: it's user-owned from the moment it
   * exists, so the next Analyze run (which replaces generatedPaths wholesale) can't take it away.
   * It is never starred either — starring is the team-level save, and a copy made to be edited
   * shouldn't write itself onto the team before it's worth keeping. Steps carry over as they are;
   * the chain is identical, so they were simulated against this same card.
   */
  const handleDuplicatePath = (pathId: string) => {
    const path = allPaths.find(p => p.id === pathId);
    if (!path || path.chainIds.length === 0) return;

    // "Foo (Copy)", then "Foo (Copy 2)" — copying the same build twice shouldn't produce two chips
    // with the same name on them.
    const taken = new Set(allPaths.map(p => p.name));
    let name = `${path.name} (Copy)`;
    for (let n = 2; taken.has(name); n++) name = `${path.name} (Copy ${n})`;

    const copy: EvolutionPath = {
      ...path,
      id: `custom-${Date.now()}`,
      name,
      isFavorite: false,
      starTier: undefined,
      chainIds: [...path.chainIds]
    };

    updateState({
      manualPaths: [...manualPaths, copy],
      activePathId: copy.id,
      expandedPathIds: currentState.expandedPathIds.includes(copy.id)
        ? currentState.expandedPathIds
        : [...currentState.expandedPathIds, copy.id]
    });
  };

  /**
   * Naming a build is an edit like any other, so an Analyze result becomes user-owned when it is
   * renamed — otherwise the next run would replace generatedPaths wholesale and take the name with
   * it. The id is kept, so whatever is pointing at this path (the active selection, a starred
   * entry on the team) still is.
   */
  const handleRenamePath = (pathId: string, name: string) => {
    const next = name.trim();
    if (!next || isBaseCardPath({ id: pathId })) return;
    const generated = generatedPaths.find(p => p.id === pathId);
    if (generated) {
      updateState({
        generatedPaths: generatedPaths.filter(p => p.id !== pathId),
        manualPaths: [...manualPaths, { ...generated, name: next }]
      });
      return;
    }
    updateState({
      manualPaths: manualPaths.map(p => (p.id === pathId ? { ...p, name: next } : p))
    });
  };

  /**
   * Mark how far the build has been played. `index` is the step just ticked: everything up to it
   * counts as done, and ticking the last done step again clears it (and, by the same rule,
   * everything after it — a step can't be done when the one before it isn't).
   *
   * Progress is the user's own note about a build, so recording it makes an Analyze result
   * user-owned, exactly as renaming or editing one does.
   */
  const handleSetPathProgress = (pathId: string, index: number) => {
    const path = allPaths.find(p => p.id === pathId);
    if (!path || isBaseCardPath(path)) return;
    const doneUpTo = (path.doneUpTo ?? -1) === index ? index - 1 : index;

    const generated = generatedPaths.find(p => p.id === pathId);
    if (generated) {
      updateState({
        generatedPaths: generatedPaths.filter(p => p.id !== pathId),
        manualPaths: [...manualPaths, { ...generated, doneUpTo }]
      });
      return;
    }
    // The Default path is synthesised until something is added to it, so it may be in neither list.
    updateState({
      manualPaths: manualPaths.some(p => p.id === pathId)
        ? manualPaths.map(p => (p.id === pathId ? { ...p, doneUpTo } : p))
        : [...manualPaths, { ...path, doneUpTo }]
    });
  };

  const handleClearPaths = () => {
    updateState({
      generatedPaths: generatedPaths.filter(p => p.isFavorite || isInGamePath(p)),
      manualPaths: manualPaths.filter(p => p.isFavorite || isInGamePath(p)),
      activePathId: DEFAULT_PATH_ID,
      expandedPathIds: [DEFAULT_PATH_ID]
    });
  };

  // Drop one evo from the active path. Later steps may stop being eligible without it; the
  // chain simulation surfaces that rather than us silently trimming them.
  const handleRemoveNode = (pathId: string, index: number) => {
    const targetPathId = pathId;
    const path = allPaths.find(p => p.id === targetPathId);
    if (!path || isBaseCardPath(path)) return;

    const newChainIds = [...path.chainIds];
    newChainIds.splice(index, 1);
    const steps = simulateEvoChain(newChainIds, playerBio, initialOvrData, statsData, playStylesData).steps;
    
    // Auto paths become manual paths when edited
    const wasGenerated = currentState.generatedPaths.some(p => p.id === path.id);
    // Removing a step shifts everything after it, so the base and the progress marker have to
    // follow — otherwise both would silently move onto a different evo.
    const currentBase = currentState.baseIndex ?? -1;
    const nextBase = index <= currentBase ? currentBase - 1 : currentBase;
    const currentDone = path.doneUpTo ?? -1;

    const updated: EvolutionPath = {
      ...path,
      id: wasGenerated ? `custom-${Date.now()}` : path.id,
      name: wasGenerated ? `${path.name} (Edited)` : path.name,
      doneUpTo: index <= currentDone ? currentDone - 1 : currentDone,
      chainIds: newChainIds,
      steps
    };

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
    if (!path || isBaseCardPath(path)) return;

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

    // Adding or dropping a step shifts everything after it, so the base and the progress marker
    // have to follow.
    let nextBase = currentState.baseIndex ?? -1;
    if (removedAt !== null && removedAt <= nextBase) nextBase -= 1;
    if (insertedAt !== null && insertedAt <= nextBase) nextBase += 1;

    let nextDone = path.doneUpTo ?? -1;
    if (removedAt !== null && removedAt <= nextDone) nextDone -= 1;
    if (insertedAt !== null && insertedAt <= nextDone) nextDone += 1;

    const updated: EvolutionPath = { ...path, doneUpTo: nextDone, chainIds: newChainIds, steps };

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

  /**
   * The card the verdict is about: the step you last clicked on the chain, or the raw card when
   * that is the base. Not the preview column, which is the *higher* of the two selected nodes —
   * clicking an earlier step to read it would otherwise leave the verdict describing a card two
   * steps further on.
   */
  const focusedCard = useMemo(() => {
    const idx = safeNodes[1];
    const step = idx >= 0 ? chainResult.steps[idx] : undefined;
    return step
      ? { stats: step.statsAfter, bio: step.bioAfter, label: step.evoName }
      : { stats: statsData, bio: playerBio, label: 'the base card' };
  }, [safeNodes, chainResult, statsData, playerBio]);

  // A new pick is made at the end of the chain, so that's the card state it has to be legal for.
  const canAddPlayStylePick =
    canPickPlayStyles(chainResult.finalBio.rarity) && !isBaseCardPath(activePath);

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

  const runAnalyze = (version: 1 | 2 = 1) => {
    analyzeHandle.current?.cancel();
    setIsAnalyzing(true);
    setAnalyzeNothing(null);
    setAnalyzeProgress(0);

    const handle = runEvoSearch(
      {
        poolIds: effectiveEvosPool,
        maxDepth: 5,
        bio: playerBio,
        ovr: initialOvrData,
        stats: statsData,
        playStyles: playStylesData,
        filters: { ...evoFilters, assumeChemStyle },
        prefixChainIds: basePrefix,
        version,
        // Two lists rather than one, unless told otherwise: the card as it is and the card as it
        // would be fielded are different questions with different best answers.
        readings:
          evoFilters.analyzeReadings === 'bare' ? ['bare']
          : evoFilters.analyzeReadings === 'chem' ? ['chem']
          : ['bare', 'chem'],
        // Only V2 reads these, and only to hide what you turned down and keep what you liked.
        feedback: version === 2 ? { down: playerFeedback.down, up: playerFeedback.up } : undefined
      },
      nodes => setAnalyzeProgress(nodes)
    );
    analyzeHandle.current = handle;

    handle.promise
      .then(results => {
        if (analyzeHandle.current !== handle) return; // superseded by a newer run
        analyzeHandle.current = null;
        setIsAnalyzing(false);

        // A recommendation you already have is not a recommendation. Anything the search comes back
        // with that matches a build already on the card is dropped, so the list is what Analyze
        // found *on top of* what is there rather than a second copy of it.
        //
        // Only the manual paths — starred saves and hand-built drafts alike — are compared against:
        // they are what survives a run. The previous run's results are being replaced by this one,
        // so matching against those would delete a build instead of deduplicating it.
        const already = new Set(currentState.manualPaths.map(p => p.chainIds.join('>')));
        const fresh: EvolutionPath[] = [];
        results.forEach(path => {
          const key = path.chainIds.join('>');
          if (already.has(key)) return;
          already.add(key);
          fresh.push(path);
        });

        setGeneratedPaths(fresh);
        // Nothing came back, or everything that did was already on the card — either way the
        // screen is about to look untouched, and that needs saying rather than showing. It used to
        // test only the first of those, so a run that found four builds you had already saved was
        // indistinguishable from a broken button.
        setAnalyzeNothing(
          fresh.length > 0
            ? null
            : { reason: results.length === 0 ? 'none' : 'duplicates', assumedChem: assumeChemStyle }
        );
        if (fresh.length > 0) {
          setActivePathId(fresh[0].id);
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

  // Abandon an in-flight search when the player changes, so its result can't land on someone else —
  // and drop the last run's verdict with it, since it was about a different card.
  useEffect(() => {
    setAnalyzeNothing(null);
    return () => analyzeHandle.current?.cancel();
  }, [selectedPlayerId]);

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

  /**
   * Where this card is being judged. The slot it stands in on the pitch, because that is the
   * question actually being asked of it — and its primary position when it isn't on one, which is
   * what the card claims to be. Never "wherever it happens to score best": a right-back reading 96
   * as a centre-back tells you nothing about the team you are picking.
   */
  const scorePosition = useMemo(() => {
    const squad = squads.find(s => s.id === activeSquadId) || squads[0];
    const onPitch = squad
      ? Object.entries(squad.slots || {}).find(([, entry]) => entry?.playerId === selectedPlayerId)
      : undefined;
    const slotPos = onPitch
      ? formationOf(squad?.formation).slots.find(slot => slot.id === onPitch[0])?.pos
      : undefined;
    return slotPos || previewBio.primaryPositions.split(',')[0]?.trim() || 'ST';
  }, [squads, activeSquadId, selectedPlayerId, previewBio.primaryPositions]);

  /** The previewed card scored there — every badge on the page reads this one position. */
  const previewScore = useMemo(
    () =>
      scoreAtPosition(previewStats, previewBio, scorePosition, assumeChemStyle) ??
      bestScore(previewStats, previewBio, assumeChemStyle),
    [previewStats, previewBio, scorePosition, assumeChemStyle]
  );

  // Calculate IGS & Face Stats Summary
  const { igs, faceSum, accelerateType, accelerateFamily } = useMemo(() => {
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

    const height = parseHeightCm(playerBio.height);
    const accType = calculateAccelerateType(accVal, agiVal, strVal, height);
    // The word the game prints is computed, not derived from the tier — the two disagree.
    const accFamily = calculateAccelerateFamily(accVal, agiVal, strVal, height);

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
      accelerateType: accType,
      accelerateFamily: accFamily
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
    // Imported cards are not in playersDatabase, so reading the base OVR from there would throw
    // for any custom player. Nothing calls handleReset today, so this is a latent fault rather
    // than a live one — but the app can now open straight onto an imported card, which is exactly
    // the state that would break it the moment anything wires this up.
    setOvr((allPlayersData[selectedPlayerId] || playersDatabase['rodri-91']).ovr);
    setActivePathId(DEFAULT_PATH_ID);
    setEvosPool([]);
    setGeneratedPaths([]);
    setManualPaths([]);
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
            // A build judged with a chemistry style on is a build about a card wearing it, so
            // opening it puts the style on. Otherwise the row says stamina 93 while the panel
            // beneath says 87, and the reader has no way to tell which card is being described.
            const chosen = allPaths.find(p => p.id === id);
            if (chosen?.chemStyle) setLockedChem(chosen.chemStyle);
          }}
          onOpenEvoPool={() => setIsEvoPoolOpen(true)}
          onOpenManualPath={() => { setPickerMode('append'); setIsManualPathOpen(true); }}
          onBranchFromBase={() => { setPickerMode('branch'); setIsManualPathOpen(true); }}
          onOpenImportBuild={() => setIsImportBuildOpen(true)}
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
          freshPathIds={generatedPaths.map(p => p.id)}
          assumeChemStyle={assumeChemStyle}
          onSetAssumeChemStyle={setAssumeChemStyle}
          pathFeedback={playerFeedback.byChain}
          onRatePath={ratePath}
          excludedCount={excludedCount}
          extraCount={extraCount}
          onEvoFiltersChange={setEvoFilters}
          onAnalyze={() => runAnalyze(1)}
          onAnalyzeV2={() => runAnalyze(2)}
          isAnalyzing={isAnalyzing}
          analyzeNothing={analyzeNothing}
          analyzeProgress={analyzeProgress}
          onCancelAnalyze={cancelAnalyze}
          evosPool={effectiveEvosPool}
          evoPreview={evoPreview}
          evoLocked={evoLocked}
          accelerateType={accelerateType}
          // The card on screen scored where it plays — the same number the evo cards show a delta
          // of, so the two always agree about what the build is worth.
          score={previewScore}
          // Kept apart from the stat score on purpose: one says the card's numbers are right for
          // the position, the other says its PlayStyles are — and they want opposite next steps.
          // Read at the same position as the stat score, or the two badges beside each other would
          // quietly be talking about different positions.
          psScore={
            previewScore
              ? playStyleScoreAt(previewStats, previewPlayStyles, previewBio, previewScore.position, { style: previewScore.style })
              : null
          }
          scorePosition={previewScore?.position ?? scorePosition}
          igs={igs}
          faceSum={faceSum}
          activeEvo={activeEvo}
          selectedNodes={safeNodes}
          onNodeClick={handleNodeClick}
          playStyles={previewPlayStyles}
          onDeletePath={handleDeletePath}
          onDuplicatePath={handleDuplicatePath}
          onSetProgress={handleSetPathProgress}
          onToggleFavoritePath={(path) => {
            if (path.chainIds.length === 0) return;
            // The in-game record does not cycle. It is saved, it is green, and a stray click on the
            // star should not be able to hand it to Clear Unstarred.
            if (isInGamePath(path)) return;
            // The star cycles rather than toggles: unstarred, then each colour in turn, then off again.
            // Every colour is a save, so only the last click gives the build back to Clear Unstarred.
            const tier = path.isFavorite ? path.starTier ?? 1 : 0;
            const step = (from: number): number => {
              const to = from + 1;
              return to === IN_GAME_STAR_TIER ? step(to) : to; // green is the record's colour only
            };
            const nextTier = step(tier);
            const next =
              tier === 0
                ? { isFavorite: true, starTier: 1 as const }
                : nextTier > STAR_TIER_COUNT
                ? { isFavorite: false, starTier: undefined }
                : { isFavorite: true, starTier: nextTier as NonNullable<EvolutionPath['starTier']> };
            const isManual = manualPaths.some(p => p.id === path.id);
            if (isManual) {
              // Already manual: just move it along in place.
              updateState({
                manualPaths: manualPaths.map(p => p.id === path.id ? { ...p, ...next } : p)
              });
            } else {
              // Starring a generated path promotes it to manual so the next Analyze run
              // (which replaces generatedPaths wholesale) can't silently discard it.
              //
              // It is also renamed, because `#2` was a position in a list that no longer contains
              // it — and the next run will produce a `#2` of its own. The plan it was ranked under
              // is the name that keeps meaning something, numbered only if you already have one.
              updateState({
                generatedPaths: generatedPaths.filter(p => p.id !== path.id),
                manualPaths: [...manualPaths, { ...path, ...next, name: keeperName(path) }]
              });
            }
          }}
          onRenamePath={handleRenamePath}
          shareUrlFor={(path) => buildShareUrl(selectedPlayerId, path.chainIds)}
          onClearPaths={handleClearPaths}
          onViewEvo={(id) => setViewingEvoId(id)}
          baseIndex={safeBaseIndex}
          onSetBase={(pathId, idx) => {
            // There is one starting point on a card, not one per path, so choosing a step on
            // another build moves it there rather than toggling against the index the old build
            // happened to be on — which is how clicking a node could clear the start instead of
            // setting it, and Analyze would then quietly search from the base card again.
            if (activePathId !== pathId) {
              updateState({ activePathId: pathId, baseIndex: idx });
              return;
            }
            setBaseIndex(idx === safeBaseIndex ? -1 : idx);
          }}
          onRemoveNode={handleRemoveNode}
        />

        <>

            <div className="flex flex-wrap items-center gap-3 mb-2 px-1">
              {/* Both systems at once: the word the card prints in game, then how far it leans
                  within it — the two read the same on a card and feel nothing alike in a match. */}
              <span
                className="font-bold text-sm text-gray-300 bg-gray-900/60 px-2 py-1 rounded border border-gray-800"
                title={`AcceleRATE: ${accelerateFamily} in game · ${accelerateType} by the seven-way thresholds`}
              >
                {accelerateFamily}
                <span className="text-gray-500 font-medium ml-1.5">· {accelerateType}</span>
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
                  onOpenSlot={openSquadSlot}
                  onClearSlot={clearSquadSlot}
                  onCreateSquad={createSquad}
                  onSetFormation={setSquadFormation}
                  onDeleteSquad={deleteSquad}
                  onAddCurrentToSlot={addCurrentPlayerToSlot}
                  onSwapSlots={swapSquadSlots}
                  currentName={playerBio.name}
                  currentPlayerId={selectedPlayerId}
                  playersById={allPlayersData}
                  assumeChemStyle={assumeChemStyle}
                />
              }
              asideBelow={
                <CardVerdict
                  stats={focusedCard.stats}
                  bio={focusedCard.bio}
                  position={scorePosition}
                  context={focusedCard.label}
                  assumeChemStyle={assumeChemStyle}
                />
              }
              below={
                <ChemistryGrid
                  chemStyles={chemStyles}
                  previewStats={previewStats}
                  hoveredChem={hoveredChem}
                  lockedChem={lockedChem}
                  heightCm={parseHeightCm(playerBio.height)}
                  bio={previewBio}
                  scorePosition={scorePosition}
                  onHoverChem={setHoveredChem}
                  onLockChem={(name) => {
                    setLockedChem(lockedChem === name ? null : name);
                  }}
                />
              }
            />
        </>

        <div className="flex justify-center mt-6 mb-2">
          <button
            onClick={() => setIsEvoLabOpen(true)}
            className="px-4 py-1.5 bg-[#121212] border border-gray-800/80 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:border-gray-600 flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4" />
            EVO Chain Lab
          </button>
        </div>

        <div className="mt-12 pt-4 border-t border-gray-800/80 text-center text-xs text-fcTextDim flex items-center justify-between flex-wrap gap-2">
          <span>EA FC 26 Player Stats & Evolution Preview Calculator</span>
          <span className="flex items-center gap-1 text-fcGreen font-medium">
            <Trophy className="w-3.5 h-3.5" /> Built for Ultimate Team Enthusiasts
          </span>
        </div>

      </div>

      {/* The lab is a reference you consult, not a place you work — so it opens over the
          workbench instead of replacing it. */}
      {isEvoLabOpen && (
        <EvoLabModal onClose={() => setIsEvoLabOpen(false)}>
          <EvolutionChainWorkbench
            bio={playerBio}
            ovr={initialOvrData}
            stats={statsData}
            playStyles={playStylesData}
            disabledEvos={disabledEvos}
            onToggleDisabled={toggleEvoDisabled}
          />
        </EvoLabModal>
      )}

      {isImportBuildOpen && (
        <ImportBuildModal
          onClose={() => setIsImportBuildOpen(false)}
          playersById={allPlayersData}
          existingChainsByPlayer={Object.fromEntries(
            Object.entries(team?.savedPaths || {}).map(([playerId, paths]) => [
              playerId,
              // The open card's saves live in the workbench until they're written back.
              (playerId === selectedPlayerId ? allPaths : paths).map(p => p.chainIds.join('>'))
            ])
          )}
          onImport={importSharedBuilds}
        />
      )}

      <EvoPoolModal
        isOpen={isEvoPoolOpen}
        onClose={() => setIsEvoPoolOpen(false)}
        evoStatuses={evoStatuses}
        setEvoStatuses={setTeamEvoStatuses}
      />
      <ManualPathModal
        isOpen={isManualPathOpen}
        onClose={() => setIsManualPathOpen(false)}
        evosPool={Object.keys(availableEvolutions)}
        includedEvos={evosPool}
        disabledEvos={disabledEvos}
        onToggleDisabled={toggleEvoDisabled}
        // Append grows the active path in place (so it keeps its id and name); branch leaves
        // it alone and starts a fresh path from the base prefix.
        // The base card takes no edits, so appending from it starts a new build rather than
        // growing the one chip that is meant to stay where it is.
        editingPath={pickerMode === 'append' && !isBaseCardPath(activePath) ? activePath : null}
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
        assumeChemStyle={assumeChemStyle}
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
            setSelectedPlayerId(id);
            setHoveredChem(null);
            setLockedChem(null);
            setEvoPreview(false);
            setSelectionQueue([-1, -1]);
            const ovrData = allPlayersData[id]?.ovr || playersDatabase['rodri-91'].ovr;
            setOvr(ovrData);
          }}
          onOpenImport={() => setIsImportModalOpen(true)}
          libraryPlayers={libraryPlayers}
          hiddenPlayerIds={hiddenPlayers}
          onHidePlayer={hidePlayerForTeam}
          onUnhidePlayer={unhidePlayerForTeam}
          onDeletePlayer={deletePlayerFromLibrary}
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
