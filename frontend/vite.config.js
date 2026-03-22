import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: env.VITE_HOST || 'localhost',
      port: parseInt(env.VITE_PORT) || 3000,
      strictPort: false,
      open: false
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production' ? false : true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            axios: ['axios']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    preview: {
      host: env.VITE_HOST || 'localhost',
      port: parseInt(env.VITE_PORT) || 3000
    }
  };
});