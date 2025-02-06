set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../app

func azure functionapp fetch-app-settings $FUNCTION_APP_NAME --no-encrypt
func settings decrypt

