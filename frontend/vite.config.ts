import { fileURLToPath, URL } from 'url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return defineConfig({
    envDir: '../',
    server: {
      host: true,
      port: Number(process.env.FRONTEND_PORT),
      proxy: {
        '/users': {
          target: `http://localhost:${process.env.API_PORT}`
        },
        '/matches': {
          target: `http://localhost:${process.env.API_PORT}`
        },
        '/auth': {
          target: `http://localhost:${process.env.API_PORT}`
        },
        '/channels': {
          target: `http://localhost:${process.env.API_PORT}`
        },
        '/messages': {
          target: `http://localhost:${process.env.API_PORT}`
        },
        '/upload': {
          target: `http://localhost:7002`
        },
        '/assets': {
          target: `http://localhost:7002`
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
};
