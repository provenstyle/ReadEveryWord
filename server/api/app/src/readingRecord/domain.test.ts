import { map } from "./domain"

describe('mapping ReadingRecordRow to ReadingRecord', () => {
  it('valid request is valid', async () => {
    const data = map({
      partitionKey: 'partitionKey',
      rowKey: 'rowKey',
      timestamp: 'timestamp',
      dateRead: 'dateRead',
      bookId: 0,
      chapterId: 1
    })

    expect(data.id).toEqual('rowKey')
    expect(data.readingCycleId).toEqual('partitionKey')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.dateRead).toEqual('dateRead')
    expect(data.bookId).toEqual(0)
    expect(data.chapterId).toEqual(1)
  })
})
