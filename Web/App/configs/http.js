(function() {
    angular
        .module('readEveryWord')
        .config(httpConfig);

    httpConfig.$inject = ['$httpProvider'];

    function httpConfig($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }
})();