angular.module('readEveryWord')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'aboutController'
            });
    }]);