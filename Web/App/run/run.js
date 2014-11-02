(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['$q', 'routeEvents', 'userAuthentication'];

    function run($q, routeEvents, userAuthentication) {
        var deferred = $q.defer(); 
        routeEvents.initialize();
        userAuthentication.initialize();
        return deferred.promise;
    }

})();