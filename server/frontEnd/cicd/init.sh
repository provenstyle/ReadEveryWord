set -e

source ../../../cicd/variables.sh
source ./variables.sh

cd ../terraform

terraform init                                                       \
    -reconfigure                                                     \
    -input=false                                                     \
    -backend-config=resource_group_name=$STATE_RESOURCE_GROUP_NAME   \
    -backend-config=storage_account_name=$STATE_STORAGE_ACCOUNT_NAME \
    -backend-config=container_name=$STATE_CONTAINER_NAME             \
    -backend-config=key=$STATE_KEY                                   \

