SERVICE_NAME=read-every-word-api

# Example state key
# STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"

# Dev Variables
ENVIRONMENT=dev
STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"
FUNCTION_APP_NAME=fa-cmvkmwjkuwgxfhrelc

# Prod Variables
# ENVIRONMENT=prod
# STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"
# FUNCTION_APP_NAME=fa-oyckxrbdmprrhejrrq

