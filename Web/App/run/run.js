(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['$log', 'bootstrapper', 'routeEvents'];

    function run($log, bootstrapper, routeEvents) {
        $log.debug('*** run');
        bootstrapper.initialize();
        routeEvents.initialize();
    }

})();