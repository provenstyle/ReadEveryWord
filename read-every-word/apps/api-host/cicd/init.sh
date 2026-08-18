#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
TF_DIR="$SCRIPT_DIR/../terraform"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/variables.sh"

terraform -chdir="$TF_DIR" init                                      \
    -reconfigure                                                     \
    -upgrade                                                         \
    -input=false                                                     \
    -backend-config=resource_group_name=$STATE_RESOURCE_GROUP_NAME   \
    -backend-config=storage_account_name=$STATE_STORAGE_ACCOUNT_NAME \
    -backend-config=container_name=$STATE_CONTAINER_NAME             \
    -backend-config=key=$STATE_KEY                                   \

