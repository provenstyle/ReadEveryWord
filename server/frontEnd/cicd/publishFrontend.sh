set -e

source ../../../cicd/variables.sh
source ./outputs.sh

cd ../ui
npm run build

# The storage key identifies the account on its own, so there is no entra sign
# in to get wrong and no resource group to pass.
#
# Two passes because upload-batch has --pattern to include but no way to
# exclude. Everything lands as no-cache first so a new index.html is picked up
# immediately, then the hashed assets are re-uploaded to win the cache header.
az storage blob upload-batch                        \
    --account-name "$FRONTEND_STORAGE_NAME"         \
    --account-key  "$FRONTEND_STORAGE_KEY"          \
    --destination '$web'                            \
    --source ./dist                                 \
    --overwrite                                     \
    --content-cache-control "no-cache"              \
    --output none

# vite hashes these filenames, so they can never go stale
az storage blob upload-batch                        \
    --account-name "$FRONTEND_STORAGE_NAME"         \
    --account-key  "$FRONTEND_STORAGE_KEY"          \
    --destination '$web'                            \
    --source ./dist                                 \
    --pattern "assets/*"                            \
    --overwrite                                     \
    --content-cache-control "public, max-age=31536000, immutable" \
    --output none
