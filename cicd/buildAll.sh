set -e

cd ../
ROOT=$(pwd)

echo "infrastructure *********************************************"
cd $ROOT
cd ./server/infrastructure
npm run build
npm run test

echo "domain         *********************************************"
cd $ROOT
cd ./server/domain
npm run build
npm run test

echo "api            *********************************************"
cd $ROOT
cd ./server/api/app
npm run build
npm run test

echo "api client     *********************************************"
cd $ROOT
cd ./server/api/client
npm run build
npm run test

echo "bff            *********************************************"
cd $ROOT
cd ./server/frontEnd/bff/app
npm run build
npm run test

echo "bff client     *********************************************"
cd $ROOT
cd ./server/frontEnd/bff/client
npm run build
npm run test

echo "ui             *********************************************"
cd $ROOT
cd ./server/frontEnd/ui
npm run build

