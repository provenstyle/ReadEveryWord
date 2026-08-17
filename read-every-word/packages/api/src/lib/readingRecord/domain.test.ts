import { map } from "./domain.js"

describe('mapping ReadingRecordRow to ReadingRecord', () => {
  it('valid request is valid', async () => {
    const data = map({
      partitionKey: 'partitionKey',
      rowKey: '0-1',
      timestamp: 'timestamp',
      authId: 'myAuthId',
      readingCycleId: 'myReadingCycleId',
      dateRead: 'dateRead',
      bookId: 0,
      chapterId: 1
    })

    // The row keeps its authId column, but the entity it maps to is a response
    // payload and must not carry it.
    expect(data).not.toHaveProperty('authId')
    expect(data.id).toEqual('0-1')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.readingCycleId).toEqual('myReadingCycleId')
    expect(data.dateRead).toEqual('dateRead')
    expect(data.bookId).toEqual(0)
    expect(data.chapterId).toEqual(1)
  })
})
