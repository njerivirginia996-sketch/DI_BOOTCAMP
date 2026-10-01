import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  plugins: [react({ include: /\.[jt]sx?$/ })],
});