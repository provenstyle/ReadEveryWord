define(['plugins/router', 'durandal/app', 'durandal/system', 'models/history'], function (router, app, system, history) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {

            var def = new $.Deferred();

            $.get('api/AccountApi/LoggedIn')
                    .done(function (response) {
                        history.prime()
                            .done(function () {
                                system.log('User is logged in.');
                                configureRouter()
                                    .done(function () {
                                        def.resolve();
                                    });
                            });
                    })
                    .fail(function (a, b, c) {
                        system.log('User is not logged in. Navigating to login.');
                        location.hash = '#login';
                        configureRouter()
                            .done(function() {
                                def.resolve();
                            });
                    });

            return def;
        },
        logOff: function() {
            $.post('api/AccountApi/Logoff')
                .done(function () {
                    system.log('Logged off.');
                    router.navigate('#login');
                })
                .fail(function(parameters) {
                    system.log('Failled to logoff.');
                });
        }
    };

    function configureRouter() {
        router.map([
                { route: ['Books', ''], title: 'Books', moduleId: 'viewmodels/books', nav: true },
                { route: 'Chapters/:name', title: 'Chapters', moduleId: 'viewmodels/chapters', nav: true },
                { route: 'login', moduleId: 'viewmodels/login', nav: true },
                { route: 'register', moduleId: 'viewmodels/register', nav: true },
        ]).buildNavigationModel();

        return router.activate();
    }
});