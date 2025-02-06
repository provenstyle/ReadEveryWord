set -e

cd ../
ROOT=$(pwd)

echo "fetch api app settings *********************************************"
cd $ROOT/server/api/cicd
./functionFetchAppSettings.sh

echo "fetch bff app settings *********************************************"
cd $ROOT/server/frontEnd/cicd
./functionFetchAppSettings.sh
