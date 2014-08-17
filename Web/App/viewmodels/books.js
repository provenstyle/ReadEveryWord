define(['models/history', 'plugins/router', 'models/user'], function(history, router, user) {
    var vm = {};

    vm.canActivate = function() {
        if (user.isAuthenticated === true) {
            return true;
        }

        return { redirect: '#login' };
    };

    vm.history = history;

    vm.toggleRead = function(chapter) {
        router.navigate('#chapters/' + encodeURIComponent(chapter.longName));
    };
    
    return vm;
});