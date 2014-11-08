(function () {
    angular
        .module('readEveryWord')
        .controller('shellController', shellController);

    shellController.$inject = ['$scope', '$log', '$location', 'bootstrapper', 'userModel', 'accountService', 'historyModel'];

    function shellController($scope, $log, $location, bootstrapper, userModel, accountService, historyModel) {
        $log.debug('Creating shell controller.');

        activate();

        $scope.bootstrapped = false;

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

        function activate() {
            bootstrapper.promise
                .then(function () {
                    $log.debug('shellController is activated.');
                    $scope.bootstrapped = true;
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