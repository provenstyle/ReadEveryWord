(function () {
    angular
        .module('readEveryWord')
        .factory('bootstrapper', bootstrapper);

    bootstrapper.$inject = ['$q', '$location', '$log', 'accountService', 'historyModel'];

    function bootstrapper($q, $location, $log, accountService, historyModel) {
        $log.debug('*** bootstrapper');
        var deferred = $q.defer();

        return {
            promise: deferred.promise,
            initialize: initialize
        }

        function initialize() {
            accountService.loggedIn()
                .then(function () {
                    return historyModel.prime();
                })
                .then(function () {
                    $log.debug('*** Resolving Bootstrap Promise');
                    deferred.resolve();
                })
                .catch(function () {
                    $log.debug('*** Bootstrapper is redirecting to login');
                    $location.path('/login').replace();
                    $log.debug('*** Rejecting Bootstrap Promise');
                    deferred.reject();
                });
        }
    }
})();