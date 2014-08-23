define(['models/chapter', 'plugins/observable'], function (chapterCtor, observable) {
    var ctor = function(longName, shortName, chapterCount) {
        var self = this;

        self.longName = longName;
        self.shortName = shortName;
        self.chapterCount = chapterCount;
        self.chapters = [];

        for (var i = 0; i < this.chapterCount; i++) {
            self.chapters.push(new chapterCtor(i+1));
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

    return ctor;
});