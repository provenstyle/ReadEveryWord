﻿define(['durandal/system', 'plugins/observable', 'models/history', 'models/user', 'services/account'], function (system, observable, history, user, accountService) {

    var ctor = function() {

        var self = this,
            validator = {};

        self.email = '';
        self.password = '';
        self.loginError = false;

        self.canActivate = function() {
            if (user.isAuthenticated === true) {
                return { redirect: '#book' };
            }

            return true;
        };

        self.create = function (model, el) {
            var valid = validator.form();
            system.log("Login form valid? " + valid);
            if (valid === true) {
                var target = $(el.target);
                submitForm(target);
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

        function submitForm(target) {

            target.prop('disabled', true);

            accountService.login(self.email, self.password)
            .done(function () {
                history.prime()
                    .done(function () {
                        location.hash = "#books";
                    });
            })
            .fail(function () {
                system.log('Failed to login. Invalid username or password.');
                self.loginError = true;
                target.prop('disabled', false);
            });
        }

        function resetError() {
            self.loginError = false;
        }

    };

    return ctor;

});