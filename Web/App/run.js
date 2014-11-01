(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['$rootScope', '$location', '$log', 'userModel'];

    function run($rootScope, $location, $log, userModel) {
        $rootScope.$on('$routeChangeStart', function(evt, next, current) {
            var authenticationNotRequired = ['aboutController', 'loginController', 'registerController'];

            if (!next.controller) {
                $log.debug('unknown route');
                return;
            }

            if (_.contains(authenticationNotRequired, next.controller)) {
                $log.debug('authentication not required');
                 return;
            }

            if (!userModel.isAuthenticated) {
                $log.debug('Redirecting to login');
                evt.preventDefault();
                $location.path('/login').replace();
            }
        });
    }

})();