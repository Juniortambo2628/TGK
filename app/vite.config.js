import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1',
        hmr: {
            host: '127.0.0.1',
        },
    },
    build: isSsrBuild
        ? {}
        : {
              rollupOptions: {
                  output: {
                      manualChunks: {
                          framer: ['framer-motion'],
                          'react-vendor': ['react', 'react-dom'],
                      },
                  },
              },
          },
}));
