set -e

echo "standup environment *********************************************"
./initAll.sh
./applyAll.sh
./buildAll.sh
./deployAll.sh