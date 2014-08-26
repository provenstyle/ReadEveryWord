define(['durandal/system', 'models/user'], function (system, user) {

    var module = {};

    module.loggedIn = function () {
        var def = $.Deferred();

        $.get(rew.config.basePath() + '/api/AccountApi/LoggedIn')
            .done(function (data, status, xhr) {
                system.log('User is logged in: ' + xhr.status);
                user.authenticated(data.username);
                def.resolve();
            })
            .fail(function (xhr) {
                system.log('User is not logged in: ' + xhr.status);
                def.reject();
            });

        return def;
    };

    return module;
});