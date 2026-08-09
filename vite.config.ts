import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { createApiRouter } from './server/api.js';

// The dev server mounts the very same /api the deployed server does, so local development and
// production read and write one shared store. It used to write JSON files into src/data instead,
// which meant "shared" state only followed you as far as the machine running `npm run dev`.
function apiPlugin() {
  const api = express();
  api.use('/api', createApiRouter());

  return {
    name: 'evo-api',
    configureServer(server: any) {
      server.middlewares.use(api);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
