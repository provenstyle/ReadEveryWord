set -e

cd ../../../
ROOT=$(pwd)

# Get the organization outputs
cd $ROOT/organization/terraform
ORGANIZATION_OUTPUTS=$(terraform output -json)

ORGANIZATION_DOMAIN_NAME=$(echo $ORGANIZATION_OUTPUTS | jq -r '.organization_domain_name.value')
echo "ORGANIZATION_DOMAIN_NAME: $ORGANIZATION_DOMAIN_NAME"

ORGANIZATION_RESOURCE_GROUP_NAME=$(echo $ORGANIZATION_OUTPUTS | jq -r '.organization_resource_group_name.value')
echo "ORGANIZATION_RESOURCE_GROUP_NAME: $ORGANIZATION_RESOURCE_GROUP_NAME"

# Get service outputs
cd $ROOT/server/frontEnd/terraform
NAMES=$(terraform output -json names)

FUNCTION_APP_NAME=$(echo $NAMES | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"

STATIC_APP_NAME=$(echo $NAMES | jq -r '.static_web_app')
echo "STATIC_APP_NAME: $STATIC_APP_NAME"

RESOURCE_GROUP=$(terraform output -json names | jq -r '.resource_group')
echo "RESOURCE_GROUP: $RESOURCE_GROUP"