﻿define(['plugins/router', 'durandal/app', 'durandal/system', 'models/history', 'models/user', 'services/account'], function (router, app, system, history, user, accountService) {
    return {
        user: user,
        router: router,
        activate: function () {

            var def = new $.Deferred();

            accountService.loggedIn()
                .done(function (data, status, xhr) {
                    history.prime()
                        .done(function () {
                            configureRouter()
                                .done(function () {
                                    def.resolve();
                                });
                        });
                })
                .fail(function (xhr) {
                    location.hash = '#login';
                    configureRouter()
                        .done(function () {
                            def.resolve();
                        });
                });

            return def;
        },
        compositionComplete: function () {
            $(function () {
                $('.navbar-nav').on('click', function () {
                    if ($('.navbar-header .navbar-toggle').css('display') != 'none') {
                        $(".navbar-header .navbar-toggle").trigger("click");
                    }
                });
            });
        },
        logOff: function () {
            accountService.logOff
                .done(function () {
                    router.navigate('#login');
                });
        }
    };

    function configureRouter() {
        router.map([
                { route: ['Books', ''], title: 'Books', moduleId: 'viewmodels/books', nav: true },
                { route: 'Chapters/:name', title: 'Chapters', moduleId: 'viewmodels/chapters', nav: true },
                { route: 'login', moduleId: 'viewmodels/login', nav: true },
                { route: 'register', moduleId: 'viewmodels/register', nav: true },
                { route: 'readingLog', moduleId: 'viewmodels/readingLog', nav: true }
        ]).buildNavigationModel();

        router.mapUnknownRoutes('viewmodels/books', "#books");

        return router.activate();
    }
});