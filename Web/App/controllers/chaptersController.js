(function() {
    angular
        .module('readEveryWord')
        .controller('chaptersController', chaptersController);

    chaptersController.$inject = ['$scope', '$routeParams', 'historyModel'];

    function chaptersController($scope, $routeParams, historyModel) {
        $scope = {
            book: historyModel.bookByName($routeParams.bookname),
            toggleRead: toggleRead
        };

        function toggleRead(chapter) {
            var read = !chapter.read;
            service.postHistory($scope.book.shortName, chapter.number, read)
                .done(function () {
                    chapter.read = read;

                    var historyUpdate = {
                        book: $scope.book.shortName,
                        chapter: chapter.number
                    };

                    if (read === true) {
                        history.addToHistoryRecords(historyUpdate);
                    }

                    if (read === false) {
                        history.removeHistoryRecords(historyUpdate);
                    }
                })
                .fail(function () {
                    chapter.read = !read;
                });
            chapter.read = read;
        };
    }
})();