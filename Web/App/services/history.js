﻿define(['plugins/observable'], function(observable) {

    function addComputeds(books) {
        var length = books.length;

        _.each(books, function(book) {
            observable.defineProperty(book, 'started', function() {
                return _.some(book.chapters, function(chapter) {
                    return chapter.read === true;
                });
            });

            observable.defineProperty(book, 'completed', function() {
                return _.every(book.chapters, function(chapter) {
                    return chapter.read === true;
                })
            });
        });
    }

    return {
        getHistory: function () {
            var dfd = new $.Deferred();
            $.get("api/history").done(function (data) {
                addComputeds(data.oldTestamentBooks);
                addComputeds(data.newTestamentBooks);
                dfd.resolve(data);
            });
            return dfd;
        }
    }
});