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

    it('should have 66 books total', function () {
        var bookCount = propertyCount(books.bookIndex);
        expect(bookCount).toEqual(66);
    });

    it('chapters should start with 1', function () {
        expect(books.newTestamentBooks[0].chapters[0].number).toEqual(1);
    });

    it('should have unique short names', function () {
        var bookCount = propertyCount(books.bookIndex);
        expect(bookCount).toEqual(66);
    });

    function propertyCount(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
});