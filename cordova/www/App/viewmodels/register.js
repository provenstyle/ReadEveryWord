define(['durandal/system', 'plugins/observable', 'models/history', 'models/user'], function (system, observable, history, user) {

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
                $.post(rew.config.basePath() + '/api/accountApi/register', {
                    email: self.email,
                    password: self.password,
                    confirmPassword: self.confirmPassword
                })
                    .done(function () {
                        system.log('New user created.');
                        user.authenticated(self.email);
                        history.prime()
                            .done(function () {
                                location.hash = "#books";
                            });
                        location.hash = "#books";
                    })
                    .fail(function (result) {
                        system.log('Failed to create account: ' + result.status);
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