#!/usr/bin/env bash
set -e

# Legacy. apps/api-host deploys to this same function app now, via
# read-every-word/apps/api-host/cicd/functionPush.sh, and deployAll.sh calls
# that one instead. Kept only as a rollback path while server/api/app still
# exists; running both would mean whichever went last wins.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

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

cd "$SCRIPT_DIR/../app"

func azure functionapp publish $FUNCTION_APP_NAME --typescript
