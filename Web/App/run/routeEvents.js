(function () {
    angular
        .module('readEveryWord')
        .factory('routeEvents', routeEvents);

    routeEvents.$inject = ['$rootScope', '$location', '$log', '$q', 'userModel', 'bootstrapper'];

    function routeEvents($rootScope, $location, $log, $q, userModel, bootstrapper) {
        $log.debug('*** routeEvents');
        return {
            initialize: initialize
        }

        function initialize() {
            $rootScope.$on('$routeChangeStart', function (evt, next, current) {

                if (userModel.isAuthenticated) {
                    return;
                }

                if (!next.controller) {
                    $log.debug('unknown route');
                    return;
                }

                var authenticationNotRequired = ['aboutController', 'loginController', 'registerController'];
                if (_.contains(authenticationNotRequired, next.controller)) {
                    $log.debug('authentication not required: ' + next.controller);
                    return;
                }

                bootstrapper.promise['finally'](function () {
                    if (!userModel.isAuthenticated) {
                        $log.debug('routeEvents is redirecting to login from: ' + next.controller);
                        $location.path('/login').replace();
                    }
                });
            });
        }
    }
})();