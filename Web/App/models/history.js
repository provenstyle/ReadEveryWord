define(['services/history'], function(service) {

    var model = {};

    model.oldTestament = [];
    model.newTestament = [];
    model.allBooks = [];

    model.prime = function() {
        return service.getHistory()
            .done(function(data) {
                model.oldTestament = data.oldTestamentBooks;
                model.newTestament = data.newTestamentBooks;
                model.allBooks = model.oldTestament.concat(model.newTestament);
        });
    };

    model.bookByName = function(bookName) {
        return _.find(model.allBooks, function(book) {
            return book.longName === bookName;
        });
    }

    return model;

});