import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  return defineConfig({
    envDir: "../",
    server: {
      host: true,
      port: Number(process.env.FRONTEND_PORT),
      proxy: {
        "/users": {
          target: `http://${process.env.BACKEND_HOST}:${process.env.API_PORT}`,
        },
        "/matches": {
          target: `http://${process.env.BACKEND_HOST}:${process.env.API_PORT}`,
        },
        "/auth": {
          target: `http://${process.env.BACKEND_HOST}:${process.env.API_PORT}`,
        },
        "/channels": {
          target: `http://${process.env.BACKEND_HOST}:${process.env.API_PORT}`,
        },
        "/messages": {
          target: `http://${process.env.BACKEND_HOST}:${process.env.API_PORT}`,
        },
        "/upload": {
          target: `http://${process.env.BACKEND_HOST}:7000`,
        },
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  });
};
