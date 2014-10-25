angular.module('readEveryWord')
    .factory('bookFactory', function () {
        var factory = {
            create: create
        }

        return factory;

        function create(longName, shortName, chapterCount) {
            return new Book(longName, shortName, chapterCount);
        }

        function Book(longName, shortName, chapterCount) {
            var self = this;

            self.longName = longName;
            self.shortName = shortName;
            self.chapterCount = chapterCount;
            self.chapters = [];

            for (var i = 0; i < self.chapterCount; i++) {
                self.chapters.push(new Chapter(i + 1));
            }

            observable.defineProperty(self, 'started', function () {
                return _.some(self.chapters, function (chapter) {
                    return chapter.read === true;
                });
            });

            observable.defineProperty(self, 'completed', function () {
                return _.every(self.chapters, function (chapter) {
                    return chapter.read === true;
                });
            });
        };

        function Chapter(number) {
            this.number = number;
            this.read = false;
        };

    });