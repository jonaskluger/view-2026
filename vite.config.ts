import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getProgram } from './src/lib/programService';

/**
 * Serves the same handler as api/program.ts during `vite dev`,
 * so you don't need the Vercel CLI for local development.
 */
function devApiProgram(): Plugin {
  return {
    name: 'dev-api-program',
    configureServer(server) {
      server.middlewares.use('/api/program', async (_req, res) => {
        try {
          const data = await getProgram();
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(data));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiProgram()],
});
