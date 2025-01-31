set -e

cd ../
ROOT=$(pwd)

echo "deploy api            *********************************************"
cd $ROOT/server/api/cicd
./functionPush.sh

echo "deploy bff            *********************************************"
cd $ROOT/server/frontEnd/cicd
./functionPush.sh

echo "deploy ui             *********************************************"
cd $ROOT/server/frontEnd/cicd
./publishFrontend.sh