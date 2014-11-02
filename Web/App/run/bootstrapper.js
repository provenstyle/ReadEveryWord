(function () {
    angular
        .module('readEveryWord')
        .factory('bootstrapper', bootstrapper);

    bootstrapper.$inject = ['$q', 'routeEvents', 'userAuthentication'];

    function bootstrapper($q, routeEvents, userAuthentication) {
        console.log('*** bootstrapper');
        var deferred = $q.defer();

        return {
            bootstrap: bootstrap,
            promise: deferred.promise
        }

        function bootstrap() {
            $q.all([
                    routeEvents.initialize(),
                    userAuthentication.initialize()
            ])
                .then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
        }
    }
})();