import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'dist-renderer',
    lib: { entry: 'src/renderer/main.tsx', name: 'ResumeBankRenderer', formats: ['iife'], fileName: () => 'renderer.js', cssFileName: 'renderer' },
    minify: true,
  },
})
