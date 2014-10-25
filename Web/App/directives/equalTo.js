angular.module('readEveryWord')
    .directive('equalTo', ['$log', function ($log) {
        return {
            restrict: 'A',
            scope: {},
            require: 'ngModel',
            link: function (scope, element, attrs, model) {

                var targetId = '#' + attrs.equalTo;
                var target = $(targetId);
                if (target.length === 0) {
                    $log.error('Cannot find input for equal-to validation: ' + targetId);
                    return;
                }
                element.add(target).on('keyup', function() {
                    scope.$apply(function () {
                        var valid = element.val() === target.val();
                        model.$setValidity('equalTo', valid);
                        $log.debug(valid);

                    });
                });
            }
        };
    }]);