(function () {
    angular
        .module('readEveryWord')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope', '$log', '$location', 'accountService', 'historyModel'];

    function registerController($scope, $log, $location, accountService, historyModel) {

        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.registrationError = false;
        $scope.disableCreate = false;
        $scope.create = create;

        function create() {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.register.$valid) {
                $scope.disableCreate = true;

                accountService.register($scope.email, $scope.password, $scope.confirmPassword)
                    .then(function () {
                        return historyModel.prime();
                    })
                    .then(function () {
                        $location.path('/books').replace();
                    })
                    .catch(function () {
                        $scope.registrationError = true;
                        $scope.disableCreate = false;
                    });
            }
        }

        $scope.$watchGroup(['email', 'password', 'confirmPassword'], function () {
            $scope.registrationError = false;
        });
    }
})();