set -e

cd ../terraform
NAMES=$(terraform output -json names)

FUNCTION_APP_NAME=$(echo $NAMES | jq -r '.function_app')
echo $FUNCTION_APP_NAME

STATIC_APP_NAME=$(echo $NAMES | jq -r '.static_web_app')
echo $STATIC_APP_NAME

RESOURCE_GROUP=$(terraform output -json names | jq -r '.resource_group')
echo $RESOURCE_GROUP