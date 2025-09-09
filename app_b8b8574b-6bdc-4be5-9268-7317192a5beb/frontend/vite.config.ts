import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        watchPath: './src',
        // keep this prop because of the issue
        // https://github.com/fi3ework/vite-plugin-checker/issues/418
        useFlatConfig: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',        // allow external access (needed in Gitpod)
    port: 5173,             // default Vite port
    allowedHosts: [
      '.gitpod.io',         // allow all Gitpod workspace URLs
    ],
  },
});
