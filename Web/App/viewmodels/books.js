define(['models/history', 'plugins/router'], function(history, router) {
    var vm = {};

    vm.history = history;

    vm.toggleRead = function (chapter) {
        router.navigate('#chapters/' + encodeURIComponent(chapter.longName));
    }
    
    return vm;
});