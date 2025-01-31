set -e

cd ../
ROOT=$(pwd)

echo "infrastructure *********************************************"
cd $ROOT/server/infrastructure
npm run build
npm run test

echo "domain         *********************************************"
cd $ROOT/server/domain
npm run build
npm run test

echo "api            *********************************************"
cd $ROOT/server/api/app
npm run build
npm run test

echo "api client     *********************************************"
cd $ROOT/server/api/client
npm run build
npm run test

echo "bff            *********************************************"
cd $ROOT/server/frontEnd/bff/app
npm run build
npm run test

echo "bff client     *********************************************"
cd $ROOT/server/frontEnd/bff/client
npm run build
npm run test

echo "ui             *********************************************"
cd $ROOT/server/frontEnd/ui
npm run build

