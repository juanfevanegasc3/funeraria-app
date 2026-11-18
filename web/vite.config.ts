import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const webRoot = fileURLToPath(new URL('.', import.meta.url));

// El frontend vive en web/ y compila hacia ../dist, que el Worker sirve con [assets].
export default defineConfig({
  root: webRoot,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('../dist', import.meta.url)),
    emptyOutDir: true,
  },
  server: {
    // `npm run dev:web` + `npx wrangler dev` en paralelo: la API se proxifica al Worker local.
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
});
