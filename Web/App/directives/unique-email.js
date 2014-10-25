angular.module('readEveryWord')
    .directive('uniqueEmail', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                if (ctrl) {
                    ctrl.$asyncValidators.uniqueEmail = function (modelValue) {
                        
                    };
                }
            }
        };
    });