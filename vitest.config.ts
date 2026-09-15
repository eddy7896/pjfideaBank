import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // happy-dom gives every test a real window/document/localStorage -
    // route-logic tests run exactly as before (it's a superset of the
    // Node globals they use), and component tests can now actually
    // render into a DOM and interact with it instead of only being
    // reachable through Playwright's much heavier real-browser e2e path.
    environment: 'happy-dom',
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
