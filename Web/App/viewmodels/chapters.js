define(['models/history'], function(history) {
    var vm = {};
    vm.book = {};

    vm.activate = function(bookName) {
        vm.book = history.bookByName(bookName);
    }

    vm.toggleRead = function(chapter) {
        chapter.read = !chapter.read;
    }

    return vm;
});