import express from 'express';
import {
  SAFE_ID,
  createTeam,
  deleteSquad,
  deleteTeam,
  getLibrary,
  getTeam,
  listTeamHistory,
  listTeams,
  putLibrary,
  restoreTeamVersion,
  saveSquad,
  setPlayerPaths,
  updateTeam
} from './store.js';

/**
 * The /api router, mounted by both the deployed server and the Vite dev server so local
 * development and production talk to exactly the same store — the previous split (dev wrote
 * files into the repo, production had no backend at all and silently fell back to localStorage)
 * is what made data vanish when you opened the app on another machine.
 */
export function createApiRouter() {
  const router = express.Router();
  router.use(express.json({ limit: '5mb' }));

  const wrap = handler => (req, res) => {
    Promise.resolve(handler(req, res)).catch(err => {
      const status = err.status || 500;
      if (status >= 500) console.error(`${req.method} ${req.originalUrl}`, err);
      res.status(status).json({ error: err.message || 'Server error' });
    });
  };

  const checkId = value => {
    if (!SAFE_ID.test(value || '')) throw Object.assign(new Error('Invalid id'), { status: 400 });
    return value;
  };

  // --- Teams ---
  router.get('/teams', wrap(async (_req, res) => res.json(await listTeams())));

  router.post(
    '/teams',
    wrap(async (req, res) => {
      const name = String(req.body?.name || '').trim();
      if (!name) throw Object.assign(new Error('A team needs a name'), { status: 400 });
      // Generated here rather than by the client so two browsers can't mint the same id.
      const id = `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      res.status(201).json(await createTeam(id, name));
    })
  );

  router.get(
    '/teams/:teamId',
    wrap(async (req, res) => {
      const team = await getTeam(checkId(req.params.teamId));
      if (!team) throw Object.assign(new Error('Team not found'), { status: 404 });
      res.json(team);
    })
  );

  router.patch(
    '/teams/:teamId',
    wrap(async (req, res) => res.json(await updateTeam(checkId(req.params.teamId), req.body || {})))
  );

  // One player's builds, merged into what is stored rather than replacing the whole map — see
  // setPlayerPaths. This is what a save from the workbench goes through.
  router.put(
    '/teams/:teamId/paths/:playerId',
    wrap(async (req, res) =>
      res.json(
        await setPlayerPaths(
          checkId(req.params.teamId),
          checkId(req.params.playerId),
          Array.isArray(req.body) ? req.body : req.body?.paths || []
        )
      )
    )
  );

  // Every version of a team that has been replaced, newest first, and the way to put one back.
  router.get(
    '/teams/:teamId/history',
    wrap(async (req, res) => res.json(await listTeamHistory(checkId(req.params.teamId))))
  );

  router.post(
    '/teams/:teamId/history/:at/restore',
    wrap(async (req, res) =>
      res.json(await restoreTeamVersion(checkId(req.params.teamId), Number(req.params.at)))
    )
  );

  router.delete(
    '/teams/:teamId',
    wrap(async (req, res) => {
      await deleteTeam(checkId(req.params.teamId));
      res.json({ success: true });
    })
  );

  // --- Squads ---
  router.put(
    '/teams/:teamId/squads/:squadId',
    wrap(async (req, res) => {
      const saved = await saveSquad(
        checkId(req.params.teamId),
        checkId(req.params.squadId),
        req.body || {}
      );
      res.json(saved);
    })
  );

  router.delete(
    '/teams/:teamId/squads/:squadId',
    wrap(async (req, res) => {
      await deleteSquad(checkId(req.params.teamId), checkId(req.params.squadId));
      res.json({ success: true });
    })
  );

  // --- Global libraries (players everyone contributes to) ---
  router.get(
    '/library/:key',
    wrap(async (req, res) => {
      const value = await getLibrary(checkId(req.params.key));
      if (value === null) return res.status(404).json({ error: 'Not found' });
      res.json(value);
    })
  );

  router.put(
    '/library/:key',
    wrap(async (req, res) => res.json(await putLibrary(checkId(req.params.key), req.body)))
  );

  return router;
}
