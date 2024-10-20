import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/module',
    lib: {
      entry: path.resolve(__dirname, 'src/model-viewer.js'),
      name: 'ModelViewer',
      fileName: (format) => `model-viewer.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['three', 'lil-gui'],
      output: {
        globals: {
          three: 'THREE',
          'lil-gui': 'GUI',
        },
      },
    },
  },
});