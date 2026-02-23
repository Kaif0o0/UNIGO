import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // Output to dist/ (default) — point your hosting platform here
    outDir: 'dist',
    sourcemap: false,
  },
})
