#!/usr/bin/env bash
set -e

# Anchored to this script rather than to the caller's cwd, so these no longer
# have to be run from the cicd directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

# api first: the front end stack reads the api's remote state for the edge
# worker's API_HOST binding.
echo "apply api *********************************************"
"$ROOT/server/api/cicd/apply.sh"

echo "apply front end *********************************************"
"$ROOT/read-every-word/apps/frontEnd/cicd/apply.sh"
