set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../ui
npm run build

npx swa login

# workaround to keep the cli from modifying the config file
chmod 444 swa-cli.config.json
npx swa deploy                       \
    --resource-group $RESOURCE_GROUP \
    --app-name $STATIC_APP_NAME      \
    --app-location ./dist            \
    --env production
chmod 644 swa-cli.config.json
