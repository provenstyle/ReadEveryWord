/// <reference path="../Scripts/jasmine-2.0.0/jasmine.js"/>
/// <reference path="../vendor/require.js"/>

describe('books', function () {
    var books;

    beforeEach(function(cb) {
        require(['models/books'], function (booksCtor) {
            books = new booksCtor();
            cb();
        });
    });

    it('should exist', function() {
        expect(books).toBeDefined();
    });

    it('should have the 39 old testament books', function () {
        expect(books.oldTestamentBooks.length).toEqual(39);
    });

    it('should have the 27 new testament books', function () {
        expect(books.newTestamentBooks.length).toEqual(27);
    });

    it('chapters should start with 1', function () {
        expect(books.newTestamentBooks[0].chapters[0].number).toEqual(1);
    });

    it('should have unique short names', function () {
        var allBooks = {},
            book,
            i;

        for (i = 0; i < 39; i++) {
            book = books.oldTestamentBooks[i];
            allBooks[book.shortName] = book;
        }

        for (i = 0; i < 27; i++) {
            book = books.newTestamentBooks[i];
            allBooks[book.shortName] = book;
        }

        var bookCount = propertyCount(allBooks);
        expect(bookCount).toEqual(66);

        function propertyCount(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }

    });


});