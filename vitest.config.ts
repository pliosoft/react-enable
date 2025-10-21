import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Global test setup
    globals: true,

    // Setup files
    setupFiles: ['./src/setupTests.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.tsx',
        '**/*.spec.ts',
        'src/setupTests.ts',
        '**/*.config.*',
        '**/test.tsx',
      ],
    },

    // CSS module mocking
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },

  resolve: {
    alias: {
      // Map CSS imports to identity-obj-proxy equivalent
      '\\.css$': 'identity-obj-proxy',
    },
  },
});
