(function() {
    angular
        .module('readEveryWord')
        .controller('booksController', booksController);

    booksController.$inject = ['$scope', '$location', 'userModel', 'historyModel'];

    function booksController($scope, $location, userModel, historyModel) {
      
        $scope.books = historyModel.books;

        $scope.goToChapters = function (book) {
            $location.path('/chapters/' + encodeURIComponent(book.shortName));
        };
    }
})();