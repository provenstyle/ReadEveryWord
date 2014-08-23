define(['durandal/system', 'services/history', 'models/books'], function (system, service, booksCtor) {

    var model = {};

    model.prime = function () {
        var books = new booksCtor();

        model.oldTestament = books.oldTestamentBooks;
        model.newTestament = books.newTestamentBooks;
        model.bookIndex = books.bookIndex;

        return service.getHistory()
            .done(function (data) {

                model.historyRecords = data;
                var dataCount = data.length;
                for (var i = 0; i < dataCount; i++) {
                    var record = data[i];

                    var book = model.bookIndex[record.book];
                    var chapter = book.chapters[record.chapter - 1];
                    chapter.read = true;
                }
            });
    };

    model.bookByName = function (bookName) {
        return model.bookIndex[bookName];
    };

    model.clear = function () {
        model.oldTestament = [];
        model.newTestament = [];
        model.bookIndex = [];
        system.log("Cleared reading history.");
    };

    return model;

});