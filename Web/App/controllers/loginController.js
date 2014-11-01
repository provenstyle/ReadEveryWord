(function () {
    angular
        .module('readEveryWord')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$log', 'accountService', 'historyService'];

    function loginController($scope, $log, accountService, historyService) {
        $scope.email = '';
        $scope.password = '';
        $scope.loginError = false;
        $scope.disableLogin = false;

        $scope.login = function () {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.login.$valid) {
                submitForm();
            }
        };

        $scope.$watchGroup(['email', 'password'], function () {
            $scope.loginError = false;
        });

        function submitForm() {
            $scope.disableLogin = true;

            accountService.login($scope.email, $scope.password)
                .then(function() {
                    return historyService.prime();
                }, function() {
                    $log.warn('Failed to login. Invalid username or password.');
                    $scope.loginError = true;
                    $scope.disableLogin = false;
                })
                .then(function () {
                    location.hash = "#books";
                });
        }
    }

})();