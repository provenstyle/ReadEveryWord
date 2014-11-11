﻿(function() {
    angular
        .module('readEveryWord')
        .directive('mobileNavFix', mobileNavFix);

    mobileNavFix.$inject = [];

    function mobileNavFix() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                elm.on('click', function () {
                    closeMobileNav();
                });

                $('.navbar-brand').on('click', function () {
                    closeMobileNav();
                });

                function closeMobileNav() {
                    var smallMenu = $('.navbar-collapse');

                    if (smallMenu.hasClass('in') === true) {
                        smallMenu.removeClass('in');
                    }
                }
            }

        }        
    }
})();