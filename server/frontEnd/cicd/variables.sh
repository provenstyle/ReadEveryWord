SERVICE_NAME=read-every-word-front-end
STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"

if [ "$ENVIRONMENT" = "dev" ]; then
  echo "Deploying in Development Environment"
  FUNCTION_APP_NAME=fa-rpbpnabjedhwlhvhwu
  STATIC_APP_NAME=stapp-ehmrwpxjociwslfudu
elif [ "$ENVIRONMENT" = "prod" ]; then
  echo "Deploying in Production Environment"
  FUNCTION_APP_NAME=fa-glsuwfipqqitmbugqr
  STATIC_APP_NAME=stapp-xgnsvotromajjgexni
else
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
fi

# State key format
# STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"