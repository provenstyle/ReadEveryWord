#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
TF_DIR="$SCRIPT_DIR/../terraform"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/variables.sh"

#export TF_LOG=DEBUG

terraform -chdir="$TF_DIR" destroy \
    -auto-approve \
    -var-file="envs/$ENVIRONMENT/terraform.tfvars"              \
    -var=state_resource_group_name=$STATE_RESOURCE_GROUP_NAME   \
    -var=state_storage_account_name=$STATE_STORAGE_ACCOUNT_NAME \
    -var=state_container_name=$STATE_CONTAINER_NAME             \
    -var=state_key=$STATE_KEY                                   \
    -var=location=$LOCATION                                     \
    -var=environment=$ENVIRONMENT                               \
    -var=service=$SERVICE_NAME
