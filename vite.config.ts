
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true, // Add this to transform mixed modules
    },
    rollupOptions: {
      // Handle problematic modules as external
      external: [
        '@tensorflow/tfjs-core/dist/ops/ops_for_converter',
      ],
      output: {
        manualChunks: (id) => {
          // Split libraries into separate chunks
          if (id.includes('node_modules/@tensorflow')) {
            return 'tensorflow';
          }
          if (id.includes('node_modules/face-api')) {
            return 'face-api';
          }
          // Separate chunk for long library
          if (id.includes('node_modules/long')) {
            return 'vendors-long';
          }
          // Separate chunk for seedrandom
          if (id.includes('node_modules/seedrandom')) {
            return 'vendors-seedrandom';
          }
        },
        // Handle CommonJS modules (like long.js)
        format: 'es',
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd', 'face-api.js', 'long', 'seedrandom'],
    exclude: ['@tensorflow/tfjs-core/dist/ops/ops_for_converter'],
    esbuildOptions: {
      // Configuration for long.js and similar libraries
      define: {
        global: 'globalThis'
      },
    }
  }
}));
