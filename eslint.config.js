'use-strict';

import eslint from '@eslint/js';
import eslintTs from 'typescript-eslint';
import eslintPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default eslintTs.config(
  eslint.configs.recommended,
  ...eslintTs.configs.recommendedTypeChecked,
  eslintPrettier,
  {
    ignores: ['build/*', 'node_modules/*'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['*.config.js'],
    ...eslintTs.configs.disableTypeChecked,
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['src/*'],
    languageOptions: { globals: { ...globals.browser } },
  },
);
