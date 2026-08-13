set -e

# outputs.sh walks up a fixed number of levels to find the repo root, so anchor
# on the cicd directory instead of wherever this was invoked from.
cd "$(dirname "$0")/.."

source ../../../cicd/variables.sh
source ./outputs.sh

# One time migration, run once per environment as part of moving off static web
# apps. Registering the bff as a static web app backend made azure enable easy
# auth here with an azureStaticWebApps identity provider, and the setting
# outlives the link. Left on it rejects the traffic cloudflare's worker
# forwards. Environments created after the move never had the link, so this is
# a no-op for them.
#
# This is a script rather than a terraform local-exec because the azure cli
# does not read the ARM_* variables terraform uses, and apply runs before
# anything in the pipeline signs the cli in.
az login                              \
    --service-principal               \
    --username "$ARM_CLIENT_ID"       \
    --password "$ARM_CLIENT_SECRET"   \
    --tenant "$ARM_TENANT_ID"         \
    --output none
az account set --subscription "$ARM_SUBSCRIPTION_ID"

# The static web app registration wrote siteAuthSettingsV2. `az webapp auth
# update` targets the classic v1 document, and mixing the two is what the api
# rejects with "Operation returned an invalid status 'Bad Request'", so write
# v2 directly.
FUNCTION_APP_ID=$(az webapp show          \
    --name "$FUNCTION_APP_NAME"           \
    --resource-group "$RESOURCE_GROUP"    \
    --query id                            \
    --output tsv)
AUTH_URI="https://management.azure.com${FUNCTION_APP_ID}/config/authsettingsV2?api-version=2022-03-01"

echo "easy auth before:"
az rest --method get --uri "$AUTH_URI" | jq -c '.properties | {
    platform:              .platform.enabled,
    requireAuthentication: .globalValidation.requireAuthentication,
    staticWebApps:         .identityProviders.azureStaticWebApps.enabled
}'

# A put replaces the whole document, which is what we want: it switches the
# middleware off and drops the leftover azureStaticWebApps provider in one go.
az rest --method put --uri "$AUTH_URI" --output none --body '{
    "properties": {
        "platform": { "enabled": false },
        "globalValidation": {
            "requireAuthentication": false,
            "unauthenticatedClientAction": "AllowAnonymous"
        }
    }
}'

echo "easy auth after:"
az rest --method get --uri "$AUTH_URI" | jq -c '.properties | {
    platform:              .platform.enabled,
    requireAuthentication: .globalValidation.requireAuthentication,
    staticWebApps:         .identityProviders.azureStaticWebApps.enabled
}'
