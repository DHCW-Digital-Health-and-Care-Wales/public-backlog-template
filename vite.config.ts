import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Production build uses Preact (via React-compatible aliases) to keep the
// shipped JavaScript within the performance budget (specs/08). The component
// code is written against the React API unchanged. Tests run against React
// (see vitest.config.ts). Relative base so the site works on any GitHub Pages
// path without reconfiguration (see docs/DECISIONS.md).
export default defineConfig({
  base: './',
  plugins: [preact()],
  build: {
    target: 'es2020',
    cssMinify: true,
  },
});
