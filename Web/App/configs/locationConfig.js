(function() {
    angular
        .module('readEveryWord')
        .config(locationConfig);

    locationConfig.$inject = ['$locationProvider'];

    function locationConfig($locationProvider) {
        $locationProvider.html5Mode(false);
    }

})();