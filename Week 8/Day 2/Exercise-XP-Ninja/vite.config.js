import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ include: /\.[jt]sx?$/ })],
  server: {
    proxy: {
      '/users': 'http://localhost:3001',
      '/api': 'http://localhost:3002',
    },
  },
})