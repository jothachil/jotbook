import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    // Ensure Node.js conditions are used for native module resolution
    conditions: ['node'],
    browserField: false,
    mainFields: ['module', 'main'],
  },
  build: {
    rollupOptions: {
      external: ['better-sqlite3'],
    },
  },
});
