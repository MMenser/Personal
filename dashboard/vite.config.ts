import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Paths are relative to the repo root, where the npm scripts run.
export default defineConfig({
  root: 'dashboard',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist-dashboard',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    // In dev, run `npm run dashboard:server` alongside for live stats.
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
})
