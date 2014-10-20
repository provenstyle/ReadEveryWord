define(['durandal/system', 'services/history', 'models/books'], function (system, service, booksCtor) {

    var model = {};

    model.prime = function () {
        var books = new booksCtor();

        model.oldTestament = books.oldTestamentBooks;
        model.newTestament = books.newTestamentBooks;
        model.bookIndex = books.bookIndex;

        return model.updateHistory();
    };

    model.updateHistory = function() {
        return service.getHistory()
            .done(function(data) {

                model.historyRecords = data;

                for (var i = 0; i < data.years.length; i++) {
                    var year = data.years[i];
                    for (var j = 0; j < year.months.length; j++) {
                        var month = year.months[j];
                        for (var k = 0; k < month.days.length; k++) {
                            var day = month.days[k];

                            var book = model.bookIndex[day.book];
                            var chapter = book.chapters[day.chapter - 1];
                            chapter.read = true;
                        }
                    }
                }
            });
    };

    model.bookByName = function (bookName) {
        return model.bookIndex[bookName];
    };

    model.clear = function () {

        function reset(chapter) {
            chapter.read = false;
        }

        for (var prop in model.bookIndex) {
            var book = model.bookIndex[prop];
            if (book.chapters) {
                _.each(book.chapters, reset);
            }
        }
        system.log("Cleared reading history.");
    };

    model.refresh = function() {
        model.clear();
        return model.updateHistory();
    };

    model.addToHistoryRecords = function (data) {

        if (model.historyRecords.years.length === 0) { return; }

        model.historyRecords.years[0].months[0].days.unshift({
            book: data.book,
            chapter: data.chapter,
            day: new Date().getDate()
        });
    };

    model.removeHistoryRecords = function(data) {
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
    };

    return model;

});