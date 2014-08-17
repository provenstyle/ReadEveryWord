define(['durandal/system', 'plugins/observable', 'models/history', 'models/user'], function (system, observable, history, user) {

    var ctor = function() {

        var self = this,
            validator = {};

        self.email = '';
        self.password = '';
        self.loginError = false;

        self.create = function () {
            var valid = validator.form();
            system.log("Login form valid? " + valid);
            if (valid === true) {
                submitForm();
            }
        };

        self.compositionComplete = function () {
            validator = $("#login").validate();
        };

        _.each(['email', 'password'], function (prop) {
            observable(self, prop).subscribe(function () {
                resetError();
            });
        });

        function submitForm() {
            $.post(rew.config.basePath() + '/api/accountApi/login', {
                email: self.email,
                password: self.password
            })
                .done(function (data, status, xhr) {
                    system.log('Login successfull');
                    user.authenticated(data.username);
                    history.prime()
                        .done(function () {
                            location.hash = "#books";
                        });
                })
                .fail(function () {
                    system.log('Failed to login. Invalid username or password.');
                    self.loginError = true;
                    user.clear();
                });
        };

        function resetError() {
            self.loginError = false;
        };

    };

    return ctor;

});