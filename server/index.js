import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApiRouter } from './api.js';

/**
 * The deployed server: the same /api the dev server mounts, plus the built front end.
 *
 * app.yaml used to serve dist/ as static files with no backend at all, so every /api call in
 * production hit the catch-all, came back as index.html, and the app quietly fell through to
 * localStorage — which is why nothing followed you to another browser or another machine.
 */
const app = express();
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

app.use('/api', createApiRouter());

app.use(express.static(dist, { index: false, maxAge: '1h' }));

// Anything that isn't a file or an API call is a client-side route.
app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`listening on ${port}`));
