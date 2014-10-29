(function () {
    angular
        .module('readEveryWord')
        .directive('uniqueEmail', uniqueEmail);

    uniqueEmail.$inject = ['$q', '$log', 'accountService'];

    function uniqueEmail($q, $log, accountService) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                if (ctrl) {
                    ctrl.$asyncValidators.uniqueEmail = function (modelValue) {
                        var deferred = $q.defer();
                        var promise = accountService.uniqueEmail(modelValue);
                        promise.then(function(response) {
                            if (response.data === true) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        });
                        promise.catch(function (response) {
                            $log.warn('Error validating unique email: ' + response.status);
                            deferred.reject();
                        });

                        return deferred.promise;
                    };
                } else {
                    var msg = 'Expected ngModel to exist in the unique-email directive.';
                    $log.warn(msg);
                }
            }
        };
    }
})();

