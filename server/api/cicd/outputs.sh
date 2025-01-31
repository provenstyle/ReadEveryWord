set -e

cd ../terraform
FUNCTION_APP_NAME=$(terraform output -json names | jq -r '.function_app')


# Environment-specific Variables
# if [ "$ENVIRONMENT" = "dev" ]; then
#     echo "Deploying in Development Environment"
#     FUNCTION_APP_NAME=fa-cmvkmwjkuwgxfhrelc
# elif [ "$ENVIRONMENT" = "prod" ]; then
#     echo "Deploying in Production Environment"
#     FUNCTION_APP_NAME="fa-oyckxrbdmprrhejrrq"
# else
#     echo "Unknown environment: $ENVIRONMENT"
#     exit 1
# fi

# State key format
# STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"