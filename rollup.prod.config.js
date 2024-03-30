'use-strict';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';

export default {
  context: 'window',
  input: 'src/main.tsx',
  output: {
    file: 'build/main.js',
    format: 'iife',
  },
  plugins: [
    resolve({ rootDir: 'src', browser: true }),
    copy({ targets: [{ src: 'public/**/*', dest: 'build' }] }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
  onwarn(warning, warn) {
    if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
      warn(warning);
    }
  },
};
