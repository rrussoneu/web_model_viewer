import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/model-viewer.js'),
      name: 'ModelViewer',
      fileName: (format) => `model-viewer.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
     
        }
      }
    }
  }
});