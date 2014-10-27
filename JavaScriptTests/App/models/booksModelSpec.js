describe('booksModel', function() {
    var booksModel;
    beforeEach(module('readEveryWord'));
    // ReSharper disable once InconsistentNaming
    beforeEach(inject(function(_booksModel_) {
        booksModel = _booksModel_;
    }));

    it('should exist', function () {
        should.exist(booksModel);
    });

    it('should have the 39 old testament books', function () {
        booksModel.oldTestamentBooks.length.should.equal(39);
    });

    it('should have the 27 new testament books', function () {
        booksModel.newTestamentBooks.length.should.equal(27);
    });

    it('should have 66 books with unique short names', function () {
        var bookCount = propertyCount(booksModel.bookIndex);
        bookCount.should.equal(66);
    });

    function propertyCount(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

});