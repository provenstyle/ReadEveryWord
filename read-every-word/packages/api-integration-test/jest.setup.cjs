/* eslint-disable */
const { resolve } = require('node:path');
const { existsSync } = require('node:fs');
const dotenv = require('dotenv');

// Integration tests read their configuration from a .env alongside this file.
//
// Loaded via setupFiles rather than globalSetup so it runs inside every jest
// worker, and before the test framework installs any module. Anything that
// reads process.env at import time therefore sees the values.
//
// Real environment variables win over the file, so CI can supply secrets
// without a .env present and a one-off override still works:
//   TABLE_STORAGE_CONNECTION_STRING=... npx nx integration-test ...
const envPath = resolve(__dirname, '.env');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath, quiet: true, override: false });
} else {
  console.warn(
    `[api-integration-test] No .env at ${envPath}.\n` +
      '  Copy .env.example to .env and fill it in, or export the variables directly.\n' +
      '  These tests talk to real Azure Table Storage and cannot run unconfigured.'
  );
}
