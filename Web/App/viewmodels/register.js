define(['durandal/system', 'plugins/observable', 'models/history', 'models/user', 'services/account'], function (system, observable, history, user, accountService) {

    var ctor = function() {
        var self = this,
            validator = {};

        self.email = '';
        self.password = '';
        self.confirmPassword = '';
        self.registrationError = false;

        self.canActivate = function () {
            if (user.isAuthenticated === true) {
                return { redirect: '#book' };
            }

            return true;
        };

        self.compositionComplete = function () {
            validator = $("#register").validate({
                rules: {
                    newPassword: {
                        validpassword: true
                    },
                    newEmail: {
                        required: true,

                        remote: {
                            url: rew.config.basePath() + "/api/accountApi/EmailAvailable",
                            type: "get",
                            data: {
                                email: function () {
                                    return self.email;
                                }
                            }
                        }
                    }
                },
                messages: {
                    newEmail: {
                        required: "This field is required.",
                        remote: "Email address already in use."
                    }
                }
            });

        };

        self.create = function () {
            var valid = validator.form();
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
                });
            }
        };

        _.each(['email', 'password', 'confirmPassword'], function (prop) {
            observable(self, prop).subscribe(function () {
                resetError();
            });
        });

        function resetError() {
            self.registrationError = false;
        }
    };

    return ctor;
});