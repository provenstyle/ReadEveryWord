set -e

cd ../../../
ROOT=$(pwd)

# Get service outputs
cd $ROOT/server/frontEnd/terraform
NAMES=$(terraform output -json names)

FUNCTION_APP_NAME=$(echo $NAMES | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"

FRONTEND_STORAGE_NAME=$(echo $NAMES | jq -r '.frontend_storage')
echo "FRONTEND_STORAGE_NAME: $FRONTEND_STORAGE_NAME"

RESOURCE_GROUP=$(terraform output -json names | jq -r '.resource_group')
echo "RESOURCE_GROUP: $RESOURCE_GROUP"

# deliberately not echoed
FRONTEND_STORAGE_KEY=$(terraform output -raw frontend_storage_key)