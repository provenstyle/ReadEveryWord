cd ../
ROOT=$(pwd)

cd $ROOT/server/api/cicd
./init.sh
./apply.sh

cd $ROOT/server/frontEnd/cicd
./init.sh
./apply.sh

cd $ROOT/cicd
./deployAll.sh