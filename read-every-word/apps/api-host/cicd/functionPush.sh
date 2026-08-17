#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
NX_ROOT="$REPO_ROOT/read-every-word"

source "$REPO_ROOT/cicd/variables.sh"

# The function app is still owned by the legacy api stack. This replaces what
# server/api/cicd/functionPush.sh used to deploy, onto the same app, so only
# one of the two may run.
FUNCTION_APP_NAME=$(terraform -chdir="$REPO_ROOT/server/api/terraform" output -json names | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"

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
# listing the npm packages left external.
cd "$NX_ROOT"
npx nx deploy-manifest @read-every-word/api-host

cd "$NX_ROOT/apps/api-host/dist"

# Everything is built here, so nothing is symlinked into the published zip and
# there is nothing for a remote build to do.
npm install --omit=dev

# --no-build because the artifact is already javascript. No --typescript for
# the same reason.
func azure functionapp publish "$FUNCTION_APP_NAME" --no-build
