#!/usr/bin/env bash
set -e

# Anchored to this script rather than to the caller's cwd, so these no longer
# have to be run from the cicd directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

echo "init api            *********************************************"
"$ROOT/read-every-word/apps/api-host/cicd/init.sh"

echo "init front end      *********************************************"
"$ROOT/read-every-word/apps/frontEnd/cicd/init.sh"
