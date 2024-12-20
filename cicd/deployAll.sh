set -e

cd ../
ROOT=$(pwd)

echo "api            *********************************************"
cd $ROOT
cd ./server/api/cicd
./functionPush.sh

echo "bff            *********************************************"
cd $ROOT
cd ./server/frontEnd/cicd
./functionPush.sh

echo "ui             *********************************************"
cd $ROOT
cd ./server/frontEnd/cicd
./publishFrontend.sh