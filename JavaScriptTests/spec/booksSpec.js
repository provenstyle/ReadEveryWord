describe('books', function() {

    it('should exist', function(cb) {
        require(['models/books'], function(Books) {
            var books = new Books();
            expect(books).toBeDefined();
            cb();
        });
    });

});