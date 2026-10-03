import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Relative base so the build can be hosted from any static path.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Pre-bundle everything up front so the dev server never re-optimises mid-session.
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'motion/react', 'three', '@react-three/fiber', '@react-three/drei', 'zustand', 'zustand/middleware'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (/node_modules[\/](three|@react-three|camera-controls|three-stdlib)[\/]/.test(id)) return 'three';
          return undefined;
        },
      },
    },
  },
});
