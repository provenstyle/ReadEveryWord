﻿define(['plugins/router', 'durandal/app', 'models/history'], function (router, app, history) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {


            router.map([
                { route: ['Books',''], title:'Books', moduleId: 'viewmodels/books', nav: true },
                { route: 'Chapters/:name', title:'Chapters', moduleId: 'viewmodels/chapters', nav: true },
                //{ route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                //{ route: 'flickr', moduleId: 'viewmodels/flickr', nav: true }
            ]).buildNavigationModel();
            
            return $.when(router.activate(), history.prime());
        }
    };
});