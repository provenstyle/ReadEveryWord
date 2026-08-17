# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Read Every Word is a Bible reading tracker. Everything lives in [read-every-word/](read-every-word/) — an Nx monorepo (npm workspaces), tRPC over Azure Functions, the Vue 3 + Vuetify SPA, and all of the Terraform. Active work happens on branch `nx2`.

The legacy `server/` tree is **gone**, along with the BFF. It only verified the Auth0 JWT and forwarded to the REST api, and `packages/api` verifies tokens itself. The SPA calls the tRPC router directly, and Cloudflare's edge worker routes `/api/*` to the api function app.

**All infrastructure now lives in the Nx tree.** Both apps follow the same three-sibling shape — the deployable code, its Terraform, and its cicd scripts together:

```
read-every-word/apps/
├── api-host/{app,cicd,terraform}     # function app, table storage
└── frontEnd/{ui,cicd,terraform}      # blob storage, cloudflare dns + worker
```

The Nx project root is the first folder in each (`api-host/app`, `frontEnd/ui`); `cicd` and `terraform` are plain directories, not workspace packages. Orchestration is still [cicd/](cicd/) at the repo root.

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

Running the UI locally (proxies `/api` to the function host on 7074):

```sh
npx nx serve @read-every-word/ui     # http://localhost:3000
```

Running the function host locally — note it runs **from `dist`**, which is a
self-contained function app, and takes no `--typescript` flag:

```sh
npx nx deploy-manifest api-host      # build, then write dist/package.json
cd apps/api-host/app/dist && npm install --omit=dev
func start --port 7074
```

There is also a VS Code launch config, "Debug @read-every-word/api-host with Nx", which runs `nx serve` with `--inspect=9229`.

### Gotchas

