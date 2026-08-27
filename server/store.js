import { Datastore, PropertyFilter } from '@google-cloud/datastore';

/**
 * The shared store behind /api.
 *
 * State used to be written into the repo by a Vite dev-server middleware, which meant it lived on
 * whichever machine happened to be running `npm run dev` — a second computer, and anybody the app
 * was shared with, saw nothing. It now lives in the project's Datastore, so the deployed app and
 * every local dev server read and write the same data.
 *
 * The project's (default) database is in Datastore mode, and the free quota only applies to that
 * one, so this uses it rather than adding a Firestore-native database alongside. Kinds are
 * prefixed so nothing here can collide with whatever else the project stores.
 *
 * Documents are held as one JSON string per entity, excluded from indexes: none of this is
 * queried by field, only fetched whole by key or listed by kind, and indexed string properties
 * are capped at 1500 bytes.
 */

const datastore = new Datastore();

const TEAM = 'evo_team';
/**
 * Every team starts with one squad, so finishing a build never runs into "you have nowhere to put
 * this" — a build has to live in a squad to exist at all.
 */
export const DEFAULT_SQUAD_ID = 'default';
const DEFAULT_SQUAD_NAME = 'Default XI';
const SQUAD = 'evo_squad';
const LIBRARY = 'evo_library';

/**
 * Every previous version of a team's state, kept so nothing is ever gone for good.
 *
 * The writes here are last-one-wins over the whole document, and a client holding a stale copy can
 * therefore delete work it never knew about. Narrowing what a write touches makes that rarer; it
 * cannot make it impossible, and "rarer" is not the promise wanted about a build that took an
 * evening to find. So the old state is filed before every write, and the answer to losing one
 * stops being "it is gone" and becomes "which version do you want back".
 *
 * The key carries the timestamp, zero-padded so it sorts, which is what lets this be pruned and
 * listed with plain key ranges — no composite index, nothing to deploy alongside it.
 */
const HISTORY = 'evo_team_history';

/** How many versions of a team to keep. Each is a few tens of KB at most. */
const HISTORY_KEEP = 50;

const historyKey = (teamId, at) =>
  datastore.key([HISTORY, `${teamId}__${String(at).padStart(15, '0')}`]);

/** Every stored version of one team, oldest first. Key-only range, so it needs no index. */
async function historyKeys(teamId) {
  const query = datastore
    .createQuery(HISTORY)
    .filter(new PropertyFilter('__key__', '>=', historyKey(teamId, 0)))
    .filter(new PropertyFilter('__key__', '<', historyKey(teamId, Number.MAX_SAFE_INTEGER)))
    .select('__key__');
  const [entities] = await query.run();
  return entities.map(e => e[datastore.KEY]).sort((a, b) => (a.name < b.name ? -1 : 1));
}

/**
 * File the version of a team that is about to be replaced.
 *
 * Never allowed to fail the write it precedes: losing the ability to undo a save is bad, refusing
 * to save because the undo could not be written is worse.
 */
async function recordHistory(id, entity, reason) {
  if (!entity) return;
  try {
    const at = now();
    await datastore.save({
      key: historyKey(id, at),
      excludeFromIndexes: ['json'],
      data: { teamId: id, at, reason: reason || '', name: entity.name || '', json: entity.json || '{}' }
    });
    const keys = await historyKeys(id);
    if (keys.length > HISTORY_KEEP) await datastore.delete(keys.slice(0, keys.length - HISTORY_KEEP));
  } catch (err) {
    console.error('history write failed (the save itself is unaffected):', err);
  }
}

/** What is on file for a team, newest first. `json` is the whole state as it was then. */
export async function listTeamHistory(id) {
  const keys = await historyKeys(id);
  if (keys.length === 0) return [];
  const [entities] = await datastore.get(keys);
  return (entities || [])
    .map(e => ({ at: e.at, reason: e.reason || '', name: e.name || '', state: JSON.parse(e.json || '{}') }))
    .sort((a, b) => b.at - a.at);
}

/** Ids become key names, so they may not be empty or exotic. */
export const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

const now = () => Date.now();

const pack = (extra, payload) => ({
  key: extra.key,
  // A Datastore entity property that is indexed cannot exceed 1500 bytes, and none of these are
  // searched by content.
  excludeFromIndexes: ['json'],
  data: { ...extra.data, json: JSON.stringify(payload ?? {}) }
});

const unpack = entity => {
  if (!entity) return null;
  try {
    return JSON.parse(entity.json || '{}');
  } catch {
    return {};
  }
};

// --- Teams -------------------------------------------------------------------------------
// A team is one account's worth of state: which evos it treats as required/included/disabled,
// and the squads it has built. The evo and player libraries are deliberately *not* in here —
// those are global, and everyone contributes to them.

