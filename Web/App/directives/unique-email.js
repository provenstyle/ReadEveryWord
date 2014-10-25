(function() {
    angular
        .module('readEveryWord')
        .directive('uniqueEmail', uniqueEmail);

    uniqueEmail.$inject = ['accountService'];

    function uniqueEmail (accountService) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                if (ctrl) {
                    ctrl.$asyncValidators.uniqueEmail = function (modelValue) {
                        return accountService.uniqueEmail(modelValue)
                            .then();
                    };
                }
            }
        };
    }
})();

