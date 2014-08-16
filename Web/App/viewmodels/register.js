define(['durandal/system', 'plugins/observable', 'models/history', 'models/user'], function (system, observable, history, user) {

    var vm = {},
        validator = {};

    vm.email = '';
    vm.password = '';
    vm.confirmPassword = '';
    vm.registrationError = false;

    vm.compositionComplete = function () {
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
                            email: function() {
                                return vm.email;
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

    vm.create = function () {
        var valid = validator.form();
        system.log("Registration form valid? " + valid);
        if (valid) {
            $.post(rew.config.basePath() + '/api/accountApi/register', {
                    email: vm.email,
                    password: vm.password,
                    confirmPassword: vm.confirmPassword
                })
                .done(function() {
                    system.log('New user created.');
                    user.authenticated(vm.email);
                    history.prime()
                        .done(function() {
                            location.hash = "#books";
                        });
                    location.hash = "#books";
                })
                .fail(function(result) {
                    system.log('Failed to create account: ' + result.status);
                    vm.registrationError = true;
                });
        }
    };

    function resetError() {
        vm.registrationError = false;
    };

    _.each(['email', 'password', 'confirmPassword'], function(prop) {
        observable(vm, prop).subscribe(function () {
            resetError();
        });
    });

    return vm;
});