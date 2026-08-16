# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout — two generations of the same app

Read Every Word is a Bible reading tracker. The repo currently holds **two implementations side by side**:

- [read-every-word/](read-every-word/) — the **current** implementation. An Nx monorepo (npm workspaces), tRPC over Azure Functions. Active work happens here (branch `nx2`).
- [server/](server/) — the **legacy** implementation being replaced. Independent npm packages wired with `file:../..` deps, plain REST Azure Function endpoints, a Vue 3 + Vuetify UI, a BFF layer, and all the Terraform.

The legacy tree still owns the **infrastructure and deployment** ([server/api/terraform/](server/api/terraform/), [server/frontEnd/terraform/](server/frontEnd/terraform/), [cicd/](cicd/)). The new Nx workspace has no Terraform of its own yet. Domain types, `Result`, and validation logic were ported from `server/domain` + `server/infrastructure` into `read-every-word/packages/domain` + `packages/foundation`, so the two trees contain near-duplicate code — check which tree you're in before editing.

`android/`, `iphone/`, and `design/` are notes/placeholders, not code.

## Commands (Nx workspace)

All commands run from [read-every-word/](read-every-word/).

```sh
npm ci --legacy-peer-deps           # install (the --legacy-peer-deps flag is required; CI uses it)

npx nx run-many -t lint test build typecheck    # what CI runs
npx nx test @read-every-word/api                 # one project (use the full scoped name)
npx nx test @read-every-word/api -- validation   # one test file / pattern
npx nx build @read-every-word/api

npx nx integration-test @read-every-word/api-integration-test   # needs a real environment
npx nx sync                          # regenerate TS project references after changing cross-package imports
npx nx sync:check                    # verify references are current
npx nx graph
```

Running the function host locally:

```sh
npx nx prune api-host                # build + prune lockfile + copy workspace modules into apps/api-host/dist
cd apps/api-host/dist && npm ci --omit=dev
cd .. && func start --port 7074 --typescript
```

There is also a VS Code launch config, "Debug @read-every-word/api-host with Nx", which runs `nx serve` with `--inspect=9229`.

### Gotchas

