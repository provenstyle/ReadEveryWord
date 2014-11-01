(function() {
    angular
        .module('readEveryWord')
        .factory('bookFactory', bookFactory);

    function bookFactory() {
        var factory = {
            create: create
        };

        return factory;

        function create(longName, shortName, chapterCount) {
            return new Book(longName, shortName, chapterCount);
        }

        // ReSharper disable once InconsistentNaming
        function Book(longName, shortName, chapterCount) {
            var self = this;

            self.longName = longName;
            self.shortName = shortName;
            self.chapterCount = chapterCount;
            self.chapters = [];
            self.started = false;
            self.completed = false;

            for (var i = 0; i < self.chapterCount; i++) {
                self.chapters.push(new Chapter(i + 1, self));
            }

            self.updateStartedAndCompleted = function () {
                self.started = _.some(self.chapters, function (chapter) {
                    return chapter.read === true;
                });

                self.completed = _.every(self.chapters, function (chapter) {
                    return chapter.read === true;
                });
            };
        }

        // ReSharper disable once InconsistentNaming
        function Chapter(number, book) {
            this.number = number;

            var read = false;
            Object.defineProperty(this, 'read', {
                get: function () {
                    return read;
                },
                set: function (value) {
                    if (read === value) return;
                    read = value;
                    book.updateStartedAndCompleted();
                }
            });
        }
    }
})();