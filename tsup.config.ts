import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry point
  entry: ['src/index.tsx'],

  // Output formats: both ESM and CJS for maximum compatibility
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Clean dist folder before building
  clean: true,

  // Generate source maps for debugging
  sourcemap: true,

  // Target modern browsers and Node.js
  target: 'es2020',

  // Bundle dependencies (except externals)
  bundle: true,

  // Split output for better tree-shaking
  splitting: true,

  // Minify in production
  minify: process.env.NODE_ENV === 'production',

  // External dependencies (don't bundle peer deps)
  external: ['react', 'react-dom'],

  // Loader configuration for CSS files
  loader: {
    '.css': 'text',
  },

  // Output file naming
  outDir: 'dist',

  // Include declaration maps for better IDE support
  // This helps with go-to-definition in consuming projects
  tsconfig: './tsconfig.json',
});
