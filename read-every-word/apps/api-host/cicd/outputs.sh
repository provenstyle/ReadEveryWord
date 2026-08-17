#!/usr/bin/env bash
set -e

_OUTPUTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FUNCTION_APP_NAME=$(terraform -chdir="$_OUTPUTS_DIR/../terraform" output -json names | jq -r '.function_app')
echo "FUNCTION_APP_NAME: $FUNCTION_APP_NAME"
