//for some reason angular email validation is wrong in 1.3.0
//it allows asdf@asdf as valid
//this fixes it
(function() {
    angular
        .module('readEveryWord')
        .directive('overwriteEmail', overwriteEmail);

    function overwriteEmail() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function (modelValue) {
                        var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return ctrl.$isEmpty(modelValue) || emailRegEx.test(modelValue);
                    };
                }
            }
        };
    }
})();

