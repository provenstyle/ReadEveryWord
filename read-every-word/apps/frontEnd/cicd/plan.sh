#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
TF_DIR="$SCRIPT_DIR/../terraform"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/variables.sh"

#export TF_LOG=DEBUG

# The auth0 settings moved to the api stack with the bff, so there is no
# envs/ var-file here any more.
terraform -chdir="$TF_DIR" plan \
    -var=state_resource_group_name=$STATE_RESOURCE_GROUP_NAME               \
    -var=state_storage_account_name=$STATE_STORAGE_ACCOUNT_NAME             \
    -var=state_container_name=$STATE_CONTAINER_NAME                         \
    -var=state_key=$STATE_KEY                                               \
    -var=location=$LOCATION                                                 \
    -var=environment=$ENVIRONMENT                                           \
    -var=service=$SERVICE_NAME                                              \
    -var=dns_zone_name=$DNS_ZONE_NAME                                       \
    -var=cloudflare_zone_id=$CLOUDFLARE_ZONE_ID                             \
    -var=cloudflare_account_id=$CLOUDFLARE_ACCOUNT_ID                       \
    -var=branch_name=$BRANCH
