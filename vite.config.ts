
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
      // Обработка проблемных модулей как внешних
      external: [
        '@tensorflow/tfjs-core/dist/ops/ops_for_converter',
      ],
      output: {
        manualChunks: (id) => {
          // Разделение библиотек на отдельные чанки
          if (id.includes('node_modules/@tensorflow')) {
            return 'tensorflow';
          }
          if (id.includes('node_modules/face-api')) {
            return 'face-api';
          }
          // Отдельный чанк для библиотеки long
          if (id.includes('node_modules/long')) {
            return 'vendors-long';
          }
          // Отдельный чанк для seedrandom
          if (id.includes('node_modules/seedrandom')) {
            return 'vendors-seedrandom';
          }
        },
        // Обработка модулей CommonJS (таких как long.js)
        format: 'es',
      }
    },
    // Увеличение лимита предупреждения о размере чанка
    chunkSizeWarningLimit: 3000,
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd', 'face-api.js', 'long', 'seedrandom'],
    exclude: ['@tensorflow/tfjs-core/dist/ops/ops_for_converter'],
    esbuildOptions: {
      // Настройка для long.js и подобных библиотек
      define: {
        global: 'globalThis'
      },
    }
  }
}));
