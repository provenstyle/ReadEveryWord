define(['durandal/system'], function (system) {

    return {
        getHistory: function () {
            var dfd = new $.Deferred();
            $.get(rew.config.basePath() + '/api/history')
                .done(function (data) {
                    dfd.resolve(data);
                })
                .fail(function () {
                    system.log('Failed to get the history.');
                });

            return dfd;
        }
    };
});