angular.module('readEveryWord')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'aboutController'
            })
            .when('/register', {
                templateUrl: 'app/views/register.html',
                controller:'registerController'
            });

    }]);