angular.module('readEveryWord')
    .factory('booksModel', ['bookFactory', function (bookFactory) {

        var oldTestamentBooks =
            [
                bookFactory.create("Genesis", "Gen", 50),
                bookFactory.create("Exodus", "Exo", 40),
                bookFactory.create("Leviticus", "Lev", 27),
                bookFactory.create("Numbers", "Num", 36),
                bookFactory.create("Deuteronomy", "Deu", 34),
                bookFactory.create("Joshua", "Jos", 24),
                bookFactory.create("Judges", "Jdg", 21),
                bookFactory.create("Ruth", "Rth", 4),
                bookFactory.create("1 Samuel", "1Sa", 31),
                bookFactory.create("2 Samuel", "2Sa", 24),
                bookFactory.create("1 Kings", "1Ki", 22),
                bookFactory.create("2 Kings", "2Ki", 25),
                bookFactory.create("1 Chronicles", "1Ch", 29),
                bookFactory.create("2 Chronicles", "2Ch", 36),
                bookFactory.create("Ezra", "Eza", 10),
                bookFactory.create("Nehemiah", "Neh", 13),
                bookFactory.create("Esther", "Est", 10),
                bookFactory.create("Job", "Job", 42),
                bookFactory.create("Psalm", "Psa", 150),
                bookFactory.create("Proverbs", "Pro", 31),
                bookFactory.create("Ecclesiastes", "Ecc", 12),
                bookFactory.create("Song of Solomon", "SOS", 8),
                bookFactory.create("Isaiah", "Isa", 66),
                bookFactory.create("Jeremiah", "Jer", 52),
                bookFactory.create("Lamentations", "Lam", 5),
                bookFactory.create("Ezekiel", "Ezk", 48),
                bookFactory.create("Daniel", "Dan", 12),
                bookFactory.create("Hosea", "Hos", 14),
                bookFactory.create("Joel", "Joe", 3),
                bookFactory.create("Amos", "Amo", 9),
                bookFactory.create("Obadiah", "Obd", 1),
                bookFactory.create("Jonah", "Jon", 4),
                bookFactory.create("Micah", "Mic", 7),
                bookFactory.create("Nahum", "Nah", 3),
                bookFactory.create("Habakkuk", "Hab", 3),
                bookFactory.create("Zephaniah", "Zep", 3),
                bookFactory.create("Haggai", "Hag", 2),
                bookFactory.create("Zechariah", "Zch", 14),
                bookFactory.create("Malachi", "Mal", 4)
            ];

            var newTestamentBooks =
            [
                bookFactory.create("Matthew", "Mat", 28),
                bookFactory.create("Mark", "Mar", 16),
                bookFactory.create("Luke", "Luk", 24),
                bookFactory.create("John", "Joh", 21),
                bookFactory.create("Acts", "Act", 28),
                bookFactory.create("Romans", "Rom", 16),
                bookFactory.create("1 Corinthians", "1Co", 16),
                bookFactory.create("2 Corinthians", "2Co", 13),
                bookFactory.create("Galations", "Gal", 6),
                bookFactory.create("Ephesians", "Eph", 6),
                bookFactory.create("Philippians", "Phi", 4),
                bookFactory.create("Colossians", "Col", 4),
                bookFactory.create("1 Thessalonians", "1Th", 5),
                bookFactory.create("2 Thessalonians", "2Th", 3),
                bookFactory.create("1 Timothy", "1Ti", 6),
                bookFactory.create("2 Timothy", "2Ti", 4),
                bookFactory.create("Titus", "Tit", 3),
                bookFactory.create("Philemon", "Phm", 1),
                bookFactory.create("Hebrews", "Heb", 13),
                bookFactory.create("James", "Jam", 5),
                bookFactory.create("1 Peter", "1Pe", 5),
                bookFactory.create("2 Peter", "2Pe", 3),
                bookFactory.create("1 John", "1Jo", 5),
                bookFactory.create("2 John", "2Jo", 1),
                bookFactory.create("3 John", "3Jo", 1),
                bookFactory.create("Jude", "Jud", 1),
                bookFactory.create("Revelation", "Rev", 22)
            ];

            var bookIndex = {};
            var book;
            for (var i = 0; i < 39; i++) {
                book = oldTestamentBooks[i];
                bookIndex[book.shortName] = book;
            }
            for (var j = 0; j < 27; j++) {
                book = newTestamentBooks[j];
                bookIndex[book.shortName] = book;
            }

        var model = {
            oldTestamentBooks: oldTestamentBooks,
            newTestamentBooks: newTestamentBooks,
            bookIndex: bookIndex
        };

        return model;
    }]);
