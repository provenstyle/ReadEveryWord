(function () {
    angular
        .module('readEveryWord')
        .factory('bootstrapper', bootstrapper);

    bootstrapper.$inject = ['$q', '$location', 'accountService', 'historyModel'];

    function bootstrapper($q, $location, accountService, historyModel) {
        console.log('*** bootstrapper');
        var deferred = $q.defer();

        accountService.loggedIn()
            .then(function () {
                return historyModel.prime();
            })
            .then(function () {
                console.log('*** Resolving Bootstrap Promise');
                deferred.resolve();
            })
            .catch(function () {
                console.log('*** Bootstrapper is redirecting to login');
                $location.path('/login').replace();
                console.log('*** Rejecting Bootstrap Promise');
                deferred.reject();
            });

        return {
            promise: deferred.promise
        }
    }
})();