describe('bookFactory', function() {

    var bookFactory;
    beforeEach(module('readEveryWord'));
    // ReSharper disable once InconsistentNaming
    beforeEach(inject(function (_bookFactory_) {
        bookFactory = _bookFactory_;
    }));

    describe('create', function() {
        describe('constructor', function() {
            var book;

            beforeEach(function() {
                book = bookFactory.create('Genesis', 'Gen', 50); 
            });

            it('should set the long name', function () {
                book.longName.should.equal('Genesis');
            });

            it('should set the short name', function () {
                book.shortName.should.equal('Gen');
            });

            it('should create all chapters', function() {
                book.chapters.length.should.equal(50);
            });

            it('chapters should start with 1', function () {
                book.chapters[0].number.should.equal(1);
            });

            it('chapters should default to not read', function() {
                book.chapters[0].read.should.equal(false);
            });

            it('books should default to not started', function() {
                book.started.should.equal(false);
            });

            it('books should default to not completed', function () {
                book.completed.should.equal(false);
            });
        });
    });

    describe('book behavior', function() {
        describe('reading at least one chapter', function () {

            it('should set book.started to true', function () {
                var book = bookFactory.create('Genesis', 'Gen', '50');
                book.chapters[0].read = true;

                book.started.should.equal(true);
            });
        });

        describe('removing the last read chapter', function () {

            it('should set book.started to false', function () {
                var book = bookFactory.create('Genesis', 'Gen', '50');
                book.chapters[0].read = true;
                book.started.should.equal(true);

                book.chapters[0].read = false;
                book.started.should.equal(false);
            });
        });

        describe('reading all chapters', function () {

            it('should set book.completed to true', function () {
                var book = bookFactory.create('Genesis', 'Gen', '50');

                for (var i = 0; i < 50; i++) {
                    book.chapters[i].read = true;
                }

                book.completed.should.equal(true);
            });
        });

        describe('after reading all chapters marking a chapter as unread', function () {

            it('should set book.completed to false', function () {
                var book = bookFactory.create('Genesis', 'Gen', '50');

                for (var i = 0; i < 50; i++) {
                    book.chapters[i].read = true;
                }

                book.chapters[0].read = false;
                book.completed.should.equal(false);
            });
        });
    });
    

});