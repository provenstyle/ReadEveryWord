#!/usr/bin/env bash
set -e

SERVICE_NAME=read-every-word-api
STATE_KEY="$ENVIRONMENT/$BRANCH/$TYPE/$SERVICE_NAME/terraform.tfstate"
