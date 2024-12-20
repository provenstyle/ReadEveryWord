SERVICE_NAME=read-every-word-api

# Dev Variables
#ENVIRONMENT=dev
#STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"
#STATE_KEY="$ENVIRONMENT/fresh-start/manual/mpd/default/$SERVICE_NAME/terraform.tfstate"
#FUNCTION_APP_NAME=fa-ddixmmxvxydnaklsnd

# Prod Variables
ENVIRONMENT=prod
STATE_KEY="$ENVIRONMENT/main/default/$SERVICE_NAME/terraform.tfstate"
FUNCTION_APP_NAME=fa-oyckxrbdmprrhejrrq

