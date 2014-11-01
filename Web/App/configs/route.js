(function() {
    angular
        .module('readEveryWord')
        .config(routeConfig);

    routeConfig.$init = ['$routeProvider'];

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'aboutController'
            })
            .when('/register', {
                templateUrl: 'app/views/register.html',
                controller: 'registerController'
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'loginController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();

