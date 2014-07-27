define(['services/history', 'plugins/router'], function(history, router) {
    var vm = {};
    vm.oldTestament = [];
    vm.newTestament = [];

    vm.activate = function() {
        return history.getHistory()
            .done(function(data) {
                vm.oldTestament = data.oldTestamentBooks;
                vm.newTestament = data.newTestamentBooks;
        });
    };

    vm.toggleRead = function(chapter) {
        router.navigate('#chapters/' + chapter.longName);
    }
    
    
    return vm;
});