define(['durandal/system'], function(system) {

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
            .done(function(result) {
                if (result.status === 200) {
                    location.hash = "#books";
                };
            })
            .fail(function(result) {
                system.log('Failed to create account: ' + result.status);
            });
    };

    return vm;
});