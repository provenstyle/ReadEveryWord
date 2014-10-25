angular.module('readEveryWord')
    .factory('userModel', ['$log', function ($log) {
        var model = {
            username: "",
            isAuthenticated: false,
            authenticated: authenticated,
            clear: clear
        };

        return model;

        function authenticated(username) {
            model.username = username;
            model.isAuthenticated = true;
        }
        
        function clear() {
            model.username = '';
            model.isAuthenticated = false;
            $log.debug('Cleared user.');
        }
    }]);