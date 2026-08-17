import { Result, CreateFailed, DeleteFailed, GetFailed } from '@read-every-word/foundation'

export interface ReadingRecord {
  id?: string
  lastModified?: string
  readingCycleId?: string
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

export interface GetReadingRecord {
  readingCycleId: string
}

export type GetReadingRecordSucceeded =
  | ReadingRecord[]

export type GetReadingRecordFailed =
  | GetFailed

export type GetReadingRecordResult = Result<GetReadingRecordSucceeded, GetReadingRecordFailed>

export interface DeleteReadingRecord {
  readingCycleId: string
  bookId: number
  chapterId: number
}

export interface DeletedReadingRecord {
  readingCycleId?: string
  id?: string
  deleted: boolean
}

export type DeleteReadingRecordSucceeded =
  | DeletedReadingRecord

export type DeleteReadingRecordFailed =
  | DeleteFailed

export type DeleteReadingRecordResult = Result<DeleteReadingRecordSucceeded, DeleteReadingRecordFailed>
