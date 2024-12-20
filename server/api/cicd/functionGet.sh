source ../../../cicd/variables.sh
source ./variables.sh

cd ../app

func azure functionapp fetch-app-settings $FUNCTION_APP_NAME

