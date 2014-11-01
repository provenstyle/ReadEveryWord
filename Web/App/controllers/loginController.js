(function () {
    angular
        .module('readEveryWord')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$log', 'accountService', 'historyModel'];

    function loginController($scope, $log, accountService, historyModel) {
        $scope.email = '';
        $scope.password = '';
        $scope.loginError = false;
        $scope.disableLogin = false;

        $scope.login = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.loginForm.$valid) {
                submitForm();
            }
        };

        $scope.$watchGroup(['email', 'password'], function () {
            $scope.loginError = false;
        });

        function submitForm() {
            $scope.disableLogin = true;

            accountService.logIn($scope.email, $scope.password)
                .then(function() {
                    return historyModel.prime();
                })
                .then(function () {
                    location.hash = "#books";
                })
                .catch(function () {
                    $log.warn('Failed to login. Invalid username or password.');
                    $scope.loginError = true;
                    $scope.disableLogin = false;
                });
        }
    }

})();