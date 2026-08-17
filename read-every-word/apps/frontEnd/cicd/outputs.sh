#!/usr/bin/env bash
set -e

# Anchored to this file rather than to the caller's cwd. The previous version
# counted directories up to the repo root and hardcoded the path back down,
# which is exactly what the move into the nx workspace broke.
_OUTPUTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# One state read instead of three. Each one pulls the state blob from azure.
OUTPUTS=$(terraform -chdir="$_OUTPUTS_DIR/../terraform" output -json)

FRONTEND_STORAGE_NAME=$(echo "$OUTPUTS" | jq -r '.names.value.frontend_storage')
echo "FRONTEND_STORAGE_NAME: $FRONTEND_STORAGE_NAME"

RESOURCE_GROUP=$(echo "$OUTPUTS" | jq -r '.names.value.resource_group')
echo "RESOURCE_GROUP: $RESOURCE_GROUP"

# deliberately not echoed
FRONTEND_STORAGE_KEY=$(echo "$OUTPUTS" | jq -r '.frontend_storage_key.value')
