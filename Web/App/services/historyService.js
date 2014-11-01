(function() {
    angular
        .module('readEveryWord')
        .factory('historyService', historyService);

    historyService.$inject = ['$http', '$q', '$log'];

    function historyService ($http, $q, $log) {
        var module = {
            getHistory: getHistory,
            postHistory: postHistory
        };

        return module;

        function getHistory() {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/history';
            $http.get(url)
                .then(function (data) {
                    $log.debug('Get history was successful.');
                    deferred.resolve(data);
                }, function () {
                    toastr.error('Unable to get reading history.');
                    deferred.reject();
                });
            return deferred.promise;
        }

        function postHistory(bookShortName, chapter, read) {
            var deferred = $q.defer();
            var url = rew.config.basePath() + '/api/history';
            var data = {
                book: bookShortName,
                chapter: chapter,
                read: read
            };
            $http.post(url, data)
                .then(function () {
                    $log.debug("Successfully updated history" + bookShortName + " " + chapter + " " + read);
                    deferred.resolve();
                }, function (xhr) {
                    $log.error("Failed to save ReadRecord: " + xhr.status);
                    toastr.error("Unable to save.");
                    deferred.reject();
                });
            return deferred.promise;
        }
    }
})();

