import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import net from 'net';
import path from 'path';
import {defineConfig} from 'vite';

function isTcpPortOpen(targetUrl: string, timeoutMs = 250): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const host = parsed.hostname === 'localhost' ? '127.0.0.1' : parsed.hostname;
      const port = parsed.port
        ? Number(parsed.port)
        : parsed.protocol === 'https:'
          ? 443
          : 80;

      const socket = net.createConnection({host, port});
      const done = (result: boolean) => {
        socket.removeAllListeners();
        socket.destroy();
        resolve(result);
      };
      socket.setTimeout(timeoutMs);
      socket.once('connect', () => done(true));
      socket.once('timeout', () => done(false));
      socket.once('error', () => done(false));
    } catch {
      resolve(false);
    }
  });
}

export default defineConfig(() => {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8081';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          bypass: async (req, res) => {
            const reachable = await isTcpPortOpen(backendUrl);
            if (!reachable && res) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  code: 'BACKEND_OFFLINE',
                  message:
                    'Backend API server is not running on port 8081 in this preview environment.',
                })
              );
              return req.url;
            }
            return undefined;
          },
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('axios')) {
                return 'vendor-network';
              }
              return 'vendor-libs';
            }
          },
        },
      },
    },
  };
});
