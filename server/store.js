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
