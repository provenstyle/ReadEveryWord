#!/usr/bin/env bash
set -e

# Anchored to this script rather than to the caller's cwd, so these no longer
# have to be run from the cicd directory.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

echo "build nx workspace   *********************************************"
cd "$ROOT/read-every-word"
npm ci
# lint is deliberately absent: two pre-existing failures would abort the
# standup under set -e. CI covers it.
npx nx run-many -t build test typecheck
