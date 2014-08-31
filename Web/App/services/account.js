define(['durandal/system', 'models/user', 'models/history'], function (system, user, history) {

    var module = {};

    module.loggedIn = function () {
        var def = $.Deferred();

        $.ajax({
            type: 'GET',
            url: rew.config.basePath() + '/api/AccountApi/LoggedIn',
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function (data, status, xhr) {
                system.log('User is logged in: ' + xhr.status);
                user.authenticated(data.username);
                def.resolve();
            })
            .fail(function (xhr) {
                system.log('User is not logged in: ' + xhr.status);
                user.clear();
                def.reject();
            });

        return def;
    };

    module.login = function (email, password) {
        var data = {
            email: email,
            password: password
        };

        return $.ajax({
            type: 'POST',
            url: rew.config.basePath() + '/api/accountApi/login',
            data: data,
            xhrFields: {
                withCredentials: true
            }
        })
        .done(function (response) {
            system.log('Login successfull');
            user.authenticated(response.username);
        })
        .fail(function () {
            system.log('Failed to login. Invalid username or password.');
            user.clear();
        });
    };

    module.register = function(email, password, confirmPassword) {

        var data = {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };

        return $.ajax({
                type: 'POST',
                url: rew.config.basePath() + '/api/accountApi/register',
                data: data,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function() {
                system.log('New user created.');
                user.authenticated(email);
            })
            .fail(function(result) {
                system.log('Failed to create account: ' + result.status);
            });
    };

    module.logOff = function() {
        return $.ajax({
                type: 'POST',
                url: rew.config.basePath() + '/api/AccountApi/Logoff',
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function() {
                system.log('Logged off.');
                user.clear();
                history.clear();
            })
            .fail(function() {
                system.log('Failled to logoff.');
            });
    };

    return module;
});