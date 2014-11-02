(function() {
    angular
        .module('readEveryWord')
        .config(routeConfig);

    routeConfig.$init = ['$routeProvider', 'bootstrapper'];

    function routeConfig($routeProvider, bootstrapper) {
        $routeProvider
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'aboutController',
                resolve: {boostrapper: bootstrapper.promise}
            })
            .when('/register', {
                templateUrl: 'app/views/register.html',
                controller: 'registerController',
                resolve: { boostrapper: bootstrapper.promise }
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'loginController',
                resolve: { boostrapper: bootstrapper.promise }
            })
            .when('/readingLog', {
                templateUrl: 'app/views/readingLog.html',
                controller: 'readingLogController',
                resolve: { boostrapper: bootstrapper.promise }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();

