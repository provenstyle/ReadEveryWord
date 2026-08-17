// Writes the package.json that ships inside apps/api-host/dist.
//
// The build bundles every workspace library into main.js and leaves npm
// packages external, so the deployed app needs a manifest listing exactly
// those externals. Deriving it from the bundle rather than hand maintaining a
// list means it cannot drift: adding a dependency to packages/api shows up
// here automatically instead of as a cold start crash in azure.
//
// nx's own generatePackageJson is not available to us; it refuses to run
// against this workspace's typescript solution setup.

import { readFileSync, writeFileSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(scriptDir, '..')
const workspaceRoot = join(projectRoot, '..', '..')
const distDir = join(projectRoot, 'dist')

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

const bundle = readFileSync(join(distDir, 'main.js'), 'utf8')

// Every bare specifier the bundle still imports at runtime.
const specifiers = new Set()
for (const match of bundle.matchAll(/(?:from|import|require\()\s*["']([^"']+)["']/g)) {
  const specifier = match[1]
  if (specifier.startsWith('.') || specifier.startsWith('node:')) continue
  if (builtinModules.includes(specifier)) continue
  // Reduce subpaths to their package: @trpc/server/http -> @trpc/server
  const parts = specifier.split('/')
  specifiers.add(specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0])
}

// Versions come from wherever the workspace already declares them, so the
// deployed app installs the same ranges the workspace resolved against.
const declared = {
  ...readJson(join(workspaceRoot, 'package.json')).dependencies,
  ...readJson(join(projectRoot, 'package.json')).dependencies,
}

const dependencies = {}
const missing = []
for (const name of [...specifiers].sort()) {
  if (name.startsWith('@read-every-word/')) {
    missing.push(`${name} (workspace package: it should have been bundled, not left external)`)
    continue
  }
  if (!declared[name]) {
    missing.push(`${name} (not declared in the workspace root or apps/api-host package.json)`)
    continue
  }
  dependencies[name] = declared[name]
}

if (missing.length) {
  console.error('Cannot write the deploy manifest. Unresolved runtime imports:')
  for (const entry of missing) console.error(`  - ${entry}`)
  process.exit(1)
}

writeFileSync(
  join(distDir, 'package.json'),
  JSON.stringify(
    {
      name: 'read-every-word-api-host',
      version: readJson(join(projectRoot, 'package.json')).version,
      private: true,
      // The bundle is esm, and the v4 programming model loads it as such.
      type: 'module',
      // Relative to dist, which is the app root the function host runs from.
      main: 'main.js',
      dependencies,
    },
    null,
    2
  ) + '\n'
)

console.log(`Wrote dist/package.json with ${Object.keys(dependencies).length} dependencies:`)
for (const [name, range] of Object.entries(dependencies)) console.log(`  ${name} ${range}`)
