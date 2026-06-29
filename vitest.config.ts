import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Tests run against React (not the Preact production alias) so
// @testing-library/react works directly. Component behaviour is identical.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    css: false,
  },
});