- **Every project needs its own `.spec.swcrc`.** Each `jest.config.cjs` does `readFileSync(`${__dirname}/.spec.swcrc`)` at module load, and the `@nx/jest` plugin loads those configs while building the project graph — so one missing file makes *every* `nx` command fail with `ENOENT`, not just `nx test`. They are byte-identical; copy one when scaffolding a project. This only applies to projects that *have* a `jest.config.cjs` — `apps/frontEnd/ui` has none, so it has no `test` target and needs no `.spec.swcrc`.
- **`@swc/core` is pinned to an exact `1.13.20`.** The `1.13.21` darwin-arm64 binary ships a malformed code signature and fails `dlopen` with `code signature invalid` on Apple Silicon, which breaks all Jest runs. Don't loosen the pin back to a range without checking that the resolved version's native binding actually loads.
- **`vue-router` is pinned to `~4.4.5` and declared at the workspace root.** 4.5 ships its own `vue-router-auto.d.ts`, which collides with the `vue-router/auto` module `unplugin-vue-router` declares. It sits at the root because `unplugin-vue-router` does `export * from 'vue-router'` from its own location — if npm nests `vue-router` under the ui project instead, that re-export resolves to nothing and `createRouter` appears to not exist.
- **`nx build api-host` wipes `apps/api-host/app/dist`**, including the generated `package.json` and the `node_modules` you installed into it. Anything that builds — `nx run-many -t build`, and therefore the CI command — leaves a half-populated `dist` behind, and `func start` there reports "Worker failed to load package.json" and registers no functions. Re-run `nx deploy-manifest api-host` (it restores `package.json` from cache) and `npm install --omit=dev`. `functionPush.sh` already does both in that order.
- Two pre-existing `lint` errors block the CI command: the empty `GetHealthCheck` interface in [packages/domain/src/lib/healthCheck.ts:8](read-every-word/packages/domain/src/lib/healthCheck.ts#L8), and `@nx/dependency-checks` reporting `dotenv` declared but unused in `packages/api-integration-test/package.json` (the import went away in `64f4a8b`; the fix is deleting the dependency). The second only surfaces after `nx reset` — a stale cache entry reports the task as passing, so a green local `run-many` is not proof.
- `apps/frontEnd/ui` reports ~200 `eslint` **warnings** (vue formatting). They do not fail CI. The legacy project hid them by running `eslint . --fix` as its lint script.

## Architecture (Nx workspace)

Dependency direction, strictly one-way:

```
apps/frontEnd/ui ─┐
                  ├→  packages/api  →  packages/domain
apps/api-host/app ─┘         ↓                ↓
      ↓            table-storage         foundation
azure-function-adapter
```

`apps/frontEnd/ui` depends on `packages/api` for **types only** (`AppRouter`); see the UI section below.

- **`packages/foundation`** — no dependencies. Owns the `Result<T, E>` type (`ok`/`err`/`isOk`/`isErr`/`assertNever`) and the shared error classes (`NotFound`, `PersistenceError`, `Unauthorized`, `ValidationFailed`, …) plus the `CreateFailed`/`GetFailed`/`UpdateFailed`/`DeleteFailed` unions.
- **`packages/domain`** — pure types. Per aggregate (`readingCycle`, `readingRecord`, `readSummary`, `healthCheck`) it defines the request shape, the `…Succeeded`/`…Failed` unions, and the `…Result = Result<Succeeded, Failed>` alias. Also holds static Bible data (`bible.ts`, `book.ts`, `chapter.ts`).
- **`packages/api`** — the tRPC `appRouter` and all business logic. Exports `AppRouter` (type only), `Caller`, `createContextFromHeaders`, and `fromEnv`.
- **`packages/table-storage`** — Azure Table/Blob helpers: `cacheTableClient` (memoized `TableClient` per table name), the `resourceDoesNotExist`/`entityAlreadyExist` error predicates, and `withLock`.
- **`packages/azure-function-adapter`** — a hand-rolled tRPC↔Azure Functions v4 bridge (tRPC ships no official Azure adapter). Converts `HttpRequest` → fetch `Request`, calls `resolveResponse`, converts back.
- **`apps/api-host/app`** — thin. `src/config.ts` reads config from env at module load (throwing on invalid config); `trpc/endpoint.ts` registers one `app.http('trpc', { route: 'trpc/{*path}' })` catch-all; `keepWarm.ts` optionally registers a timer. See "Deploying api-host" below — the build is unusual.
- **`apps/frontEnd/ui`** — the Vue 3 + Vuetify SPA. See "The UI" below.
- **`packages/api-integration-test`** — tests that hit real Azure Table Storage and a real Auth0 token, via tRPC's direct-call API (`appRouter.createCaller`) rather than HTTP. Because these need a live environment they are **not** part of `test`: [nx.json](read-every-word/nx.json) registers `@nx/jest` twice against the glob `**/*integration-test*/**` — `exclude`d from the `test` target, `include`d in an `integration-test` target. So `nx run-many -t test` (and therefore CI) skips them, and they run explicitly via `nx integration-test`. This is by **naming convention**: any new project with `integration-test` in its directory name is automatically routed to the `integration-test` target and kept out of `test`.

### Errors are values, not exceptions

Nothing in `packages/api` throws for expected failures. Handlers return `Result` and the caller narrows with `isErr`. The pattern in every handler:

```ts
const validationResponse = await validate(request)
if (isErr(validationResponse)) return validationResponse
```

`assertNever` in exhaustive `switch` statements over `err.code` is how failure unions get mapped to transport concerns. Exceptions are caught at the persistence boundary and converted (`resourceDoesNotExist(e) → err(new NotFound())`, everything else → `err(new PersistenceError())`).

### Vertical slice per operation

`packages/api/src/lib/<aggregate>/<operation>/` holds `handler.ts`, `validation.ts`, `validation.test.ts`, and sometimes `persistence.ts`. Each aggregate's `index.ts` assembles its procedures into a sub-router, and [packages/api/src/index.ts](read-every-word/packages/api/src/index.ts) composes those into `appRouter`.

Each handler exports **two** things: the tRPC procedure and a plain `handle…(request, config)` function. Cross-aggregate calls go through the plain function, not the router — `readSummary/get/handler.ts` calls `handleGetReadingCycles` and `handleCreateReadingCycle` directly.

Persistence placement is inconsistent by aggregate: `readingCycles` has one shared `persistence.ts` with a `Persistence` class; `readingRecord` has a `persistence.ts` per operation. Follow whichever aggregate you're in. Note also `readingRecord/count/handle.ts` (not `handler.ts`).

### Validation

Ajv JSON Schema, hand-written per operation, `additionalProperties: false`, converted to `ValidationFailed` carrying `InvalidSchema[]`. Zod was deliberately removed (commit `5f32cc0`) — don't reintroduce it, and don't use tRPC's built-in validators; procedures use the passthrough form `.input(r => r as SomeType)` because validation happens inside the handler.

Tests use `factory.ts` factories plus `expectOk`/`expectErrorMessage` from `@read-every-word/test-utils`.

### Auth

Auth0 JWTs, RS256, verified against JWKS with a 12-hour in-process key cache ([packages/api/src/lib/authentication.ts](read-every-word/packages/api/src/lib/authentication.ts)). `authenticatedProcedure` runs a middleware that validates the bearer token, derives the sanitized `sub`, and puts it on the **context** as `ctx.authId`. `publicProcedure` skips this; `healthCheck` and `clientConfig` are the only public procedures.

> 🚨 **`authId` never appears in a request type.** It is the Azure Table Storage `PartitionKey` and the blob container name used for locking, so it decides whose data a request touches. It is derived from the verified token and reaches handlers on a separate slot:
>
> ```ts
> export interface Principal { authId: string }
> export interface Authenticated<TRequest> { request: TRequest; principal: Principal }
> ```
>
> Build authenticated procedures with `authenticatedQuery` / `authenticatedMutation` (client input) or `principalQuery` / `principalMutation` (identity is the whole input) from [packages/api/src/lib/trpc.ts](read-every-word/packages/api/src/lib/trpc.ts). Those four builders are the **only** places identity is attached to a request, so there is no per-slice step to forget. Read `principal.authId`, never `request.authId` — the request types have no such field, so an attempt is a compile error.
>
> An earlier version merged the two with `{ ...input, authId: ctx.authId }`, which was safe only because `authId` came last in the spread. Before that, a middleware tried to mutate `input` and silently did nothing, because a middleware only sees input from parsers registered before it and `authenticatedProcedure` is built before any `.input()`. Don't reintroduce either shape.
>
> The property is defended twice over, which is worth knowing when changing either layer: `additionalProperties: false` on every schema means a client that sends `authId` is **rejected** with `must NOT have additional properties`, and separately nothing reads `authId` off a request. `authIdIsTakenFromTheToken.test.ts` covers both, going around the types with `as any` since a typed client cannot express the attack.
>
> `authId` is server-only in both directions: the entities (`ReadingCycle`, `ReadingRecord`, `DeletedReadingRecord`) do not carry it either, so responses never echo the partition key.

`clientConfig` is public by necessity — it serves the Auth0 `domain`/`clientId`/`audience` the SPA needs *before* it can obtain a token, so it must return only those three fields and never spread `config.openId` (which holds `jwksUri`/`issuer`) or `config` (which holds the storage connection string).

`sanitizeAuthId` strips pipes from the `sub`, and `isUsableAuthId` rejects anything that would not be a legal Azure container name — token validation fails such a token rather than letting it reach storage. That predicate is a **reject, never transform** guard on purpose: `authId` is the live PartitionKey for existing data, so normalizing it would repartition those users and orphan what they have written.

### Data model and locking

Azure Table Storage. Row types (`ReadingCycleRow`) live next to their `map(row) → DomainType` function in the aggregate's `domain.ts`; `rowKey`/`timestamp` are translated to `id`/`lastModified` at that boundary, and `partitionKey` is deliberately *not* projected back out — the domain types never leak storage field names.

`withLock` in [packages/table-storage/src/lib/storageLock.ts](read-every-word/packages/table-storage/src/lib/storageLock.ts) implements mutual exclusion via **blob lease acquisition** (60s lease, 100ms retry poll, caller-supplied timeout). It's needed because Table Storage has no cross-entity transactions: without it, concurrent requests create duplicate default reading cycles. Table transactions are batched in chunks of 100 (`submitTransaction` limit).

### Module system

ESM throughout the new workspace — `"type": "module"`, and **relative imports must carry the `.js` extension** even in `.ts` source. Cross-package imports use the scoped names (`@read-every-word/domain`); the `@read-every-word/source` custom export condition in [tsconfig.base.json](read-every-word/tsconfig.base.json) resolves those to `src/index.ts` during development so there's no build step between packages. Jest transpiles with `@swc/jest` (not ts-jest) reading each package's `.spec.swcrc`.

`@nx/dependency-checks` lints `package.json` files: a package's `dependencies` must match what it actually imports. Workspace-internal deps are listed under `ignoredDependencies` in each package's `eslint.config.mjs` — add there when introducing a new cross-package import.

## The UI (`apps/frontEnd/ui`)

Vite 5, file-based routing via `unplugin-vue-router`, Auth0 via `@auth0/auth0-vue`, Pinia, Vuetify. Targets are hand-rolled in `package.json` under `nx.targets`, matching the api-host convention — there is no `project.json` and no workspace-wide Vite plugin.

Things that will bite:

- **`typecheck` runs `vue-tsc`, not `tsc`.** The `@nx/js/typescript` plugin infers a `tsc --build` typecheck target, which cannot parse `.vue`. The inferred target is overridden in `package.json`.
- **`tsconfig.app.json` extends `@vue/tsconfig`, not `tsconfig.base.json`**, and restates `customConditions: ["@read-every-word/source"]` by hand. That condition compiles `@read-every-word/*` from TS source, which puts server-authored files into the UI's program — hence `verbatimModuleSyntax: false` (domain imports types without a `type` modifier) and `types: ["node"]` (`packages/api/src/lib/config.ts` reads `process.env`).
- **`nx sync` would strip the `packages/{domain,foundation}` project references**, because the imports justifying them live in `.vue` files, which Nx's import analysis does not parse. They are pinned via `nx.sync.ignoredReferences` in `tsconfig.app.json`. Removing that guard breaks typecheck with TS6307.
- **`@nx/dependency-checks` sets `checkObsoleteDependencies: false` here**, because the rule cannot see inside `.vue` files and would report `vuetify`, `@auth0/auth0-vue` and `vue` itself as unused.
- `vite.config.mts` must spell out `resolve.conditions` in full — Vite *replaces* the default list rather than appending.

### Talking to the api

`src/api/client.ts` builds a tRPC client over `import type { AppRouter } from '@read-every-word/api'`. The full router is available with end-to-end inference.

**Keep that import type-only.** `packages/api` exports the router instance and `fromEnv` from the same module, so a value import pulls `@azure/data-tables`, `jsonwebtoken` and `jwks-rsa` into the browser bundle. Vite would resolve it happily; the guard is a `no-restricted-imports` rule with `allowTypeImports`. The regression test is `grep -rliE 'data-tables|jwks-rsa|jsonwebtoken' apps/frontEnd/ui/dist/assets`, which must come back empty.

`createApiClient`'s return type is **annotated**, not inferred — `composite: true` makes tsc emit declarations and it cannot name tRPC's inferred client type without reaching into `packages/api` internals (TS2742).

Procedures return `Result` values as their *payload* rather than throwing, and `isOk`/`isErr` discriminate on a plain `__result` string while the error classes carry `code`/`message` as instance fields — so all of that survives JSON and the UI's error branching works unchanged. Class prototypes do **not** survive; never use `instanceof` on the err side. `src/api/result.ts` (`fromTrpc`) exists only to map transport and middleware failures — which tRPC *does* throw — back onto the same error classes.

Authenticated calls send no identity at all — `authId` is not part of any request type. `readSummary.get` and `readingCycle.get` take no argument whatsoever.

## Deployment

Everything is driven by shell scripts in [cicd/](cicd/), which shell out to per-service scripts. `_standupEnv.sh` = init → **build** → apply (Terraform) → deploy; build comes before apply so a compile error cannot strand an environment mid-cutover. All scripts anchor off `git rev-parse --show-toplevel` rather than counting `..`, so they can be run from anywhere.

Two stacks:

| Stack | Terraform | cicd | Deploys |
|---|---|---|---|
| api | [apps/api-host/terraform/](read-every-word/apps/api-host/terraform/) | [apps/api-host/cicd/](read-every-word/apps/api-host/cicd/) | `apps/api-host/app` to the function app |
| front end | [apps/frontEnd/terraform/](read-every-word/apps/frontEnd/terraform/) | [apps/frontEnd/cicd/](read-every-word/apps/frontEnd/cicd/) | `apps/frontEnd/ui` to blob storage `$web` |

Both cicd folders hold the same script set — `init/plan/apply/destroy/validate/outputs/variables.sh` — and each resolves its Terraform as `$SCRIPT_DIR/../terraform`, which is why the sibling layout matters.

`cicd/variables.sh` selects the environment by commenting/uncommenting a block and derives a DNS-safe subdomain from the current git branch. **It holds live Azure and Cloudflare credentials in plaintext.** It is gitignored and untracked (CLAUDE.md previously claimed otherwise), but treat the values as compromised and don't copy them into new files. `local.settings.json` is gitignored for the same reason.

Because `BRANCH` feeds both the Terraform state key *and* the subdomain, **every branch gets a fully isolated stack** at `dev-<branch>.readeveryword.com`. Use that to rehearse risky changes.

Order matters: **api applies before front end**, because the front end stack reads the api's remote state for the edge worker's `API_HOST` binding.

### Traps

- **`names.tf` is an index-ordered list** in both stacks. `azurecaf_name` is `for_each`'d by list index, so entries may only be *appended*. Indexes 1–6 in the front end stack are **dead placeholders** for the deleted BFF and static web app; removing them shifts `frontend_storage` and forces the live storage account holding `$web` to be replaced. `terraform plan | grep azurecaf` should always be empty on an existing stack.
- Don't `terraform state rm` the BFF resources. Deleting the config and applying is what destroys them; `state rm` orphans them, still billing.
- Several comments in `function_app.tf` document provider quirks causing non-converging diffs; read them before touching app settings or Application Insights wiring.
- The Auth0 audience is still named `read-every-word-bff-{dev,prod}`. Auth0 API identifiers are **immutable**, so renaming means a new API, re-authorizing the SPA, and 401ing every cached token. Left as-is deliberately.

### Routing

Cloudflare worker ([apps/frontEnd/terraform/edge_worker.js](read-every-word/apps/frontEnd/terraform/edge_worker.js)) fans one hostname out to two origins: `/api/*` → the api function app (`API_HOST`), everything else → blob storage (`WEB_HOST`), rewriting storage's 404-with-shell into a 200 for SPA deep links.

The browser's `/api` prefix and the Azure Functions default route prefix are both `api`, so `/api/trpc/x` forwards **unchanged**. Setting `routePrefix` in `host.json` would break that and the worker would have to strip. The route is `authLevel: 'anonymous'`, so no function key is involved — auth is entirely the Auth0 JWT, which also means the `*.azurewebsites.net` host is directly reachable and must not be treated as a trusted origin.

### Deploying api-host

The build **bundles every workspace library into a single ESM `dist/main.js`** and leaves npm packages external (`bundle: true`, `thirdParty: false`, `format: ["esm"]`). This is deliberate and replaces an earlier `bundle: false` + `workspace_modules` setup that was not actually deployable:

- The copied `main` resolved to `dist/dist/...`, so the host registered zero functions and 404'd everything with no deploy-time error.
- The workspace packages were undeclared and only resolved via npm workspace symlinks.
- CJS output `require`-ing packages that are all `"type": "module"`.
- `file:` deps install as symlinks, which may not survive Core Tools' zip packer.

`dist/package.json` is written by [scripts/generate-deploy-manifest.mjs](read-every-word/apps/api-host/app/scripts/generate-deploy-manifest.mjs), which derives the dependency list from the specifiers `main.js` still imports — so a new dependency anywhere under `packages/` cannot reach Azure as a cold-start crash. (Nx's own `generatePackageJson` refuses to run against this workspace's TS solution setup.)

Deploys are **local build, `--no-build` publish** — no Oryx. `SCM_DO_BUILD_DURING_DEPLOYMENT` is `false` accordingly.

### App settings

Required: `TABLE_STORAGE_CONNECTION_STRING`, `OPEN_ID_JWKS_URI`, `OPEN_ID_AUDIENCE`, `OPEN_ID_ISSUER`, `OPEN_ID_DOMAIN`, `OPEN_ID_CLIENT_ID`. All six are read by `fromEnv` at module load and `apps/api-host` throws on any missing one, so an incomplete block is a **startup failure of the whole app**, not a degraded endpoint. The last two are consumed only by `clientConfig.get`. They live in [apps/api-host/terraform/envs/{dev,prod}/terraform.tfvars](read-every-word/apps/api-host/terraform/envs/).

`KEEP_WARM` is optional and deliberately **not** in `fromEnv`'s list — a missing flag should mean off, not a dead app. When true, `apps/api-host` registers a once-a-minute timer that makes a real HTTP request to its own `healthCheck.get`. It must stay an HTTP call: a timer firing keeps an instance alive but never exercises the HTTP path, which is what callers hit and what the consumption plan's scale controller watches. Each firing should log a `keep_warm_timer` invocation *and* a separate inbound `Functions.trpc` one.

Integration tests need only `TABLE_STORAGE_CONNECTION_STRING` (Azurite works — see [packages/api-integration-test/.env.example](read-every-word/packages/api-integration-test/.env.example)). There is no Auth0 tenant involved: `createTestIdentityProvider()` in `packages/test-utils` generates a keypair and serves a JWKS on loopback, and each test gets its own subject and therefore its own storage partition.
