define(['models/chapter'], function(Chapter) {
    var ctor = function(longName, shortName, chapterCount) {
        this.longName = longName;
        this.shortName = shortName;
        this.chapterCount = chapterCount;
        this.chapters = [];

        for (var i = 0; i < this.chapterCount; i++) {
            this.chapters.push(new Chapter(i+1));
        }
    };

    return ctor;
});