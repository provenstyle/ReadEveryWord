import { Result, CreateFailed, DeleteFailed } from '@read-every-word/infrastructure'

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

export interface GetReadingRecord {
  readingCycleId: string
}

export type GetReadingRecordSucceeded =
  | ReadingRecord[]

export type GetReadingRecordFailed =
  | CreateFailed

export type GetReadingRecordResult = Result<GetReadingRecordSucceeded, GetReadingRecordFailed>

export interface CountReadingRecord {
  readingCycleId: string
}

export type CountReadingRecordSucceeded =
  | number

export type CountReadingRecordFailed =
  | CreateFailed

export type CountReadingRecordResult = Result<CountReadingRecordSucceeded, CountReadingRecordFailed>

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
