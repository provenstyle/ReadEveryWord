set -e

cd ../
ROOT=$(pwd)

echo "init api            *********************************************"
cd $ROOT/server/api/cicd
./init.sh

echo "init front end      *********************************************"
cd $ROOT/server/frontEnd/cicd
./init.sh
