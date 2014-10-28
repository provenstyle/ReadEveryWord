(function() {
    angular
        .module('readEveryWord')
        .factory('historyModel', historyModel);

    historyModel.$inject = ['$log', 'historyService', 'booksModel'];
    
    function historyModel($log, historyService, booksModel) {

        var model = {
            historyRecords: {},
            books: booksModel,
            prime: prime,
            updateHistory: updateHistory,
            bookByName: bookByName,
            clear: clear,
            refresh: refresh,
            addToHistoryRecords: addToHistoryRecords,
            removeHistoryRecords: removeHistoryRecords
        };

        return model;

        function prime() {
            return model.updateHistory();
        }

        function updateHistory() {
            return historyService.getHistory()
                .then(function (response) {

                    model.historyRecords = response.data;

                    for (var i = 0; i < response.data.years.length; i++) {
                        var year = response.data.years[i];
                        for (var j = 0; j < year.months.length; j++) {
                            var month = year.months[j];
                            for (var k = 0; k < month.days.length; k++) {
                                var day = month.days[k];

                                var book = model.books.bookIndex[day.book];
                                var chapter = book.chapters[day.chapter - 1];
                                chapter.read = true;
                            }
                        }
                    }
                });
        }

        function bookByName(bookName) {
            return model.books.bookIndex[bookName];
        }

        function clear() {

            function reset(chapter) {
                chapter.read = false;
            }

            for (var prop in model.books.bookIndex) {
                var book = model.bookIndex[prop];
                if (book.chapters) {
                    _.each(book.chapters, reset);
                }
            }
            $log.debug("Cleared reading history.");
        }

        function refresh() {
            model.clear();
            return model.updateHistory();
        }

        function addToHistoryRecords(data) {

            if (model.historyRecords.years.length === 0) { return; }

            model.historyRecords.years[0].months[0].days.unshift({
                book: data.book,
                chapter: data.chapter,
                day: new Date().getDate()
            });
        }

        function removeHistoryRecords(data) {
            for (var i = 0; i < model.historyRecords.years.length; i++) {
                var year = model.historyRecords.years[i];
                for (var j = 0; j < year.months.length; j++) {
                    var month = year.months[j];
                    for (var k = 0; k < month.days.length; k++) {
                        var day = month.days[k];
                        if (day.book === data.book && day.chapter === data.chapter) {
                            month.days.splice(k, 1);
                            return;
                        }
                    }
                }
            }
        }
    };

})();