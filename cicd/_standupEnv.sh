#!/usr/bin/env bash
set -e

# Anchored to this script rather than to the caller's cwd, so these no longer
# have to be run from the cicd directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

# Build before apply, so a compile error cannot strand the environment
# mid-cutover with the bff destroyed and nothing deployed in its place.
echo "standup environment *********************************************"
"$SCRIPT_DIR/initAll.sh"
"$SCRIPT_DIR/buildAll.sh"
"$SCRIPT_DIR/applyAll.sh"
"$SCRIPT_DIR/deployAll.sh"
