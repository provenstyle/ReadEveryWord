import { BIBLE_CHAPTER_COUNT, Bible } from './bible.js'

describe('Bible', () => {
  const bible = new Bible()

  it('has 66 books', () => {
    expect(bible.books.length).toBe(66)
  })

  it('can index into books and chapters to set read', () => {
     const chapter = bible.books[0].chapters[0]
     chapter.read = true
     expect(chapter.id).toBe(0)
     expect(chapter.number).toBe(1)
     expect(chapter.read).toBe(true)
  })
})

/*
  A fresh Bible per test. The describe above deliberately shares one and the second
  test writes to it, so anything counting chapters has to bring its own or it reads
  whatever ran before it.
*/
describe('Bible progress', () => {
  const readEverything = (bible: Bible) => {
    for (const book of bible.books) {
      for (const chapter of book.chapters) {
        chapter.read = true
      }
    }
  }

  // The guard on BIBLE_CHAPTER_COUNT being a literal. If a chapter count in the book
  // table is ever corrected, this fails rather than letting the drawer quietly
  // divide by the wrong denominator.
  it('agrees with BIBLE_CHAPTER_COUNT', () => {
    expect(new Bible().chapterCount).toBe(BIBLE_CHAPTER_COUNT)
  })

  it('splits its chapters across the two testaments', () => {
    const bible = new Bible()
    const chaptersIn = (books: typeof bible.books) =>
      books.reduce((total, book) => total + book.chapterCount, 0)

    expect(chaptersIn(bible.oldTestament)).toBe(929)
    expect(chaptersIn(bible.newTestament)).toBe(260)
    expect(929 + 260).toBe(BIBLE_CHAPTER_COUNT)
  })

  it('starts with nothing read', () => {
    const bible = new Bible()

    expect(bible.chaptersRead).toBe(0)
    expect(bible.oldTestamentPercentComplete).toBe(0)
    expect(bible.newTestamentPercentComplete).toBe(0)
  })

  it('reaches exactly 1 when every chapter is read', () => {
    const bible = new Bible()
    readEverything(bible)

    expect(bible.chaptersRead).toBe(BIBLE_CHAPTER_COUNT)
    expect(bible.oldTestamentPercentComplete).toBe(1)
    expect(bible.newTestamentPercentComplete).toBe(1)
  })

  it('counts a single chapter', () => {
    const bible = new Bible()
    bible.books[0].chapters[0].read = true

    expect(bible.chaptersRead).toBe(1)
    expect(bible.books[0].chaptersRead).toBe(1)
  })

  it('moves only the testament the reading was in', () => {
    const bible = new Bible()
    const matthew = bible.books[39]
    for (const chapter of matthew.chapters) {
      chapter.read = true
    }

    expect(matthew.percentComplete).toBe(1)
    expect(bible.newTestamentPercentComplete).toBe(28 / 260)
    expect(bible.oldTestamentPercentComplete).toBe(0)
  })
})