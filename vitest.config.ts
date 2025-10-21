import { defineConfig } from 'vitest/config';

export default defineConfig({
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
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.tsx',
        '**/*.spec.ts',
        'src/setupTests.ts',
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
