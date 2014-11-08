(function() {
    angular
        .module('readEveryWord')
        .controller('shellController', shellController);

    shellController.$inject = ['$scope', '$log', '$location', 'userModel', 'accountService', 'historyModel'];

    function shellController($scope, $log, $location, userModel, accountService, historyModel) {
        $log.debug('Creating shell controller.');

        $scope.userModel = userModel;

        $scope.logOff = function () {
            accountService.logOff()
                .then(function () {
                    $location.path('/login');
                });
        },
        $scope.refresh = function () {
            historyModel.refresh()
                .then(function () {
                    toastr.success("Refreshed Data");
                });
        }
    }
})();


        //compositionComplete: function () {
        //    $(function () {
        //        $('.navbar-nav').on('click', function () {
        //            if ($('.navbar-header .navbar-toggle').css('display') != 'none') {
        //                $(".navbar-header .navbar-toggle").trigger("click");
        //            }
        //        });
        //    });
        //}