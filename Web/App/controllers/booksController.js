(function() {
    angular
        .module('readEveryWord')
        .controller('booksController', booksController);

    booksController.$inject = ['$scope', '$location', 'userModel', 'historyModel'];

    function booksController($scope, $location, userModel, historyModel) {
      
        $scope.books = historyModel.books;

        $scope.toggleRead = function (chapter) {
            $location.path('/chapters/' + +encodeURIComponent(chapter.shortName));
        };
    }
})();