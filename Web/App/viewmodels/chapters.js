define(['durandal/system', 'models/history', 'models/user'], function(system, history, user) {
    var vm = {};
    vm.book = {};

    vm.canActivate = function () {
        if (user.isAuthenticated === true) {
            return true;
        }

        return { redirect: '#login' };
    };

    vm.activate = function(bookName) {
        vm.book = history.bookByName(bookName);
    };

    vm.toggleRead = function(chapter) {
        var read = !chapter.read;

        var data = {
            book: vm.book.shortName,
            chapter: chapter.number,
            read: read
        };

        $.post(rew.config.basePath() + '/api/history', data)
            .done(function() {
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
                system.log("Failed to save ReadRecord.");
            });
        chapter.read = read;
    };

    return vm;
});