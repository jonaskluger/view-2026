import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
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
  plugins: [
    react(),
    tailwindcss(),
    devApiProgram(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'icon.svg'],
      manifest: {
        name: 'VIEW Conference 2026 — Live Program',
        short_name: 'VIEW 2026',
        description:
          'Live program for VIEW Conference 2026 — 12–16 October, Torino. Talks, panels, workshops and screenings, updated daily.',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cache the offline snapshot so the app boots with data even offline.
        // The API itself uses network-first with the client-side fallback chain.
        navigateFallback: 'index.html',
        additionalManifestEntries: [{ url: 'program-snapshot.json', revision: null }],
        runtimeCaching: [
          {
            urlPattern: /\/api\/program$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'program-api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
});
