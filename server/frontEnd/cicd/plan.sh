set -e

source ../../../cicd/variables.sh
source ./variables.sh
source ./outputs.sh

cd ../terraform

#export TF_LOG=DEBUG

terraform plan                                                              \
    -var-file="envs/$ENVIRONMENT/terraform.tfvars"                          \
    -var=state_resource_group_name=$STATE_RESOURCE_GROUP_NAME               \
    -var=state_storage_account_name=$STATE_STORAGE_ACCOUNT_NAME             \
    -var=state_container_name=$STATE_CONTAINER_NAME                         \
    -var=state_key=$STATE_KEY                                               \
    -var=location=$LOCATION                                                 \
    -var=environment=$ENVIRONMENT                                           \
    -var=service=$SERVICE_NAME                                              \
    -var=organization_resource_group_name=$ORGANIZATION_RESOURCE_GROUP_NAME \
    -var=organization_domain_name=$ORGANIZATION_DOMAIN_NAME                 \
    -var=branch_name=$BRANCH
