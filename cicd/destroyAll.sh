set -e

cd ../
ROOT=$(pwd)

echo "destroy api *********************************************"
cd $ROOT/server/api/cicd
./destroy.sh

echo "destroy front end *********************************************"
cd $ROOT/server/frontEnd/cicd
./destroy.sh
