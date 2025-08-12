import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";
import { fileURLToPath } from "node:url";
import { dirname, resolve as pathResolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      plugins: [
        alias({
          entries: [
            {
              find: "node:fs",
              replacement: pathResolve(__dirname, "./src/shims/fs.ts"),
            },
            {
              find: "node:path",
              replacement: pathResolve(__dirname, "./src/shims/path.ts"),
            },
            {
              find: "fs",
              replacement: pathResolve(__dirname, "./src/shims/fs.ts"),
            },
            {
              find: "path",
              replacement: pathResolve(__dirname, "./src/shims/path.ts"),
            },
          ],
        }),
      ],
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [pathResolve(__dirname, "..")],
    },
  },
  resolve: {
    alias: {
      "node:fs": pathResolve(__dirname, "./src/shims/fs.ts"),
      "node:path": pathResolve(__dirname, "./src/shims/path.ts"),
      fs: pathResolve(__dirname, "./src/shims/fs.ts"),
      path: pathResolve(__dirname, "./src/shims/path.ts"),
    },
  },
});
