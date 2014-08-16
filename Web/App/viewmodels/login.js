define(['durandal/system', 'plugins/observable', 'models/history', 'models/user'], function (system, observable, history, user) {

    var vm = {},
        validator = {};

    vm.email = '';
    vm.password = '';
    vm.loginError = false;

    vm.create = function () {
        var valid = validator.form();
        system.log("Login form valid? " + valid);
        if (valid === true) {
            submitForm();
        }
    };

    vm.compositionComplete = function() {
        validator = $("#login").validate();
    };

    function submitForm() {
        $.post(rew.config.basePath() + '/api/accountApi/login', {
            email: vm.email,
            password: vm.password
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
                vm.loginError = true;
                user.clear();
           });
    };

    function resetError() {
        vm.loginError = false;
    };

    _.each(['email', 'password'], function (prop) {
        observable(vm, prop).subscribe(function () {
            resetError();
        });
    });

    return vm;
});