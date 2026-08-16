import { createRequire } from 'node:module';
import baseConfig from '../../../eslint.config.mjs';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tseslint from 'typescript-eslint';

// eslintrc format globals emitted by unplugin-auto-import.
const require = createRequire(import.meta.url);
const autoImport = require('./.eslintrc-auto-import.json');

export default [
  ...baseConfig,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: autoImport.globals,
    },
  },
  {
    files: ['**/*.{ts,mts,vue}'],
    languageOptions: { globals: autoImport.globals },
  },
  {
    files: ['**/*.{ts,mts,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
      // packages/api exports the router type and runtime values from the same
      // module. A value import drags @azure/data-tables, jsonwebtoken and
      // jwks-rsa into the browser bundle.
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@read-every-word/api',
              allowTypeImports: true,
              message:
                'Server code. Type-only imports (AppRouter) are fine; value imports poison the browser bundle.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: { parser: await import('jsonc-eslint-parser') },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            // Build and story tooling. These are devDependencies by design and
            // never reach the browser bundle.
            '{projectRoot}/vite.config.mts',
            '{projectRoot}/.storybook/**/*',
            '{projectRoot}/src/**/*.stories.ts',
            '{projectRoot}/src/stories/**/*',
          ],
          // The rule cannot see inside .vue files, so anything imported only
          // from an SFC (vuetify, @auth0/auth0-vue, vue itself) looks unused.
          checkObsoleteDependencies: false,
          ignoredDependencies: [
            '@read-every-word/api',
            '@read-every-word/domain',
            '@read-every-word/foundation',
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '**/dist',
      '**/storybook-static',
      '**/out-tsc',
      '**/.vite',
      'src/auto-imports.d.ts',
      'src/components.d.ts',
      'src/typed-router.d.ts',
    ],
  },
];
