﻿angular.module('readEveryWord')
    .controller('registerController', ['$scope', '$log', function ($scope, $log) {
        
        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.registrationError = false;
        $scope.disableCreate = false;
        $scope.create = create;

        //This goes on a global routing event handler
        //self.canActivate = function () {
        //    if (user.isAuthenticated === true) {
        //        return { redirect: '#book' };
        //    }

        //    return true;
        //};

        //Still need to validate that the email is available
        function create() {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.register.$valid) {
                $scope.disableCreate = true;

                accountService.register(self.email, self.password, self.confirmPassword)
                .done(function () {
                    history.prime()
                        .done(function () {
                            location.hash = "#books";
                        });
                })
                .fail(function () {
                    self.registrationError = true;
                    target.prop('disabled', false);
                });
            }
        };

        $scope.$watchGroup(['email', 'password', 'confirmPassword'], function () {
            $log.debug('Resetting registration error.');
            $scope.registrationError = false;
        });

    }]);