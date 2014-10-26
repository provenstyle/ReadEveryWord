angular.module('readEveryWord')
    .factory('accountService', ['$http', '$q', '$log', 'userModel', function ($http, $q, $log, userModel) {
        var service = {
            loggedIn: loggedIn,
            logIn: logIn,
            logOff: logOff,
            register: register
        };

        return service;

        function loggedIn() {
            var deffered = $q.defer();
            $http.get(rew.config.basePath() + '/api/AccountApi/LoggedIn')
                .then(function (data) {
                    $log.debug('User is logged in: ' + xhr.status);
                    userModel.authenticated(data.username);
                    deffered.resolve();
                }, function () {
                    $log.info('User is not logged in: ' + xhr.status);
                    userModel.clear();
                    deffered.reject();
                });
            return deffered.promise;
        }

        function logIn(email, password) {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/accountApi/login';
            var data = {
                email: email,
                password: password
            };
            $http.post(url, data)
                .then(function (response) {
                    $log.debug('Login successfull');
                    user.authenticated(response.username);
                    deferred.resolve();
                }, function () {
                    $log.warn('Failed to login. Invalid username or password.');
                    user.clear();
                    deferred.reject();
                });
            return deferred.promise;
        }

        function register(email, password, confirmPassword) {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/accountApi/register';
            var data = {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            };
            $http.post(url, data)
                .then(function () {
                    $log.debug('New user created.');
                    user.authenticated(email);
                    deferred.resolve();
                }, function () {
                    $log.warn('Failed to create account: ' + result.status);
                    deferred.reject();
                });
        }

        function logOff() {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/AccountApi/Logoff';
            $http.post(url)
               .then(function () {
                   $log.debug('Logged off.');
                   user.clear();
                   history.clear();
                   deferred.resolve();
               }, function () {
                   $log.warn('Failed to logoff.');
                   deferred.reject();
               });
        };
    }]);