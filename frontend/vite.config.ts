import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3001,
    proxy: {
      '/users': {
        target: 'http://localhost:4000'
      },
      '/matches': {
        target: 'http://localhost:4000'
      },
      '/auth': {
        target: 'http://localhost:4000'
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
