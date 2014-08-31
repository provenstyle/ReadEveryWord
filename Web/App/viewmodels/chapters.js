define(['durandal/system', 'models/history', 'models/user', 'services/history'], function (system, history, user, service) {
    var vm = {};
    vm.book = {};

    vm.canActivate = function () {
        if (user.isAuthenticated === true) {
            return true;
        }

        return { redirect: '#login' };
    };

    vm.activate = function (bookName) {
        vm.book = history.bookByName(bookName);
    };

    vm.toggleRead = function (chapter) {
        var read = !chapter.read;
        service.postHistory(vm.book.shortName, chapter.number, read)
            .done(function () {
                chapter.read = read;

                var historyUpdate = {
                    book: vm.book.shortName,
                    chapter: chapter.number
                };

                if (read === true) {
                    history.addToHistoryRecords(historyUpdate);
                }

                if (read === false) {
                    history.removeHistoryRecords(historyUpdate);
                }
            })
            .fail(function () {
                chapter.read = !read;
            });
        chapter.read = read;
    };

    return vm;
});