define(['durandal/system'], function (system) {

    return {
        getHistory: function () {
            var dfd = new $.Deferred();
            $.get(rew.config.basePath() + '/api/history')
                .done(function (data) {
                    dfd.resolve(data);
                })
                .fail(function () {
                    toastr.error('Unable to get reading history.');
                });

            return dfd;
        }
    };
});