set -e

cd ../terraform
FUNCTION_APP_NAME=$(terraform output -json names | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"
