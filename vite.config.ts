import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function playerSavesPlugin() {
  return {
    name: 'player-saves',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/saves/')) {
          const playerId = req.url.split('/').pop();
          const saveDir = path.resolve(process.cwd(), 'src/data/saves');
          const savePath = path.join(saveDir, `${playerId}.json`);

          // Ensure directory exists
          if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
          }

          if (req.method === 'GET') {
            if (fs.existsSync(savePath)) {
              res.setHeader('Content-Type', 'application/json');
              res.end(fs.readFileSync(savePath, 'utf-8'));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Save not found' }));
            }
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              fs.writeFileSync(savePath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), playerSavesPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
