import { fileURLToPath, URL } from 'url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    envDir: '../',
    define: {
      HOST: JSON.stringify(env.HOST),
      BACKEND_HOST: JSON.stringify(env.BACKEND_HOST),
      API_PORT: env.API_PORT,
      STATUS_PORT: env.STATUS_PORT,
      GAME_PORT: env.GAME_PORT,
      UPLOAD_PORT: env.UPLOAD_PORT
    },
    server: {
      host: true,
      port: Number(env.FRONTEND_PORT),
      proxy: {
        '/stats': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/users': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/matches': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/auth': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/channels': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/messages': {
          target: `http://${env.BACKEND_HOST}:${env.API_PORT}`
        },
        '/assets': {
          target: `http://${env.BACKEND_HOST}:${env.UPLOAD_PORT}`
        },
        '/upload': {
          target: `http://${env.BACKEND_HOST}:${env.UPLOAD_PORT}`
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
