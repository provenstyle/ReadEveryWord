angular.module('readEveryWord')
    .controller('registerController', ['$scope', function ($scope) {

        var self = this,
            validator = {};

        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.registrationError = false;

        //This goes on a global routing event handler
        //self.canActivate = function () {
        //    if (user.isAuthenticated === true) {
        //        return { redirect: '#book' };
        //    }

        //    return true;
        //};

        //????Where should this go?
        //self.compositionComplete = function () {
        //    validator = $("#register").validate({
        //        rules: {
        //            newEmail: {
        //                required: true,
        //                remote: {
        //                    url: rew.config.basePath() + "/api/accountApi/EmailAvailable",
        //                    type: "get",
        //                    data: {
        //                        email: function () {
        //                            return self.email;
        //                        }
        //                    }
        //                }
        //            }
        //        },
        //        messages: {
        //            newEmail: {
        //                required: "This field is required.",
        //                remote: "Email address already in use."
        //            }
        //        }
        //    });

        //};

        $scope.create = function () {
            var valid = validator.form();
            var target = $(el.target);
            target.prop('disabled', true);

            system.log("Registration form valid? " + valid);
            if (valid) {
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
            resetError();
        });

        function resetError() {
            self.registrationError = false;
        }



    }]);