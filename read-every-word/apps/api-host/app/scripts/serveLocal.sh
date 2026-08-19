#!/usr/bin/env bash
set -e

# Runs the function app locally. Invoked by `nx serve api-host`, which depends
# on deploy-manifest, so dist/main.js and dist/package.json already exist by
# the time this runs.
#
# func start is the only way to run this app. `node dist/main.js` registers
# zero functions and exits 0: in the v4 programming model the http listener is
# the Functions host, which talks to the worker over grpc, so with no host
# present @azure/functions drops into "test mode" and skips every app.http()
# call. That failure is silent, which is why serve does not just run node.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${1:-7074}"

# Written by cicd/functionFetchAppSettings.sh, which lands it in the app root.
if [ ! -f "$APP_DIR/local.settings.json" ]; then
    echo "No local.settings.json at $APP_DIR." >&2
    echo "Fetch the app settings first:" >&2
    echo "  apps/api-host/cicd/functionFetchAppSettings.sh" >&2
    exit 1
fi

# func start reads local.settings.json from its own working directory, and that
# has to be dist - dist is the self-contained function app, and the app root's
# package.json main points into it. So the settings have to be copied down.
# Every build wipes dist, so this cannot be a one time setup step.
#
# Safe to leave there: dist/.funcignore lists local.settings.json, so the zip
# functionPush.sh publishes from this same directory excludes it.
cp "$APP_DIR/local.settings.json" "$APP_DIR/dist/local.settings.json"

cd "$APP_DIR/dist"

# The dependencies nx build left external. Unconditional because a build - or a
# cache restore of the build - clears this directory out from under us.
npm install --omit=dev --silent

# Debugging is opt in: INSPECT_PORT=9229 npx nx serve api-host
#
# It has to reach the node worker specifically, which the host spawns itself.
# NODE_OPTIONS would instead be inherited by every node process in the tree -
# nx's, npm's and the worker's - and they would all fight over the one port.
# languageWorkers__node__arguments is the double underscore env form of the
# languageWorkers:node:arguments host setting, so only the worker gets it.
if [ -n "$INSPECT_PORT" ]; then
    export languageWorkers__node__arguments="--inspect=127.0.0.1:$INSPECT_PORT"
    echo "Node worker will listen for a debugger on 127.0.0.1:$INSPECT_PORT"
fi

# exec so ctrl-c reaches func rather than this wrapper.
exec func start --port "$PORT"
