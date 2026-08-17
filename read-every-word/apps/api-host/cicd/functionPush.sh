#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
NX_ROOT="$REPO_ROOT/read-every-word"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/outputs.sh"

# func publish authenticates through the azure cli, which does not read the
# ARM_* variables terraform uses, so sign in explicitly
az login                              \
    --service-principal               \
    --username "$ARM_CLIENT_ID"       \
    --password "$ARM_CLIENT_SECRET"   \
    --tenant "$ARM_TENANT_ID"         \
    --output none
az account set --subscription "$ARM_SUBSCRIPTION_ID"

# Bundles the workspace libraries into dist/main.js and writes the manifest
# listing the npm packages left external. Run via nx rather than by hand: a
# plain nx build wipes dist, and this restores the manifest afterwards.
cd "$NX_ROOT"
npx nx deploy-manifest @read-every-word/api-host

cd "$SCRIPT_DIR/../app/dist"

# Everything is built here, so nothing is symlinked into the published zip and
# there is nothing for a remote build to do.
npm install --omit=dev

# --no-build because the artifact is already javascript. No --typescript for
# the same reason.
func azure functionapp publish "$FUNCTION_APP_NAME" --no-build
