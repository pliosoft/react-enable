#!/usr/bin/env node

import { nodeExternalsPlugin } from 'esbuild-node-externals';
import esbuild from 'esbuild';

const dist = process.argv.includes('--dist') || process.env.NODE_ENV === 'production';
const watch = !dist && process.argv.includes('--watch');
const entries = ['src/index.tsx'];

const a = esbuild.build({
  logLevel: 'info',
  entryPoints: entries,
  minify: !watch,
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es6',
  plugins: [nodeExternalsPlugin()],
  minify: dist,
  sourcemap: 'both',
  outdir: 'dist/esm',
  loader: { '.css': 'text' },
  outbase: './',
  incremental: watch,
  watch,
});

const b = esbuild.build({
  logLevel: 'info',
  entryPoints: entries,
  minify: !watch,
  bundle: true,
  format: 'cjs',
  target: 'es6',
  plugins: [nodeExternalsPlugin()],
  minify: dist,
  sourcemap: 'both',
  outdir: 'dist/cjs',
  loader: { '.css': 'text' },
  outbase: './',
  incremental: watch,
  watch,
});

await Promise.all([a, b]);
