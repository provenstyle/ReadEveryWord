(function () {
    angular
        .module('readEveryWord')
        .factory('userAuthentication', routeEvents);

    routeEvents.$inject = ['$location', 'accountService', 'historyModel'];

    function routeEvents($location, accountService, historyModel) {
        console.log('*** userAuthentication');
        return {
            initialize: initialize
        }

        function initialize() {
            return accountService.loggedIn()
                .then(function () {
                    historyModel.prime();
                })
                .catch(function () {
                    $location.path('/login').replace();
                });
        }
    }
})();