define(['durandal/system', 'models/history'], function (system, history) {

    var vm = {};

    vm.email = '';
    vm.password = '';
    vm.confirmPassword = '';

    vm.create = function() {
        $.post('api/accountApi/register', {
                email: vm.email,
                password: vm.password,
                confirmPassword: vm.confirmPassword
            })
            .done(function () {
                system.log('New user created.');
                history.prime()
                    .done(function () {
                        location.hash = "#books";
                    });
                location.hash = "#books";
            })
            .fail(function(result) {
                system.log('Failed to create account: ' + result.status);
            });
    };

    return vm;
});