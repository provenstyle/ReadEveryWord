#!/usr/bin/env bash
set -e

# Anchored to this script rather than to the caller's cwd, so these no longer
# have to be run from the cicd directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

# The legacy server/api/cicd/functionPush.sh is not called here any more.
# apps/api-host deploys to the same function app, so running both would mean
# whichever went last wins.
echo "deploy api            *********************************************"
"$ROOT/read-every-word/apps/api-host/cicd/functionPush.sh"

echo "deploy ui             *********************************************"
"$ROOT/read-every-word/apps/frontEnd/cicd/publishFrontend.sh"
