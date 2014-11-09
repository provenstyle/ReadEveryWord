(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['$log', 'bootstrapper', 'routeEvents', 'toastrConfig'];

    function run($log, bootstrapper, routeEvents, toastrConfig) {
        $log.debug('*** run');
        bootstrapper.initialize();
        routeEvents.initialize();
        toastrConfig.initialize();
    }

})();