import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 关键：确保在 GitHub Pages 的子路径下资源路径正确
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});