import { map } from "./domain"

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

    expect(data.authId).toEqual('myAuthId')
    expect(data.id).toEqual('0-1')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.readingCycleId).toEqual('myReadingCycleId')
    expect(data.dateRead).toEqual('dateRead')
    expect(data.bookId).toEqual(0)
    expect(data.chapterId).toEqual(1)
  })
})
