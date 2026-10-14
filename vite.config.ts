import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative URLs, so the build works from any sub-path, such as GitHub Pages' /trip-quote/.
  base: './',
});
