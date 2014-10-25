angular.module('readEveryWord')
    .directive('overwriteEmail', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function (modelValue) {
                        var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });