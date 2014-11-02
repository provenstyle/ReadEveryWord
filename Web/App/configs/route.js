(function () {
    angular
        .module('readEveryWord')
        .config(routeConfig);

    routeConfig.$init = ['$routeProvider'];

    function routeConfig($routeProvider) {

        bootstrapperPromise.inject = ['bootstrapper'];
        function bootstrapperPromise (bootstrapper) {
            return bootstrapper.promise;
        }

        $routeProvider
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'aboutController',
            })
            .when('/register', {
                templateUrl: 'app/views/register.html',
                controller: 'registerController',
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'loginController',
            })
            .when('/readingLog', {
                templateUrl: 'app/views/readingLog.html',
                controller: 'readingLogController',
                resolve: {
                    boostrapperPromise: bootstrapperPromise
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();

