SERVICE_NAME=read-every-word-front-end
ENVIRONMENT=dev

#STATE_KEY="myEnvironment/myBranch/myPipeline/myName/default/myService/terraform.tfstate"
STATE_KEY="$ENVIRONMENT/fresh-start/manual/mpd/default/$SERVICE_NAME/terraform.tfstate"

FUNCTION_APP_NAME=fa-lpbtpdxqjquvoitmpr
STATIC_APP_NAME=stapp-aawnmnwbvsulhxsnwu