import { Bible } from './bible'

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