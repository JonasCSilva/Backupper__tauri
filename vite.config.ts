import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src/',
  build: {
    emptyOutDir: true,
    outDir: '../dist/',
    rollupOptions: {
      input: {
        main: '/index.html',
        splashscreen: '/splashscreen.html'
      }
    }
  }
})
