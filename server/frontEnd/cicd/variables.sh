SERVICE_NAME=read-every-word-front-end

# STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"

# dev variables
ENVIRONMENT=dev
STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"
FUNCTION_APP_NAME=fa-rpbpnabjedhwlhvhwu
STATIC_APP_NAME=stapp-ehmrwpxjociwslfudu

# prod variables
# ENVIRONMENT=prod
# STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"
# FUNCTION_APP_NAME=fa-glsuwfipqqitmbugqr
# STATIC_APP_NAME=stapp-xgnsvotromajjgexni
