set -e

cd ../../../
ROOT=$(pwd)

# Get service outputs
cd $ROOT/server/frontEnd/terraform
NAMES=$(terraform output -json names)

FUNCTION_APP_NAME=$(echo $NAMES | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"

STATIC_APP_NAME=$(echo $NAMES | jq -r '.static_web_app')
echo "STATIC_APP_NAME: $STATIC_APP_NAME"

RESOURCE_GROUP=$(terraform output -json names | jq -r '.resource_group')
echo "RESOURCE_GROUP: $RESOURCE_GROUP"

# deliberately not echoed
DEPLOYMENT_TOKEN=$(terraform output -raw static_web_app_api_key)