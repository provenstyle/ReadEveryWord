#!/usr/bin/env bash
set -e

# The directory moved into the nx workspace but the service did not. This name
# feeds the terraform state key, the resource group name, and the replace() in
# remote_state.tf that derives the api's state key, so changing it orphans the
# state file and builds a whole new stack.
SERVICE_NAME=read-every-word-front-end
STATE_KEY="$ENVIRONMENT/$BRANCH/$TYPE/$SERVICE_NAME/terraform.tfstate"
