import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

function nojekyll(): Plugin {
  return {
    name: 'nojekyll',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
    },
  };
}

export default defineConfig({
  base: '/genki/',
  plugins: [react(), tailwindcss(), nojekyll()],
});
