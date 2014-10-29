angular.module('readEveryWord')
    .factory('accountService', ['$http', '$q', '$log', 'userModel', function ($http, $q, $log, userModel) {
        var service = {
            loggedIn: loggedIn,
            logIn: logIn,
            logOff: logOff,
            register: register,
            uniqueEmail: uniqueEmail
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
                    userModel.authenticated(response.username);
                    deferred.resolve();
                }, function () {
                    $log.warn('Failed to login. Invalid username or password.');
                    userModel.clear();
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
                    userModel.authenticated(email);
                    deferred.resolve();
                }, function (result) {
                    $log.warn('Failed to create account: ' + result.status);
                    deferred.reject();
                });
            return deferred.promise;
        }

        function logOff() {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/AccountApi/Logoff';
            $http.post(url)
               .then(function (result) {
                   $log.debug('Logged off.');
                   userModel.clear();
                   history.clear();
                   deferred.resolve(result);
               }, function (result) {
                   $log.warn('Failed to logoff.');
                   deferred.reject(result);
               });
            return deferred.promise;
        };

        function uniqueEmail(value) {
            var deferred = $q.defer();

            var url = '/api/accountApi/email/unique?email=' + value;

            $http.get(url)
                .then(function (result) {
                    deferred.resolve(result);
                }, function (result) {
                    $log.warn('Failed to get uniqueEmail: ' + result.status);
                    deferred.reject(result);
                });

            return deferred.promise;
        }
    }]);