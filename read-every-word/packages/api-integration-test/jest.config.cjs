/* eslint-disable */
const { readFileSync } = require('fs');

// Reading the SWC compilation config for the spec files
const swcJestConfig = JSON.parse(
  readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8')
);

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

module.exports = {
  verbose: true,
  displayName: '@read-every-word/api-integration-test',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  // Loads .env before any test module is imported.
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  // uuid and lodash-es are ESM-only, so they must be transformed rather than
  // ignored like the rest of node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|lodash-es)/)'
  ]
};
