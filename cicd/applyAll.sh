set -e

cd ../
ROOT=$(pwd)

echo "apply api *********************************************"
cd $ROOT/server/api/cicd
./apply.sh

echo "apply front end *********************************************"
cd $ROOT/server/frontEnd/cicd
./apply.sh
