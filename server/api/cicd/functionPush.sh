set -e

source ../../../cicd/variables.sh
source ./outputs.sh

# func publish authenticates through the azure cli, which does not read the
# ARM_* variables terraform uses, so sign in explicitly
az login                              \
    --service-principal               \
    --username "$ARM_CLIENT_ID"       \
    --password "$ARM_CLIENT_SECRET"   \
    --tenant "$ARM_TENANT_ID"         \
    --output none
az account set --subscription "$ARM_SUBSCRIPTION_ID"

cd ../app

func azure functionapp publish $FUNCTION_APP_NAME --typescript

