import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://incidents.fire.ca.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/riverside': {
        target: 'https://www.riversideca.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riverside/, ''),
      },
      '/earthquakes': {
        target: 'https://earthquake.usgs.gov/earthquakes',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/earthquakes/, ''),
      },
    },
  },
});
