import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        estimator: resolve(rootDirectory, 'estimator.html'),
      },
    },
  },
});
