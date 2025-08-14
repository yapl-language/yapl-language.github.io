import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    host: "localhost",
    hmr: {
      port: 5174,
      host: "localhost",
    },
  },
});
