(function() {
    angular
        .module('readEveryWord')
        .controller('booksController', booksController);

    booksController.$inject = ['$scope', '$location', '$log', 'userModel', 'historyModel'];

    function booksController($scope, $location, $log, userModel, historyModel) {
        $log.debug('*** Creating booksController');

        $scope.books = historyModel.books;

        $scope.goToChapters = function (book) {
            $location.path('/chapters/' + encodeURIComponent(book.shortName));
        };
    }
})();