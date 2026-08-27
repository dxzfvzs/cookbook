import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const isCapacitor = process.env.CAPACITOR === 'true'

  return {
    plugins: [react()],
    // gh-pages serve from /cookbook/
    // Capacitor serves the bundle from the root
    base: isCapacitor ? './' : '/cookbook/',
    build: {
      outDir: isCapacitor ? 'dist-android' : 'dist',
    },
  }
})
