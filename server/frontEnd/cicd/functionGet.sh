source ../../../cicd/variables.sh
source ./variables.sh

cd ../bff/app

func azure functionapp fetch-app-settings $FUNCTION_APP_NAME --no-encrypt
func settings decrypt