- **Every project needs its own `.spec.swcrc`.** Each `jest.config.cjs` does `readFileSync(`${__dirname}/.spec.swcrc`)` at module load, and the `@nx/jest` plugin loads those configs while building the project graph — so one missing file makes *every* `nx` command fail with `ENOENT`, not just `nx test`. All eight are byte-identical; copy one when scaffolding a project.
- **`@swc/core` is pinned to an exact `1.13.20`.** The `1.13.21` darwin-arm64 binary ships a malformed code signature and fails `dlopen` with `code signature invalid` on Apple Silicon, which breaks all Jest runs. Don't loosen the pin back to a range without checking that the resolved version's native binding actually loads.
- The `merge-deps` target in [apps/api-host/package.json](read-every-word/apps/api-host/package.json) points at `apps/api-host/scripts/merge-deps.js`, which doesn't exist. `prune` doesn't depend on it, so it only bites if invoked directly.
- Two pre-existing `lint` errors block the CI command: the empty `GetHealthCheck` interface in [packages/domain/src/lib/healthCheck.ts:8](read-every-word/packages/domain/src/lib/healthCheck.ts#L8), and `@nx/dependency-checks` reporting `@read-every-word/foundation`, `@jest/globals`, and `tslib` missing from `packages/test-utils/package.json`.

## Architecture (Nx workspace)

Dependency direction, strictly one-way:

```
apps/api-host  →  packages/api  →  packages/domain
      ↓                ↓                ↓
azure-function-adapter  table-storage  foundation
```

- **`packages/foundation`** — no dependencies. Owns the `Result<T, E>` type (`ok`/`err`/`isOk`/`isErr`/`assertNever`) and the shared error classes (`NotFound`, `PersistenceError`, `Unauthorized`, `ValidationFailed`, …) plus the `CreateFailed`/`GetFailed`/`UpdateFailed`/`DeleteFailed` unions.
- **`packages/domain`** — pure types. Per aggregate (`readingCycle`, `readingRecord`, `readSummary`, `healthCheck`) it defines the request shape, the `…Succeeded`/`…Failed` unions, and the `…Result = Result<Succeeded, Failed>` alias. Also holds static Bible data (`bible.ts`, `book.ts`, `chapter.ts`).
- **`packages/api`** — the tRPC `appRouter` and all business logic. Exports `AppRouter` (type only), `Caller`, `createContextFromHeaders`, and `fromEnv`.
- **`packages/table-storage`** — Azure Table/Blob helpers: `cacheTableClient` (memoized `TableClient` per table name), the `resourceDoesNotExist`/`entityAlreadyExist` error predicates, and `withLock`.
- **`packages/azure-function-adapter`** — a hand-rolled tRPC↔Azure Functions v4 bridge (tRPC ships no official Azure adapter). Converts `HttpRequest` → fetch `Request`, calls `resolveResponse`, converts back.
- **`apps/api-host`** — thin. `main.ts` imports `trpc/endpoint.ts`, which reads config from env at module load (throwing on invalid config), then registers one `app.http('trpc', { route: 'trpc/{*path}' })` catch-all.
- **`packages/api-integration-test`** — tests that hit real Azure Table Storage and a real Auth0 token, via tRPC's direct-call API (`appRouter.createCaller`) rather than HTTP. Because these need a live environment they are **not** part of `test`: [nx.json](read-every-word/nx.json) registers `@nx/jest` twice against the glob `**/*integration-test*/**` — `exclude`d from the `test` target, `include`d in an `integration-test` target. So `nx run-many -t test` (and therefore CI) skips them, and they run explicitly via `nx integration-test`. This is by **naming convention**: any new project with `integration-test` in its directory name is automatically routed to the `integration-test` target and kept out of `test`.

### Errors are values, not exceptions

Nothing in `packages/api` throws for expected failures. Handlers return `Result` and the caller narrows with `isErr`. The pattern in every handler:

```ts
const validationResponse = await validate(request)
if (isErr(validationResponse)) return validationResponse
```

`assertNever` in exhaustive `switch` statements over `err.code` is how failure unions get mapped to transport concerns — see the legacy [server/api/app/src/readingCycles/create/endpoint.ts](server/api/app/src/readingCycles/create/endpoint.ts) for the fully worked HTTP-status version. Exceptions are caught at the persistence boundary and converted (`resourceDoesNotExist(e) → err(new NotFound())`, everything else → `err(new PersistenceError())`).

### Vertical slice per operation

`packages/api/src/lib/<aggregate>/<operation>/` holds `handler.ts`, `validation.ts`, `validation.test.ts`, and sometimes `persistence.ts`. Each aggregate's `index.ts` assembles its procedures into a sub-router, and [packages/api/src/index.ts](read-every-word/packages/api/src/index.ts) composes those into `appRouter`. [server/api/_template/](server/api/_template/) is the original scaffold for a slice.

Each handler exports **two** things: the tRPC procedure and a plain `handle…(request, config)` function. Cross-aggregate calls go through the plain function, not the router — `readSummary/get/handler.ts` calls `handleGetReadingCycles` and `handleCreateReadingCycle` directly.

Persistence placement is inconsistent by aggregate: `readingCycles` has one shared `persistence.ts` with a `Persistence` class; `readingRecord` has a `persistence.ts` per operation. Follow whichever aggregate you're in. Note also `readingRecord/count/handle.ts` (not `handler.ts`).

### Validation

Ajv JSON Schema, hand-written per operation, `additionalProperties: false`, converted to `ValidationFailed` carrying `InvalidSchema[]`. Zod was deliberately removed (commit `5f32cc0`) — don't reintroduce it, and don't use tRPC's built-in validators; procedures use the passthrough form `.input(r => r as SomeType)` because validation happens inside the handler.

Tests use `factory.ts` factories plus `expectOk`/`expectErrorMessage` from `@read-every-word/test-utils`.

### Auth

Auth0 JWTs, RS256, verified against JWKS with a 12-hour in-process key cache ([packages/api/src/lib/authentication.ts](read-every-word/packages/api/src/lib/authentication.ts)). `authenticatedProcedure` runs a middleware that validates the bearer token and **overwrites `input.authId` with the token's sanitized `sub`** — clients cannot act on another user's data by supplying a different `authId`. `publicProcedure` skips this; `healthCheck` and `clientConfig` are the only public procedures. `clientConfig` is public by necessity — it serves the Auth0 `domain`/`clientId`/`audience` the SPA needs *before* it can obtain a token, so it must return only those three fields and never spread `config.openId` (which holds `jwksUri`/`issuer`) or `config` (which holds the storage connection string).

`authId` is the Azure Table Storage `PartitionKey` throughout, and also the blob container name used for locking.

### Data model and locking

Azure Table Storage. Row types (`ReadingCycleRow`) live next to their `map(row) → DomainType` function in the aggregate's `domain.ts`; `partitionKey`/`rowKey`/`timestamp` are translated to `authId`/`id`/`lastModified` at that boundary — the domain types never leak storage field names.

`withLock` in [packages/table-storage/src/lib/storageLock.ts](read-every-word/packages/table-storage/src/lib/storageLock.ts) implements mutual exclusion via **blob lease acquisition** (60s lease, 100ms retry poll, caller-supplied timeout). It's needed because Table Storage has no cross-entity transactions: without it, concurrent requests create duplicate default reading cycles. Table transactions are batched in chunks of 100 (`submitTransaction` limit).

### Module system

ESM throughout the new workspace — `"type": "module"`, and **relative imports must carry the `.js` extension** even in `.ts` source. Cross-package imports use the scoped names (`@read-every-word/domain`); the `@read-every-word/source` custom export condition in [tsconfig.base.json](read-every-word/tsconfig.base.json) resolves those to `src/index.ts` during development so there's no build step between packages. Jest transpiles with `@swc/jest` (not ts-jest) reading each package's `.spec.swcrc`.

`@nx/dependency-checks` lints `package.json` files: a package's `dependencies` must match what it actually imports. Workspace-internal deps are listed under `ignoredDependencies` in each package's `eslint.config.mjs` — add there when introducing a new cross-package import.

## Deployment (legacy tree)

Everything is driven by shell scripts in [cicd/](cicd/) that shell out to per-service scripts in `server/*/cicd/`. `_standupEnv.sh` = init → apply (Terraform) → build → deploy. `variables.sh` selects the environment by commenting/uncommenting a block and derives a DNS-safe subdomain from the current git branch name.

**`cicd/variables.sh` contains live Azure and Cloudflare credentials in plaintext and is committed to the repo.** Treat as compromised; don't propagate those values into new files.

Azure resource names are generated by `azurecaf_name` from an **index-ordered list** in [server/api/terraform/names.tf](server/api/terraform/names.tf) — new entries must be *appended*, since inserting renames every later resource and forces replacement of the function app and service plan. Several comments in `function_app.tf` document provider quirks that cause non-converging diffs; read them before touching app settings or Application Insights wiring.

Required runtime env vars: `TABLE_STORAGE_CONNECTION_STRING`, `OPEN_ID_JWKS_URI`, `OPEN_ID_AUDIENCE`, `OPEN_ID_ISSUER`, `OPEN_ID_DOMAIN`, `OPEN_ID_CLIENT_ID`. All six are required — `fromEnv` fails on any missing one and `apps/api-host` throws at module load, so an incomplete app-settings block is a startup failure, not a degraded runtime. The last two are consumed only by `clientConfig.get`; the legacy tree sets them on the **BFF** function app ([server/frontEnd/terraform/function_app.tf](server/frontEnd/terraform/function_app.tf)), so they need adding wherever the api's `OPEN_ID_*` settings are supplied.

Integration tests need only `TABLE_STORAGE_CONNECTION_STRING` (Azurite works — see [packages/api-integration-test/.env.example](read-every-word/packages/api-integration-test/.env.example)). There is no Auth0 tenant involved: `createTestIdentityProvider()` in `packages/test-utils` generates a keypair and serves a JWKS on loopback, and each test gets its own subject and therefore its own storage partition.
