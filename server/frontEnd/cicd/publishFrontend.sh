set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../ui
npm run build

# The deployment token identifies the app on its own, so there is no entra
# sign in to get wrong. swa login is not needed and neither are the resource
# group or app name.
#
# workaround to keep the cli from modifying the config file
chmod 444 swa-cli.config.json
npx swa deploy                              \
    --deployment-token "$DEPLOYMENT_TOKEN"  \
    --app-location ./dist                   \
    --env production
chmod 644 swa-cli.config.json
