# Exit on error
set -e

source ../../../cicd/variables.sh
source ./variables.sh

cd ../terraform

APP_NAME=$(terraform output -json names | jq -r '.static_web_app')
echo $APP_NAME
RESOURCE_GROUP=$(terraform output -json names | jq -r '.resource_group')
echo $RESOURCE_GROUP

cd ../ui
npm run build

npx swa login
npx swa deploy                       \
    --resource-group $RESOURCE_GROUP \
    --app-name $STATIC_APP_NAME      \
    --app-location ./dist            \
    --env production
