
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
    },
    rollupOptions: {
      external: [
        // Explicitly marking problematic TensorFlow.js imports as external
        '@tensorflow/tfjs-core/dist/ops/ops_for_converter',
      ],
      output: {
        manualChunks: {
          // Separate chunk for TensorFlow
          tensorflow: ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd', 'face-api.js'],
        }
      }
    },
    // Increasing the chunk size limit to accommodate large libraries
    chunkSizeWarningLimit: 2000,
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd', 'face-api.js'],
  }
}));
