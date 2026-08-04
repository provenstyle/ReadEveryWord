# Manual migrations

One time scripts, run by hand against a specific environment. Nothing in here is
called by `_standupEnv.sh` or the `*All.sh` scripts, and nothing here is needed
to stand up a new environment from scratch — each script exists to move an
environment that predates some change onto the other side of it.

They read `ENVIRONMENT` from `cicd/variables.sh` like the rest of the pipeline,
so switch environments the same way you would for an apply. All of them are safe
to re-run.

## disableEasyAuth.sh

Registering the bff as a static web app backend made azure turn on easy auth
with an `azureStaticWebApps` identity provider. Moving the front end to storage
plus a cloudflare worker removed the static web app, but the auth setting
outlives the link and answers every request with a 401 before the function runs
— including `/api/config`, which is anonymous by design. This switches it off
and drops the stale provider.

The bff validates auth0 jwts itself in `bff/app/src/authentication.ts`, so easy
auth has nothing left to do once the static web app is gone.

Run it after `applyAll.sh`, once per environment:

    cd server/frontEnd/cicd/manual-migrations && ./disableEasyAuth.sh

Expect `platform` and `requireAuthentication` to go `true` -> `false`, and
`staticWebApps` to go `true` -> `null`. An environment created after the move
reports `false`/`null` both times.

- dev: done 2026-08-04
- prod: pending
