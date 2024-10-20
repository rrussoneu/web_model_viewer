import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/browser',
    lib: {
      entry: path.resolve(__dirname, 'src/model-viewer.js'),
      name: 'ModelViewer',
      fileName: (format) => `model-viewer.browser.${format}.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});