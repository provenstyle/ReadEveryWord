(function() {
    angular
        .module('readEveryWord')
        .controller('chaptersController', chaptersController);

    chaptersController.$inject = ['$scope', '$routeParams', 'historyModel', 'historyService'];

    function chaptersController($scope, $routeParams, historyModel, historyService) {
        

        $scope.book = historyModel.bookByName($routeParams.bookname);

        $scope.toggleRead = function (chapter) {
            var read = !chapter.read;
            historyService.postHistory($scope.book.shortName, chapter.number, read)
                .then(function () {
                    chapter.read = read;

                    var historyUpdate = {
                        book: $scope.book.shortName,
                        chapter: chapter.number
                    };

                    if (read === true) {
                        historyModel.addToHistoryRecords(historyUpdate);
                    }

                    if (read === false) {
                        historyModel.removeHistoryRecords(historyUpdate);
                    }
                })
                .catch(function () {
                    chapter.read = !read;
                });
            chapter.read = read;
        };
    }
})();