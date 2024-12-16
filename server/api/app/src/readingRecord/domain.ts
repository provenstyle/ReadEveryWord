import {ReadingRecord} from '@read-every-word/domain'

export interface ReadingRecordRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  dateRead: string
  bookId: number
  chapterId: number
}

export const map = (row: ReadingRecordRow): ReadingRecord => {
  return {
    readingCycleId: row.partitionKey,
    id: row.rowKey,
    lastModified: row.timestamp,
    dateRead: row.dateRead,
    bookId: row.bookId,
    chapterId: row.chapterId
  }
}
