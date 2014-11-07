(function() {
    angular
        .module('readEveryWord')
        .controller('readingLogController', readingLogController);

    readingLogController.$inject = ['$scope', 'historyModel'];

    function readingLogController($scope, historyModel) {
        $scope.historyRecords = historyModel.historyRecords;
    }
})();