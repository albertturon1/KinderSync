import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import js from '@eslint/js';
import globals from 'globals';
import { fixupPluginRules } from '@eslint/compat';

export default defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      'build/**',
      'dist/**',
      'eslint.config.mjs',
      'metro.config.js',
      'babel.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  pluginReact.configs.flat.recommended,
  {
    ignores: ['dist/*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import/resolver': { typescript: true, node: true },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      'react-native': fixupPluginRules(pluginReactNative),
    },
    rules: {
      'import/no-named-as-default-member': 'off',
      'react/display-name': 'off',
      'react-native/no-unused-styles': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-console': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
]);
