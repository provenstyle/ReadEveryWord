set -e

cd ../
ROOT=$(pwd)

echo "build infrastructure *********************************************"
cd $ROOT/server/infrastructure
npm run build
npm run test

echo "build domain         *********************************************"
cd $ROOT/server/domain
npm run build
npm run test

echo "build api            *********************************************"
cd $ROOT/server/api/app
npm run build
npm run test

echo "build api client     *********************************************"
cd $ROOT/server/api/client
npm run build
npm run test

echo "build bff            *********************************************"
cd $ROOT/server/frontEnd/bff/app
npm run build
npm run test

echo "build bff client     *********************************************"
cd $ROOT/server/frontEnd/bff/client
npm run build
npm run test

echo "build ui             *********************************************"
cd $ROOT/server/frontEnd/ui
npm run build

