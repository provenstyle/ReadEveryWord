(function () {
    angular
        .module('readEveryWord')
        .factory('routeEvents', routeEvents);

    routeEvents.$inject = ['$rootScope', '$location', '$log', '$q', 'userModel', 'bootstrapper'];

    function routeEvents($rootScope, $location, $log, $q, userModel, bootstrapper) {
        console.log('*** routeEvents');
        return {
            initialize: initialize
        }

        function initialize() {
            $rootScope.$on('$routeChangeStart', function (evt, next, current) {

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
                    bootstrapper.promise
                        ['finally'](function () {
                            if (!userModel.isAuthenticated) {
                                $log.debug('routeEvents is redirecting to login');
                                $location.path('/login').replace();
                            }
                        });
                }
            });
        }
    }
})();