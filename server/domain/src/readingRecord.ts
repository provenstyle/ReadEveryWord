import { Result, CreateFailed } from '@read-every-word/infrastructure'

export interface ReadingRecord {
  readingCycleId?: string
  id?: string
  lastModified?: string
  dateRead?: string
  bookId: number
  chapterId: number
}

export interface CreateReadingRecord {
  readingCycleId: string
  dateRead: string
  bookId: number
  chapterId: number
}

export type CreateReadingRecordSucceeded =
  | ReadingRecord

export type CreateReadingRecordFailed =
  | CreateFailed

export type CreateReadingRecordResult = Result<CreateReadingRecordSucceeded, CreateReadingRecordFailed>
