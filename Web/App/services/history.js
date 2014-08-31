define(['durandal/system'], function (system) {

    return {
        getHistory: function () {
            var dfd = new $.Deferred();

            $.ajax({
                url: rew.config.basePath() + '/api/history',
                xhrFields: {
                    withCredentials: true
                }
            })
                .done(function (data) {
                    dfd.resolve(data);
                })
                .fail(function () {
                    toastr.error('Unable to get reading history.');
                });

            return dfd;
        },
        postHistory: function(bookShortName, chapter, read) {

            var data = {
                book: bookShortName,
                chapter: chapter,
                read: read
            };

            return $.ajax({
                type: 'POST',
                url: rew.config.basePath() + '/api/history',
                data: data,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function () {
                    system.log("Successfully updated history" + bookShortName + " " + chapter + " " + read);
                })
            .fail(function (xhr) {
                system.log("Failed to save ReadRecord: " + xhr.status);
                toastr.error("Unable to save.");
            });
        }
    };
});