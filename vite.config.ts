import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Two file-backed stores, so state follows the project rather than the browser it was made in:
//   /api/saves/<playerId>  one file per player — paths, filters, pool
//   /api/app/<key>         app-wide state that used to live only in localStorage, which is why
//                          imported players and disabled evos didn't show up in a second browser
const STORES: Record<string, string> = {
  '/api/saves/': 'src/data/saves',
  '/api/app/': 'src/data/app'
};

// The id becomes a filename, so it may not climb out of the store directory.
const SAFE_ID = /^[A-Za-z0-9_-]+$/;

function fileStorePlugin() {
  return {
    name: 'file-store',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const prefix = Object.keys(STORES).find(p => req.url?.startsWith(p));
        if (!prefix) return next();

        const id = decodeURIComponent((req.url.split('?')[0].split('/').pop() || ''));
        if (!SAFE_ID.test(id)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid id' }));
          return;
        }

        const dir = path.resolve(process.cwd(), STORES[prefix]);
        const filePath = path.join(dir, `${id}.json`);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        if (req.method === 'GET') {
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(filePath, 'utf-8'));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not found' }));
          }
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            fs.writeFileSync(filePath, body, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), fileStorePlugin()],
  server: {
    port: 3000,
    open: false
  }
});
