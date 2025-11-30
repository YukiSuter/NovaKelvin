import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/static/ticketing/',         // URL prefix when loaded in the browser
  build: {
      outDir: '../static/ticketing',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.jsx'),
        },
        output: {
          entryFileNames: 'assets/main.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
})
