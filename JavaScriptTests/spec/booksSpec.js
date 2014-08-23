describe('books', function() {
    var books;

    beforeEach(function(cb) {
        require(['models/books'], function (Books) {
            books = new Books();
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

});