export async function listTeams() {
  const [entities] = await datastore.createQuery(TEAM).run();
  return entities
    .map(e => ({
      id: e[datastore.KEY].name,
      name: e.name || 'Untitled',
      createdAt: e.createdAt || 0,
      updatedAt: e.updatedAt || 0
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt);
}

export async function createTeam(id, name) {
  const key = datastore.key([TEAM, id]);
  const [existing] = await datastore.get(key);
  if (existing) throw Object.assign(new Error('Team already exists'), { status: 409 });

  const createdAt = now();
  await datastore.save(
    pack({ key, data: { name, createdAt, updatedAt: createdAt } }, { evoStatuses: {} })
  );
  await saveSquad(id, DEFAULT_SQUAD_ID, {
    name: DEFAULT_SQUAD_NAME,
    formation: '4-2-3-1',
    members: [],
    createdAt
  });
  return { id, name, createdAt, updatedAt: createdAt };
}

/** The team's own state plus its squads, which are separate entities so no one document grows unbounded. */
export async function getTeam(id) {
  const key = datastore.key([TEAM, id]);
  const [entity] = await datastore.get(key);
  if (!entity) return null;

  let squads = await listSquads(id);
  if (squads.length === 0) {
    // Teams made before squads were created up front, and any team whose last squad was deleted,
    // still need somewhere for the next build to land.
    await saveSquad(id, DEFAULT_SQUAD_ID, {
      name: DEFAULT_SQUAD_NAME,
      formation: '4-2-3-1',
      members: [],
      createdAt: now()
    });
    squads = await listSquads(id);
  }

  return {
    id,
    name: entity.name || 'Untitled',
    createdAt: entity.createdAt || 0,
    updatedAt: entity.updatedAt || 0,
    ...unpack(entity),
    squads
  };
}

/** Merges into what is stored, so a caller can save just the pool or just the name. */
export async function updateTeam(id, patch) {
  const key = datastore.key([TEAM, id]);
  const [entity] = await datastore.get(key);
  if (!entity) throw Object.assign(new Error('Team not found'), { status: 404 });

  await recordHistory(id, entity, 'patch');

  const { name, squads, id: _ignored, createdAt: _createdAt, ...state } = patch;
  await datastore.save(
    pack(
      {
        key,
        data: {
          name: name ?? entity.name,
          createdAt: entity.createdAt || now(),
          updatedAt: now()
        }
      },
      { ...unpack(entity), ...state }
    )
  );
  return getTeam(id);
}

/**
 * Replace one player's builds, and touch nothing else.
 *
 * The whole-document PATCH above is what makes a stale client dangerous: it sends the entire
 * savedPaths map, built from whatever it had when it loaded, so a save for one card silently
 * reinstates its old copy of every other card. Here the map is read fresh out of the store and only
 * the named player is written, so two windows working on two cards cannot overwrite each other at
 * all — and two windows on the same card lose only that card's newer version, which the history
 * above still holds.
 */
export async function setPlayerPaths(id, playerId, paths) {
  const key = datastore.key([TEAM, id]);
  const [entity] = await datastore.get(key);
  if (!entity) throw Object.assign(new Error('Team not found'), { status: 404 });

  await recordHistory(id, entity, `paths:${playerId}`);

  const state = unpack(entity) || {};
  const savedPaths = { ...(state.savedPaths || {}) };
  if (Array.isArray(paths) && paths.length > 0) savedPaths[playerId] = paths;
  else delete savedPaths[playerId];

  await datastore.save(
    pack(
      { key, data: { name: entity.name, createdAt: entity.createdAt || now(), updatedAt: now() } },
      { ...state, savedPaths }
    )
  );
  return getTeam(id);
}

/** Put a filed version back. Recorded first, so restoring is itself undoable. */
export async function restoreTeamVersion(id, at) {
  const key = datastore.key([TEAM, id]);
  const [entity] = await datastore.get(key);
  if (!entity) throw Object.assign(new Error('Team not found'), { status: 404 });

  const [version] = await datastore.get(historyKey(id, at));
  if (!version) throw Object.assign(new Error('No such version'), { status: 404 });

  await recordHistory(id, entity, 'before-restore');
  await datastore.save(
    pack(
      { key, data: { name: entity.name, createdAt: entity.createdAt || now(), updatedAt: now() } },
      JSON.parse(version.json || '{}')
    )
  );
  return getTeam(id);
}

export async function deleteTeam(id) {
  const squads = await listSquadKeys(id);
  await datastore.delete([datastore.key([TEAM, id]), ...squads]);
}

// --- Squads ------------------------------------------------------------------------------
// A squad is the only place a finished build lives: the app treats an unsaved path as a draft,
// so putting a player in a squad is what makes the build real.

const squadKeyName = (teamId, squadId) => `${teamId}:${squadId}`;

async function listSquadKeys(teamId) {
  const [entities] = await datastore.createQuery(SQUAD).filter(new PropertyFilter('teamId', '=', teamId)).run();
  return entities.map(e => e[datastore.KEY]);
}

export async function listSquads(teamId) {
  const [entities] = await datastore.createQuery(SQUAD).filter(new PropertyFilter('teamId', '=', teamId)).run();
  return entities
    .map(e => ({ ...unpack(e), id: e.squadId, createdAt: e.createdAt || 0 }))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function saveSquad(teamId, squadId, squad) {
  const key = datastore.key([SQUAD, squadKeyName(teamId, squadId)]);
  const [existing] = await datastore.get(key);
  const createdAt = existing?.createdAt || squad.createdAt || now();

  await datastore.save(
    pack({ key, data: { teamId, squadId, createdAt, updatedAt: now() } }, { ...squad, id: squadId })
  );
  await touchTeam(teamId);
  return { ...squad, id: squadId, createdAt };
}

export async function deleteSquad(teamId, squadId) {
  await datastore.delete(datastore.key([SQUAD, squadKeyName(teamId, squadId)]));
  await touchTeam(teamId);
}

async function touchTeam(teamId) {
  const key = datastore.key([TEAM, teamId]);
  const [entity] = await datastore.get(key);
  if (!entity) return;
  await datastore.save(pack({ key, data: { ...entity, updatedAt: now() } }, unpack(entity)));
}

// --- Global libraries --------------------------------------------------------------------
// Imported players and the evo library belong to everybody: any team can use them and any team
// can add to them. They are keyed by name rather than by team on purpose.

export async function getLibrary(key) {
  const [entity] = await datastore.get(datastore.key([LIBRARY, key]));
  return entity ? unpack(entity) : null;
}

export async function putLibrary(key, value) {
  await datastore.save(
    pack({ key: datastore.key([LIBRARY, key]), data: { updatedAt: now() } }, value)
  );
  return value;
}
