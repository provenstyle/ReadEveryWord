define(['durandal/system', 'models/history'], function(system, history) {
    var vm = {};
    vm.book = {};

    vm.activate = function(bookName) {
        vm.book = history.bookByName(bookName);
    }

    vm.toggleRead = function (chapter) {
        var read = !chapter.read;

        var data = {
            book: vm.book.shortName,
            chapter: chapter.number,
            read: read
        };

        $.post('api/history', data)
            .done(function() {
                chapter.read = read;
            })
            .fail(function () {
                system.log("Failed to save ReadRecord.");
            });
        chapter.read = !chapter.read;
    }

    return vm;
});