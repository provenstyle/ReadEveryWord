#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
NX_ROOT="$REPO_ROOT/read-every-word"

source "$REPO_ROOT/cicd/variables.sh"
source "$SCRIPT_DIR/outputs.sh"

# Nx owns the build. The ui has no lockfile or node_modules of its own; its
# dependencies come from the workspace root install.
cd "$NX_ROOT"
npx nx build @read-every-word/ui

cd "$SCRIPT_DIR/../ui"

# vite's outDir is project relative, so the bundle lands here. Fail loudly
# rather than uploading nothing if that ever stops being true.
if [ ! -f ./dist/index.html ]; then
    echo "No build output at $(pwd)/dist. Check vite's build.outDir." >&2
    exit 1
fi

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
