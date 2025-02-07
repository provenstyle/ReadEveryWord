set -e

source ../../cicd/variables.sh
source ./variables.sh

cd ../terraform

#export TF_LOG=DEBUG

terraform destroy                                               \
    -auto-approve                                               \
    -var=state_resource_group_name=$STATE_RESOURCE_GROUP_NAME   \
    -var=state_storage_account_name=$STATE_STORAGE_ACCOUNT_NAME \
    -var=state_container_name=$STATE_CONTAINER_NAME             \
    -var=state_key=$STATE_KEY                                   \
    -var=location=$LOCATION                                     \
