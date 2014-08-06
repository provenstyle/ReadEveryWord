define(['durandal/system', 'models/history'], function (system, history) {

    var vm = {};

    vm.email = '';
    vm.password = '';

    vm.create = function () {
        $.post('api/accountApi/login', {
            email: vm.email,
            password: vm.password
        })
            .done(function (result) {
                system.log('Login successfull');
                history.prime()
                    .done(function() {
                        location.hash = "#books";
                    });
            })
            .fail(function () {
                system.log('Failed to login. Invalid username or password.');
            });
    };

    return vm;
});