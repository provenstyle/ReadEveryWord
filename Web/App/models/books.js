﻿define(['models/book'], function(Book) {
    var ctor = function() {
        this.oldTestamentBooks = 
            [
                new Book("Genesis", "Gen", 50),
                new Book("Exodus", "Exo", 40),
                new Book("Leviticus", "Lev", 27),
                new Book("Numbers", "Num", 36),
                new Book("Deuteronomy", "Deu", 34),
                new Book("Joshua", "Jos", 24),
                new Book("Judges", "Jdg", 21),
                new Book("Ruth", "Rth", 4),
                new Book("1 Samuel", "1Sa", 31),
                new Book("2 Samuel", "2Sa", 24),
                new Book("1 Kings", "1Ki", 22),
                new Book("2 Kings", "2Ki", 25),
                new Book("1 Chronicles", "1Ch", 29),
                new Book("2 Chronicles", "2Ch", 36),
                new Book("Ezra", "Eza", 10),
                new Book("Nehemiah", "Neh", 13),
                new Book("Esther", "Est", 10),
                new Book("Job", "Job", 42),
                new Book("Psalm", "Psa", 150),
                new Book("Proverbs", "Pro", 31),
                new Book("Ecclesiastes", "Ecc", 12),
                new Book("Song of Solomon", "SOS", 8),
                new Book("Isaiah", "Isa", 66),
                new Book("Jeremiah", "Jer", 52),
                new Book("Lamentations", "Lam", 5),
                new Book("Ezekiel", "Ezk", 48),
                new Book("Daniel", "Dan", 12),
                new Book("Hosea", "Hos", 14),
                new Book("Joel", "Joe", 3),
                new Book("Amos", "Amo", 9),
                new Book("Obadiah", "Obd", 1),
                new Book("Jonah", "Jon", 4),
                new Book("Micah", "Mic", 7),
                new Book("Nahum", "Nah", 3),
                new Book("Habakkuk", "Hab", 3),
                new Book("Zephaniah", "Zep", 3),
                new Book("Haggai", "Hag", 2),
                new Book("Zechariah", "Zch", 14),
                new Book("Malachi", "Mal", 4)
            ];

        this.newTestamentBooks = 
        [
            new Book("Matthew", "Mat", 28),
            new Book("Mark", "Mar", 16),
            new Book("Luke", "Luk", 24),
            new Book("John", "Joh", 21),
            new Book("Acts", "Act", 28),
            new Book("Romans", "Rom", 16),
            new Book("1 Corinthians", "1Co", 16),
            new Book("2 Corinthians", "2Co", 13),
            new Book("Galations", "Gal", 6),
            new Book("Ephesians", "Eph", 6),
            new Book("Philippians", "Phi", 4),
            new Book("Colossians", "Col", 4),
            new Book("1 Thessalonians", "1Th", 5),
            new Book("2 Thessalonians", "2Th", 3),
            new Book("1 Timothy", "1Ti", 6),
            new Book("2 Timothy", "2Ti", 4),
            new Book("Titus", "Tit", 3),
            new Book("Philemon", "Phm", 1),
            new Book("Hebrews", "Heb", 13),
            new Book("James", "Jam", 5),
            new Book("1 Peter", "1Pe", 5),
            new Book("2 Peter", "2Pe", 3),
            new Book("1 John", "1Jo", 5),
            new Book("2 John", "2Jo", 1),
            new Book("3 John", "3Jo", 1),
            new Book("Jude", "Jud", 1),
            new Book("Revelation", "Rev", 22),
        ];

        this.bookIndex = {};

        var book;

        for (var i = 0; i < 39; i++) {
            book = this.oldTestamentBooks[i];
            this.bookIndex[book.shortName] = book;
        }

        for (var j = 0; j < 27; j++) {
            book = this.newTestamentBooks[j];
            this.bookIndex[book.shortName] = book;
        }
    };

    return ctor;
});