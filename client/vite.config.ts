import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function stripCommentLines(): Plugin {
  const slash = String.raw`\/`;
  const pattern = new RegExp(`^\\s*(?:${slash}{2}.*|${slash}\\*.*|\\*.*)(?:\\n|$)`, 'gm');

  return {
    name: 'strip-comment-lines',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'chunk') {
          item.code = item.code.replace(pattern, '');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), stripCommentLines()],
  esbuild: {
    legalComments: 'none',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
