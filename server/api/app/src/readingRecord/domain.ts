import {ReadingRecord} from '@read-every-word/domain'

export interface ReadingRecordRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  authId: string,
  readingCycleId: string,
  dateRead: string
  bookId: number
  chapterId: number
}

export const map = (row: ReadingRecordRow): ReadingRecord => {
  return {
    authId: row.authId,
    readingCycleId: row.readingCycleId,
    id: row.rowKey,
    lastModified: row.timestamp,
    dateRead: row.dateRead,
    bookId: row.bookId,
    chapterId: row.chapterId
  }
}
