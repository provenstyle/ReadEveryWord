#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/outputs.sh"

# Writes local.settings.json holding the real connection string. Gitignored;
# do not move it anywhere that is not.
cd "$SCRIPT_DIR/../app"

func azure functionapp fetch-app-settings $FUNCTION_APP_NAME --no-encrypt
func settings decrypt
