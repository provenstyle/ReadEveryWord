set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../ui
npm run build

npx swa login
npx swa deploy                       \
    --resource-group $RESOURCE_GROUP \
    --app-name $STATIC_APP_NAME      \
    --app-location ./dist            \
    --env production
