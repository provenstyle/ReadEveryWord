(function() {
    angular
        .module('readEveryWord')
        .run(run);

    run.$inject = ['bootstrapper'];

    function run(bootstrapper) {
        console.log('*** run');
        bootstrapper.bootstrap();
    }

})();