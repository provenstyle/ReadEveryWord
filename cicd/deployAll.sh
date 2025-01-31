set -e

cd ../
ROOT=$(pwd)

echo "api            *********************************************"
cd $ROOT/server/api/cicd
./functionPush.sh

echo "bff            *********************************************"
cd $ROOT/server/frontEnd/cicd
./functionPush.sh

echo "ui             *********************************************"
cd $ROOT/server/frontEnd/cicd
./publishFrontend.sh