import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // ===========================
  // Production Build Configuration
  // ===========================
  build: {
    outDir: '../src/main/resources/static',  // Build directly into Spring Boot static folder
    emptyOutDir: true,                        // Clean before build
    sourcemap: false,                         // No source maps in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for core React libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI chunk for Radix UI components
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-popover',
          ],
        },
      },
    },
  },

  // ===========================
  // Development Server Configuration
  // ===========================
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy WebSocket connections
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
