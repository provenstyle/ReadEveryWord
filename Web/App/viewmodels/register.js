define(['durandal/system', 'models/history'], function (system, history) {

    var vm = {}, 
        validator = {};

    vm.email = '';
    vm.password = '';
    vm.confirmPassword = '';

    vm.compositionComplete = function () {
        validator = $("#register").validate({
            rules: {
                password: {
                    validpassword: true
                }
            }
        });
    };

    vm.create = function () {
        var valid = validator.form();
        system.log("Registration form valid? " + valid);
        if (valid) {
            $.post('api/accountApi/register', {
                    email: vm.email,
                    password: vm.password,
                    confirmPassword: vm.confirmPassword
                })
                .done(function() {
                    system.log('New user created.');
                    history.prime()
                        .done(function() {
                            location.hash = "#books";
                        });
                    location.hash = "#books";
                })
                .fail(function(result) {
                    system.log('Failed to create account: ' + result.status);
                });
        }
    };

    return vm;
});