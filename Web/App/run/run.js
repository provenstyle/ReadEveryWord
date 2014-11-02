(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['bootstrapper', 'routeEvents'];

    function run(bootstrapper, routeEvents) {
        //resolving the bootstrapper should be enough
        routeEvents.initialize();
        console.log('*** run');
    }

})();