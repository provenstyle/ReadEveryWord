import { Book } from "./book"
import { ReadingRecord } from

export class Bible {
  books: Book[]

  constructor(readingRecords?: ReadingRecord[]) {
    this.books = [
      new Book(0,  "Genesis",         "Gen", 50),
      new Book(1,  "Exodus",          "Exo", 40),
      new Book(2,  "Leviticus",       "Lev", 27),
      new Book(3,  "Numbers",         "Num", 36),
      new Book(4,  "Deuteronomy",     "Deu", 34),
      new Book(5,  "Joshua",          "Jos", 24),
      new Book(6,  "Judges",          "Jdg", 21),
      new Book(7,  "Ruth",            "Rth", 4),
      new Book(8,  "1 Samuel",        "1Sa", 31),
      new Book(9,  "2 Samuel",        "2Sa", 24),
      new Book(10, "1 Kings",         "1Ki", 22),
      new Book(11, "2 Kings",         "2Ki", 25),
      new Book(12, "1 Chronicles",    "1Ch", 29),
      new Book(13, "2 Chronicles",    "2Ch", 36),
      new Book(14, "Ezra",            "Eza", 10),
      new Book(15, "Nehemiah",        "Neh", 13),
      new Book(16, "Esther",          "Est", 10),
      new Book(17, "Job",             "Job", 42),
      new Book(18, "Psalm",           "Psa", 150),
      new Book(19, "Proverbs",        "Pro", 31),
      new Book(20, "Ecclesiastes",    "Ecc", 12),
      new Book(21, "Song of Solomon", "SOS", 8),
      new Book(22, "Isaiah",          "Isa", 66),
      new Book(23, "Jeremiah",        "Jer", 52),
      new Book(24, "Lamentations",    "Lam", 5),
      new Book(25, "Ezekiel",         "Ezk", 48),
      new Book(26, "Daniel",          "Dan", 12),
      new Book(27, "Hosea",           "Hos", 14),
      new Book(28, "Joel",            "Joe", 3),
      new Book(29, "Amos",            "Amo", 9),
      new Book(30, "Obadiah",         "Obd", 1),
      new Book(31, "Jonah",           "Jon", 4),
      new Book(32, "Micah",           "Mic", 7),
      new Book(33, "Nahum",           "Nah", 3),
      new Book(34, "Habakkuk",        "Hab", 3),
      new Book(35, "Zephaniah",       "Zep", 3),
      new Book(36, "Haggai",          "Hag", 2),
      new Book(37, "Zechariah",       "Zch", 14),
      new Book(38, "Malachi",         "Mal", 4),
      new Book(39, "Matthew",         "Mat", 28),
      new Book(40, "Mark",            "Mar", 16),
      new Book(41, "Luke",            "Luk", 24),
      new Book(42, "John",            "Joh", 21),
      new Book(43, "Acts",            "Act", 28),
      new Book(44, "Romans",          "Rom", 16),
      new Book(45, "1 Corinthians",   "1Co", 16),
      new Book(46, "2 Corinthians",   "2Co", 13),
      new Book(47, "Galations",       "Gal", 6),
      new Book(48, "Ephesians",       "Eph", 6),
      new Book(49, "Philippians",     "Phi", 4),
      new Book(50, "Colossians",      "Col", 4),
      new Book(51, "1 Thessalonians", "1Th", 5),
      new Book(52, "2 Thessalonians", "2Th", 3),
      new Book(53, "1 Timothy",       "1Ti", 6),
      new Book(54, "2 Timothy",       "2Ti", 4),
      new Book(55, "Titus",           "Tit", 3),
      new Book(56, "Philemon",        "Phm", 1),
      new Book(57, "Hebrews",         "Heb", 13),
      new Book(58, "James",           "Jam", 5),
      new Book(59, "1 Peter",         "1Pe", 5),
      new Book(60, "2 Peter",         "2Pe", 3),
      new Book(61, "1 John",          "1Jo", 5),
      new Book(62, "2 John",          "2Jo", 1),
      new Book(63, "3 John",          "3Jo", 1),
      new Book(64, "Jude",            "Jud", 1),
      new Book(65, "Revelation",      "Rev", 22)
    ]

    if (readingRecords ) {
      for (const record of readingRecords) {
        const chapter = this.books[record.bookId].chapters[record.chapterId]
        chapter.read = true
      }
    }
  }

  get oldTestament (): Book[] {
    return this.books.slice(0, 39)
  }

  get newTestament (): Book[] {
    return this.books.slice(39, 66)
  }
}