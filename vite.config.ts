import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const gateway = 'http://localhost:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': gateway,
      '/renders': gateway,
      '/admin': gateway,
      '/ws': { target: gateway, ws: true },
    },
  },
})
