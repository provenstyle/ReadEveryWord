define([], function() {

    return {
        getHistory: function() {
            var dfd = new $.Deferred();
            $.get(rew.config.basePath() + '/api/history').done(function(data) {
                dfd.resolve(data);
            });
            return dfd;
        }
    };
});