(function() {
    angular
        .module('readEveryWord')
        .factory('toastrConfig', toastrConfig);

    function toastrConfig() {
        return {
            initialize: initialize
        }

        function initialize() {
            toastr.options = {
                timeOut: 1000
            };
        }
    }
})();