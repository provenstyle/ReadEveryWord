set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../bff/app

func azure functionapp publish $FUNCTION_APP_NAME  --typescript
