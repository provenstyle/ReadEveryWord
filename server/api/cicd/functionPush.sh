source ../../../cicd/variables.sh
source ./variables.sh

cd ../app

func azure functionapp publish $FUNCTION_APP_NAME --typescript

